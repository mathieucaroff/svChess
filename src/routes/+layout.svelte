<script lang="ts">
  import '../app.css'
  import { browser } from '$app/environment'
  import { onMount } from 'svelte'

  let { children } = $props()

  // Theme state management
  let isDark = $state(false)

  onMount(() => {
    const stored = localStorage.getItem('theme')
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    isDark = stored === 'dark' || (!stored && systemPrefersDark)
    updateDOM()
  })

  function updateDOM() {
    if (browser) {
      document.documentElement.classList.toggle('dark', isDark)
      localStorage.setItem('theme', isDark ? 'dark' : 'light')
    }
  }

  function toggleTheme() {
    isDark = !isDark
    updateDOM()
  }
</script>

<div
  class="min-h-screen bg-gray-100 bg-white text-gray-900 transition-colors duration-200 dark:bg-gray-800 dark:text-white"
>
  <!-- Theme toggle button -->
  <div class="fixed top-4 right-4 z-50">
    <button
      onclick={toggleTheme}
      class="rounded-full bg-gray-200 p-3 shadow-lg transition-colors duration-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
      aria-label="Toggle theme"
    >
      {#if isDark}
        <!-- Sun icon for light mode -->
        <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
            clip-rule="evenodd"
          ></path>
        </svg>
      {:else}
        <!-- Moon icon for dark mode -->
        <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
        </svg>
      {/if}
    </button>
  </div>

  <!-- Main content -->
  {@render children()}
</div>
