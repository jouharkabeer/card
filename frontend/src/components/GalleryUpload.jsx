import { useState, useEffect } from 'react'
import { FaTrash, FaPlus, FaImage } from 'react-icons/fa'
import { toast } from 'react-toastify'

const GalleryUpload = ({ value = [], onChange, maxImages = 3 }) => {
  // value contains URLs (from backend) - we'll track these + new File objects
  const [existingUrls, setExistingUrls] = useState([])  // URLs from backend
  const [newFiles, setNewFiles] = useState([])  // New File objects to upload

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    
    const totalImages = existingUrls.length + newFiles.length
    if (totalImages + files.length > maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`)
      e.target.value = ''
      return
    }

    const validFiles = files.filter((file) => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`)
        return false
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error(`${file.name} is too large (max 10MB)`)
        return false
      }
      return true
    })

    if (validFiles.length === 0) {
      e.target.value = ''
      return
    }

    // Add new File objects
    const updatedFiles = [...newFiles, ...validFiles]
    setNewFiles(updatedFiles)
    
    // Pass both existing URLs and new File objects to parent
    onChange([...existingUrls, ...updatedFiles])
    
    // Reset input
    e.target.value = ''
  }

  const removeImage = (index) => {
    if (index < existingUrls.length) {
      // Removing an existing URL (from backend)
      const updatedUrls = existingUrls.filter((_, i) => i !== index)
      setExistingUrls(updatedUrls)
      onChange([...updatedUrls, ...newFiles])
    } else {
      // Removing a new file - revoke blob URL first
      const fileIndex = index - existingUrls.length
      if (newFiles[fileIndex]) {
        const url = URL.createObjectURL(newFiles[fileIndex])
        URL.revokeObjectURL(url)
      }
      const updatedFiles = newFiles.filter((_, i) => i !== fileIndex)
      setNewFiles(updatedFiles)
      onChange([...existingUrls, ...updatedFiles])
    }
    toast.success('Image removed')
  }

  // Sync with external value changes using useEffect
  useEffect(() => {
    if (value && Array.isArray(value)) {
      // Separate URLs (existing images from backend) from File objects (new uploads)
      const urls = value.filter(item => typeof item === 'string')
      const fileObjects = value.filter(item => item instanceof File)
      
      setExistingUrls(urls)
      setNewFiles(fileObjects)
    } else {
      setExistingUrls([])
      setNewFiles([])
    }
  }, [value])
  
  // Get all preview URLs for display
  const getAllPreviews = () => {
    const urlPreviews = existingUrls
    const filePreviews = newFiles.map(file => URL.createObjectURL(file))
    return [...urlPreviews, ...filePreviews]
  }
  
  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      newFiles.forEach(file => {
        // Revoke any blob URLs created for preview
        const url = URL.createObjectURL(file)
        URL.revokeObjectURL(url)
      })
    }
  }, [newFiles])
  
  const previews = getAllPreviews()

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Gallery (Max {maxImages} images)
      </label>
      <div className="grid grid-cols-3 gap-4">
        {previews.map((preview, index) => (
          <div key={index} className="relative group">
            <img
              src={preview}
              alt={`Gallery ${index + 1}`}
              className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
            >
              <FaTrash size={12} />
            </button>
          </div>
        ))}
        {previews.length < maxImages && (
          <label className="flex items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#41287b] transition">
            <div className="text-center">
              <FaPlus className="mx-auto mb-1 text-gray-400" />
              <span className="text-xs text-gray-500">Add Image</span>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        )}
      </div>
      {previews.length === 0 && (
        <div className="mt-4 text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
          <FaImage className="mx-auto mb-2 text-gray-400" size={32} />
          <p className="text-sm text-gray-500">No images in gallery</p>
          <label className="mt-2 inline-block px-4 py-2 bg-[#41287b] text-white rounded-md cursor-pointer hover:bg-[#41287b]/90">
            Add Images
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>
      )}
    </div>
  )
}

export default GalleryUpload

