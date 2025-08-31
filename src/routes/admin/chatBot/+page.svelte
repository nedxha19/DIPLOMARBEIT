<script>
  import { enhance } from '$app/forms';
  import { onMount } from 'svelte';
  
  export let data;
  
  let messages = [];
  let input = '';
  let loading = false;
  let chatContainer;
  let showQuickActions = false;
  let currentTypingMessage = null;

  const initialMessage = {
    role: 'bot',
    text: 'Hello! I\'m your Houseo AI Assistant. I can help you with client communications, property analysis, legal guidance, marketing content, and more. How can I assist you today?',
    timestamp: new Date()
  };

  onMount(() => {
    messages = [initialMessage];
  });

  // Handle form submission
  function handleSubmit() {
    if (!input.trim()) return;
    
    // Add user message
    const userMsg = {
      role: 'user',
      text: input.trim(),
      timestamp: new Date()
    };
    messages = [...messages, userMsg];
    
    loading = true;
    showQuickActions = false;
    
    // Add typing indicator
    messages = [...messages, {
      role: 'bot',
      text: '...',
      isTyping: true,
      timestamp: new Date()
    }];

    return async ({ result }) => {
      // Remove typing indicator
      messages = messages.filter(msg => !msg.isTyping);
      
      if (result.type === 'success' && result.data?.success) {
        const botMsg = {
          role: 'bot',
          text: result.data.data.reply,
          timestamp: new Date()
        };
        messages = [...messages, botMsg];
      } else {
        const errorMsg = {
          role: 'bot',
          text: result.data?.error || 'Sorry, something went wrong. Please try again.',
          timestamp: new Date(),
          isError: true
        };
        messages = [...messages, errorMsg];
      }
      
      loading = false;
      input = '';
      
      // Scroll to bottom
      setTimeout(() => {
        if (chatContainer) {
          chatContainer.scrollTop = chatContainer.scrollHeight;
        }
      }, 50);
    };
  }

  function useQuickAction(action) {
    input = action.prompt;
    showQuickActions = false;
  }

  function toggleQuickActions() {
    showQuickActions = !showQuickActions;
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      e.target.form.requestSubmit();
    }
  }

  function clearChat() {
    if (confirm('Are you sure you want to clear the conversation? This action cannot be undone.')) {
      messages = [initialMessage];
      input = '';
      showQuickActions = false;
      loading = false;
      currentTypingMessage = null;
    }
  }

  function copyMessage(text) {
    navigator.clipboard.writeText(text).then(() => {
      // Could add a toast notification here
    });
  }

  function scrollToBottom() {
    setTimeout(() => {
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }, 100);
  }
</script>

<div class="admin-container-full chat-app">
  <!-- Modern Header -->
  <header class="admin-page-header">
    <div class="admin-header-content">
      <div class="admin-header-icon">
        <i class="fas fa-robot"></i>
      </div>
      <div class="admin-header-text">
        <h1>Houseo AI Assistant</h1>
        <p class="status">
          {#if loading}
            <i class="fas fa-circle pulse"></i> Thinking...
          {:else}
            <i class="fas fa-circle online"></i> Ready to help
          {/if}
        </p>
      </div>
    </div>
    <div class="admin-header-stats">
      <div class="admin-stat-card">
        <button type="button" on:click={toggleQuickActions} class="action-btn" title="Quick Actions">
          <i class="fas fa-lightbulb"></i>
          <span>Templates</span>
        </button>
      </div>
      <div class="admin-stat-card">
        <button type="button" on:click={clearChat} class="action-btn danger" title="Clear Chat">
          <i class="fas fa-trash-alt"></i>
          <span>Clear</span>
        </button>
      </div>
    </div>
  </header>

  <!-- Message Stats -->
  <div class="chat-stats">
    <span class="message-count">{messages.length} messages</span>
    {#if showQuickActions}
      <span class="separator">•</span>
      <span class="templates-active">Templates active</span>
    {/if}
  </div>

  <!-- Quick Actions Panel -->
  {#if showQuickActions}
    <div class="quick-actions">
      <div class="quick-actions-header">
        <h3><i class="fas fa-magic"></i> Quick Templates</h3>
        <button type="button" on:click={toggleQuickActions} class="close-btn" aria-label="Close quick actions panel">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="actions-grid">
        {#each data.quickActions as action, index}
          <button 
            type="button"
            class="template-btn"
            on:click={() => useQuickAction(action)}
          >
            <div class="template-icon">
              <i class="fas fa-{index === 0 ? 'comments' : index === 1 ? 'chart-line' : index === 2 ? 'gavel' : index === 3 ? 'bullhorn' : 'file-alt'}"></i>
            </div>
            <div class="template-content">
              <strong>{action.title}</strong>
              <span>{action.prompt.substring(0, 45)}...</span>
            </div>
            <div class="template-arrow">
              <i class="fas fa-arrow-right"></i>
            </div>
          </button>
        {/each}
      </div>
    </div>
  {/if}

  <!-- Messages Container -->
  <div class="messages-container">
    <div class="messages" bind:this={chatContainer}>
      {#each messages as msg, index}
        <div class="message {msg.role}" class:error={msg.isError}>
          {#if msg.role === 'bot' && !msg.isTyping}
            <div class="message-avatar">
              <i class="fas fa-robot"></i>
            </div>
          {/if}
          
          <div class="message-content">
            {#if msg.isTyping}
              <div class="typing-indicator">
                <div class="typing">
                  <span></span><span></span><span></span>
                </div>
                <span class="typing-text">AI is thinking...</span>
              </div>
            {:else}
              <div class="message-text">
                <p>{msg.text}</p>
              </div>
              <div class="message-footer">
                <time>{new Date(msg.timestamp).toLocaleTimeString()}</time>
                {#if msg.role === 'bot'}
                  <div class="message-actions">
                    <button type="button" on:click={() => copyMessage(msg.text)} class="msg-action" aria-label="Copy message">
                      <i class="fas fa-copy"></i>
                    </button>
                  </div>
                {/if}
              </div>
            {/if}
          </div>

          {#if msg.role === 'user'}
            <div class="message-avatar user">
              <i class="fas fa-user"></i>
            </div>
          {/if}
        </div>
      {/each}
      

    </div>
  </div>

  <!-- Input Form -->
  <form method="POST" action="?/chat" use:enhance={handleSubmit} class="input-form">
    <div class="input-group">
      <textarea
        name="message"
        bind:value={input}
        placeholder="Type your message here..."
        rows="2"
        maxlength="2000"
        disabled={loading}

        required
      ></textarea>
      
      <button 
        type="submit" 
        disabled={!input.trim() || loading}
        class="send-btn"
      >
        {#if loading}
          Sending...
        {:else}
          Send
        {/if}
      </button>
    </div>
    
    <div class="input-footer">
      <span>Characters: {input.length}/2000</span>
      <span>Press Enter to send</span>
    </div>
  </form>
</div>

<style>
  /* === OPTIMIZED CHAT APPLICATION STYLES === */
  
  .chat-app {
    height: 100vh;
    display: flex;
    flex-direction: column;
    background: var(--gradient-bg);
    font-family: var(--font-family-sans);
  }

  /* === HEADER SECTION === */
  /* Header styles now handled by global admin-page-header classes */
  
  /* Custom status styling for chatbot */
  .status {
    color: var(--text-white) !important;
    opacity: 0.9;
    font-size: var(--font-size-sm);
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }

  .status i.online {
    color: var(--success-color);
    animation: pulse 2s infinite;
  }

  .status i.pulse {
    color: var(--warning-color);
    animation: thinking 1.5s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  @keyframes thinking {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }

  /* Action buttons styled to fit in stat cards */
  .action-btn {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    background: transparent;
    border: none;
    color: var(--text-white);
    padding: var(--space-2);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: var(--transition-fast);
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-medium);
    width: 100%;
    justify-content: center;
  }

  .action-btn:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-1px);
  }

  .action-btn.danger:hover {
    background: rgba(239, 68, 68, 0.2);
  }



  .status {
    margin: 0.25rem 0 0 0;
    font-size: 0.85rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    opacity: 0.9;
  }

  .status .fa-circle {
    font-size: 0.5rem;
  }

  .status .online {
    color: #22c55e;
  }

  .status .pulse {
    color: #0ea5e9;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  .header-actions {
    display: flex;
    gap: 0.75rem;
  }

  .action-btn {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: #f3f4f6;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.85rem;
    font-weight: 500;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .action-btn:hover {
    background: rgba(14, 165, 233, 0.2);
    border-color: rgba(14, 165, 233, 0.4);
    transform: translateY(-1px);
  }

  .action-btn.danger:hover {
    background: rgba(239, 68, 68, 0.2);
    border-color: rgba(239, 68, 68, 0.4);
  }

  /* Chat Stats */
  .chat-stats {
    background: rgba(255, 255, 255, 0.05);
    padding: 0.75rem 2rem;
    font-size: 0.85rem;
    color: var(--text-white);
    opacity: 0.7;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .separator {
    opacity: 0.5;
  }

  .templates-active {
    color: #0ea5e9;
    font-weight: 500;
  }

  /* Quick Actions Toggle */
  .quick-toggle {
    padding: 1rem 2rem;
    background: white;
    border-bottom: 1px solid rgba(156, 163, 175, 0.2);
  }

  .toggle-btn {
    background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
    border: 1px solid rgba(156, 163, 175, 0.3);
    border-radius: 10px;
    padding: 0.75rem 1rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
    font-weight: 500;
    color: #374151;
    transition: all 0.3s ease;
    width: 100%;
    justify-content: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }

  .toggle-btn:hover {
    background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
    border-color: #0ea5e9;
    color: white;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(14, 165, 233, 0.2);
  }

  .toggle-btn i:first-child {
    color: #0ea5e9;
    transition: color 0.3s ease;
  }

  .toggle-btn:hover i:first-child {
    color: white;
  }

  .toggle-btn i:last-child {
    margin-left: auto;
    transition: color 0.3s ease;
  }

  .toggle-btn:hover i:last-child {
    color: white;
  }

  /* Quick Actions */
  .quick-actions {
    background: linear-gradient(135deg, #ffffff 0%, #f9fafb 100%);
    border-bottom: 1px solid rgba(156, 163, 175, 0.2);
    padding: 0;
    animation: slideDown 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }

  .quick-actions-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.25rem 2rem;
    border-bottom: 1px solid rgba(156, 163, 175, 0.1);
  }

  .quick-actions-header h3 {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 600;
    color: #1a2236;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .quick-actions-header h3 i {
    color: #0ea5e9;
  }

  .close-btn {
    background: none;
    border: none;
    color: var(--text-white);
    opacity: 0.7;
    cursor: pointer;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
  }

  .close-btn:hover {
    background: rgba(239, 68, 68, 0.1);
    color: #ef4444;
  }

  @keyframes slideDown {
    from { opacity: 0; max-height: 0; }
    to { opacity: 1; max-height: 600px; }
  }

  .actions-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 1rem;
    padding: 1.5rem 2rem 2rem;
  }

  .template-btn {
    background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
    border: 1px solid rgba(156, 163, 175, 0.2);
    border-radius: 12px;
    padding: 1.25rem;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 1rem;
    text-align: left;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    position: relative;
    overflow: hidden;
  }

  .template-btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #0ea5e9, #1a2236);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .template-btn:hover::before {
    opacity: 1;
  }

  .template-btn:hover {
    border-color: rgba(14, 165, 233, 0.3);
    background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(14, 165, 233, 0.12);
  }

  .template-icon {
    width: 48px;
    height: 48px;
    border-radius: 10px;
    background: linear-gradient(135deg, #0ea5e9 0%, #1a2236 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.125rem;
    flex-shrink: 0;
  }

  .template-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .template-content strong {
    color: #1a2236;
    font-size: 1rem;
    font-weight: 600;
    line-height: 1.3;
  }

  .template-content span {
    color: #6b7280;
    font-size: 0.875rem;
    line-height: 1.4;
  }

  .template-arrow {
    color: var(--text-white);
    opacity: 0.6;
    font-size: 0.875rem;
    transition: all 0.3s ease;
  }

  .template-btn:hover .template-arrow {
    color: #0ea5e9;
    transform: translateX(4px);
  }

  /* Messages Container */
  .messages-container {
    flex: 1;
    overflow: hidden;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  }

  .messages {
    height: 100%;
    overflow-y: auto;
    padding: 1.5rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .messages::-webkit-scrollbar {
    width: 6px;
  }

  .messages::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 3px;
  }

  .messages::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
  }

  .messages::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }

  .message {
    display: flex;
    gap: 0.75rem;
    align-items: flex-start;
    animation: messageSlide 0.4s ease;
    max-width: 85%;
  }

  .message.user {
    align-self: flex-end;
    flex-direction: row-reverse;
  }

  .message.bot {
    align-self: flex-start;
  }

  @keyframes messageSlide {
    from {
      opacity: 0;
      transform: translateY(15px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  .message-avatar {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    flex-shrink: 0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .message-avatar:not(.user) {
    background: linear-gradient(135deg, #0ea5e9 0%, #1a2236 100%);
    color: white;
  }

  .message-avatar.user {
    background: linear-gradient(135deg, #1a2236 0%, #0ea5e9 100%);
    color: white;
  }

  .message-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .message.user .message-content {
    align-items: flex-end;
  }

  .message-text {
    padding: 1rem 1.25rem;
    border-radius: 16px;
    position: relative;
  }

  .message.user .message-text {
    background: var(--gradient-button);
    color: var(--text-white) !important;
    border-radius: 16px 16px 6px 16px;
    box-shadow: var(--shadow-lg);
  }

  /* Ensure all text in user messages is white */
  .message.user .message-text * {
    color: var(--text-white) !important;
  }

  .message.bot .message-text {
    background: white;
    color: #1a2236;
    border-radius: 16px 16px 16px 6px;
    border: 1px solid rgba(156, 163, 175, 0.2);
    box-shadow: 0 3px 12px rgba(0, 0, 0, 0.08);
  }

  .message-footer {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.75rem;
    opacity: 0.7;
  }

  .message.user .message-footer {
    justify-content: flex-end;
  }

  .message-actions {
    display: flex;
    gap: 0.25rem;
  }

  .msg-action {
    background: rgba(156, 163, 175, 0.1);
    border: none;
    border-radius: 6px;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.75rem;
    color: #6b7280;
  }

  .msg-action:hover {
    background: rgba(14, 165, 233, 0.1);
    color: #0ea5e9;
  }

  .typing-indicator {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 1.25rem;
    background: white;
    border-radius: 16px 16px 16px 6px;
    border: 1px solid rgba(156, 163, 175, 0.2);
  }

  .typing-text {
    font-size: 0.875rem;
    color: #6b7280;
    font-style: italic;
  }



  .message.error {
    background: #fef2f2;
    border-color: #fecaca;
    color: #dc2626;
  }

  .message p {
    margin: 0 0 0.5rem 0;
    line-height: 1.5;
    font-size: 0.95rem;
  }

  .message time {
    font-size: 0.75rem;
    opacity: 0.7;
    font-weight: 500;
  }

  .typing {
    display: flex;
    gap: 4px;
    align-items: center;
    padding: 0.25rem 0;
  }

  .typing span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: linear-gradient(135deg, #0ea5e9 0%, #1a2236 100%);
    animation: typingBounce 1.4s ease-in-out infinite both;
    box-shadow: 0 0 6px rgba(14, 165, 233, 0.4);
  }

  .typing span:nth-child(1) { animation-delay: -0.32s; }
  .typing span:nth-child(2) { animation-delay: -0.16s; }

  @keyframes typingBounce {
    0%, 80%, 100% {
      transform: scale(0);
    } 40% {
      transform: scale(1);
    }
  }

  /* Input Form */
  .input-form {
    background: linear-gradient(135deg, #ffffff 0%, #f9fafb 100%);
    border-top: 1px solid rgba(156, 163, 175, 0.2);
    padding: 1.5rem 2rem;
    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.08);
  }

  .input-group {
    display: flex;
    gap: 1rem;
    align-items: flex-end;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    border: 2px solid rgba(156, 163, 175, 0.25);
    border-radius: 16px;
    padding: 1rem;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }

  .input-group:focus-within {
    border-color: #0ea5e9;
    box-shadow: 0 4px 16px rgba(14, 165, 233, 0.15);
    background: linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%);
  }

  .input-group textarea {
    flex: 1;
    border: none;
    background: transparent;
    color: #1a2236;
    padding: 0.5rem;
    font-family: inherit;
    font-size: 0.95rem;
    font-weight: 500;
    resize: none;
    outline: none;
    line-height: 1.5;
    min-height: 20px;
    max-height: 120px;
  }

  .input-group textarea::placeholder {
    color: var(--text-placeholder);
    font-weight: 400;
  }

  .input-group textarea:disabled {
    opacity: 0.6;
  }

  .send-btn {
    background: linear-gradient(135deg, #0ea5e9 0%, #1a2236 100%);
    color: white;
    border: none;
    border-radius: 12px;
    padding: 0.875rem 1.75rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    min-width: 90px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    box-shadow: 0 4px 16px rgba(14, 165, 233, 0.3);
    position: relative;
    overflow: hidden;
  }

  .send-btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s ease;
  }

  .send-btn:hover::before {
    left: 100%;
  }

  .send-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(14, 165, 233, 0.4);
    background: linear-gradient(135deg, #0284c7 0%, #1a2236 100%);
  }

  .send-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  .input-footer {
    display: flex;
    justify-content: space-between;
    margin-top: 1rem;
    font-size: 0.8rem;
    color: var(--text-muted);
    font-weight: 500;
  }

  /* Mobile */
  @media (max-width: 768px) {
    .admin-page-header {
      flex-direction: column;
      align-items: center;
      gap: var(--space-4);
      padding: var(--space-6);
      text-align: center;
    }

    .admin-header-stats {
      flex-direction: row;
      gap: var(--space-3);
    }

    .clear-btn {
      align-self: stretch;
      text-align: center;
    }

    .quick-toggle {
      padding: 1rem;
    }

    .quick-actions {
      padding: 1rem;
    }

    .actions-grid {
      grid-template-columns: 1fr;
    }

    .messages {
      padding: 1rem;
    }

    .message {
      max-width: 90%;
    }

    .input-form {
      padding: 1rem;
    }

    .input-group {
      flex-direction: column;
      align-items: stretch;
    }

    .send-btn {
      margin-top: 0.5rem;
    }

    .input-footer {
      flex-direction: column;
      gap: 0.25rem;
      text-align: center;
    }
  }
</style>