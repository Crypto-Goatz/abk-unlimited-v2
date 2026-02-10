'use client'

import { useState } from 'react'
import ImageUploader from './ImageUploader'

interface IndoorControlPanelProps {
  onGenerate: (style: string, description: string, refImage: File | null, refType: 'structure' | 'inspiration' | null) => void
  isGenerating: boolean
}

const styles = [
  { id: 'modern', label: 'Modern', color: 'bg-zinc-800 text-white' },
  { id: 'rustic', label: 'Rustic', color: 'bg-amber-800 text-white' },
  { id: 'industrial', label: 'Industrial', color: 'bg-zinc-600 text-white' },
  { id: 'boho', label: 'Bohemian', color: 'bg-orange-700 text-white' },
  { id: 'scandinavian', label: 'Scandinavian', color: 'bg-stone-300 text-zinc-800' },
  { id: 'traditional', label: 'Traditional', color: 'bg-indigo-900 text-white' },
]

export default function IndoorControlPanel({ onGenerate, isGenerating }: IndoorControlPanelProps) {
  const [selectedStyle, setSelectedStyle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [refImage, setRefImage] = useState<File | null>(null)
  const [refType, setRefType] = useState<'structure' | 'inspiration'>('inspiration')
  const refImageUrl = refImage ? URL.createObjectURL(refImage) : null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedStyle && description.trim() && !isGenerating) {
      onGenerate(selectedStyle, description, refImage, refType)
    }
  }

  return (
    <div className="bg-card p-4 rounded-xl border border-border h-full flex flex-col shadow-sm max-h-[85vh] overflow-y-auto">
      <h2 className="text-xl font-bold text-foreground mb-4">Design Configuration</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6 h-full">
        {/* Style Selector */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">1. Choose a Style</label>
          <div className="grid grid-cols-2 gap-2">
            {styles.map(style => (
              <button
                key={style.id}
                type="button"
                onClick={() => setSelectedStyle(style.label)}
                className={`py-2 px-1 text-sm rounded-lg font-medium transition-all ${
                  selectedStyle === style.label
                    ? style.color + ' ring-2 ring-offset-1 ring-primary shadow-md'
                    : 'bg-background border border-border text-muted-foreground hover:bg-muted'
                }`}
              >
                {style.label}
              </button>
            ))}
          </div>
        </div>

        {/* Reference Image */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">2. Reference Image (Optional)</label>
          <div className="w-full h-32">
            <ImageUploader
              id="ref-uploader"
              onFileSelect={setRefImage}
              imageUrl={refImageUrl}
              label=""
            />
          </div>
          {refImage && (
            <div className="mt-2 flex bg-background rounded-lg p-1 border border-border">
              <button
                type="button"
                onClick={() => setRefType('inspiration')}
                className={`flex-1 py-1 text-xs font-semibold rounded-md transition-colors ${
                  refType === 'inspiration' ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Inspiration
              </button>
              <button
                type="button"
                onClick={() => setRefType('structure')}
                className={`flex-1 py-1 text-xs font-semibold rounded-md transition-colors ${
                  refType === 'structure' ? 'bg-accent/20 text-accent' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Build Onto
              </button>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="flex-grow flex flex-col">
          <label className="block text-sm font-semibold text-foreground mb-2">3. Describe the Space</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What do you want to change? Be specific about colors, furniture, and materials."
            className="w-full flex-grow p-3 border-2 border-border rounded-lg text-sm focus:ring-2 focus:outline-none focus:border-primary focus:ring-primary/30 resize-none min-h-[100px] bg-background"
            disabled={isGenerating}
          />
        </div>

        <button
          type="submit"
          disabled={!selectedStyle || !description.trim() || isGenerating}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105 disabled:bg-muted disabled:cursor-not-allowed disabled:transform-none"
        >
          Visualize Design
        </button>
      </form>
    </div>
  )
}
