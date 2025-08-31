const API_KEY = 'AIzaSyBa44MHgVmA8wzCjcrA2gvn77aEm6kLCGA';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
const SYSTEM_PROMPT = `You are Houseo's professional AI assistant for real estate staff. Provide expert guidance on:
• Client communications and relationship management
• Property valuations and market analysis  
• Investment calculations (ROI, cash flow, cap rates)
• Legal compliance and contract guidance
• Marketing content and property listings
• Negotiation strategies and pricing tactics

Always give practical, actionable advice with specific steps. Include calculations, templates, or examples when relevant. Keep responses professional and immediately useful for real estate operations.`;

const validateMessage = (input) => {
  if (!input || typeof input !== 'string') throw new Error('Please provide a valid message');
  const message = input.trim();
  if (!message) throw new Error('Message cannot be empty');
  if (message.length > 2000) throw new Error('Message is too long (maximum 2000 characters)');
  return message;
};

const getAIResponse = async (message) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: `${SYSTEM_PROMPT}\n\nUser Question: ${message}\n\nResponse:` }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 1500, topP: 0.9 }
    })
  });

  if (!response.ok) throw new Error(`API request failed (${response.status})`);
  
  const data = await response.json();
  const reply = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  
  if (!reply) throw new Error('No response generated');
  return reply.length > 2500 ? `${reply.substring(0, 2500)}...` : reply;
};

export const actions = {
  chat: async ({ request }) => {
    try {
      const formData = await request.formData();
      const message = validateMessage(formData.get('message'));
      const reply = await getAIResponse(message);
      
      return {
        success: true,
        data: { reply, timestamp: new Date().toISOString() }
      };
    } catch (error) {
      console.error('Chat action error:', error.message);
      return { success: false, error: error.message };
    }
  }
};

// Page Data
export async function load() {
  return {
    quickActions: [
      {
        title: 'Draft Client Email',
        prompt: 'Help me draft a professional email to a client about [describe the situation, e.g., property viewing, offer update, market conditions]'
      },
      {
        title: 'Property Valuation',
        prompt: 'Analyze the market value for a property: [provide address, property type, size, condition] and give comparable market analysis'
      },
      {
        title: 'Investment Analysis',
        prompt: 'Calculate ROI and investment potential for: [property price, rental income, expenses, location, property type]'
      },
      {
        title: 'Marketing Copy',
        prompt: 'Create compelling marketing copy for property listing: [describe property features, location, unique selling points]'
      },
      {
        title: 'Legal Guidance',
        prompt: 'I need legal guidance for real estate matter: [describe situation - contracts, disclosures, compliance issues]'
      },
      {
        title: 'Negotiation Strategy',
        prompt: 'Help me develop a negotiation strategy for: [buyer/seller scenario, price point, terms, timeline]'
      }
    ]
  };
}
