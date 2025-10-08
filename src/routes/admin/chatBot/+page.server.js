import { redirect } from '@sveltejs/kit';
import { db } from '$lib/db/helpers';

const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
const API_KEY = 'AIzaSyCT5H5K90iPHY1wn1BIs4Ekz9zsoJjWHfc';

const SYSTEM_PROMPT = `You are Houseo's professional AI assistant for real estate staff. Provide expert guidance on:
• Client communications and relationship management
• Property valuations and market analysis  
• Investment calculations (ROI, cash flow, cap rates)
• Legal compliance and contract guidance
• Marketing content and property listings
• Negotiation strategies and pricing tactics

Always give practical, actionable advice with specific steps. Include calculations, templates, or examples when relevant. Keep responses professional and immediately useful for real estate operations.`;

const getAIResponse = async (message) => {
	const response = await fetch(API_URL, {
		method: 'POST',
		headers: { 
			'Content-Type': 'application/json',
			'X-goog-api-key': API_KEY
		},
		body: JSON.stringify({
			contents: [{ parts: [{ text: `${SYSTEM_PROMPT}\n\nUser Question: ${message}\n\nResponse:` }] }],
			generationConfig: { temperature: 0.7, maxOutputTokens: 1500, topP: 0.9 }
		})
	});
	if (!response.ok) throw new Error(`API request failed (${response.status})`);
	const reply = (await response.json()).candidates?.[0]?.content?.parts?.[0]?.text?.trim();
	if (!reply) throw new Error('No response generated');
	return reply.length > 2500 ? reply.substring(0, 2500) + '...' : reply;
};

export const load = async ({ locals, cookies }) => {
	if (!locals.user) throw redirect(302, '/admin/login');
	
	let sessionId = cookies.get('chat_session');
	
	if (sessionId) {
		const session = await db('SELECT id FROM chat_sessions WHERE id=? AND user_id=?', [sessionId, locals.user.id]);
		if (!session.length) sessionId = null;
	}
	
	if (!sessionId) {
		sessionId = (await db('INSERT INTO chat_sessions (user_id) VALUES (?)', [locals.user.id])).insertId;
		cookies.set('chat_session', sessionId, { path: '/admin/chatBot', maxAge: 86400 });
	}
	
	const [messages, sessions] = await Promise.all([
		db('SELECT role, content, created_at FROM chat_messages WHERE session_id=? ORDER BY created_at', [sessionId]),
		db(`SELECT cs.id, cs.created_at,
			(SELECT content FROM chat_messages WHERE session_id=cs.id AND role='user' ORDER BY created_at LIMIT 1) as first_message,
			(SELECT COUNT(*) FROM chat_messages WHERE session_id=cs.id) as message_count
			FROM chat_sessions cs WHERE cs.user_id=? ORDER BY cs.created_at DESC`, [locals.user.id])
	]);
	
	return {
		sessionId,
		messages,
		sessions,
		quickActions: [
			{ title: 'Draft Client Email', prompt: 'Help me draft a professional email to a client about [describe the situation, e.g., property viewing, offer update, market conditions]' },
			{ title: 'Property Valuation', prompt: 'Analyze the market value for a property: [provide address, property type, size, condition] and give comparable market analysis' },
			{ title: 'Investment Analysis', prompt: 'Calculate ROI and investment potential for: [property price, rental income, expenses, location, property type]' },
			{ title: 'Marketing Copy', prompt: 'Create compelling marketing copy for property listing: [describe property features, location, unique selling points]' },
			{ title: 'Legal Guidance', prompt: 'I need legal guidance for real estate matter: [describe situation - contracts, disclosures, compliance issues]' },
			{ title: 'Negotiation Strategy', prompt: 'Help me develop a negotiation strategy for: [buyer/seller scenario, price point, terms, timeline]' }
		]
	};
};

export const actions = {
	chat: async ({ request, cookies }) => {
		const message = (await request.formData()).get('message') || '';
		const sessionId = cookies.get('chat_session');
		
		await db('INSERT INTO chat_messages (session_id, role, content) VALUES (?, ?, ?)', [sessionId, 'user', message]);
		const reply = await getAIResponse(message);
		await db('INSERT INTO chat_messages (session_id, role, content) VALUES (?, ?, ?)', [sessionId, 'bot', reply]);
		
		return { success: true, data: { reply } };
	},
	
	newChat: async ({ locals, cookies }) => {
		const sessionId = (await db('INSERT INTO chat_sessions (user_id) VALUES (?)', [locals.user.id])).insertId;
		cookies.set('chat_session', sessionId, { path: '/admin/chatBot', maxAge: 86400 });
		return { success: true };
	},
	
	loadSession: async ({ request, cookies }) => {
		cookies.set('chat_session', (await request.formData()).get('session_id'), { path: '/admin/chatBot', maxAge: 86400 });
		return { success: true };
	},
	
	deleteSession: async ({ request, locals }) => {
		await db('DELETE FROM chat_sessions WHERE id=? AND user_id=?', [(await request.formData()).get('session_id'), locals.user.id]);
		return { success: true };
	}
};
