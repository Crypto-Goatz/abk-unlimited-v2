'use client'

import { useState } from 'react'

interface OutdoorRenovationPanelProps {
  onApplyRenovation: (prompt: string) => void
  isGenerating: boolean
}

const renovationOptions = [
  { id: 'deck', label: 'Add a Deck', prompt: 'a beautiful new deck made of ' },
  { id: 'siding', label: 'Change Siding', prompt: 'new siding that is ' },
  { id: 'roof', label: 'Replace Roof', prompt: 'a new roof with ' },
  { id: 'windows', label: 'Update Windows', prompt: 'new windows that are ' },
  { id: 'paint', label: 'Paint the House', prompt: 'the house painted in a ' },
  { id: 'custom', label: 'Custom Change', prompt: '' },
]

export default function OutdoorRenovationPanel({ onApplyRenovation, isGenerating }: OutdoorRenovationPanelProps) {
  const [activePrompt, setActivePrompt] = useState('')
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null)

  const handleOptionClick = (option: typeof renovationOptions[0]) => {
    setSelectedOptionId(option.id)
    setActivePrompt(option.prompt)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (activePrompt.trim() && !isGenerating) {
      onApplyRenovation(activePrompt)
    }
  }

  return (
    <div className="bg-card p-4 rounded-xl border border-border h-full flex flex-col shadow-sm max-h-[75vh]">
      <div className="flex-shrink-0 mb-4">
        <h2 className="text-2xl font-bold text-center text-foreground">Renovation Options</h2>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {renovationOptions.map(option => (
          <button
            key={option.id}
            onClick={() => handleOptionClick(option)}
            className={`px-3 py-1.5 text-sm font-semibold rounded-full border-2 transition-all ${
              selectedOptionId === option.id
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background text-foreground border-border hover:border-primary'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col flex-grow">
        <label htmlFor="renovation-prompt" className="font-semibold text-foreground mb-2">
          Describe your change:
        </label>
        <textarea
          id="renovation-prompt"
          value={activePrompt}
          onChange={(e) => setActivePrompt(e.target.value)}
          placeholder="e.g., a large, multi-level redwood deck with white railings and built-in benches."
          className="w-full h-full flex-grow p-3 border-2 border-border rounded-lg text-md focus:ring-2 focus:outline-none transition-all focus:border-primary focus:ring-primary/30 bg-background"
          aria-label="Renovation description"
          disabled={isGenerating || !selectedOptionId}
        />
        <div className="flex-shrink-0 pt-4 mt-auto">
          <button
            type="submit"
            disabled={!activePrompt.trim() || isGenerating || !selectedOptionId}
            className="w-full flex items-center justify-center bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-4 rounded-lg text-lg transition-transform transform hover:scale-105 disabled:bg-muted disabled:cursor-not-allowed"
          >
            Apply Change
          </button>
        </div>
      </form>
    </div>
  )
}
