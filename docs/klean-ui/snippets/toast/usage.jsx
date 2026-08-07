import Toast from '@/components/ui/toast/Toast.jsx'
import { toast } from '@/components/ui/toast/toast.js'

export default function App() {
  function save() {
    toast({
      title: 'Changes saved',
      message: 'Your draft is ready.',
      action: { label: 'View draft', href: '/drafts/42' }
    })
  }

  return (
    <>
      <Toast />
      <button type="button" onClick={save}>
        Save changes
      </button>
    </>
  )
}
