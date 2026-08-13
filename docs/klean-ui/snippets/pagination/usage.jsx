import Pagination from '@/components/ui/pagination/Pagination'

export default function ProjectPages({ pagination }) {
  return (
    <Pagination
      page={pagination.page}
      pages={pagination.totalPages}
      only={['projects', 'pagination']}
      aria-label="Project pages"
    />
  )
}
