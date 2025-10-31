<script>
  import { fly, fade, scale } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  import { enhance } from '$app/forms';
  
  export let form;
  
  let formSubmitted = false;
  
  const contactInfo = [
    {
      icon: 'map-marker-alt',
      title: 'Visit Us',
      details: ['123 Real Estate Avenue', 'New York, NY 10001', 'United States']
    },
    {
      icon: 'phone',
      title: 'Call Us',
      details: ['+1 (555) 123-4567', '+1 (555) 987-6543', 'Mon-Fri 9am-6pm EST']
    },
    {
      icon: 'envelope',
      title: 'Email Us',
      details: ['info@houseo.com', 'support@houseo.com', '24/7 Support']
    }
  ];
  
  const departments = [
    { name: 'Sales', email: 'sales@houseo.com', icon: 'handshake' },
    { name: 'Support', email: 'support@houseo.com', icon: 'headset' },
    { name: 'Partnerships', email: 'partners@houseo.com', icon: 'users' }
  ];
  
  function handleSubmit() {
    return async ({ result }) => {
      if (result.type === 'success') {
        formSubmitted = true;
      }
    };
  }
</script>

<svelte:head>
  <title>Contact Us | Houseo - Get In Touch</title>
  <meta name="description" content="Contact Houseo for property inquiries, support, or partnership opportunities. We're here to help you find your dream home." />
</svelte:head>

<!-- Hero Section -->
<section class="relative py-20 bg-slate-900 text-white overflow-hidden">
  <div class="absolute inset-0 opacity-10">
    <div class="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
    <div class="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
  </div>
  
  <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <div in:fly={{ y: 30, duration: 800, delay: 100, easing: quintOut }}>
      <h1 class="text-5xl md:text-6xl font-bold mb-6">Get In Touch</h1>
      <p class="text-xl text-slate-300 max-w-2xl mx-auto">
        Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
      </p>
    </div>
  </div>
</section>


<section class="py-20 bg-slate-50">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
      
      <!-- Contact Form -->
      <div 
        class="bg-white rounded-2xl p-8 shadow-lg"
        in:fly={{ x: -30, duration: 600, delay: 200, easing: quintOut }}
      >
        {#if !formSubmitted}
          <div class="mb-8">
            <h2 class="text-3xl font-bold text-slate-900 mb-3">Send us a Message</h2>
            <p class="text-slate-600">Fill out the form below and we'll get back to you within 24 hours.</p>
          </div>
          
          <form method="POST" action="?/contact" use:enhance={handleSubmit} class="space-y-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label for="firstName" class="block text-sm font-semibold text-slate-700 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  required
                  class="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-slate-900 focus:ring-2 focus:ring-slate-100 outline-none transition-all"
                  placeholder="John"
                />
              </div>
              
              <div>
                <label for="lastName" class="block text-sm font-semibold text-slate-700 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  required
                  class="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-slate-900 focus:ring-2 focus:ring-slate-100 outline-none transition-all"
                  placeholder="Doe"
                />
              </div>
            </div>
            
            <div>
              <label for="email" class="block text-sm font-semibold text-slate-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                class="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-slate-900 focus:ring-2 focus:ring-slate-100 outline-none transition-all"
                placeholder="john.doe@example.com"
              />
            </div>
            
            <div>
              <label for="phone" class="block text-sm font-semibold text-slate-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                class="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-slate-900 focus:ring-2 focus:ring-slate-100 outline-none transition-all"
                placeholder="+1 (555) 123-4567"
              />
            </div>
            
            <div>
              <label for="subject" class="block text-sm font-semibold text-slate-700 mb-2">
                Subject *
              </label>
              <select
                id="subject"
                name="subject"
                required
                class="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-slate-900 focus:ring-2 focus:ring-slate-100 outline-none transition-all appearance-none bg-white"
              >
                <option value="">Select a subject</option>
                <option value="General Inquiry">General Inquiry</option>
                <option value="Property Viewing">Property Viewing</option>
                <option value="Buying">Buying Property</option>
                <option value="Selling">Selling Property</option>
                <option value="Support">Technical Support</option>
                <option value="Partnership">Partnership</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div>
              <label for="message" class="block text-sm font-semibold text-slate-700 mb-2">
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows="5"
                class="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-slate-900 focus:ring-2 focus:ring-slate-100 outline-none transition-all resize-none"
                placeholder="Tell us more about your inquiry..."
              ></textarea>
            </div>
            
            {#if form?.error}
              <div class="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg" in:fly={{ y: -10, duration: 300 }}>
                <p class="text-sm text-red-700">{form.error}</p>
              </div>
            {/if}
            
            <button
              type="submit"
              class="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
            >
              Send Message
            </button>
            
            <p class="text-xs text-slate-500 text-center">
              By submitting this form, you agree to our Privacy Policy and Terms of Service
            </p>
          </form>
        {:else}
          <div 
            class="text-center py-12"
            in:scale={{ duration: 500, easing: quintOut }}
          >
            <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <i class="fas fa-check-circle text-4xl text-green-600"></i>
            </div>
            <h3 class="text-2xl font-bold text-slate-900 mb-3">Message Sent!</h3>
            <p class="text-slate-600 mb-8">
              Thank you for contacting us. We'll get back to you within 24 hours.
            </p>
            <button
              on:click={() => formSubmitted = false}
              class="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg transition-all"
            >
              Send Another Message
            </button>
          </div>
        {/if}
      </div>
      
      <!-- Contact Information -->
      <div in:fly={{ x: 30, duration: 600, delay: 300, easing: quintOut }}>
        <div class="space-y-6">
          {#each contactInfo as info, i}
            <div 
              class="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300"
              in:fly={{ y: 20, duration: 500, delay: 400 + (i * 100), easing: quintOut }}
            >
              <div class="flex items-start gap-4">
                <div class="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center flex-shrink-0">
                  <i class="fas fa-{info.icon} text-white text-lg"></i>
                </div>
                <div>
                  <h3 class="text-xl font-bold text-slate-900 mb-2">{info.title}</h3>
                  {#each info.details as detail}
                    <p class="text-slate-600">{detail}</p>
                  {/each}
                </div>
              </div>
            </div>
          {/each}
        </div>
        
        <!-- Departments -->
        <div class="mt-8 bg-white rounded-2xl p-6 shadow-md">
          <h3 class="text-xl font-bold text-slate-900 mb-4">Direct Contacts</h3>
          <div class="space-y-3">
            {#each departments as dept}
              <a 
                href="mailto:{dept.email}"
                class="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-all group"
              >
                <div class="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center group-hover:bg-slate-900 transition-all">
                  <i class="fas fa-{dept.icon} text-slate-600 group-hover:text-white transition-colors"></i>
                </div>
                <div>
                  <div class="font-semibold text-slate-900 group-hover:text-slate-700">{dept.name}</div>
                  <div class="text-sm text-slate-600">{dept.email}</div>
                </div>
              </a>
            {/each}
          </div>
        </div>
        
        <!-- Social Media -->
        <div class="mt-8 bg-slate-900 rounded-2xl p-6 text-white">
          <h3 class="text-xl font-bold mb-4">Follow Us</h3>
          <p class="text-slate-300 mb-6">Stay connected on social media for updates and news</p>
          <div class="flex gap-3">
            {#each [
              { name: 'Facebook', icon: 'facebook-f', color: 'hover:bg-blue-600' },
              { name: 'Twitter', icon: 'twitter', color: 'hover:bg-sky-500' },
              { name: 'Instagram', icon: 'instagram', color: 'hover:bg-pink-600' },
              { name: 'LinkedIn', icon: 'linkedin-in', color: 'hover:bg-blue-700' }
            ] as social}
              <a
                href="/"
                aria-label={social.name}
                class="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center {social.color} transition-all duration-300 hover:-translate-y-1"
              >
                <i class="fab fa-{social.icon}"></i>
              </a>
            {/each}
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Map Section -->
<section class="py-12 bg-white">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="bg-slate-100 rounded-2xl overflow-hidden shadow-lg" style="height: 450px;">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.15830869428!2d-74.11976378671873!3d40.69766374874431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1635789012345!5m2!1sen!2s"
        width="100%"
        height="100%"
        style="border:0;"
        allowfullscreen=""
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
        title="Houseo office location"
      ></iframe>
    </div>
  </div>
</section>

<!-- FAQ Section -->
<section class="py-20 bg-slate-50">
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-12">
      <h2 class="text-4xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
      <p class="text-xl text-slate-600">Quick answers to common questions</p>
    </div>
    
    <div class="space-y-4">
      {#each [
        {
          q: 'What are your business hours?',
          a: 'Our office is open Monday-Friday from 9am to 6pm EST. However, our support team is available 24/7 via email.'
        },
        {
          q: 'How quickly will I receive a response?',
          a: 'We aim to respond to all inquiries within 24 hours. Urgent matters are typically addressed within a few hours during business days.'
        },
        {
          q: 'Can I schedule a property viewing?',
          a: 'Yes! You can request a property viewing through the contact form above or by calling us directly. We offer both in-person and virtual tours.'
        },
        {
          q: 'Do you offer consultation services?',
          a: 'Absolutely! We offer free initial consultations to discuss your real estate needs, whether you\'re buying, selling, or investing.'
        }
      ] as faq, i}
        <details 
          class="bg-white rounded-lg shadow-sm hover:shadow-md transition-all"
          in:fly={{ y: 20, duration: 500, delay: 100 + (i * 100), easing: quintOut }}
        >
          <summary class="px-6 py-4 font-semibold text-slate-900 cursor-pointer flex items-center justify-between">
            {faq.q}
            <i class="fas fa-chevron-down text-slate-400"></i>
          </summary>
          <div class="px-6 pb-4 text-slate-600">
            {faq.a}
          </div>
        </details>
      {/each}
    </div>
  </div>
</section>


