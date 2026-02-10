'use client'

import { useEffect } from 'react'

interface CRMChatWidgetProps {
  widgetId?: string
}

export function CRMChatWidget({ widgetId }: CRMChatWidgetProps) {
  useEffect(() => {
    // Use the provided widgetId or fallback to env variable
    const chatWidgetId = widgetId || process.env.NEXT_PUBLIC_CRM_CHAT_WIDGET_ID

    if (!chatWidgetId) {
      return
    }

    // Check if script already exists
    const existingScript = document.querySelector(`script[src*="widgets.leadconnectorhq.com"]`)
    if (existingScript) {
      return
    }

    // Create and inject the CRM chat widget script
    const script = document.createElement('script')
    script.src = 'https://widgets.leadconnectorhq.com/loader.js'
    script.setAttribute('data-resources-url', 'https://widgets.leadconnectorhq.com/chat-widget/loader.js')
    script.setAttribute('data-widget-id', chatWidgetId)
    script.async = true

    document.body.appendChild(script)

    return () => {
      // Cleanup on unmount
      const scriptToRemove = document.querySelector(`script[data-widget-id="${chatWidgetId}"]`)
      if (scriptToRemove) {
        document.body.removeChild(scriptToRemove)
      }
    }
  }, [widgetId])

  return null
}
