// This route and its authentication/CSRF handling belong to your application.
export async function uploadImage(file, { signal }) {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    throw new Error('Choose a JPEG, PNG, or WebP image.')
  }
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('Choose an image smaller than 5 MB.')
  }

  const body = new FormData()
  body.append('image', file)
  const response = await fetch('/uploads/images', {
    method: 'POST',
    body,
    signal
  })
  if (!response.ok) throw new Error('The image could not be uploaded.')

  const image = await response.json()
  return { src: image.url, alt: image.alt || '', title: image.title }
}
