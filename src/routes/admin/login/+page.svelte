<script>
  import { enhance } from '$app/forms';
  import { fly, scale } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  
  export let form;
</script>

<!-- Ultra-Modern Professional Login - Curved Design -->
<div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
  <div 
    class="w-full max-w-6xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden relative"
    in:scale={{ start: 0.9, duration: 700, easing: quintOut }}
  >
    <div class="grid lg:grid-cols-2 min-h-[700px]">
      <!-- Left Panel - Login Form -->
      <div 
        class="relative p-8 sm:p-12 lg:p-16 flex flex-col justify-center z-10 bg-white"
        in:fly={{ x: -30, duration: 700, delay: 200, easing: quintOut }}
      >
        <div class="max-w-md mx-auto w-full">
          <!-- Logo/Brand -->
          <div class="mb-12">
            <div class="w-16 h-16 bg-gradient-to-br from-sky-500 to-indigo-600 rounded-2xl mb-6 flex items-center justify-center shadow-lg">
              <span class="text-white text-3xl font-bold">H</span>
            </div>
            <h1 class="text-4xl lg:text-5xl font-bold text-gray-900 mb-3">Welcome back</h1>
            <p class="text-lg text-gray-500">Sign in to access your dashboard</p>
          </div>
          
          <form method="POST" action="?/login" use:enhance class="space-y-6">
            <!-- Email Input -->
            <div class="space-y-2">
              <label for="email" class="block text-sm font-semibold text-gray-700 pl-1">
                Email Address
              </label>
              <input
                type="email" 
                name="email" 
                id="email"
                required
                placeholder="admin@houseo.com"
                autocomplete="email"
                class="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-500/10 transition-all duration-300 outline-none"
              />
            </div>

            <!-- Password Input -->
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <label for="password" class="block text-sm font-semibold text-gray-700 pl-1">
                  Password
                </label>
                <a href="#" class="text-sm font-medium text-sky-600 hover:text-sky-700 transition-colors">
                  Forgot password?
                </a>
              </div>
              <input
                type="password" 
                name="password" 
                id="password"
                required
                placeholder="Enter your password"
                autocomplete="current-password"
                class="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-500/10 transition-all duration-300 outline-none"
              />
            </div>

            <!-- Remember Me -->
            <div class="flex items-center">
              <input 
                type="checkbox" 
                id="remember" 
                class="w-5 h-5 rounded-lg border-2 border-gray-300 text-sky-600 focus:ring-2 focus:ring-sky-500/20 cursor-pointer"
              />
              <label for="remember" class="ml-3 text-sm font-medium text-gray-700 cursor-pointer select-none">
                Remember me for 30 days
              </label>
            </div>

            <!-- Login Button -->
            <button 
              type="submit" 
              class="group relative w-full px-6 py-4 bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-bold text-lg rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-sky-500/50 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span class="relative z-10">Sign In</span>
              <div class="absolute inset-0 bg-gradient-to-r from-sky-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>

            <!-- Error Message -->
            {#if form?.message}
              <div class="p-4 bg-red-50 border-l-4 border-red-500 rounded-xl" in:fly={{ y: -10, duration: 300 }}>
                <div class="flex items-start gap-3">
                  <div class="flex-shrink-0 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center mt-0.5">
                    <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                  <div class="flex-1">
                    <h3 class="text-sm font-semibold text-red-900">Authentication Failed</h3>
                    <p class="text-sm text-red-700 mt-1">{form.message}</p>
                  </div>
                </div>
              </div>
            {/if}
          </form>

          <!-- Security Notice -->
          <div class="mt-8 pt-6 border-t border-gray-100">
            <p class="text-xs text-center text-gray-500">
              🔒 Protected by enterprise-grade security
            </p>
          </div>
        </div>
      </div>

      <!-- Right Panel - Curved Blue Section -->
      <div 
        class="relative overflow-hidden hidden lg:block"
        in:fly={{ x: 30, duration: 700, delay: 300, easing: quintOut }}
      >
        <!-- Curved Background with SVG -->
        <svg class="absolute inset-0 w-full h-full" viewBox="0 0 400 700" preserveAspectRatio="none">
          <defs>
            <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#0ea5e9;stop-opacity:1" />
              <stop offset="50%" style="stop-color:#3b82f6;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#6366f1;stop-opacity:1" />
            </linearGradient>
          </defs>
          <path d="M 0 0 Q 100 350 0 700 L 400 700 L 400 0 Z" fill="url(#blueGradient)" />
        </svg>

        <!-- Decorative Elements -->
        <div class="absolute inset-0 overflow-hidden">
          <div class="absolute top-20 right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float"></div>
          <div class="absolute bottom-32 right-32 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-float-delayed"></div>
          <div class="absolute top-1/2 left-10 w-48 h-48 bg-white/10 rounded-full blur-2xl animate-float-slow"></div>
        </div>

        <!-- Content -->
        <div class="relative z-10 h-full flex flex-col items-center justify-center p-16 text-white">
          <div class="max-w-md text-center">
            <div class="mb-8">
              <div class="w-24 h-24 mx-auto bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mb-8 shadow-2xl">
                <svg class="w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                </svg>
              </div>
            </div>
            
            <h2 class="text-4xl font-bold mb-4 leading-tight">
              Secure Admin Access
            </h2>
            <p class="text-xl text-blue-100 leading-relaxed">
              Manage your properties with confidence. Your data is protected with bank-level encryption.
            </p>

            <!-- Stats -->
            <div class="grid grid-cols-2 gap-6 mt-12">
              <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div class="text-3xl font-bold mb-1">99.9%</div>
                <div class="text-sm text-blue-100">Uptime</div>
              </div>
              <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div class="text-3xl font-bold mb-1">24/7</div>
                <div class="text-sm text-blue-100">Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  @keyframes float {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33% { transform: translate(30px, -30px) scale(1.1); }
    66% { transform: translate(-20px, 20px) scale(0.9); }
  }

  @keyframes float-delayed {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33% { transform: translate(-30px, 30px) scale(1.05); }
    66% { transform: translate(20px, -20px) scale(0.95); }
  }

  @keyframes float-slow {
    0%, 100% { transform: translate(0, 0); }
    50% { transform: translate(0, -20px); }
  }

  .animate-float {
    animation: float 20s ease-in-out infinite;
  }

  .animate-float-delayed {
    animation: float-delayed 25s ease-in-out infinite;
  }

  .animate-float-slow {
    animation: float-slow 15s ease-in-out infinite;
  }
</style>
