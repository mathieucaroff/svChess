<script lang="ts">
  import clsx from 'clsx'

  const { iy }: { iy: number } = $props()
</script>

<div
  class={clsx('w-10 content-center border-x-2 border-t-2 text-center', { 'border-b-2': iy === 7 })}
>
  {8 - iy}
</div>
