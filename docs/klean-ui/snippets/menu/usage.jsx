import Button from '~/components/ui/button/Button.jsx'
import Menu from '~/components/ui/menu/Menu.jsx'

export default function ProjectActions() {
  return (
    <>
      <Button popovertarget="project-actions">Actions</Button>

      <Menu id="project-actions" aria-label="Project actions" className="w-56">
        <button
          type="button"
          className="flex w-full rounded px-3 py-2 text-left text-sm outline-none hover:bg-gray-100 focus:bg-gray-100"
        >
          Redeploy
        </button>
        <a
          href="/deployments"
          className="flex w-full rounded px-3 py-2 text-sm no-underline outline-none hover:bg-gray-100 focus:bg-gray-100"
        >
          View deployments
        </a>
      </Menu>
    </>
  )
}
