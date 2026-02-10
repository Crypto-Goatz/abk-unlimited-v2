'use client'

import { useCallback, useRef, useState, useImperativeHandle, forwardRef, useEffect } from 'react'
import { Upload, AlertTriangle } from 'lucide-react'

interface ImageUploaderProps {
  id: string
  label?: string
  onFileSelect: (file: File) => void
  imageUrl: string | null
  isDropZone?: boolean
  onProductDrop?: (position: {x: number, y: number}, relativePosition: { xPercent: number; yPercent: number }) => void
  persistedOrbPosition?: { x: number; y: number } | null
  showDebugButton?: boolean
  onDebugClick?: () => void
}

const ImageUploader = forwardRef<HTMLImageElement, ImageUploaderProps>(({
    id,
    label,
    onFileSelect,
    imageUrl,
    isDropZone = false,
    onProductDrop,
    persistedOrbPosition,
    showDebugButton,
    onDebugClick
}, ref) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const [isDraggingOver, setIsDraggingOver] = useState(false)
  const [fileTypeError, setFileTypeError] = useState<string | null>(null)

  useImperativeHandle(ref, () => imgRef.current as HTMLImageElement)

  useEffect(() => {
    if (!imageUrl) {
      setFileTypeError(null)
    }
  }, [imageUrl])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png']
      if (!allowedTypes.includes(file.type)) {
        setFileTypeError('For best results, please use PNG, JPG, or JPEG formats.')
      } else {
        setFileTypeError(null)
        onFileSelect(file)
      }
    }
  }

  const handlePlacement = useCallback((clientX: number, clientY: number, currentTarget: HTMLDivElement) => {
    const img = imgRef.current
    if (!img || !onProductDrop) return

    const containerRect = currentTarget.getBoundingClientRect()
    const { naturalWidth, naturalHeight } = img
    const { width: containerWidth, height: containerHeight } = containerRect

    const imageAspectRatio = naturalWidth / naturalHeight
    const containerAspectRatio = containerWidth / containerHeight

    let renderedWidth, renderedHeight
    if (imageAspectRatio > containerAspectRatio) {
      renderedWidth = containerWidth
      renderedHeight = containerWidth / imageAspectRatio
    } else {
      renderedHeight = containerHeight
      renderedWidth = containerHeight * imageAspectRatio
    }

    const offsetX = (containerWidth - renderedWidth) / 2
    const offsetY = (containerHeight - renderedHeight) / 2

    const pointX = clientX - containerRect.left
    const pointY = clientY - containerRect.top

    const imageX = pointX - offsetX
    const imageY = pointY - offsetY

    if (imageX < 0 || imageX > renderedWidth || imageY < 0 || imageY > renderedHeight) {
      return
    }

    const xPercent = (imageX / renderedWidth) * 100
    const yPercent = (imageY / renderedHeight) * 100

    onProductDrop({ x: pointX, y: pointY }, { xPercent, yPercent })
  }, [onProductDrop])

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (isDropZone && onProductDrop) {
      handlePlacement(event.clientX, event.clientY, event.currentTarget)
    } else if (!imageUrl) {
      inputRef.current?.click()
    }
  }

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDraggingOver(true)
  }, [])

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDraggingOver(false)
  }, [])

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDraggingOver(false)

    const file = event.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      const allowedTypes = ['image/jpeg', 'image/png']
      if (!allowedTypes.includes(file.type)) {
        setFileTypeError('For best results, please use PNG, JPG, or JPEG formats.')
      } else {
        setFileTypeError(null)
        onFileSelect(file)
      }
    }
  }, [onFileSelect])

  const showHoverState = isDraggingOver
  const isActionable = isDropZone || !imageUrl

  return (
    <div className="flex flex-col items-center w-full">
      {label && <h3 className="text-xl font-semibold mb-4 text-foreground">{label}</h3>}
      <div
        className={`w-full aspect-video bg-muted border-2 border-dashed rounded-lg flex items-center justify-center transition-all duration-300 relative overflow-hidden ${
          showHoverState ? 'border-primary bg-primary/10'
          : isDropZone ? 'border-muted-foreground/50 cursor-crosshair ring-4 ring-primary/10'
          : 'border-border hover:border-primary cursor-pointer'
        } ${!isActionable ? 'cursor-default' : ''}`}
        onClick={isActionable ? handleClick : undefined}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        data-dropzone-id={id}
      >
        <input
          type="file"
          id={id}
          ref={inputRef}
          onChange={handleFileChange}
          accept="image/png, image/jpeg"
          className="hidden"
        />
        {imageUrl ? (
          <>
            <img
              ref={imgRef}
              src={imageUrl}
              alt={label || 'Uploaded Scene'}
              className="w-full h-full object-contain"
            />

            {persistedOrbPosition && (
              <div
                className="absolute w-5 h-5 bg-red-600 rounded-full border-2 border-white shadow-[0_0_10px_rgba(255,0,0,0.5)] z-20"
                style={{
                  left: persistedOrbPosition.x,
                  top: persistedOrbPosition.y,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0.5 h-2 bg-red-600" />
              </div>
            )}

            {showDebugButton && onDebugClick && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onDebugClick()
                }}
                className="absolute bottom-2 right-2 bg-black/60 text-white text-xs font-semibold px-3 py-1.5 rounded-md hover:bg-black/80 transition-all z-20 shadow-lg"
                aria-label="Show debug view"
              >
                Debug
              </button>
            )}
          </>
        ) : (
          <div className="text-center text-muted-foreground p-4">
            <Upload className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Click to upload or drag & drop</p>
          </div>
        )}
      </div>
      {fileTypeError && (
        <div className="w-full mt-2 text-sm text-yellow-800 bg-yellow-100 border border-yellow-300 rounded-lg p-3 flex items-center" role="alert">
          <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
          <span>{fileTypeError}</span>
        </div>
      )}
    </div>
  )
})

ImageUploader.displayName = 'ImageUploader'

export default ImageUploader
