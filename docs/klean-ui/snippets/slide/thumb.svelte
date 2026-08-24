{#snippet thumb({ pending })}
  <img
    src="/mascot.svg"
    alt=""
    class={`size-6 ${pending ? 'animate-spin motion-reduce:animate-none' : ''}`}
  />
{/snippet}

<Slide pending={deploying} onconfirm={deploy} {thumb}>
  {deploying ? 'Deploying…' : 'Slide to deploy'}
</Slide>
