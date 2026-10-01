import Flag from '@/components/ui/flag/Flag.jsx'

export default function Countries() {
  return (
    <div className="flex items-center gap-4">
      <span className="inline-flex items-center gap-2">
        <Flag country="ng" alt="" className="w-5" />
        <span>Nigeria</span>
      </span>
      <Flag country="KE" className="w-8" />
      <Flag
        country="GH"
        alt="Based in Ghana"
        className="size-10 aspect-square rounded-full"
      />
    </div>
  )
}
