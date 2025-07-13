<script lang="ts">
  import Icon from '@iconify/svelte'

  interface Props {
    color?: WhiteOrBlack
    piece: Piece | null
    selected?: boolean
    dotted?: boolean
    ix?: number
    iy?: number
    onmousedown?: (ev: MouseEvent) => void
  }

  let { color, piece, selected, dotted, ix, iy, onmousedown }: Props = $props()
</script>

<div {onmousedown} role="presentation" class="relative size-[100px]" data-ix={ix} data-iy={iy}>
  <div
    class={[
      'absolute inset-0 size-full',
      color && { white: 'bg-orange-300', black: 'bg-orange-700' }[color],
    ]}
  ></div>
  <div class={['absolute inset-0 size-full', { 'border-15 border-red-400': selected }]}></div>
  <div class={['absolute inset-0 flex size-full items-center justify-center text-black']}>
    {#if piece}
      {#if piece.type === 'pawn'}
        <Icon
          icon={`material-symbols:chess-pawn${piece.color === 'white' ? '-outline' : ''}`}
          class="size-[70%]"
        />
      {:else}
        <Icon
          icon={`tabler:chess-${piece.type}${piece.color === 'white' ? '' : '-filled'}`}
          class="size-[80%]"
        />
      {/if}
    {/if}
  </div>
  <div
    class={[
      'absolute inset-0 flex size-full items-center justify-center',
      { 'pointer-events-none': dotted },
    ]}
  >
    {#if dotted}
      <div class="size-6 rounded-full bg-red-400"></div>
    {/if}
  </div>
</div>
