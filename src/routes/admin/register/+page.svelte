<script>
  import { enhance } from '$app/forms';
  import { fly, scale } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  
  export let form;
</script>

<!-- Ultra-Modern Professional Register - Curved Design (Reversed) -->
<div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
  <div 
    class="w-full max-w-6xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden relative"
    in:scale={{ start: 0.9, duration: 700, easing: quintOut }}
  >
    <div class="grid lg:grid-cols-2 min-h-[700px]">
      <!-- Left Panel - Curved Blue Section -->
      <div 
        class="relative overflow-hidden hidden lg:block"
        in:fly={{ x: -30, duration: 700, delay: 300, easing: quintOut }}
      >
        <!-- Curved Background with SVG (Mirrored) -->
        <svg class="absolute inset-0 w-full h-full" viewBox="0 0 400 700" preserveAspectRatio="none">
          <defs>
            <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#0ea5e9;stop-opacity:1" />
              <stop offset="50%" style="stop-color:#3b82f6;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#6366f1;stop-opacity:1" />
            </linearGradient>
          </defs>
          <path d="M 400 0 Q 300 350 400 700 L 0 700 L 0 0 Z" fill="url(#blueGradient)" />
        </svg>

        <!-- Decorative Elements -->
        <div class="absolute inset-0 overflow-hidden">
          <div class="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float"></div>
          <div class="absolute bottom-32 left-32 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-float-delayed"></div>
          <div class="absolute top-1/2 right-10 w-48 h-48 bg-white/10 rounded-full blur-2xl animate-float-slow"></div>
        </div>

        <!-- Content -->
        <div class="relative z-10 h-full flex flex-col items-center justify-center p-16 text-white">
          <div class="max-w-md text-center">
            <div class="mb-8">
              <div class="w-24 h-24 mx-auto bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mb-8 shadow-2xl">
                <svg class="w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
                </svg>
              </div>
            </div>
            
            <h2 class="text-4xl font-bold mb-4 leading-tight">
              Join Houseo Admin
            </h2>
            <p class="text-xl text-blue-100 leading-relaxed">
              Create your administrator account and start managing properties efficiently.
            </p>

            <!-- Features -->
            <div class="mt-12 space-y-4 text-left">
              <div class="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                <div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                </div>
                <span class="text-blue-100">Full dashboard access</span>
              </div>
              <div class="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                <div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                </div>
                <span class="text-blue-100">Priority support</span>
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
            <div class="w-16 h-16 bg-gradient-to-br from-sky-500 to-indigo-600 rounded-2xl mb-6 flex items-center justify-center shadow-lg">
              <span class="text-white text-3xl font-bold">H</span>
            </div>
            <h1 class="text-4xl lg:text-5xl font-bold text-gray-900 mb-3">Create Account</h1>
            <p class="text-lg text-gray-500">Join as an administrator</p>
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
                class="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-500/10 transition-all duration-300 outline-none"
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
                class="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-500/10 transition-all duration-300 outline-none"
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
                class="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-500/10 transition-all duration-300 outline-none"
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
                class="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-500/10 transition-all duration-300 outline-none"
              />
            </div>

            <!-- Terms Checkbox -->
            <div class="flex items-start">
              <input 
                type="checkbox" 
                id="terms" 
                required
                class="w-5 h-5 mt-0.5 rounded-lg border-2 border-gray-300 text-sky-600 focus:ring-2 focus:ring-sky-500/20 cursor-pointer"
              />
              <label for="terms" class="ml-3 text-sm text-gray-600 cursor-pointer select-none">
                I agree to the <a href="#" class="text-sky-600 hover:text-sky-700 font-medium">Terms of Service</a> and <a href="#" class="text-sky-600 hover:text-sky-700 font-medium">Privacy Policy</a>
              </label>
            </div>

            <!-- Register Button -->
            <button 
              type="submit" 
              class="group relative w-full px-6 py-4 bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-bold text-lg rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-sky-500/50 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span class="relative z-10">Create Account</span>
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
              <a href="/admin/login" class="font-semibold text-sky-600 hover:text-sky-700 transition-colors ml-1">
                Sign in here
              </a>
            </p>
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
