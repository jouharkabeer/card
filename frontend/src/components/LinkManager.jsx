import React, { useState, useEffect, useRef } from 'react'
import { toast } from 'react-toastify'
import { FaTrash, FaPlus } from 'react-icons/fa'

const LinkManager = ({ value = {}, onChange }) => {
  const [links, setLinks] = useState(() => {
    return Object.entries(value || {})
  })
  const [newLabel, setNewLabel] = useState('')
  const [newUrl, setNewUrl] = useState('')

  // Sync links state with value prop when it changes, but avoid resetting during user edits
  const prevValueRef = useRef(value)
  useEffect(() => {
    // Only sync if value changed externally (not from our own onChange)
    const valueStr = JSON.stringify(value || {})
    const prevValueStr = JSON.stringify(prevValueRef.current || {})
    
    if (valueStr !== prevValueStr) {
      console.log('LinkManager: Value prop changed externally, syncing:', value)
      const entries = Object.entries(value || {})
      setLinks(entries)
      prevValueRef.current = value
    }
  }, [value])

  const addLink = () => {
    if (!newLabel.trim() || !newUrl.trim()) {
      toast.error('Please enter both label and URL')
      return
    }
    
    // Validate URL format
    let urlToAdd = newUrl.trim()
    // Add https:// if protocol is missing
    if (!urlToAdd.match(/^https?:\/\//i)) {
      urlToAdd = `https://${urlToAdd}`
    }
    
    try {
      new URL(urlToAdd)
    } catch {
      toast.error('Please enter a valid URL (e.g., https://example.com or github.com/username)')
      return
    }
    
    // Check if label already exists
    if (links.some(([label]) => label.trim().toLowerCase() === newLabel.trim().toLowerCase())) {
      toast.error('A link with this label already exists')
      return
    }
    
    const updatedLinks = [...links, [newLabel.trim(), urlToAdd]]
    setLinks(updatedLinks)
    const linksObj = Object.fromEntries(updatedLinks)
    console.log('LinkManager: Adding link, calling onChange with:', linksObj)
    onChange(linksObj)
    toast.success('Link added successfully!')
    setNewLabel('')
    setNewUrl('')
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addLink()
    }
  }

  const removeLink = (index) => {
    const updatedLinks = links.filter((_, i) => i !== index)
    setLinks(updatedLinks)
    const linksObj = Object.fromEntries(updatedLinks)
    console.log('LinkManager: Removing link, calling onChange with:', linksObj)
    onChange(linksObj)
  }

  const updateLink = (index, field, newValue) => {
    const updatedLinks = [...links]
    if (field === 'label') {
      updatedLinks[index] = [newValue, updatedLinks[index][1]]
    } else {
      // For URL field, validate and add https:// if needed
      let urlToSet = newValue.trim()
      if (urlToSet && !urlToSet.match(/^https?:\/\//i)) {
        urlToSet = `https://${urlToSet}`
      }
      updatedLinks[index] = [updatedLinks[index][0], urlToSet]
    }
    
    // Filter out entries with empty labels or URLs, but keep valid ones
    const validLinks = updatedLinks.filter(([label, url]) => label.trim() && url.trim())
    const linksObj = Object.fromEntries(validLinks)
    console.log('LinkManager: Updating link, calling onChange with:', linksObj)
    setLinks(validLinks)
    onChange(linksObj)
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Additional Links
      </label>
      <div className="space-y-3">
        {links.map(([label, url], index) => (
          <div key={index} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:space-x-2">
            <input
              type="text"
              placeholder="Label"
              value={label}
              onChange={(e) => updateLink(index, 'label', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#41287b] focus:border-[#41287b] text-sm sm:text-base"
            />
            <input
              type="url"
              placeholder="URL"
              value={url}
              onChange={(e) => updateLink(index, 'url', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#41287b] focus:border-[#41287b] text-sm sm:text-base"
            />
            <button
              type="button"
              onClick={() => removeLink(index)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-md flex-shrink-0"
              aria-label="Remove link"
            >
              <FaTrash />
            </button>
          </div>
        ))}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:space-x-2">
          <input
            type="text"
            placeholder="New label"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#41287b] focus:border-[#41287b] text-sm sm:text-base"
          />
          <input
            type="url"
            placeholder="New URL"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#41287b] focus:border-[#41287b] text-sm sm:text-base"
          />
          <button
            type="button"
            onClick={addLink}
            className="p-2 bg-[#41287b] text-white rounded-md hover:bg-[#41287b]/90 flex-shrink-0 flex items-center justify-center"
            aria-label="Add link"
          >
            <FaPlus />
          </button>
        </div>
      </div>
    </div>
  )
}

export default LinkManager

