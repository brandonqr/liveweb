import { useState } from 'react'

/**
 * Custom hook to consolidate all application state
 * Separates state management from component logic
 * 
 * @returns {Object} Consolidated app state and setters
 */
export const useAppState = () => {
  // Code and page state
  const [code, setCode] = useState('<!-- Di algo para empezar -->')
  const [pageId, setPageId] = useState(null)
  const [checkpointId, setCheckpointId] = useState(null)
  
  // Checkpoints state
  const [checkpoints, setCheckpoints] = useState([])
  const [checkpointsPanelOpen, setCheckpointsPanelOpen] = useState(false)
  
  // Templates state
  const [templates, setTemplates] = useState([])
  const [templatesPanelOpen, setTemplatesPanelOpen] = useState(false)
  
  // Selection state
  const [selectionMode, setSelectionMode] = useState(false)
  const [selectedComponent, setSelectedComponent] = useState(null)
  
  // API Keys state
  const [detectedAPIs, setDetectedAPIs] = useState([])
  const [apiKeysPanelOpen, setApiKeysPanelOpen] = useState(false)
  const [apiKeysPanelDismissed, setApiKeysPanelDismissed] = useState(false)
  
  // Generation state
  const [isGenerating, setIsGenerating] = useState(false)

  return {
    // Code and page
    code,
    setCode,
    pageId,
    setPageId,
    checkpointId,
    setCheckpointId,
    
    // Checkpoints
    checkpoints,
    setCheckpoints,
    checkpointsPanelOpen,
    setCheckpointsPanelOpen,
    
    // Templates
    templates,
    setTemplates,
    templatesPanelOpen,
    setTemplatesPanelOpen,
    
    // Selection
    selectionMode,
    setSelectionMode,
    selectedComponent,
    setSelectedComponent,
    
    // API Keys
    detectedAPIs,
    setDetectedAPIs,
    apiKeysPanelOpen,
    setApiKeysPanelOpen,
    apiKeysPanelDismissed,
    setApiKeysPanelDismissed,
    
    // Generation
    isGenerating,
    setIsGenerating
  }
}
