<script>
  import { enhance } from '$app/forms';
  import { onMount } from 'svelte';
  
  export let data;
  
  let messages = [];
  let input = '';
  let loading = false;
  let chatContainer;
  let showSidebar = true;
  let showQuickActions = false;
  let searchQuery = '';
  let toastMessage = '';
  let showToast = false;
  
  $: filteredSessions = data.sessions.filter(s => 
    !searchQuery || (s.first_message?.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const quickActions = [
    { icon: 'envelope', title: 'Draft Email', prompt: 'Help me draft a professional email about ' },
    { icon: 'chart-line', title: 'Property Analysis', prompt: 'Analyze property market trends for ' },
    { icon: 'calculator', title: 'ROI Calculator', prompt: 'Calculate ROI for property with price ' },
    { icon: 'gavel', title: 'Legal Guidance', prompt: 'Provide legal guidance on real estate ' },
    { icon: 'bullhorn', title: 'Marketing Copy', prompt: 'Create marketing content for property ' },
    { icon: 'handshake', title: 'Negotiation Tips', prompt: 'Give negotiation strategy for ' }
  ];
  
  onMount(() => {
    messages = data.messages?.length 
      ? data.messages.map(m => ({ 
          role: m.role, 
          text: m.content, 
          time: new Date(m.created_at),
          id: crypto.randomUUID()
        }))
      : [{ 
          role: 'bot', 
          text: 'Hello! I\'m your AI assistant for property management. How can I help you today?', 
          time: new Date(),
          id: crypto.randomUUID()
        }];
    scrollToBottom();
  });
  
  function scrollToBottom() {
    setTimeout(() => chatContainer?.scrollTo({ top: chatContainer.scrollHeight, behavior: 'smooth' }), 100);
  }
  
  function handleSubmit() {
    if (!input.trim() || loading) return;
    
    messages = [...messages, { 
      role: 'user', 
      text: input.trim(), 
      time: new Date(),
      id: crypto.randomUUID()
    }];
    
    loading = true;
    const userInput = input;
    input = '';
    
    messages = [...messages, { 
      role: 'bot', 
      text: '', 
      isTyping: true, 
      time: new Date(),
      id: crypto.randomUUID()
    }];
    
    scrollToBottom();
    
    return async ({ result }) => {
      messages = messages.filter(m => !m.isTyping);
      
      if (result.data?.data?.reply) {
        messages = [...messages, {
          role: 'bot',
          text: result.data.data.reply,
          time: new Date(),
          id: crypto.randomUUID()
        }];
      }
      
      loading = false;
      scrollToBottom();
    };
  }
  
  function useQuickAction(action) {
    input = action.prompt;
    showQuickActions = false;
    document.querySelector('textarea')?.focus();
  }
  
  function copyMessage(text) {
    navigator.clipboard.writeText(text);
    displayToast('Message copied to clipboard!');
  }
  
  function displayToast(msg) {
    toastMessage = msg;
    showToast = true;
    setTimeout(() => showToast = false, 2500);
  }
  
  function exportChat() {
    const content = messages
      .filter(m => !m.isTyping)
      .map(m => `${m.role.toUpperCase()}: ${m.text}`)
      .join('\n\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    displayToast('Chat exported successfully!');
  }
  
  async function newChat() {
    const fd = new FormData();
    await fetch('?/newChat', { method: 'POST', body: fd });
    window.location.reload();
  }
  
  async function switchSession(id) {
    const fd = new FormData();
    fd.append('session_id', id);
    await fetch('?/loadSession', { method: 'POST', body: fd });
    window.location.reload();
  }
  
  async function deleteSession(id, e) {
    e.stopPropagation();
    if (!confirm('Delete this conversation?')) return;
    
    const fd = new FormData();
    fd.append('session_id', id);
    await fetch('?/deleteSession', { method: 'POST', body: fd });
    
    if (id === data.sessionId) {
      await newChat();
    } else {
      window.location.reload();
    }
  }
  
  function formatTime(date) {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
  
  function handleKeydown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      e.target.form.requestSubmit();
    }
  }
</script>

<div class="chat-app">
  <!-- Sidebar -->
  <aside class="sidebar" class:hidden={!showSidebar}>
    <header class="sidebar-header">
      <h2><i class="fas fa-comments"></i> Conversations</h2>
      <button class="btn-icon" on:click={newChat} aria-label="New chat">
        <i class="fas fa-plus"></i>
      </button>
    </header>
    
    <div class="search-box">
      <i class="fas fa-search"></i>
      <input 
        type="search" 
        placeholder="Search conversations..." 
        bind:value={searchQuery}
        aria-label="Search"
      />
    </div>
    
    <div class="sessions">
      {#if filteredSessions.length === 0}
        <div class="empty">
          <i class="fas fa-history"></i>
          <p>No conversations yet</p>
          <button class="btn-primary" on:click={newChat}>Start New Chat</button>
        </div>
      {:else}
        {#each filteredSessions as session}
          <div 
            class="session"
            class:active={session.id === data.sessionId}
            on:click={() => switchSession(session.id)}
            on:keydown={(e) => e.key === 'Enter' && switchSession(session.id)}
            tabindex="0"
            role="button"
          >
            <div class="session-info">
              <span class="session-title">
                {session.first_message?.substring(0, 50) || 'New conversation'}
                {#if session.first_message?.length > 50}...{/if}
              </span>
              <span class="session-meta">
                <i class="fas fa-message"></i> {session.message_count || 0} · 
                {formatTime(session.created_at)}
              </span>
            </div>
            <button 
              class="btn-delete"
              on:click={(e) => deleteSession(session.id, e)}
              aria-label="Delete"
            >
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        {/each}
      {/if}
    </div>
  </aside>
  
  <!-- Main -->
  <main class="main">
    <!-- Topbar -->
    <header class="topbar">
      <div class="topbar-left">
        <button class="btn-icon" on:click={() => showSidebar = !showSidebar} aria-label="Toggle sidebar">
          <i class="fas fa-bars"></i>
        </button>
        <div class="title">
          <h1>AI Assistant</h1>
          <span class="status" class:loading>
            <i class="fas fa-circle"></i>
            {loading ? 'Thinking...' : 'Online'}
          </span>
        </div>
      </div>
      
      <div class="topbar-right">
        <button class="btn-icon" on:click={() => showQuickActions = !showQuickActions} aria-label="Quick actions">
          <i class="fas fa-bolt"></i>
        </button>
        <button class="btn-icon" on:click={exportChat} aria-label="Export chat">
          <i class="fas fa-download"></i>
        </button>
      </div>
    </header>
    
    <!-- Quick Actions -->
    {#if showQuickActions}
      <section class="quick-actions">
        <div class="quick-header">
          <span><i class="fas fa-bolt"></i> Quick Actions</span>
          <button class="btn-icon-sm" on:click={() => showQuickActions = false} aria-label="Close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="quick-grid">
          {#each quickActions as action}
            <button class="quick-btn" on:click={() => useQuickAction(action)}>
              <i class="fas fa-{action.icon}"></i>
              <span>{action.title}</span>
            </button>
          {/each}
        </div>
      </section>
    {/if}
    
    <!-- Messages -->
    <div class="messages" bind:this={chatContainer}>
      {#each messages as msg (msg.id)}
        <div class="message {msg.role}">
          <div class="avatar">
            <i class="fas fa-{msg.role === 'user' ? 'user' : 'robot'}"></i>
          </div>
          <div class="bubble">
            {#if msg.isTyping}
              <div class="typing">
                <span></span><span></span><span></span>
              </div>
            {:else}
              <div class="bubble-header">
                <strong>{msg.role === 'user' ? 'You' : 'AI Assistant'}</strong>
                <time>{formatTime(msg.time)}</time>
              </div>
              <p class="text">{msg.text}</p>
              {#if msg.role === 'bot'}
                <button class="btn-copy" on:click={() => copyMessage(msg.text)} aria-label="Copy">
                  <i class="fas fa-copy"></i>
                </button>
              {/if}
            {/if}
          </div>
        </div>
      {/each}
    </div>
    
    <!-- Input -->
    <footer class="input-bar">
      <form method="POST" action="?/chat" use:enhance={handleSubmit}>
        <textarea
          bind:value={input}
          on:keydown={handleKeydown}
          placeholder="Type your message..."
          rows="1"
          disabled={loading}
          aria-label="Message input"
        ></textarea>
        <button type="submit" class="btn-send" disabled={!input.trim() || loading}>
          {#if loading}
            <i class="fas fa-spinner fa-spin"></i>
          {:else}
            <i class="fas fa-paper-plane"></i>
          {/if}
          <span>Send</span>
        </button>
      </form>
    </footer>
  </main>
</div>

<!-- Toast -->
{#if showToast}
  <div class="toast">
    <i class="fas fa-check-circle"></i>
    {toastMessage}
  </div>
{/if}

<style>
  /* ============================================
     CHATBOT - USES DESIGN SYSTEM ONLY
     No hardcoded values, no conflicts
     ============================================ */
  
  .chat-app {
    display: flex;
    height: 100vh;
    background: var(--bg-secondary);
    font-family: var(--font-family-sans);
    color: var(--text-primary);
  }
  
  /* ============================================
     SIDEBAR
     ============================================ */
  .sidebar {
    width: var(--sidebar-width);
    background: var(--bg-secondary);
    border-right: 1px solid var(--border-light);
    display: flex;
    flex-direction: column;
    transition: var(--transition-normal);
  }
  
  .sidebar.hidden {
    margin-left: calc(-1 * var(--sidebar-width));
  }
  
  .sidebar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-6);
    background: var(--gradient-header);
    color: var(--text-white);
  }
  
  .sidebar-header h2 {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-semibold);
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }
  
  .sidebar-header h2 i {
    color: var(--text-white);
  }
  
  .sidebar-header .btn-icon {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
    color: var(--text-white);
  }
  
  .sidebar-header .btn-icon:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: var(--text-white);
    color: var(--text-white);
  }
  
  .search-box {
    position: relative;
    padding: var(--space-4);
    border-bottom: 1px solid var(--border-light);
  }
  
  .search-box i {
    position: absolute;
    left: var(--space-6);
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-muted);
  }
  
  .search-box input {
    width: 100%;
    padding: var(--space-2-5) var(--space-10);
    border: 1px solid var(--border-light);
    border-radius: var(--radius-xl);
    font-size: var(--font-size-sm);
    outline: none;
    transition: var(--transition-fast);
  }
  
  .search-box input:focus {
    border-color: var(--border-focus);
    box-shadow: var(--shadow-outline);
  }
  
  .search-box input::placeholder {
    color: var(--text-placeholder);
  }
  
  .sessions {
    flex: 1;
    overflow-y: auto;
    padding: var(--space-2);
  }
  
  .session {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-3);
    margin-bottom: var(--space-1);
    border-radius: var(--radius-xl);
    cursor: pointer;
    transition: var(--transition-fast);
    border: 1px solid transparent;
  }
  
  .session:hover {
    background: var(--bg-accent);
    border-color: var(--border-light);
  }
  
  .session.active {
    background: var(--gradient-primary);
    color: var(--text-white);
  }
  
  .session-info {
    flex: 1;
    min-width: 0;
  }
  
  .session-title {
    display: block;
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-bottom: var(--space-1);
    color: var(--text-primary);
  }
  
  .session.active .session-title {
    color: var(--text-white);
  }
  
  .session-meta {
    font-size: var(--font-size-xs);
    color: var(--text-muted);
    display: flex;
    align-items: center;
    gap: var(--space-1);
  }
  
  .session-meta i {
    color: var(--text-secondary);
  }
  
  .session.active .session-meta {
    color: rgba(255, 255, 255, 0.8);
  }
  
  .session.active .session-meta i {
    color: rgba(255, 255, 255, 0.9);
  }
  
  .btn-delete {
    opacity: 0;
    width: var(--space-8);
    height: var(--space-8);
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    color: var(--error-color);
    border-radius: var(--radius-lg);
    cursor: pointer;
    transition: var(--transition-fast);
  }
  
  .session:hover .btn-delete {
    opacity: 1;
  }
  
  .btn-delete:hover {
    background: var(--error-light);
    transform: scale(1.1);
  }
  
  .empty {
    text-align: center;
    padding: var(--space-12) var(--space-4);
    color: var(--text-muted);
  }
  
  .empty i {
    font-size: var(--font-size-4xl);
    margin-bottom: var(--space-4);
    opacity: 0.5;
    color: var(--text-muted);
  }
  
  .empty p {
    margin-bottom: var(--space-6);
    font-size: var(--font-size-sm);
    color: var(--text-secondary);
  }
  
  /* ============================================
     MAIN AREA
     ============================================ */
  .main {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: var(--bg-primary);
  }
  
  .topbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-4) var(--space-6);
    background: var(--bg-secondary);
    border-bottom: 1px solid var(--border-light);
    box-shadow: var(--shadow-sm);
  }
  
  .topbar-left, .topbar-right {
    display: flex;
    align-items: center;
    gap: var(--space-3);
  }
  
  .title h1 {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-semibold);
    margin: 0;
    color: var(--text-primary);
  }
  
  .status {
    font-size: var(--font-size-xs);
    color: var(--text-secondary);
    display: flex;
    align-items: center;
    gap: var(--space-1);
  }
  
  .status i {
    color: var(--success-color);
  }
  
  .status.loading i {
    color: var(--warning-color);
    animation: pulse 1.5s infinite;
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  
  .btn-icon, .btn-icon-sm {
    width: var(--button-height);
    height: var(--button-height);
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: 1px solid var(--border-light);
    border-radius: var(--radius-xl);
    color: var(--text-secondary);
    cursor: pointer;
    transition: var(--transition-fast);
  }
  
  .btn-icon-sm {
    width: var(--space-8);
    height: var(--space-8);
  }
  
  .btn-icon:hover, .btn-icon-sm:hover {
    background: var(--bg-accent);
    border-color: var(--accent-color);
    color: var(--accent-color);
    transform: translateY(-1px);
  }
  
  .btn-icon i,
  .btn-icon-sm i {
    color: inherit;
  }
  
  /* ============================================
     QUICK ACTIONS
     ============================================ */
  .quick-actions {
    background: var(--bg-secondary);
    border-bottom: 1px solid var(--border-light);
    padding: var(--space-4) var(--space-6);
    animation: slideDown var(--duration-300) var(--timing-ease);
  }
  
  @keyframes slideDown {
    from { transform: translateY(-100%); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  
  .quick-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-4);
  }
  
  .quick-header span {
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-semibold);
    display: flex;
    align-items: center;
    gap: var(--space-2);
    color: var(--text-primary);
  }
  
  .quick-header span i {
    color: var(--accent-color);
  }
  
  .quick-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: var(--space-3);
  }
  
  .quick-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-4);
    background: var(--bg-accent);
    border: 1px solid var(--border-light);
    border-radius: var(--radius-xl);
    cursor: pointer;
    transition: var(--transition-fast);
  }
  
  .quick-btn:hover {
    background: var(--gradient-button);
    color: var(--text-white);
    border-color: transparent;
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }
  
  .quick-btn i {
    font-size: var(--font-size-xl);
    color: var(--accent-color);
  }
  
  .quick-btn:hover i {
    color: var(--text-white);
  }
  
  .quick-btn span {
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-medium);
    color: var(--text-primary);
  }
  
  .quick-btn:hover span {
    color: var(--text-white);
  }
  
  /* ============================================
     MESSAGES
     ============================================ */
  .messages {
    flex: 1;
    overflow-y: auto;
    padding: var(--space-6);
    display: flex;
    flex-direction: column;
    gap: var(--space-6);
  }
  
  .message {
    display: flex;
    gap: var(--space-3);
    max-width: 70%;
    animation: fadeIn var(--duration-300) var(--timing-ease);
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .message.user {
    align-self: flex-end;
    flex-direction: row-reverse;
  }
  
  .avatar {
    width: var(--space-10);
    height: var(--space-10);
    border-radius: var(--radius-full);
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-dark);
    color: var(--text-white);
    flex-shrink: 0;
  }
  
  .avatar i {
    color: var(--text-white);
  }
  
  .message.bot .avatar {
    background: var(--accent-color);
  }
  
  .message.bot .avatar i {
    color: var(--text-white);
  }
  
  .bubble {
    flex: 1;
    padding: var(--space-4);
    border-radius: var(--radius-2xl);
    background: var(--bg-secondary);
    border: 1px solid var(--border-light);
    box-shadow: var(--shadow-sm);
    position: relative;
  }
  
  .message.user .bubble {
    background: var(--gradient-primary);
    color: var(--text-white);
    border: none;
  }
  
  .bubble-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-2);
    font-size: var(--font-size-xs);
    color: var(--text-secondary);
  }
  
  .bubble-header strong {
    color: var(--text-primary);
  }
  
  .bubble-header time {
    color: var(--text-muted);
  }
  
  .message.user .bubble-header {
    color: rgba(255, 255, 255, 0.8);
  }
  
  .message.user .bubble-header strong,
  .message.user .bubble-header time {
    color: rgba(255, 255, 255, 0.9);
  }
  
  .text {
    font-size: var(--font-size-sm);
    line-height: var(--line-height-relaxed);
    white-space: pre-wrap;
    word-wrap: break-word;
    color: var(--text-primary);
  }
  
  .message.user .text {
    color: var(--text-white);
  }
  
  .btn-copy {
    position: absolute;
    top: var(--space-2);
    right: var(--space-2);
    width: var(--space-8);
    height: var(--space-8);
    background: var(--bg-accent);
    border: none;
    border-radius: var(--radius-lg);
    color: var(--text-secondary);
    cursor: pointer;
    opacity: 0;
    transition: var(--transition-fast);
  }
  
  .bubble:hover .btn-copy {
    opacity: 1;
  }
  
  .btn-copy:hover {
    background: var(--accent-color);
    color: var(--text-white);
  }
  
  .btn-copy i {
    color: inherit;
  }
  
  .typing {
    display: flex;
    gap: var(--space-1);
    padding: var(--space-2);
  }
  
  .typing span {
    width: 8px;
    height: 8px;
    background: var(--accent-color);
    border-radius: var(--radius-full);
    animation: bounce 1.4s infinite ease-in-out;
  }
  
  .typing span:nth-child(2) { animation-delay: 0.2s; }
  .typing span:nth-child(3) { animation-delay: 0.4s; }
  
  @keyframes bounce {
    0%, 80%, 100% { transform: scale(0); }
    40% { transform: scale(1); }
  }
  
  /* ============================================
     INPUT BAR
     ============================================ */
  .input-bar {
    padding: var(--space-4) var(--space-6);
    background: var(--bg-secondary);
    border-top: 1px solid var(--border-light);
  }
  
  .input-bar form {
    display: flex;
    gap: var(--space-3);
    align-items: flex-end;
  }
  
  textarea {
    flex: 1;
    min-height: var(--input-height);
    max-height: 150px;
    padding: var(--space-3);
    border: 1px solid var(--border-light);
    border-radius: var(--radius-xl);
    font-family: var(--font-family-sans);
    font-size: var(--font-size-sm);
    resize: vertical;
    outline: none;
    transition: var(--transition-fast);
  }
  
  textarea:focus {
    border-color: var(--border-focus);
    box-shadow: var(--shadow-outline);
  }
  
  textarea:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  textarea::placeholder {
    color: var(--text-placeholder);
  }
  
  .btn-send, .btn-primary {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-3) var(--space-6);
    background: var(--gradient-button);
    color: var(--text-white);
    border: none;
    border-radius: var(--radius-xl);
    font-weight: var(--font-weight-semibold);
    cursor: pointer;
    transition: var(--transition-fast);
    box-shadow: var(--shadow-sm);
  }
  
  .btn-send:hover:not(:disabled), .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }
  
  .btn-send:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .btn-send i,
  .btn-primary i,
  .btn-send span,
  .btn-primary span {
    color: var(--text-white);
  }
  
  /* ============================================
     TOAST
     ============================================ */
  .toast {
    position: fixed;
    bottom: var(--space-6);
    right: var(--space-6);
    background: var(--success-color);
    color: var(--text-white);
    padding: var(--space-4) var(--space-6);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-xl);
    display: flex;
    align-items: center;
    gap: var(--space-3);
    font-weight: var(--font-weight-medium);
    animation: toastIn var(--duration-300) var(--timing-ease);
    z-index: var(--z-index-toast);
  }
  
  .toast i {
    color: var(--text-white);
    font-size: var(--font-size-lg);
  }
  
  @keyframes toastIn {
    from { transform: translateY(100px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  
  /* ============================================
     RESPONSIVE
     ============================================ */
  @media (max-width: 768px) {
    .sidebar {
      position: absolute;
      height: 100%;
      z-index: var(--z-index-fixed);
      box-shadow: var(--shadow-2xl);
    }
    
    .sidebar.hidden {
      margin-left: 0;
      transform: translateX(-100%);
    }
    
    .message {
      max-width: 90%;
    }
    
    .btn-send span {
      display: none;
    }
    
    .quick-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  
  /* ============================================
     SCROLLBAR
     ============================================ */
  .sessions::-webkit-scrollbar,
  .messages::-webkit-scrollbar {
    width: 6px;
  }
  
  .sessions::-webkit-scrollbar-track,
  .messages::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .sessions::-webkit-scrollbar-thumb,
  .messages::-webkit-scrollbar-thumb {
    background: var(--border-medium);
    border-radius: var(--radius-full);
  }
  
  .sessions::-webkit-scrollbar-thumb:hover,
  .messages::-webkit-scrollbar-thumb:hover {
    background: var(--border-dark);
  }
</style>
