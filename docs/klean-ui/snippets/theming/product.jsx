// assets/js/components/DeployButton.jsx
import { twMerge } from 'tailwind-merge'
import Button from './ui/button/Button.jsx'

const classes =
  'min-h-11 bg-emerald-700 px-5 font-semibold text-white hover:bg-emerald-800'

export default function DeployButton({ className, ...props }) {
  return <Button {...props} className={twMerge(classes, className)} />
}
