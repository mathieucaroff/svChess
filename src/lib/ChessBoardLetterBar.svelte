<div class="text-gray-900 dark:text-white">
  <span class="inline-flex w-10"></span>{#each Array.from({ length: 8 }) as _, ix (ix)}
    <span
      class="inline-flex w-[100px] justify-center border-y-2 border-l-2 border-gray-900 last:border-r-2 dark:border-white"
    >
      {String.fromCharCode(65 + ix)}
    </span>
  {/each}
</div>
