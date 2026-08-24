import { useState } from 'react'
import FileUpload from '@/components/ui/file-upload/FileUpload.jsx'

export default function ReceiptField() {
  const [file, setFile] = useState(null)
  const [error, setError] = useState('')

  return (
    <FileUpload
      value={file}
      onChange={(candidate) => {
        setFile(candidate)
        setError('')
      }}
      onReject={(detail) => setError(detail.message)}
      accept="image/png,image/jpeg,.pdf"
      validate={(candidate) =>
        candidate.size <= 2 * 1024 * 1024 || 'Choose a file under 2 MB.'
      }
    >
      {(upload) => (
        <>
          <div
            {...upload.dropzone}
            className={`rounded-xl border border-dashed p-6 ${
              upload.dragging ? 'border-gray-950 bg-gray-50' : 'border-gray-300'
            }`}
          >
            <p>{upload.file?.name || 'Drop one file here'}</p>
            <button type="button" onClick={upload.choose}>
              {upload.file ? 'Replace file' : 'Choose file'}
            </button>
            {upload.file ? (
              <button type="button" onClick={upload.clear}>
                Remove
              </button>
            ) : null}
          </div>
          {error ? <p role="alert">{error}</p> : null}
        </>
      )}
    </FileUpload>
  )
}
