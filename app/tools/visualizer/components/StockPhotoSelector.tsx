'use client'

import { useState } from 'react'
import { ImageIcon, Upload, ChevronLeft } from 'lucide-react'

interface StockPhoto {
  id: string
  label: string
  category: 'indoor' | 'outdoor'
  url: string
  thumbnail?: string
}

// Stock photos - using Unsplash for high-quality free images
const stockPhotos: StockPhoto[] = [
  // Indoor - Living Rooms
  {
    id: 'living-modern',
    label: 'Modern Living Room',
    category: 'indoor',
    url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=80',
  },
  {
    id: 'living-cozy',
    label: 'Cozy Living Room',
    category: 'indoor',
    url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80',
  },
  // Indoor - Kitchens
  {
    id: 'kitchen-white',
    label: 'White Kitchen',
    category: 'indoor',
    url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=80',
  },
  {
    id: 'kitchen-modern',
    label: 'Modern Kitchen',
    category: 'indoor',
    url: 'https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=1200&q=80',
  },
  // Indoor - Bedrooms
  {
    id: 'bedroom-minimal',
    label: 'Minimal Bedroom',
    category: 'indoor',
    url: 'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=1200&q=80',
  },
  {
    id: 'bedroom-cozy',
    label: 'Cozy Bedroom',
    category: 'indoor',
    url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=1200&q=80',
  },
  // Indoor - Bathrooms
  {
    id: 'bathroom-modern',
    label: 'Modern Bathroom',
    category: 'indoor',
    url: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1200&q=80',
  },
  {
    id: 'bathroom-spa',
    label: 'Spa Bathroom',
    category: 'indoor',
    url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80',
  },
  // Outdoor - Houses
  {
    id: 'house-suburban',
    label: 'Suburban Home',
    category: 'outdoor',
    url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80',
  },
  {
    id: 'house-modern',
    label: 'Modern Home',
    category: 'outdoor',
    url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80',
  },
  {
    id: 'house-traditional',
    label: 'Traditional Home',
    category: 'outdoor',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
  },
  {
    id: 'house-craftsman',
    label: 'Craftsman Home',
    category: 'outdoor',
    url: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=1200&q=80',
  },
]

interface StockPhotoSelectorProps {
  category: 'indoor' | 'outdoor'
  onSelect: (file: File) => void
  onUploadClick: () => void
}

export default function StockPhotoSelector({ category, onSelect, onUploadClick }: StockPhotoSelectorProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const filteredPhotos = stockPhotos.filter(photo => photo.category === category)

  const handleSelectPhoto = async (photo: StockPhoto) => {
    setIsLoading(photo.id)
    setError(null)

    try {
      // Fetch the image
      const response = await fetch(photo.url)
      if (!response.ok) throw new Error('Failed to fetch image')

      const blob = await response.blob()
      const file = new File([blob], `${photo.id}.jpg`, { type: 'image/jpeg' })

      onSelect(file)
    } catch (err) {
      console.error('Error loading stock photo:', err)
      setError('Failed to load image. Please try again or upload your own.')
    } finally {
      setIsLoading(null)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground">
          Choose a {category === 'indoor' ? 'Room' : 'Home'}
        </h2>
        <p className="mt-2 text-lg text-muted-foreground">
          Select a stock photo or upload your own
        </p>
      </div>

      {/* Upload Option */}
      <button
        onClick={onUploadClick}
        className="w-full mb-6 p-4 border-2 border-dashed border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-3 group"
      >
        <Upload className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
        <span className="text-lg font-medium text-muted-foreground group-hover:text-primary transition-colors">
          Upload Your Own Photo
        </span>
      </button>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="px-4 text-sm text-muted-foreground bg-background">or choose a stock photo</span>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-center">
          {error}
        </div>
      )}

      {/* Stock Photo Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {filteredPhotos.map((photo) => (
          <button
            key={photo.id}
            onClick={() => handleSelectPhoto(photo)}
            disabled={isLoading !== null}
            className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all group ${
              isLoading === photo.id
                ? 'border-primary ring-2 ring-primary/30'
                : 'border-border hover:border-primary hover:shadow-lg'
            } ${isLoading !== null && isLoading !== photo.id ? 'opacity-50' : ''}`}
          >
            <img
              src={photo.url.replace('w=1200', 'w=400')}
              alt={photo.label}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-2">
              <p className="text-white text-sm font-medium truncate">{photo.label}</p>
            </div>
            {isLoading === photo.id && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
