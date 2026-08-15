import Avatar from '@/components/ui/avatar/Avatar.jsx'

export default function CreatorLink({ creator }) {
  return (
    <a href="/settings/profile" className="flex items-center gap-3">
      <Avatar src={creator.avatarUrl} alt="" className="size-10 rounded-lg">
        {creator.initials}
      </Avatar>
      <span>{creator.name}</span>
    </a>
  )
}
