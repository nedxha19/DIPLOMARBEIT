<script>
  import { enhance } from '$app/forms';
  import { fly, scale } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  
  export let form;
</script>

<!-- Professional Admin Register -->
<div class="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
  <div 
    class="w-full max-w-6xl bg-white rounded-3xl shadow-xl overflow-hidden relative"
    in:scale={{ start: 0.9, duration: 700, easing: quintOut }}
  >
    <div class="grid lg:grid-cols-2 min-h-[700px]">
      <!-- Left Panel - Professional Design -->
      <div 
        class="relative overflow-hidden hidden lg:block bg-slate-900"
        in:fly={{ x: -30, duration: 700, delay: 300, easing: quintOut }}
      >
        <!-- Content -->
        <div class="relative z-10 h-full flex flex-col items-center justify-center p-16 text-white">
          <div class="max-w-md text-center">
            <div class="mb-8">
              <div class="w-24 h-24 mx-auto bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center mb-8">
                <i class="fas fa-user-plus text-5xl text-white"></i>
              </div>
            </div>
            
            <h2 class="text-4xl font-bold mb-4 leading-tight">
              Join Our Platform
            </h2>
            <p class="text-xl text-slate-300 leading-relaxed">
              Create your administrator account and start managing properties efficiently.
            </p>

            <!-- Features -->
            <div class="mt-12 space-y-4">
              <div class="flex items-center gap-3 text-left">
                <div class="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <i class="fas fa-check text-white"></i>
                </div>
                <span class="text-slate-300">Full dashboard access</span>
              </div>
              <div class="flex items-center gap-3 text-left">
                <div class="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <i class="fas fa-check text-white"></i>
                </div>
                <span class="text-slate-300">Advanced property tools</span>
              </div>
              <div class="flex items-center gap-3 text-left">
                <div class="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <i class="fas fa-check text-white"></i>
                </div>
                <span class="text-slate-300">Priority support</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Panel - Register Form -->
      <div 
        class="relative p-8 sm:p-12 lg:p-16 flex flex-col justify-center z-10 bg-white"
        in:fly={{ x: 30, duration: 700, delay: 200, easing: quintOut }}
      >
        <div class="max-w-md mx-auto w-full">
          <!-- Logo/Brand -->
          <div class="mb-12">
            <div class="w-16 h-16 bg-slate-900 rounded-2xl mb-6 flex items-center justify-center shadow-lg">
              <i class="fas fa-user-plus text-white text-2xl"></i>
            </div>
            <h1 class="text-4xl lg:text-5xl font-bold text-gray-900 mb-3">Create Account</h1>
            <p class="text-lg text-gray-500">Register as an administrator</p>
          </div>
          
          <form method="POST" action="?/register" use:enhance class="space-y-5">
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
                class="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:border-slate-500 focus:bg-white focus:ring-4 focus:ring-slate-500/10 transition-all duration-300 outline-none"
              />
            </div>

            <!-- Username Input -->
            <div class="space-y-2">
              <label for="username" class="block text-sm font-semibold text-gray-700 pl-1">
                Username
              </label>
              <input 
                type="text" 
                name="username" 
                id="username" 
                required  
                placeholder="Choose your username"
                autocomplete="username"
                class="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:border-slate-500 focus:bg-white focus:ring-4 focus:ring-slate-500/10 transition-all duration-300 outline-none"
              />
            </div>

            <!-- Password Input -->
            <div class="space-y-2">
              <label for="password" class="block text-sm font-semibold text-gray-700 pl-1">
                Password
              </label>
              <input   
                type="password" 
                name="password" 
                id="password" 
                required 
                placeholder="Create strong password" 
                minlength="8"
                autocomplete="new-password"
                class="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:border-slate-500 focus:bg-white focus:ring-4 focus:ring-slate-500/10 transition-all duration-300 outline-none"
              />
            </div>

            <!-- Confirm Password Input -->
            <div class="space-y-2">
              <label for="confirmPassword" class="block text-sm font-semibold text-gray-700 pl-1">
                Confirm Password
              </label>
              <input 
                type="password" 
                name="confirmPassword" 
                id="confirmPassword" 
                required 
                placeholder="Re-enter password" 
                minlength="8"
                autocomplete="new-password"
                class="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:border-slate-500 focus:bg-white focus:ring-4 focus:ring-slate-500/10 transition-all duration-300 outline-none"
              />
            </div>

            <!-- Register Button -->
            <button 
              type="submit" 
              class="w-full px-6 py-4 bg-slate-900 text-white font-bold text-lg rounded-2xl transition-all duration-300 hover:bg-slate-800 hover:shadow-xl hover:shadow-slate-900/30 active:scale-[0.98]"
            >
              Create Account
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
                    <h3 class="text-sm font-semibold text-red-900">Registration Failed</h3>
                    <p class="text-sm text-red-700 mt-1">{form.message}</p>
                  </div>
                </div>
              </div>
            {/if}
          </form>

          <!-- Sign In Link -->
          <div class="mt-8 text-center">
            <p class="text-sm text-gray-600">
              Already have an account? 
              <a href="/admin/login" class="font-semibold text-slate-900 hover:text-slate-700 transition-colors ml-1">
                Sign in here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
