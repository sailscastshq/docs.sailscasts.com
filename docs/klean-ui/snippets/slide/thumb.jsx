;<Slide
  pending={deploying}
  onConfirm={deploy}
  thumb={({ pending }) => (
    <img
      src="/mascot.svg"
      alt=""
      className={`size-6 ${pending ? 'animate-spin motion-reduce:animate-none' : ''}`}
    />
  )}
>
  {deploying ? 'Deploying…' : 'Slide to deploy'}
</Slide>
