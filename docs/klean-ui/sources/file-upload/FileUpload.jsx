import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from 'react'

function acceptedByAttribute(file, accept) {
  const rules = accept
    ?.split(',')
    .map((rule) => rule.trim().toLowerCase())
    .filter(Boolean)
  if (!rules?.length) return true

  const type = file.type?.toLowerCase() ?? ''
  const name = file.name?.toLowerCase() ?? ''
  return rules.some((rule) => {
    if (rule.startsWith('.')) return name.endsWith(rule)
    if (rule.endsWith('/*')) return type.startsWith(rule.slice(0, -1))
    return type === rule
  })
}

const FileUpload = forwardRef(function FileUpload(
  {
    value,
    defaultValue = null,
    onChange,
    onReject,
    accept,
    capture,
    disabled = false,
    validate = () => true,
    className,
    children,
    'data-slot': _dataSlot,
    'data-state': _dataState,
    'data-dragging': _dataDragging,
    'data-disabled': _dataDisabled,
    ...props
  },
  forwardedRef
) {
  const rootRef = useRef(null)
  const inputRef = useRef(null)
  const dragDepth = useRef(0)
  const controlled = value !== undefined
  const [localFile, setLocalFile] = useState(defaultValue)
  const [previewUrl, setPreviewUrl] = useState('')
  const [dragging, setDragging] = useState(false)
  const file = controlled ? value : localFile

  const resetInput = useCallback(() => {
    if (inputRef.current) inputRef.current.value = ''
  }, [])

  const setFile = useCallback(
    (candidate) => {
      if (!controlled) setLocalFile(candidate)
      onChange?.(candidate)
      resetInput()
      return true
    },
    [controlled, onChange, resetInput]
  )

  const reject = useCallback(
    (candidate, reason, message, files) => {
      const detail = { file: candidate ?? null, reason, message }
      if (files) detail.files = files
      onReject?.(detail)
      resetInput()
      return false
    },
    [onReject, resetInput]
  )

  const select = useCallback(
    (files) => {
      if (disabled) return false
      const candidates = Array.from(files ?? [])
      if (!candidates.length) return false
      if (candidates.length > 1) {
        return reject(
          candidates[0],
          'multiple',
          'Choose one file at a time.',
          candidates
        )
      }

      const candidate = candidates[0]
      if (!acceptedByAttribute(candidate, accept)) {
        return reject(candidate, 'accept', 'That file type is not accepted.')
      }

      let result
      try {
        result = validate(candidate)
      } catch {
        return reject(
          candidate,
          'validate',
          'That file could not be validated.'
        )
      }

      if (result !== true && result !== undefined) {
        return reject(
          candidate,
          typeof result === 'object' && result?.reason
            ? result.reason
            : 'validate',
          typeof result === 'string' && result
            ? result
            : typeof result === 'object' && result?.message
              ? result.message
              : 'That file is not valid.'
        )
      }

      return setFile(candidate)
    },
    [accept, disabled, reject, setFile, validate]
  )

  const choose = useCallback(() => {
    const input = inputRef.current
    if (disabled || !input) return
    resetInput()
    if (typeof input.showPicker === 'function') {
      try {
        input.showPicker()
        return
      } catch {
        // The native click path covers browsers that restrict showPicker().
      }
    }
    input.click()
  }, [disabled, resetInput])

  const clear = useCallback(() => {
    if (!disabled) setFile(null)
  }, [disabled, setFile])

  function hasFiles(event) {
    return Array.from(event.dataTransfer?.types ?? []).includes('Files')
  }

  function handleDragEnter(event) {
    if (disabled || !hasFiles(event)) return
    event.preventDefault()
    dragDepth.current += 1
    setDragging(true)
  }

  function handleDragOver(event) {
    if (disabled || !hasFiles(event)) return
    event.preventDefault()
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy'
    setDragging(true)
  }

  function handleDragLeave(event) {
    if (disabled || !hasFiles(event)) return
    event.preventDefault()
    dragDepth.current = Math.max(0, dragDepth.current - 1)
    if (dragDepth.current === 0) setDragging(false)
  }

  function handleDrop(event) {
    if (!hasFiles(event)) return
    event.preventDefault()
    dragDepth.current = 0
    setDragging(false)
    if (!disabled) select(event.dataTransfer?.files)
  }

  useEffect(() => {
    if (
      !file ||
      typeof Blob === 'undefined' ||
      !(file instanceof Blob) ||
      typeof URL.createObjectURL !== 'function'
    ) {
      setPreviewUrl('')
      return undefined
    }

    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    return () => URL.revokeObjectURL?.(url)
  }, [file])

  const dropzone = {
    'data-dragging': dragging ? '' : undefined,
    'data-disabled': disabled ? '' : undefined,
    onDragEnter: handleDragEnter,
    onDragOver: handleDragOver,
    onDragLeave: handleDragLeave,
    onDrop: handleDrop
  }
  const api = {
    get file() {
      return file
    },
    get previewUrl() {
      return previewUrl
    },
    get dragging() {
      return dragging
    },
    choose,
    clear,
    get dropzone() {
      return dropzone
    }
  }

  useImperativeHandle(forwardedRef, () => ({
    root: rootRef.current,
    choose,
    clear
  }))

  return (
    <div
      {...props}
      ref={rootRef}
      data-slot="file-upload"
      data-state={file ? 'ready' : 'empty'}
      data-dragging={dragging ? '' : undefined}
      data-disabled={disabled ? '' : undefined}
      className={className}
    >
      <input
        ref={inputRef}
        type="file"
        hidden
        data-part="input"
        accept={accept}
        capture={capture}
        disabled={disabled}
        onChange={(event) => select(event.currentTarget.files)}
      />
      {typeof children === 'function' ? children(api) : children}
    </div>
  )
})

export default FileUpload
