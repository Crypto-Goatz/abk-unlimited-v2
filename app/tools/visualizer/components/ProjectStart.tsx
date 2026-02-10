'use client'

import { Home, Lightbulb } from 'lucide-react'

interface ProjectStartProps {
  onSelectGoal: (goal: 'remodel' | 'new-space') => void
}

export default function ProjectStart({ onSelectGoal }: ProjectStartProps) {
  return (
    <div className="w-full max-w-4xl mx-auto text-center animate-fade-in">
      <div className="mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-foreground">Design Your Dream Space</h2>
        <p className="mt-4 text-xl text-muted-foreground">How would you like to begin?</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div
          onClick={() => onSelectGoal('remodel')}
          className="bg-card p-8 rounded-xl border-2 border-border hover:border-primary hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer flex flex-col items-center text-center"
        >
          <div className="bg-primary/10 text-primary p-4 rounded-full mb-6">
            <Home className="h-10 w-10" />
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-2">Renovate an Existing Room</h3>
          <p className="text-muted-foreground">Upload a photo of your current space and start redesigning with new products and finishes.</p>
        </div>
        <div
          onClick={() => onSelectGoal('new-space')}
          className="bg-card p-8 rounded-xl border-2 border-border hover:border-primary hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer flex flex-col items-center text-center"
        >
          <div className="bg-primary/10 text-primary p-4 rounded-full mb-6">
            <Lightbulb className="h-10 w-10" />
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-2">Create a New Space</h3>
          <p className="text-muted-foreground">Describe your ideal room from scratch and let our AI generate a creative starting point for you.</p>
        </div>
      </div>
    </div>
  )
}
