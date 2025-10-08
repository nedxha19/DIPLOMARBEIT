<script>
  import { enhance } from '$app/forms';
  export let form;
</script>

<div class="admin-container-auth">
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
            autocomplete="email"
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
            autocomplete="current-password"
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
  /* Remove duplicate styles - using global .admin-container-auth */

  .login-card {
    width: 100%;
    max-width: 400px;
    padding: var(--space-10);
    background: rgba(255, 255, 255, 0.05);
    border-radius: var(--radius-md);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    font-family: var(--font-family-sans);
  }

  .login-header {
    text-align: center;
    margin-bottom: var(--space-8);
  }

  .logo-icon {
    font-size: var(--font-size-4xl);
    margin-bottom: var(--space-4);
  }

  .login-header h1 {
    font-size: var(--font-size-3xl);
    font-weight: var(--font-weight-semibold);
    margin-bottom: var(--space-2);
    font-family: var(--font-family-sans);
  }

  .login-header p {
    font-size: var(--font-size-sm);
    font-family: var(--font-family-sans);
  }

  .form-group {
    margin-bottom: var(--space-6);
  }

  .form-group label {
    display: block;
    margin-bottom: var(--space-2);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    font-family: var(--font-family-sans);
  }

  .input-group {
    position: relative;
  }

  .input-group i {
    position: absolute;
    left: var(--space-4);
    top: 50%;
    transform: translateY(-50%);
  }

  .input-group input {
    width: 100%;
    padding: var(--space-3) var(--space-4) var(--space-3) calc(var(--space-4) + 24px);
    border-radius: var(--radius-md);
    font-size: var(--font-size-sm);
    font-family: var(--font-family-sans);
    transition: var(--transition-normal);
  }

  .input-group input:focus {
    outline: none;
  }

  .login-btn {
    width: 100%;
    padding: var(--space-4);
    background: var(--sidebar-active);
    border: none;
    border-radius: var(--radius-md);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    font-family: var(--font-family-sans);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
    transition: var(--transition-normal);
  }

  .login-btn:hover {
    background: rgba(14, 165, 233, 0.9);
    transform: translateY(-1px);
  }

  .error-message {
    margin-top: var(--space-4);
    padding: var(--space-3);
    border-radius: var(--radius-md);
    font-size: var(--font-size-sm);
    font-family: var(--font-family-sans);
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }

  /* Mobile Responsive */
  @media (max-width: 640px) {
    .login-card {
      padding: var(--space-6);
    }
  }
</style>