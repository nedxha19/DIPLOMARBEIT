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

<!-- Modern AI Chat Interface with Tailwind CSS -->
<div class="flex h-screen bg-white">
  <!-- Sidebar -->
  <aside class="w-80 bg-white border-r border-gray-200 flex flex-col transition-all duration-300 {showSidebar ? 'translate-x-0' : '-translate-x-full'} fixed lg:relative z-40">
    <header class="flex justify-between items-center p-6 bg-gradient-to-r from-sky-600 to-orange-600 text-white">
      <h2 class="flex items-center gap-2 text-lg font-bold">
        <i class="fas fa-comments"></i>
        Conversations
      </h2>
      <button 
        class="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 hover:border-white transition-all hover:scale-110"
        on:click={newChat}
        aria-label="New chat"
      >
        <i class="fas fa-plus"></i>
      </button>
    </header>
    
    <div class="relative p-4 border-b border-gray-200">
      <i class="fas fa-search absolute left-7 top-1/2 -translate-y-1/2 text-gray-400"></i>
      <input 
        type="search" 
        placeholder="Search conversations..." 
        bind:value={searchQuery}
        autocomplete="off"
        aria-label="Search"
        class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
      />
    </div>
    
    <div class="flex-1 overflow-y-auto p-2 custom-scrollbar">
      {#if filteredSessions.length === 0}
        <div class="text-center py-12 px-4 text-gray-500">
          <i class="fas fa-history text-5xl mb-4 opacity-50"></i>
          <p class="text-sm mb-6">No conversations yet</p>
          <button 
            class="px-6 py-3 bg-gradient-to-r from-sky-600 to-orange-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all hover:scale-105"
            on:click={newChat}
          >
            Start New Chat
          </button>
        </div>
      {:else}
        {#each filteredSessions as session}
          <div 
            class="flex items-center gap-3 p-3 mb-1 rounded-xl cursor-pointer transition-all border border-transparent hover:bg-sky-50 hover:border-sky-200 {session.id === data.sessionId ? 'bg-gradient-to-r from-sky-600 to-orange-600 text-white' : ''}"
            on:click={() => switchSession(session.id)}
            on:keydown={(e) => e.key === 'Enter' && switchSession(session.id)}
            tabindex="0"
            role="button"
          >
            <div class="flex-1 min-w-0">
              <span class="block text-sm font-medium overflow-hidden text-ellipsis whitespace-nowrap mb-1 {session.id === data.sessionId ? 'text-white' : 'text-gray-800'}">
                {session.first_message?.substring(0, 50) || 'New conversation'}
                {#if session.first_message?.length > 50}...{/if}
              </span>
              <span class="flex items-center gap-1 text-xs {session.id === data.sessionId ? 'text-white/80' : 'text-gray-500'}">
                <i class="fas fa-message"></i>
                {session.message_count || 0} · {formatTime(session.created_at)}
              </span>
            </div>
            <button 
              class="opacity-0 group-hover:opacity-100 w-8 h-8 flex items-center justify-center bg-transparent hover:bg-red-100 border border-transparent hover:border-red-300 text-red-500 rounded-lg transition-all hover:scale-110"
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
  
  <!-- Main Chat Area -->
  <main class="flex-1 flex flex-col bg-gradient-to-br from-gray-50 to-white">
    <!-- Topbar -->
    <header class="flex justify-between items-center p-4 sm:p-6 bg-white border-b border-gray-200 shadow-sm">
      <div class="flex items-center gap-4">
        <button 
          class="lg:hidden w-10 h-10 flex items-center justify-center border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 hover:border-sky-500 hover:text-sky-600 transition-all"
          on:click={() => showSidebar = !showSidebar}
          aria-label="Toggle sidebar"
        >
          <i class="fas fa-bars"></i>
        </button>
        <div>
          <h1 class="text-xl font-bold text-gray-800">AI Assistant</h1>
          <span class="flex items-center gap-1 text-xs {loading ? 'text-yellow-600' : 'text-green-600'} font-medium">
            <i class="fas fa-circle {loading ? 'animate-pulse' : ''}"></i>
            {loading ? 'Thinking...' : 'Online'}
          </span>
        </div>
      </div>
      
      <div class="flex items-center gap-3">
        <button 
          class="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-xl text-gray-600 hover:bg-sky-50 hover:border-sky-500 hover:text-sky-600 transition-all hover:scale-110"
          on:click={() => showQuickActions = !showQuickActions}
          aria-label="Quick actions"
        >
          <i class="fas fa-bolt"></i>
        </button>
        <button 
          class="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-xl text-gray-600 hover:bg-orange-50 hover:border-orange-500 hover:text-orange-600 transition-all hover:scale-110"
          on:click={exportChat}
          aria-label="Export chat"
        >
          <i class="fas fa-download"></i>
        </button>
      </div>
    </header>
    
    <!-- Quick Actions -->
    {#if showQuickActions}
      <section class="bg-sky-50 border-b border-sky-200 p-4 sm:p-6 animate-slide-down">
        <div class="flex justify-between items-center mb-4">
          <span class="flex items-center gap-2 font-semibold text-gray-800">
            <i class="fas fa-bolt text-sky-600"></i>
            Quick Actions
          </span>
          <button 
            class="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-all"
            on:click={() => showQuickActions = false}
            aria-label="Close"
          >
            <i class="fas fa-times text-gray-600"></i>
          </button>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {#each quickActions as action}
            <button 
              class="flex flex-col items-center gap-2 p-4 bg-white border border-gray-200 rounded-xl cursor-pointer transition-all hover:bg-gradient-to-br hover:from-sky-600 hover:to-orange-600 hover:text-white hover:border-transparent hover:-translate-y-1 hover:shadow-lg group"
              on:click={() => useQuickAction(action)}
            >
              <i class="fas fa-{action.icon} text-2xl text-sky-600 group-hover:text-white transition-colors"></i>
              <span class="text-xs font-medium text-gray-800 group-hover:text-white transition-colors text-center">{action.title}</span>
            </button>
          {/each}
        </div>
      </section>
    {/if}
    
    <!-- Messages -->
    <div class="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar" bind:this={chatContainer}>
      {#each messages as msg (msg.id)}
        <div class="flex gap-3 max-w-4xl animate-fade-in {msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}">
          <div class="w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center {msg.role === 'user' ? 'bg-gray-800' : 'bg-gradient-to-br from-sky-600 to-orange-600'} text-white shadow-lg">
            <i class="fas fa-{msg.role === 'user' ? 'user' : 'robot'}"></i>
          </div>
          <div class="flex-1 {msg.role === 'user' ? 'max-w-2xl' : 'max-w-3xl'} p-4 rounded-2xl border shadow-sm relative {msg.role === 'user' ? 'bg-gradient-to-br from-sky-600 to-orange-600 text-white border-transparent' : 'bg-white border-gray-200'}">
            {#if msg.isTyping}
              <div class="flex gap-1 p-2">
                <span class="w-2 h-2 bg-sky-500 rounded-full animate-typing"></span>
                <span class="w-2 h-2 bg-sky-500 rounded-full animate-typing animation-delay-200"></span>
                <span class="w-2 h-2 bg-sky-500 rounded-full animate-typing animation-delay-400"></span>
              </div>
            {:else}
              <div class="flex justify-between items-center mb-2 text-xs {msg.role === 'user' ? 'text-white/80' : 'text-gray-500'}">
                <strong class="{msg.role === 'user' ? 'text-white' : 'text-gray-800'}">{msg.role === 'user' ? 'You' : 'AI Assistant'}</strong>
                <time>{formatTime(msg.time)}</time>
              </div>
              <p class="text-sm leading-relaxed whitespace-pre-wrap {msg.role === 'user' ? 'text-white' : 'text-gray-800'}">{msg.text}</p>
              {#if msg.role === 'bot'}
                <button 
                  class="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-sky-50 text-sky-600 border border-transparent rounded-lg opacity-0 group-hover:opacity-100 hover:bg-sky-600 hover:text-white transition-all"
                  on:click={() => copyMessage(msg.text)}
                  aria-label="Copy"
                >
                  <i class="fas fa-copy"></i>
                </button>
              {/if}
            {/if}
          </div>
        </div>
      {/each}
    </div>
    
    <!-- Input Bar -->
    <footer class="p-4 sm:p-6 bg-white border-t border-gray-200">
      <form method="POST" action="?/chat" use:enhance={handleSubmit} class="flex gap-3 items-end max-w-4xl mx-auto">
        <textarea
          bind:value={input}
          on:keydown={handleKeydown}
          placeholder="Type your message..."
          rows="1"
          disabled={loading}
          aria-label="Message input"
          autocomplete="off"
          class="flex-1 min-h-[48px] max-h-[150px] px-4 py-3 border-2 border-gray-300 rounded-xl text-sm resize-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        ></textarea>
        <button 
          type="submit" 
          class="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-600 to-orange-600 text-white font-semibold rounded-xl shadow-md hover:shadow-xl transition-all hover:-translate-y-1 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 disabled:scale-100"
          disabled={!input.trim() || loading}
        >
          {#if loading}
            <i class="fas fa-spinner fa-spin"></i>
          {:else}
            <i class="fas fa-paper-plane"></i>
          {/if}
          <span class="hidden sm:inline">Send</span>
        </button>
      </form>
    </footer>
  </main>
</div>

<!-- Toast Notification -->
{#if showToast}
  <div class="fixed bottom-6 right-6 flex items-center gap-3 px-6 py-4 bg-green-500 text-white font-medium rounded-xl shadow-2xl z-50 animate-toast-in">
    <i class="fas fa-check-circle text-xl"></i>
    {toastMessage}
  </div>
{/if}

<style>
  @keyframes slide-down {
    from { transform: translateY(-100%); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  
  .animate-slide-down {
    animation: slide-down 0.3s ease-out;
  }

  @keyframes fade-in {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .animate-fade-in {
    animation: fade-in 0.3s ease-out;
  }

  @keyframes typing {
    0%, 80%, 100% { transform: scale(0); }
    40% { transform: scale(1); }
  }
  
  .animate-typing {
    animation: typing 1.4s infinite ease-in-out;
  }

  .animation-delay-200 {
    animation-delay: 0.2s;
  }

  .animation-delay-400 {
    animation-delay: 0.4s;
  }

  @keyframes toast-in {
    from { transform: translateY(100px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  
  .animate-toast-in {
    animation: toast-in 0.3s ease-out;
  }

  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 10px;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
</style>
