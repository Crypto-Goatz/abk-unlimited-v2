'use client'

import { X } from 'lucide-react'

interface DebugModalProps {
  isOpen: boolean
  onClose: () => void
  imageUrl: string | null
  prompt: string | null
}

export default function DebugModal({ isOpen, onClose, imageUrl, prompt }: DebugModalProps) {
  if (!isOpen || !imageUrl) {
    return null
  }

  const handleModalContentClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  return (
    <div
      className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-card rounded-xl shadow-2xl w-full max-w-4xl p-6 md:p-8 relative transform transition-all flex flex-col"
        style={{ maxHeight: '90vh' }}
        onClick={handleModalContentClick}
        role="document"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors z-10"
          aria-label="Close modal"
        >
          <X className="h-6 w-6" />
        </button>
        <div className="text-center mb-4 flex-shrink-0">
          <h2 className="text-2xl font-bold text-foreground">Debug View</h2>
        </div>

        <div className="flex flex-col gap-4 overflow-y-auto">
          <div>
            <p className="text-muted-foreground mb-2">This is the image sent to the AI, with a red marker indicating the placement.</p>
            <div className="rounded-lg overflow-hidden bg-muted">
              <img src={imageUrl} alt="Debug view of marked scene" className="w-full h-full object-contain" />
            </div>
          </div>

          {prompt && (
            <div>
              <h3 className="text-lg font-bold text-foreground mb-2">Final Prompt to Image Model</h3>
              <pre className="bg-muted text-foreground p-4 rounded-lg text-xs whitespace-pre-wrap">
                <code>{prompt}</code>
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
