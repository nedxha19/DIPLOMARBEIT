<script>
  import { enhance } from '$app/forms';
  export let form;
</script>

<div class="login-container">
  <div class="login-card">
    <div class="login-header">
      <i class="fas fa-user-cog logo-icon"></i>
      <h1>Admin Login</h1>
      <p>Secure access to your account</p>
    </div>

    <form method="POST" action="?/login" use:enhance>
      <div class="form-group">
        <label for="email">Email address</label>
        <div class="input-group">
          <i class="fas fa-envelope"></i>
          <input
            type="email" name="email" id="email"
            required
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <div class="input-group">
          <i class="fas fa-lock"></i>
          <input
            type="password" name="password" id="password"
            required
            placeholder="••••••••"
          />
        </div>
      </div>

      <button type="submit" class="login-btn">
        <i class="fas fa-sign-in-alt"></i>
        Sign in
      </button>

      {#if form?.message}
        <div class="error-message">
          <i class="fas fa-exclamation-circle"></i>
          {form.message}
        </div>
      {/if}
    </form>
  </div>
</div>

<style>
  .login-container {
    display: flex;
    min-height: 100vh;
    align-items: center;
    justify-content: center;
    background-color: var(--auth-sidebar-bg);
    padding: var(--admin-space-4);
    font-family: 'Poppins', sans-serif;
  }

  .login-card {
    width: 100%;
    max-width: 400px;
    padding: var(--admin-space-10);
    background: rgba(255, 255, 255, 0.05);
    border-radius: var(--admin-radius-md);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .login-header {
    text-align: center;
    margin-bottom: var(--admin-space-8);
  }

  .logo-icon {
    font-size: var(--admin-text-4xl);
    color: var(--auth-sidebar-active);
    margin-bottom: var(--admin-space-4);
  }

  .login-header h1 {
    font-size: var(--admin-text-3xl);
    font-weight: 600;
    color: var(--auth-text-primary);
    margin-bottom: var(--admin-space-2);
  }

  .login-header p {
    color: var(--auth-text-secondary);
    font-size: var(--admin-text-sm);
  }

  .form-group {
    margin-bottom: var(--admin-space-6);
  }

  .form-group label {
    display: block;
    margin-bottom: var(--admin-space-2);
    color: var(--auth-text-secondary);
    font-size: var(--admin-text-sm);
    font-weight: 500;
  }

  .input-group {
    position: relative;
  }

  .input-group i {
    position: absolute;
    left: var(--admin-space-4);
    top: 50%;
    transform: translateY(-50%);
    color: var(--auth-text-secondary);
  }

  .input-group input {
    width: 100%;
    padding: var(--admin-space-3) var(--admin-space-4) var(--admin-space-3) calc(var(--admin-space-4) + 24px);
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: var(--admin-radius-md);
    color: var(--auth-text-primary);
    font-size: var(--admin-text-sm);
    transition: var(--admin-transition-normal);
  }

  .input-group input::placeholder {
    color: var(--auth-text-secondary);
  }

  .input-group input:focus {
    outline: none;
    border-color: var(--auth-sidebar-active);
    box-shadow: 0 0 0 2px rgba(14, 165, 233, 0.2);
  }

  .login-btn {
    width: 100%;
    padding: var(--admin-space-4);
    background: var(--auth-sidebar-active);
    color: var(--admin-text-white);
    border: none;
    border-radius: var(--admin-radius-md);
    font-size: var(--admin-text-sm);
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--admin-space-2);
    transition: var(--admin-transition-normal);
  }

  .login-btn:hover {
    background: rgba(14, 165, 233, 0.9);
    transform: translateY(-1px);
  }

  .error-message {
    margin-top: var(--admin-space-4);
    padding: var(--admin-space-3);
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.2);
    border-radius: var(--admin-radius-md);
    color: #ef4444;
    font-size: var(--admin-text-sm);
    display: flex;
    align-items: center;
    gap: var(--admin-space-2);
  }

  /* Mobile Responsive */
  @media (max-width: 640px) {
    .login-card {
      padding: var(--admin-space-6);
    }
  }
</style>