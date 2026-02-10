'use client'

import { useState } from 'react'
import Spinner from './Spinner'

interface SceneGeneratorProps {
  onGenerate: (prompt: string) => void
  isLoading: boolean
}

export default function SceneGenerator({ onGenerate, isLoading }: SceneGeneratorProps) {
  const [prompt, setPrompt] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (prompt.trim() && !isLoading) {
      onGenerate(prompt)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in text-center">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground">Create a New Space</h2>
        <p className="mt-2 text-lg text-muted-foreground">Describe the room you want to create. Be as detailed as you like!</p>
      </div>

      <div className="bg-card p-8 rounded-xl shadow-2xl border border-border">
        <form onSubmit={handleSubmit}>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., A cozy, rustic living room with a stone fireplace, exposed wood beams, and a large window overlooking a snowy forest."
            className="w-full h-32 p-4 border-2 border-border rounded-lg text-lg focus:ring-2 focus:outline-none transition-all focus:border-primary focus:ring-primary/30 bg-background"
            aria-label="Scene description prompt"
            disabled={isLoading}
          />
          <div className="mt-6">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center">
                <Spinner />
                <p className="text-xl mt-4 text-muted-foreground">Generating your scene...</p>
              </div>
            ) : (
              <button
                type="submit"
                disabled={!prompt.trim()}
                className="w-full flex items-center justify-center bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105 disabled:bg-muted disabled:cursor-not-allowed disabled:transform-none"
              >
                Generate Scene
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
