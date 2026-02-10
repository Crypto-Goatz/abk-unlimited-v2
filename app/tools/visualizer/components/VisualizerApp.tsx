'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import ImageUploader from './ImageUploader'
import Spinner from './Spinner'
import DebugModal from './DebugModal'
import ProjectStart from './ProjectStart'
import SceneGenerator from './SceneGenerator'
import ProjectTypeSelector from './ProjectTypeSelector'
import OutdoorRenovationPanel from './OutdoorRenovationPanel'
import FinalResultScreen from './FinalResultScreen'
import IndoorControlPanel from './IndoorControlPanel'
import RevisionPanel from './RevisionPanel'
import LeadGenModal from './LeadGenModal'
import StockPhotoSelector from './StockPhotoSelector'
import LeadGate, { type LeadData } from './LeadGate'

// Helper to convert a data URL string to a File object
const dataURLtoFile = (dataurl: string, filename: string): File => {
  const arr = dataurl.split(',')
  if (arr.length < 2) throw new Error("Invalid data URL")
  const mimeMatch = arr[0].match(/:(.*?);/)
  if (!mimeMatch || !mimeMatch[1]) throw new Error("Could not parse MIME type from data URL")

  const mime = mimeMatch[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename, { type: mime })
}

// Helper to convert File to base64
const fileToBase64 = (file: File): Promise<{ base64: string; mimeType: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      const result = reader.result as string
      const [header, base64] = result.split(',')
      const mimeMatch = header.match(/:(.*?);/)
      resolve({
        base64,
        mimeType: mimeMatch?.[1] || 'image/jpeg'
      })
    }
    reader.onerror = error => reject(error)
  })
}

// Helper to resize and pad image to square
const resizeImage = (file: File, targetDimension: number): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (event) => {
      if (!event.target?.result) {
        return reject(new Error("Failed to read file."))
      }
      const img = new Image()
      img.src = event.target.result as string
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = targetDimension
        canvas.height = targetDimension

        const ctx = canvas.getContext('2d')
        if (!ctx) {
          return reject(new Error('Could not get canvas context.'))
        }

        ctx.fillStyle = 'black'
        ctx.fillRect(0, 0, targetDimension, targetDimension)

        const aspectRatio = img.width / img.height
        let newWidth, newHeight

        if (aspectRatio > 1) {
          newWidth = targetDimension
          newHeight = targetDimension / aspectRatio
        } else {
          newHeight = targetDimension
          newWidth = targetDimension * aspectRatio
        }

        const x = (targetDimension - newWidth) / 2
        const y = (targetDimension - newHeight) / 2

        ctx.drawImage(img, x, y, newWidth, newHeight)

        canvas.toBlob((blob) => {
          if (blob) {
            resolve(new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now()
            }))
          } else {
            reject(new Error('Canvas to Blob conversion failed.'))
          }
        }, 'image/jpeg', 0.95)
      }
      img.onerror = (err) => reject(new Error(`Image load error: ${err}`))
    }
    reader.onerror = (err) => reject(new Error(`File reader error: ${err}`))
  })
}

// Helper to get image dimensions
const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (event) => {
      if (!event.target?.result) {
        return reject(new Error("Failed to read file."))
      }
      const img = new Image()
      img.src = event.target.result as string
      img.onload = () => {
        resolve({ width: img.naturalWidth, height: img.naturalHeight })
      }
      img.onerror = (err) => reject(new Error(`Image load error: ${err}`))
    }
    reader.onerror = (err) => reject(new Error(`File reader error: ${err}`))
  })
}

// Helper to crop back to original aspect ratio
const cropToOriginalAspectRatio = (
  imageDataUrl: string,
  originalWidth: number,
  originalHeight: number,
  targetDimension: number
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = imageDataUrl
    img.onload = () => {
      const aspectRatio = originalWidth / originalHeight
      let contentWidth, contentHeight
      if (aspectRatio > 1) {
        contentWidth = targetDimension
        contentHeight = targetDimension / aspectRatio
      } else {
        contentHeight = targetDimension
        contentWidth = targetDimension * aspectRatio
      }

      const x = (targetDimension - contentWidth) / 2
      const y = (targetDimension - contentHeight) / 2

      const canvas = document.createElement('canvas')
      canvas.width = contentWidth
      canvas.height = contentHeight

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        return reject(new Error('Could not get canvas context for cropping.'))
      }

      ctx.drawImage(img, x, y, contentWidth, contentHeight, 0, 0, contentWidth, contentHeight)

      resolve(canvas.toDataURL('image/jpeg', 0.95))
    }
    img.onerror = (err) => reject(new Error(`Image load error during cropping: ${err}`))
  })
}

// Helper to mark image with red dot
const markImage = async (
  file: File,
  position: { xPercent: number; yPercent: number },
  originalDimensions: { originalWidth: number; originalHeight: number }
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (event) => {
      if (!event.target?.result) {
        return reject(new Error("Failed to read file for marking."))
      }
      const img = new Image()
      img.src = event.target.result as string
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const targetDimension = canvas.width

        const ctx = canvas.getContext('2d')
        if (!ctx) {
          return reject(new Error('Could not get canvas context for marking.'))
        }

        ctx.drawImage(img, 0, 0)

        const { originalWidth, originalHeight } = originalDimensions
        const aspectRatio = originalWidth / originalHeight
        let contentWidth, contentHeight

        if (aspectRatio > 1) {
          contentWidth = targetDimension
          contentHeight = targetDimension / aspectRatio
        } else {
          contentHeight = targetDimension
          contentWidth = targetDimension * aspectRatio
        }

        const offsetX = (targetDimension - contentWidth) / 2
        const offsetY = (targetDimension - contentHeight) / 2

        const markerXInContent = (position.xPercent / 100) * contentWidth
        const markerYInContent = (position.yPercent / 100) * contentHeight

        const finalMarkerX = offsetX + markerXInContent
        const finalMarkerY = offsetY + markerYInContent

        const markerRadius = Math.max(5, Math.min(canvas.width, canvas.height) * 0.015)

        ctx.beginPath()
        ctx.arc(finalMarkerX, finalMarkerY, markerRadius, 0, 2 * Math.PI, false)
        ctx.fillStyle = 'red'
        ctx.fill()
        ctx.lineWidth = markerRadius * 0.2
        ctx.strokeStyle = 'white'
        ctx.stroke()

        canvas.toBlob((blob) => {
          if (blob) {
            resolve(new File([blob], `marked-${file.name}`, {
              type: 'image/jpeg',
              lastModified: Date.now()
            }))
          } else {
            reject(new Error('Canvas to Blob conversion failed during marking.'))
          }
        }, 'image/jpeg', 0.95)
      }
      img.onerror = (err) => reject(new Error(`Image load error during marking: ${err}`))
    }
    reader.onerror = (err) => reject(new Error(`File reader error during marking: ${err}`))
  })
}

const loadingMessages = [
  "Analyzing your scene...",
  "Understanding the style...",
  "Calculating lighting and shadows...",
  "Crafting the perfect renovation prompt...",
  "Generating photorealistic options...",
  "Assembling your new space..."
]

const MAX_DIMENSION = 1024

export default function VisualizerApp() {
  // User/Lead State (gate before using visualizer)
  const [userData, setUserData] = useState<LeadData | null>(null)
  const [isSubmittingGate, setIsSubmittingGate] = useState(false)

  // Core State
  const [projectType, setProjectType] = useState<'undecided' | 'indoor' | 'outdoor'>('undecided')
  const [projectGoal, setProjectGoal] = useState<'undecided' | 'remodel' | 'new-space'>('undecided')
  const [sceneImage, setSceneImage] = useState<File | null>(null)
  const [originalSceneImage, setOriginalSceneImage] = useState<File | null>(null)

  // Indoor Workflow State
  const [indoorPhase, setIndoorPhase] = useState<'setup' | 'result'>('setup')
  const [revisionsRemaining, setRevisionsRemaining] = useState<number>(3)
  const [revisionPoint, setRevisionPoint] = useState<{x: number, y: number, xPercent: number, yPercent: number} | null>(null)
  const [history, setHistory] = useState<File[]>([])

  // Loading and Error State
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isGeneratingScene, setIsGeneratingScene] = useState<boolean>(false)
  const [isCleaningScene, setIsCleaningScene] = useState<boolean>(false)
  const [isFinalizing, setIsFinalizing] = useState<boolean>(false)
  const [isAnalyzingEnhancements, setIsAnalyzingEnhancements] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0)

  // Lead Gen State
  const [isLeadGenModalOpen, setIsLeadGenModalOpen] = useState(false)
  const [isSubmittingLead, setIsSubmittingLead] = useState(false)

  // UI/Debug State
  const [debugImageUrl, setDebugImageUrl] = useState<string | null>(null)
  const [debugPrompt, setDebugPrompt] = useState<string | null>(null)
  const [isDebugModalOpen, setIsDebugModalOpen] = useState(false)
  const [isFinalizedViewVisible, setIsFinalizedViewVisible] = useState<boolean>(false)
  const [enhancementList, setEnhancementList] = useState<string[]>([])
  const [showUploader, setShowUploader] = useState<boolean>(false)

  const sceneImgRef = useRef<HTMLImageElement>(null)
  const sceneImageUrl = sceneImage ? URL.createObjectURL(sceneImage) : null
  const originalSceneImageUrl = originalSceneImage ? URL.createObjectURL(originalSceneImage) : null

  // --- INDOOR LOGIC ---

  const handleIndoorDesignGenerate = useCallback(async (
    style: string,
    description: string,
    refImage: File | null,
    refType: 'structure' | 'inspiration' | null
  ) => {
    if (!sceneImage) return
    setIsLoading(true)
    setError(null)
    try {
      const { width: originalWidth, height: originalHeight } = await getImageDimensions(sceneImage)
      const resizedSceneImage = await resizeImage(sceneImage, MAX_DIMENSION)
      const { base64: sceneBase64, mimeType: sceneMimeType } = await fileToBase64(resizedSceneImage)

      let refBase64 = null
      let refMimeType = null
      if (refImage) {
        const resizedRef = await resizeImage(refImage, MAX_DIMENSION)
        const refData = await fileToBase64(resizedRef)
        refBase64 = refData.base64
        refMimeType = refData.mimeType
      }

      const response = await fetch('/api/visualizer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generateIndoorDesign',
          sceneImageBase64: sceneBase64,
          sceneMimeType,
          style,
          description,
          refImageBase64: refBase64,
          refMimeType,
          refType
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate design')
      }

      const data = await response.json()
      const generatedSquareImageUrl = `data:${data.mimeType};base64,${data.imageBase64}`
      const finalImageUrl = await cropToOriginalAspectRatio(generatedSquareImageUrl, originalWidth, originalHeight, MAX_DIMENSION)

      const newSceneFile = dataURLtoFile(finalImageUrl, `generated-indoor-${Date.now()}.jpeg`)
      setSceneImage(newSceneFile)
      setHistory([newSceneFile])
      setDebugImageUrl(URL.createObjectURL(resizedSceneImage))
      setDebugPrompt(data.prompt)
      setIndoorPhase('result')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.'
      setError(`Failed to generate design. ${errorMessage}`)
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [sceneImage])

  const handlePointSelection = useCallback((position: {x: number, y: number}, relativePosition: { xPercent: number; yPercent: number }) => {
    if (indoorPhase === 'result' && revisionsRemaining > 0 && !isLoading) {
      setRevisionPoint({ ...position, ...relativePosition })
    }
  }, [indoorPhase, revisionsRemaining, isLoading])

  const handleApplyRevision = useCallback(async (instruction: string) => {
    if (!sceneImage || !revisionPoint) return

    setIsLoading(true)
    setError(null)
    try {
      const { width: originalWidth, height: originalHeight } = await getImageDimensions(sceneImage)
      const resizedImage = await resizeImage(sceneImage, MAX_DIMENSION)
      const markedImage = await markImage(resizedImage, revisionPoint, { originalWidth, originalHeight })
      const { base64, mimeType } = await fileToBase64(markedImage)

      setDebugImageUrl(URL.createObjectURL(markedImage))

      const response = await fetch('/api/visualizer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'applyRevision',
          imageBase64: base64,
          mimeType,
          instruction
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to apply revision')
      }

      const data = await response.json()
      const generatedSquareImageUrl = `data:${data.mimeType};base64,${data.imageBase64}`
      const finalImageUrl = await cropToOriginalAspectRatio(generatedSquareImageUrl, originalWidth, originalHeight, MAX_DIMENSION)

      const newSceneFile = dataURLtoFile(finalImageUrl, `revision-${Date.now()}.jpeg`)
      setSceneImage(newSceneFile)
      setHistory(prev => [...prev, newSceneFile])
      setDebugPrompt(data.prompt)
      setRevisionsRemaining(prev => prev - 1)
      setRevisionPoint(null)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.'
      setError(`Failed to apply revision. ${errorMessage}`)
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [sceneImage, revisionPoint])

  const handleUndo = useCallback(() => {
    if (history.length > 1) {
      const newHistory = history.slice(0, -1)
      const previousImage = newHistory[newHistory.length - 1]
      setHistory(newHistory)
      setSceneImage(previousImage)
      setRevisionsRemaining(prev => prev + 1)
      setRevisionPoint(null)
    }
  }, [history])

  // --- OUTDOOR LOGIC ---

  const handleSceneGeneration = useCallback(async (prompt: string) => {
    setIsGeneratingScene(true)
    setError(null)
    try {
      const response = await fetch('/api/visualizer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generateScene',
          prompt
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate scene')
      }

      const data = await response.json()
      const imageUrl = `data:${data.mimeType};base64,${data.imageBase64}`
      const sceneFile = dataURLtoFile(imageUrl, `generated-scene-${Date.now()}.jpeg`)
      setSceneImage(sceneFile)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.'
      setError(`Failed to generate scene. ${errorMessage}`)
      console.error(err)
    } finally {
      setIsGeneratingScene(false)
    }
  }, [])

  const handleOutdoorSceneUpload = useCallback(async (file: File) => {
    setOriginalSceneImage(file)
    setIsCleaningScene(true)
    setError(null)
    try {
      const { width: originalWidth, height: originalHeight } = await getImageDimensions(file)
      const resizedFile = await resizeImage(file, MAX_DIMENSION)
      const { base64, mimeType } = await fileToBase64(resizedFile)

      const response = await fetch('/api/visualizer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'cleanOutdoorScene',
          imageBase64: base64,
          mimeType
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to prepare scene')
      }

      const data = await response.json()
      const generatedSquareImageUrl = `data:${data.mimeType};base64,${data.imageBase64}`
      const croppedUrl = await cropToOriginalAspectRatio(generatedSquareImageUrl, originalWidth, originalHeight, MAX_DIMENSION)
      const cleanedFile = dataURLtoFile(croppedUrl, `cleaned-scene-${Date.now()}.jpeg`)
      setSceneImage(cleanedFile)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.'
      setError(`Failed to prepare your scene. ${errorMessage}`)
      setOriginalSceneImage(null)
      console.error(err)
    } finally {
      setIsCleaningScene(false)
    }
  }, [])

  const handleApplyOutdoorRenovation = useCallback(async (prompt: string) => {
    if (!sceneImage) return
    setIsLoading(true)
    setError(null)
    try {
      const { width: originalWidth, height: originalHeight } = await getImageDimensions(sceneImage)
      const resizedFile = await resizeImage(sceneImage, MAX_DIMENSION)
      const { base64, mimeType } = await fileToBase64(resizedFile)

      const response = await fetch('/api/visualizer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'applyOutdoorRenovation',
          imageBase64: base64,
          mimeType,
          renovationPrompt: prompt
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to apply renovation')
      }

      const data = await response.json()
      const generatedSquareImageUrl = `data:${data.mimeType};base64,${data.imageBase64}`
      const croppedUrl = await cropToOriginalAspectRatio(generatedSquareImageUrl, originalWidth, originalHeight, MAX_DIMENSION)
      const renovatedFile = dataURLtoFile(croppedUrl, `renovated-scene-${Date.now()}.jpeg`)
      setSceneImage(renovatedFile)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.'
      setError(`Failed to apply renovation. ${errorMessage}`)
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [sceneImage])

  const handleFinalizeScene = useCallback(async () => {
    if (!sceneImage || !originalSceneImage) return
    setIsFinalizing(true)
    setError(null)
    try {
      const { width: originalWidth, height: originalHeight } = await getImageDimensions(originalSceneImage)

      const resizedRenovated = await resizeImage(sceneImage, MAX_DIMENSION)
      const resizedOriginal = await resizeImage(originalSceneImage, MAX_DIMENSION)

      const { base64: renovatedBase64, mimeType: renovatedMimeType } = await fileToBase64(resizedRenovated)
      const { base64: originalBase64, mimeType: originalMimeType } = await fileToBase64(resizedOriginal)

      const response = await fetch('/api/visualizer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'finalizeOutdoorScene',
          renovatedBase64,
          renovatedMimeType,
          originalBase64,
          originalMimeType
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to finalize scene')
      }

      const data = await response.json()
      const generatedSquareImageUrl = `data:${data.mimeType};base64,${data.imageBase64}`
      const croppedUrl = await cropToOriginalAspectRatio(generatedSquareImageUrl, originalWidth, originalHeight, MAX_DIMENSION)
      const finalFile = dataURLtoFile(croppedUrl, `final-scene-${Date.now()}.jpeg`)

      setIsFinalizing(false)
      setIsAnalyzingEnhancements(true)

      // Analyze enhancements
      const { base64: finalBase64, mimeType: finalMimeType } = await fileToBase64(finalFile)
      const enhanceResponse = await fetch('/api/visualizer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'analyzeEnhancements',
          imageBase64: finalBase64,
          mimeType: finalMimeType
        })
      })

      if (enhanceResponse.ok) {
        const enhanceData = await enhanceResponse.json()
        setEnhancementList(enhanceData.enhancements || [])
      }

      setSceneImage(finalFile)
      setIsFinalizedViewVisible(true)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.'
      setError(`Failed to finalize scene. ${errorMessage}`)
      console.error(err)
    } finally {
      setIsFinalizing(false)
      setIsAnalyzingEnhancements(false)
    }
  }, [sceneImage, originalSceneImage])

  const handleReset = useCallback(() => {
    setSceneImage(null)
    setOriginalSceneImage(null)
    setError(null)
    setIsLoading(false)
    setIsCleaningScene(false)
    setIsFinalizing(false)
    setIsAnalyzingEnhancements(false)
    setDebugImageUrl(null)
    setDebugPrompt(null)
    setProjectType('undecided')
    setProjectGoal('undecided')
    setIsFinalizedViewVisible(false)
    setEnhancementList([])
    setIndoorPhase('setup')
    setRevisionsRemaining(3)
    setRevisionPoint(null)
    setHistory([])
    setShowUploader(false)
    // Note: We keep userData so user doesn't have to re-enter info
  }, [])

  const handleChangeScene = useCallback(() => {
    setSceneImage(null)
    setOriginalSceneImage(null)
    setDebugImageUrl(null)
    setDebugPrompt(null)
    setIndoorPhase('setup')
    setRevisionsRemaining(3)
    setRevisionPoint(null)
    setHistory([])
    setShowUploader(false)
    if (projectType === 'outdoor') {
      setProjectGoal('remodel')
    }
  }, [projectType])

  // Handle lead gate submission (before user can use visualizer)
  const handleLeadGateSubmit = async (data: LeadData) => {
    setIsSubmittingGate(true)
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          address: data.address,
          zipCode: data.zipCode,
          source: 'AI Visualizer',
          service: 'AI Visualization Tool'
        })
      })

      if (!response.ok) {
        throw new Error('Failed to register')
      }

      const result = await response.json()
      // Store user data with contact ID from CRM
      setUserData({
        ...data,
        contactId: result.leadId
      })
    } catch (e) {
      console.error(e)
      throw new Error('Failed to register. Please try again.')
    } finally {
      setIsSubmittingGate(false)
    }
  }

  // Handle saving final design to CRM
  const handleSaveDesign = async () => {
    if (!sceneImage || !userData?.contactId) return

    setIsSubmittingLead(true)
    try {
      const { base64, mimeType } = await fileToBase64(sceneImage)

      const response = await fetch('/api/visualizer/save-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contactId: userData.contactId,
          imageBase64: base64,
          mimeType,
          projectType,
          description: `${projectType === 'indoor' ? 'Interior' : 'Exterior'} renovation visualization`
        })
      })

      if (response.ok) {
        setIsLeadGenModalOpen(false)
        alert("Your design has been saved! Our team will review it and be in touch soon.")
      } else {
        throw new Error('Failed to save')
      }
    } catch (e) {
      console.error(e)
      alert("There was an issue saving your design. Please try again.")
    } finally {
      setIsSubmittingLead(false)
    }
  }

  const handleLeadGenSubmit = async (data: { name: string; phone: string; email: string; address: string; zipCode: string }) => {
    setIsSubmittingLead(true)
    try {
      // If we already have a contact ID, just save the design
      if (userData?.contactId) {
        await handleSaveDesign()
        return
      }

      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          message: `Address: ${data.address}, Zip: ${data.zipCode}`,
          source: 'AI Visualizer'
        })
      })

      if (response.ok) {
        setIsLeadGenModalOpen(false)
        alert("Thanks! Your design has been sent to our experts. We'll be in touch soon!")
      } else {
        throw new Error('Failed to submit')
      }
    } catch (e) {
      console.error(e)
      alert("There was an issue sending your data. Please try again.")
    } finally {
      setIsSubmittingLead(false)
    }
  }

  useEffect(() => {
    return () => {
      if (sceneImageUrl) URL.revokeObjectURL(sceneImageUrl)
      if (originalSceneImageUrl) URL.revokeObjectURL(originalSceneImageUrl)
    }
  }, [sceneImageUrl, originalSceneImageUrl])

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined
    if (isLoading) {
      setLoadingMessageIndex(0)
      interval = setInterval(() => {
        setLoadingMessageIndex(prevIndex => (prevIndex + 1) % loadingMessages.length)
      }, 3000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isLoading])

  const renderContent = () => {
    if (error) {
      return (
        <div className="text-center animate-fade-in bg-destructive/10 border border-destructive/30 p-8 rounded-lg max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-destructive">An Error Occurred</h2>
          <p className="text-lg text-destructive/80 mb-6">{error}</p>
          <button
            onClick={handleReset}
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground font-bold py-3 px-8 rounded-lg text-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      )
    }

    if (isFinalizedViewVisible && sceneImageUrl) {
      return <FinalResultScreen
        imageUrl={sceneImageUrl}
        enhancements={enhancementList}
        onStartOver={handleReset}
        onSaveDesign={userData?.contactId ? handleSaveDesign : undefined}
        isSaving={isSubmittingLead}
      />
    }

    // Lead gate - must provide info before using visualizer
    if (!userData) {
      return <LeadGate onSubmit={handleLeadGateSubmit} isSubmitting={isSubmittingGate} />
    }

    if (projectType === 'undecided') {
      return <ProjectTypeSelector onSelectProjectType={setProjectType} />
    }

    // --- INDOOR WORKFLOW ---
    if (projectType === 'indoor') {
      if (projectGoal === 'undecided') {
        return <ProjectStart onSelectGoal={setProjectGoal} />
      }

      if (!sceneImage) {
        if (projectGoal === 'remodel') {
          if (showUploader) {
            return (
              <div className="w-full max-w-4xl mx-auto animate-fade-in text-center flex flex-col items-center">
                <div className="text-center mb-10">
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground">Upload Your Space</h2>
                  <p className="mt-2 text-lg text-muted-foreground">Upload a photo of the room you want to renovate.</p>
                </div>
                <ImageUploader
                  id="scene-uploader"
                  onFileSelect={setSceneImage}
                  imageUrl={sceneImageUrl}
                />
                <button
                  onClick={() => setShowUploader(false)}
                  className="mt-6 text-sm text-primary hover:text-primary/80 font-semibold"
                >
                  ← Back to Stock Photos
                </button>
              </div>
            )
          }
          return (
            <StockPhotoSelector
              category="indoor"
              onSelect={setSceneImage}
              onUploadClick={() => setShowUploader(true)}
            />
          )
        }
        if (projectGoal === 'new-space') {
          return <SceneGenerator onGenerate={handleSceneGeneration} isLoading={isGeneratingScene} />
        }
      }

      // Indoor Control / Revision View
      return (
        <div className="w-full max-w-7xl mx-auto animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            <div className="md:col-span-1 flex flex-col">
              {indoorPhase === 'setup' ? (
                <IndoorControlPanel
                  onGenerate={handleIndoorDesignGenerate}
                  isGenerating={isLoading}
                />
              ) : (
                <RevisionPanel
                  revisionsRemaining={revisionsRemaining}
                  onApplyRevision={handleApplyRevision}
                  isProcessing={isLoading}
                  imageUrl={sceneImageUrl!}
                  isSelectionActive={!!revisionPoint}
                  onCancelSelection={() => setRevisionPoint(null)}
                  onUndo={handleUndo}
                  canUndo={history.length > 1 && !isLoading}
                  onNextStep={() => setIsLeadGenModalOpen(true)}
                />
              )}
            </div>
            <div className="md:col-span-2 flex flex-col">
              <h2 className="text-2xl font-bold text-center mb-5 text-foreground">
                {indoorPhase === 'setup' ? 'Your Canvas' : 'Design Results'}
              </h2>
              <div className="flex-grow flex items-center justify-center relative">
                <ImageUploader
                  ref={sceneImgRef}
                  id="scene-uploader"
                  onFileSelect={setSceneImage}
                  imageUrl={sceneImageUrl}
                  isDropZone={indoorPhase === 'result' && revisionsRemaining > 0 && !isLoading}
                  onProductDrop={handlePointSelection}
                  persistedOrbPosition={revisionPoint}
                  showDebugButton={!!debugImageUrl && !isLoading}
                  onDebugClick={() => setIsDebugModalOpen(true)}
                />
                {indoorPhase === 'result' && revisionsRemaining > 0 && !revisionPoint && !isLoading && (
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-background/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-border pointer-events-none z-10">
                    <p className="text-sm font-semibold text-foreground flex items-center">
                      <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse" />
                      Click anywhere to pin a revision note
                    </p>
                  </div>
                )}
              </div>
              <div className="text-center mt-4">
                <div className="h-5 flex items-center justify-center">
                  {sceneImage && !isLoading && indoorPhase === 'setup' && (
                    <button onClick={handleChangeScene} className="text-sm text-primary hover:text-primary/80 font-semibold">
                      Change Scene
                    </button>
                  )}
                </div>
              </div>
              <div className="text-center mt-6 min-h-[6rem] flex flex-col justify-center items-center">
                {isLoading ? (
                  <div className="animate-fade-in">
                    <Spinner />
                    <p className="text-xl mt-4 text-muted-foreground transition-opacity duration-500">{loadingMessages[loadingMessageIndex]}</p>
                  </div>
                ) : (
                  <p className="text-muted-foreground animate-fade-in">
                    {indoorPhase === 'setup'
                      ? 'Configure your style preferences on the left to begin.'
                      : revisionsRemaining > 0
                        ? 'Tap the image to add a specific revision request.'
                        : 'You have used all your revisions. Save or share your design!'
                    }
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )
    }

    // --- OUTDOOR WORKFLOW ---
    if (projectType === 'outdoor') {
      if (!originalSceneImage) {
        if (showUploader) {
          return (
            <div className="w-full max-w-4xl mx-auto animate-fade-in text-center flex flex-col items-center">
              <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">Upload Your Home&apos;s Exterior</h2>
                <p className="mt-2 text-lg text-muted-foreground">Upload a photo of your home to begin the renovation.</p>
              </div>
              <ImageUploader
                id="scene-uploader-outdoor"
                onFileSelect={handleOutdoorSceneUpload}
                imageUrl={null}
              />
              <button
                onClick={() => setShowUploader(false)}
                className="mt-6 text-sm text-primary hover:text-primary/80 font-semibold"
              >
                ← Back to Stock Photos
              </button>
            </div>
          )
        }
        return (
          <StockPhotoSelector
            category="outdoor"
            onSelect={handleOutdoorSceneUpload}
            onUploadClick={() => setShowUploader(true)}
          />
        )
      }
      if (isCleaningScene) {
        return (
          <div className="text-center">
            <Spinner />
            <p className="text-xl mt-4 text-muted-foreground">Preparing your canvas...</p>
            <p className="text-md mt-2 text-muted-foreground/70">Removing landscaping & clutter for a clean slate.</p>
          </div>
        )
      }

      return (
        <div className="w-full max-w-7xl mx-auto animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            <div className="md:col-span-1 flex flex-col">
              <OutdoorRenovationPanel
                onApplyRenovation={handleApplyOutdoorRenovation}
                isGenerating={isLoading}
              />
            </div>
            <div className="md:col-span-2 flex flex-col">
              <h2 className="text-2xl font-bold text-center mb-5 text-foreground">Your Renovation Canvas</h2>
              <div className="flex-grow flex items-center justify-center">
                <ImageUploader
                  ref={sceneImgRef}
                  id="scene-uploader-outdoor-canvas"
                  onFileSelect={() => {}}
                  imageUrl={sceneImageUrl}
                />
              </div>
              <div className="text-center mt-4">
                <div className="h-5 flex items-center justify-center">
                  {sceneImage && !isLoading && !isFinalizing && !isAnalyzingEnhancements && (
                    <button onClick={handleChangeScene} className="text-sm text-primary hover:text-primary/80 font-semibold">
                      Start Over
                    </button>
                  )}
                </div>
              </div>
              <div className="text-center mt-6 min-h-[6rem] flex flex-col justify-center items-center">
                {isLoading ? (
                  <div className="animate-fade-in">
                    <Spinner />
                    <p className="text-xl mt-4 text-muted-foreground">Applying your renovation...</p>
                  </div>
                ) : isFinalizing || isAnalyzingEnhancements ? (
                  <div className="animate-fade-in">
                    <Spinner />
                    <p className="text-xl mt-4 text-muted-foreground">Finalizing your scene...</p>
                    <p className="text-md mt-2 text-muted-foreground/70">
                      {isAnalyzingEnhancements ? "Analyzing professional enhancements..." : "Adding back landscaping with a professional touch."}
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={handleFinalizeScene}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105 shadow-lg"
                  >
                    Finalize Scene
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )
    }

    return null
  }

  return (
    <>
      {renderContent()}
      <DebugModal
        isOpen={isDebugModalOpen}
        onClose={() => setIsDebugModalOpen(false)}
        imageUrl={debugImageUrl}
        prompt={debugPrompt}
      />
      <LeadGenModal
        isOpen={isLeadGenModalOpen}
        onClose={() => setIsLeadGenModalOpen(false)}
        onSubmit={handleLeadGenSubmit}
        isSubmitting={isSubmittingLead}
      />
    </>
  )
}
