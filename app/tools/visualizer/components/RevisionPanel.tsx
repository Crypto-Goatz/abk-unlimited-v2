'use client'

import { useState } from 'react'
import { Undo2, Download, Share2, ArrowRight } from 'lucide-react'

interface RevisionPanelProps {
  revisionsRemaining: number
  onApplyRevision: (instruction: string) => void
  isProcessing: boolean
  imageUrl: string
  isSelectionActive: boolean
  onCancelSelection: () => void
  onUndo: () => void
  canUndo: boolean
  onNextStep: () => void
}

export default function RevisionPanel({
  revisionsRemaining,
  onApplyRevision,
  isProcessing,
  imageUrl,
  isSelectionActive,
  onCancelSelection,
  onUndo,
  canUndo,
  onNextStep
}: RevisionPanelProps) {
  const [instruction, setInstruction] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (instruction.trim() && !isProcessing) {
      onApplyRevision(instruction)
      setInstruction('')
    }
  }

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = imageUrl
    link.download = `abk-design-${Date.now()}.jpeg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        const response = await fetch(imageUrl)
        const blob = await response.blob()
        const file = new File([blob], 'design.jpg', { type: 'image/jpeg' })

        await navigator.share({
          title: 'My ABK Design',
          text: 'Check out this room design I created with ABK Unlimited!',
          files: [file]
        })
      } catch (err) {
        console.log('Share failed or canceled', err)
      }
    } else {
      alert('Sharing is not supported on this browser/device.')
    }
  }

  return (
    <div className="bg-card p-4 rounded-xl border border-border h-full flex flex-col shadow-sm">
      <h2 className="text-xl font-bold text-foreground mb-2">Refine Your Design</h2>

      {/* Status Bar */}
      <div className="bg-background p-4 rounded-lg border border-border mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold text-foreground">Revisions Left</span>
          <span className={`font-bold text-lg ${revisionsRemaining > 0 ? 'text-primary' : 'text-destructive'}`}>
            {revisionsRemaining} / 2
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-2.5 mb-3">
          <div
            className="bg-primary h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${(revisionsRemaining / 2) * 100}%` }}
          />
        </div>
        {canUndo && (
          <button
            onClick={onUndo}
            disabled={isProcessing}
            className="w-full text-sm text-muted-foreground hover:text-foreground font-medium flex items-center justify-center py-1 rounded hover:bg-muted transition-colors"
          >
            <Undo2 className="h-4 w-4 mr-1" />
            Undo Last Change
          </button>
        )}
      </div>

      {/* Input Area */}
      {isSelectionActive ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 animate-fade-in">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="font-semibold text-foreground">Selected Area</label>
              <button
                type="button"
                onClick={onCancelSelection}
                className="text-xs text-destructive hover:underline"
              >
                Cancel Selection
              </button>
            </div>
            <p className="text-xs text-muted-foreground mb-2">Provide instructions for the area marked with the red dot.</p>
            <textarea
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              placeholder="e.g., Change the chair to a velvet blue armchair."
              className="w-full h-32 p-3 border-2 border-border rounded-lg text-sm focus:ring-2 focus:outline-none focus:border-primary focus:ring-primary/30 resize-none bg-background"
              autoFocus
            />
          </div>
          <button
            type="submit"
            disabled={!instruction.trim() || isProcessing}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105 disabled:bg-muted disabled:cursor-not-allowed"
          >
            Apply Revision
          </button>
        </form>
      ) : (
        <div className="flex-grow flex flex-col items-center justify-center text-center p-4 text-muted-foreground border-2 border-dashed border-border rounded-lg bg-muted/20 min-h-[150px]">
          {revisionsRemaining > 0 ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
              <p className="text-sm">Click anywhere on the image to drop a pin and request a change.</p>
            </>
          ) : (
            <p className="text-sm">You have used all your revisions.</p>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-6 pt-6 border-t border-border flex flex-col gap-3">
        <button
          onClick={onNextStep}
          className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold py-3 px-4 rounded-lg shadow-md transition-all hover:scale-105 flex items-center justify-center text-lg"
        >
          Next Step
          <ArrowRight className="h-5 w-5 ml-2" />
        </button>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleDownload}
            className="flex items-center justify-center py-2 px-4 bg-background border border-border text-foreground rounded-lg hover:bg-muted transition-colors font-medium text-sm"
          >
            <Download className="h-4 w-4 mr-2" />
            Save
          </button>
          <button
            onClick={handleShare}
            className="flex items-center justify-center py-2 px-4 bg-background border border-border text-foreground rounded-lg hover:bg-muted transition-colors font-medium text-sm"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </button>
        </div>
      </div>
    </div>
  )
}
