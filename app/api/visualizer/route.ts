import { NextRequest, NextResponse } from 'next/server'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY

// Retry helper with exponential backoff for rate limits
async function fetchWithRetry(
  url: string,
  options: RequestInit,
  maxRetries: number = 3
): Promise<Response> {
  let lastError: Error | null = null

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const response = await fetch(url, options)

    if (response.ok) {
      return response
    }

    // If rate limited (429), wait and retry
    if (response.status === 429 && attempt < maxRetries - 1) {
      const waitTime = Math.pow(2, attempt) * 1000 + Math.random() * 1000 // 1s, 2s, 4s + jitter
      console.log(`Rate limited, waiting ${Math.round(waitTime)}ms before retry ${attempt + 1}/${maxRetries}`)
      await new Promise(resolve => setTimeout(resolve, waitTime))
      continue
    }

    // For other errors, throw immediately
    const errorText = await response.text()
    lastError = new Error(`Gemini API error: ${response.status} - ${errorText}`)

    if (response.status !== 429) {
      throw lastError
    }
  }

  throw lastError || new Error('Max retries exceeded')
}

// Helper to call Gemini API
async function callGeminiGenerateContent(model: string, parts: unknown[]) {
  const response = await fetchWithRetry(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts }],
        generationConfig: {
          responseModalities: ['TEXT', 'IMAGE'],
        },
      }),
    }
  )

  return response.json()
}

// Helper to call Imagen API
async function callImagenGenerate(prompt: string, aspectRatio: string = '16:9') {
  const response = await fetchWithRetry(
    `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:generateImages?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio,
      }),
    }
  )

  return response.json()
}

// Helper to analyze enhancements using Gemini text model
async function analyzeEnhancements(imageBase64: string, mimeType: string) {
  const prompt = `
You are a real estate marketing expert analyzing a professionally shot photo of a home. Your task is to identify and list the specific, visually appealing enhancements that make this photo look high-quality and attractive.

Based on the provided image, list 5 to 8 professional enhancements.
Focus on elements like lighting, color, composition, and realism.
Use compelling, descriptive language suitable for a client presentation.

Return your response as a JSON object with an "enhancements" array containing string descriptions.
Example: {"enhancements": ["Warm golden hour lighting", "Enhanced landscape vibrancy"]}
`

  const response = await fetchWithRetry(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            { inlineData: { mimeType, data: imageBase64 } }
          ]
        }],
        generationConfig: {
          responseMimeType: 'application/json',
        },
      }),
    }
  )

  const data = await response.json()
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text

  try {
    const parsed = JSON.parse(text)
    return parsed.enhancements || []
  } catch {
    return [
      "Photorealistic lighting and shadows",
      "Enhanced curb appeal and landscaping",
      "Professionally balanced color grading",
      "Architectural details brought to life",
      "A stunning, magazine-quality finish",
    ]
  }
}

export async function POST(request: NextRequest) {
  if (!GEMINI_API_KEY) {
    return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 })
  }

  try {
    const body = await request.json()
    const { action, ...params } = body

    switch (action) {
      case 'generateScene': {
        // Generate a scene from text prompt using Imagen
        const { prompt } = params
        const fullPrompt = `A photorealistic, high-resolution image of ${prompt}. The image should be suitable as a background for interior design. Ensure the lighting is natural and the perspective is straight-on, like a professional architectural photograph.`

        const response = await callImagenGenerate(fullPrompt)
        const imageBytes = response.generatedImages?.[0]?.image?.imageBytes

        if (!imageBytes) {
          throw new Error('No image generated')
        }

        return NextResponse.json({
          imageBase64: imageBytes,
          mimeType: 'image/jpeg'
        })
      }

      case 'generateIndoorDesign': {
        // Generate indoor design using Gemini flash-image
        const { sceneImageBase64, sceneMimeType, style, description, refImageBase64, refMimeType, refType } = params

        let promptText = `
**Role:** You are an expert interior designer.
**Task:** Renovate the provided room image based on the user's requirements.
**Style:** ${style}
**Instruction:** ${description}
`

        if (refImageBase64 && refType) {
          if (refType === 'inspiration') {
            promptText += `\n**Reference Image:** Use the second attached image as stylistic INSPIRATION. Capture its vibe, colors, and textures, but apply them to the geometry of the first image (the room).`
          } else {
            promptText += `\n**Reference Image:** Use the second attached image as a STRUCTURAL reference. Attempt to build or incorporate the objects/structure seen in the reference image into the room.`
          }
        }

        promptText += `\n**Output:** A single, high-quality, photorealistic image of the renovated room. Maintain the original perspective and lighting.`

        const parts: unknown[] = [
          { inlineData: { mimeType: sceneMimeType, data: sceneImageBase64 } }
        ]

        if (refImageBase64) {
          parts.push({ inlineData: { mimeType: refMimeType, data: refImageBase64 } })
        }

        parts.push({ text: promptText })

        const response = await callGeminiGenerateContent('gemini-2.5-flash-image-preview', parts)

        const imagePart = response.candidates?.[0]?.content?.parts?.find(
          (part: { inlineData?: { mimeType: string; data: string } }) => part.inlineData
        )

        if (!imagePart?.inlineData) {
          throw new Error('No image in response')
        }

        return NextResponse.json({
          imageBase64: imagePart.inlineData.data,
          mimeType: imagePart.inlineData.mimeType,
          prompt: promptText
        })
      }

      case 'applyRevision': {
        // Apply revision to image
        const { imageBase64, mimeType, instruction } = params

        const promptText = `
**Role:** Expert Image Editor.
**Task:** Edit the provided image based on the specific instruction.
**Location:** The area to change is indicated by a RED DOT in the image. Focus your changes on that specific area and its immediate surroundings.
**Instruction:** ${instruction}
**Requirement:** Remove the red dot in the final output. The result must be photorealistic and seamlessly integrated with the rest of the image.
`

        const response = await callGeminiGenerateContent('gemini-2.5-flash-image-preview', [
          { inlineData: { mimeType, data: imageBase64 } },
          { text: promptText }
        ])

        const imagePart = response.candidates?.[0]?.content?.parts?.find(
          (part: { inlineData?: { mimeType: string; data: string } }) => part.inlineData
        )

        if (!imagePart?.inlineData) {
          throw new Error('No image in response')
        }

        return NextResponse.json({
          imageBase64: imagePart.inlineData.data,
          mimeType: imagePart.inlineData.mimeType,
          prompt: promptText
        })
      }

      case 'cleanOutdoorScene': {
        // Clean outdoor scene for renovation
        const { imageBase64, mimeType } = params

        const prompt = `
You are a real estate photo preparation expert. Your task is to prepare a photo of a house for a renovation mockup.
Based on the provided image:
1.  **Remove all landscaping** (trees, bushes, flowers) that obstructs the view of the house structure.
2.  **Remove all yard clutter**, objects on the porch/deck, and any cars in the driveway.
3.  **Intelligently inpaint** the areas where objects were removed to show a continuous, natural-looking house facade and ground (e.g., grass, pavement).
Your goal is to produce a clean, unobstructed view of the entire house structure against a simple background. The output must be ONLY the modified photorealistic image.
`

        const response = await callGeminiGenerateContent('gemini-2.5-flash-image-preview', [
          { inlineData: { mimeType, data: imageBase64 } },
          { text: prompt }
        ])

        const imagePart = response.candidates?.[0]?.content?.parts?.find(
          (part: { inlineData?: { mimeType: string; data: string } }) => part.inlineData
        )

        if (!imagePart?.inlineData) {
          throw new Error('No image in response')
        }

        return NextResponse.json({
          imageBase64: imagePart.inlineData.data,
          mimeType: imagePart.inlineData.mimeType
        })
      }

      case 'applyOutdoorRenovation': {
        // Apply renovation to outdoor scene
        const { imageBase64, mimeType, renovationPrompt } = params

        const prompt = `
You are an expert architectural visualizer. Your task is to generate a photorealistic image showing a home renovation based on the user's request.
**Scene to Renovate:** The provided image of a house.
**User's Request:** "${renovationPrompt}"
**Instructions:**
-   Modify the house in the image to precisely match the user's request.
-   Ensure the changes are seamlessly integrated, maintaining the original house's perspective, scale, and lighting.
-   The output must be ONLY the new, photorealistic image of the renovated house.
`

        const response = await callGeminiGenerateContent('gemini-2.5-flash-image-preview', [
          { inlineData: { mimeType, data: imageBase64 } },
          { text: prompt }
        ])

        const imagePart = response.candidates?.[0]?.content?.parts?.find(
          (part: { inlineData?: { mimeType: string; data: string } }) => part.inlineData
        )

        if (!imagePart?.inlineData) {
          throw new Error('No image in response')
        }

        return NextResponse.json({
          imageBase64: imagePart.inlineData.data,
          mimeType: imagePart.inlineData.mimeType
        })
      }

      case 'finalizeOutdoorScene': {
        // Finalize outdoor scene by blending renovated with original
        const { renovatedBase64, renovatedMimeType, originalBase64, originalMimeType } = params

        const prompt = `
You are a master architectural photographer and digital artist. You are given two images:
1.  **Image 1 (Renovated House):** This shows the new architectural design.
2.  **Image 2 (Original Photo):** This shows the original house in its natural environment.

**Your Task:** Create a single, final, stunning image that looks like a magazine cover.
1.  **Combine:** Take the architectural updates from the 'Renovated House' (siding, windows, deck, etc.) and seamlessly blend them into the 'Original Photo'.
2.  **Restore Landscaping:** Re-introduce the beautiful, original landscaping (trees, bushes) and context from the 'Original Photo'. If cars were in the original, you can add them back if it improves the composition.
3.  **Enhance and Beautify:** Elevate the final image with professional touches. Adjust the lighting to be warm and inviting (like a 'golden hour' sunset). Add realistic shadows and highlights. Improve the overall curb appeal.

The output must be ONLY the final, beautified, photorealistic image.
`

        const response = await callGeminiGenerateContent('gemini-2.5-flash-image-preview', [
          { inlineData: { mimeType: renovatedMimeType, data: renovatedBase64 } },
          { inlineData: { mimeType: originalMimeType, data: originalBase64 } },
          { text: prompt }
        ])

        const imagePart = response.candidates?.[0]?.content?.parts?.find(
          (part: { inlineData?: { mimeType: string; data: string } }) => part.inlineData
        )

        if (!imagePart?.inlineData) {
          throw new Error('No image in response')
        }

        return NextResponse.json({
          imageBase64: imagePart.inlineData.data,
          mimeType: imagePart.inlineData.mimeType
        })
      }

      case 'analyzeEnhancements': {
        const { imageBase64, mimeType } = params
        const enhancements = await analyzeEnhancements(imageBase64, mimeType)
        return NextResponse.json({ enhancements })
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Visualizer API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An error occurred' },
      { status: 500 }
    )
  }
}
