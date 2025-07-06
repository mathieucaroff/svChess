<div>
  <span class="inline-flex w-10"></span>{#each Array.from({ length: 8 }) as _, ix}
    <span class="inline-flex w-[100px] justify-center border-y-2 border-l-2 last:border-r-2">
      {String.fromCharCode(65 + ix)}
    </span>
  {/each}
</div>
