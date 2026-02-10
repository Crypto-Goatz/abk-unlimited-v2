'use client'

import { Home, Building2 } from 'lucide-react'

interface ProjectTypeSelectorProps {
  onSelectProjectType: (type: 'indoor' | 'outdoor') => void
}

export default function ProjectTypeSelector({ onSelectProjectType }: ProjectTypeSelectorProps) {
  return (
    <div className="w-full max-w-4xl mx-auto text-center animate-fade-in">
      <div className="mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-foreground">What are we designing today?</h2>
        <p className="mt-4 text-xl text-muted-foreground">Choose a project type to get started.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div
          onClick={() => onSelectProjectType('indoor')}
          className="bg-card p-8 rounded-xl border-2 border-border hover:border-primary hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer flex flex-col items-center text-center"
        >
          <div className="bg-primary/10 text-primary p-4 rounded-full mb-6">
            <Home className="h-10 w-10" />
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-2">Indoor Project</h3>
          <p className="text-muted-foreground">Design the interior of a room. Replace furniture, try new decor, and create your perfect indoor space.</p>
        </div>
        <div
          onClick={() => onSelectProjectType('outdoor')}
          className="bg-card p-8 rounded-xl border-2 border-border hover:border-primary hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer flex flex-col items-center text-center"
        >
          <div className="bg-primary/10 text-primary p-4 rounded-full mb-6">
            <Building2 className="h-10 w-10" />
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-2">Outdoor Project</h3>
          <p className="text-muted-foreground">Renovate your home's exterior. Add a deck, change the siding, and boost your curb appeal.</p>
        </div>
      </div>
    </div>
  )
}
