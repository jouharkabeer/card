import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { profileAPI } from '../services/api'
import { getCurrentUser } from '../utils/auth'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ProfileCard from '../components/ProfileCard'
import ImageUpload from '../components/ImageUpload'
import LinkManager from '../components/LinkManager'
import GalleryUpload from '../components/GalleryUpload'
import TemplateSelector from '../components/TemplateSelector'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'

const DashboardPage = () => {
  const navigate = useNavigate()
  const user = getCurrentUser()
  const [profile, setProfile] = useState(null)
  const [formData, setFormData] = useState({
    profile_image: null,
    name: '',
    designation: '',
    email: '',
    phone: '',
    whatsapp: '',
    instagram: '',
    linkedin: '',
    youtube: '',
    website: '',
    others: {},
    about: '',
    template: 'template1',
    gallery: [],
  })
  const previewRef = useRef(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        const data = await profileAPI.getMyProfile()
        setProfile(data)
        setFormData({
          profile_image: data.profile_image_url || null,
          name: data.name || '',
          designation: data.designation || '',
          email: data.email || '',
          phone: data.phone || '',
          whatsapp: data.whatsapp || '',
          instagram: data.instagram || '',
          linkedin: data.linkedin || '',
          youtube: data.youtube || '',
          website: data.website || '',
          others: data.others || {},
          about: data.about || '',
          template: data.template || 'template1',
          gallery: data.gallery_urls || [],
        })
      } catch (err) {
        setError('Failed to load profile')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError('')
    setSuccess('')
  }

  const handleImageChange = (file) => {
    setFormData({
      ...formData,
      profile_image: file,
    })
  }

  const handleOthersChange = (others) => {
    console.log('handleOthersChange called with:', others)
    setFormData((prev) => {
      const updated = {
        ...prev,
        others: others || {},
      }
      console.log('Updated formData.others:', updated.others)
      return updated
    })
  }

  const handleTemplateChange = (template) => {
    setFormData({
      ...formData,
      template,
    })
    toast.success('Template updated! Preview will update after saving.')
  }

  const handleGalleryChange = (galleryFiles) => {
    // galleryFiles should be an array of File objects
    setFormData((prev) => ({
      ...prev,
      gallery: Array.isArray(galleryFiles) ? galleryFiles : [],
    }))
  }

  const handleSaveAsPDF = async () => {
    if (!previewRef.current) {
      toast.error('Preview not available')
      return
    }

    try {
      toast.info('Generating PDF...')
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      
      // Calculate dimensions for card-based design (centered, with margins)
      const margin = 20
      const maxWidth = pdfWidth - (margin * 2)
      const maxHeight = pdfHeight - (margin * 2)
      
      const imgWidth = canvas.width
      const imgHeight = canvas.height
      const ratio = Math.min(maxWidth / imgWidth, maxHeight / imgHeight)
      
      const imgFinalWidth = imgWidth * ratio
      const imgFinalHeight = imgHeight * ratio
      
      // Center the card on the page
      const xOffset = (pdfWidth - imgFinalWidth) / 2
      const yOffset = (pdfHeight - imgFinalHeight) / 2
      
      // Add subtle border effect by drawing a rectangle
      pdf.setDrawColor(200, 200, 200)
      pdf.setFillColor(255, 255, 255)
      // Use rect if roundedRect is not available
      if (typeof pdf.roundedRect === 'function') {
        pdf.roundedRect(
          xOffset - 2,
          yOffset - 2,
          imgFinalWidth + 4,
          imgFinalHeight + 4,
          3,
          3,
          'FD'
        )
      } else {
        pdf.rect(xOffset - 2, yOffset - 2, imgFinalWidth + 4, imgFinalHeight + 4, 'FD')
      }
      
      // Add the card image
      pdf.addImage(imgData, 'PNG', xOffset, yOffset, imgFinalWidth, imgFinalHeight)
      
      const fileName = `${formData.name || 'profile'}-card.pdf`
      pdf.save(fileName)
      toast.success('PDF card downloaded successfully!')
    } catch (err) {
      console.error('PDF generation error:', err)
      toast.error('Failed to generate PDF')
    }
  }

  const handleShareDetails = () => {
    const profileText = `
${formData.name || 'Profile'}
${formData.designation ? `Designation: ${formData.designation}` : ''}

${formData.about || ''}

Contact Information:
${formData.email ? `Email: ${formData.email}` : ''}
${formData.phone ? `Phone: ${formData.phone}` : ''}
${formData.whatsapp ? `WhatsApp: ${formData.whatsapp}` : ''}

Social Links:
${formData.instagram ? `Instagram: ${formData.instagram}` : ''}
${formData.linkedin ? `LinkedIn: ${formData.linkedin}` : ''}
${formData.youtube ? `YouTube: ${formData.youtube}` : ''}
${formData.website ? `Website: ${formData.website}` : ''}
${Object.entries(formData.others || {}).map(([label, url]) => `${label}: ${url}`).join('\n')}

Profile URL: ${window.location.origin}/${user?.username}
    `.trim()

    if (navigator.share) {
      navigator.share({
        title: `${formData.name || 'Profile'} - Business Card`,
        text: profileText,
        url: `${window.location.origin}/${user?.username}`,
      }).then(() => {
        toast.success('Shared successfully!')
      }).catch((err) => {
        console.error('Share error:', err)
        copyToClipboard(profileText)
      })
    } else {
      copyToClipboard(profileText)
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Profile details copied to clipboard!')
    }).catch(() => {
      toast.error('Failed to copy to clipboard')
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSaving(true)

    try {
      // Clean up formData before sending
      const cleanedData = { ...formData }
      
      // Ensure others is a valid object
      if (!cleanedData.others || typeof cleanedData.others !== 'object') {
        cleanedData.others = {}
      }
      
      // Filter out empty string values from others
      const filteredOthers = {}
      Object.entries(cleanedData.others).forEach(([key, value]) => {
        if (key && key.trim() && value && value.trim()) {
          filteredOthers[key.trim()] = value.trim()
        }
      })
      cleanedData.others = filteredOthers

      console.log('Submitting with others:', cleanedData.others)
      console.log('FormData.others before submit:', formData.others)

      const updatedProfile = await profileAPI.updateProfile(cleanedData)
      setProfile(updatedProfile)
      toast.success('Profile updated successfully!')
      
      // Update formData with the response, especially others and gallery
      setFormData({
        ...formData,
        profile_image: updatedProfile.profile_image_url || formData.profile_image,
        others: updatedProfile.others || {},
        gallery: updatedProfile.gallery_urls || [],
        template: updatedProfile.template || formData.template,
      })
    } catch (err) {
      console.error('Update error:', err.response?.data)
      const errorMessage = 
        err.response?.data?.error || 
        err.response?.data?.detail || 
        (err.response?.data?.others && (Array.isArray(err.response.data.others) ? err.response.data.others[0] : err.response.data.others)) ||
        (typeof err.response?.data === 'object' && Object.values(err.response.data)[0]) ||
        'Failed to update profile'
      
      toast.error(errorMessage)
      setError(errorMessage)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Edit Form */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Edit Profile</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <ErrorMessage message={error} onClose={() => setError('')} />
                {success && (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                    {success}
                  </div>
                )}

                <ImageUpload
                  value={formData.profile_image}
                  onChange={handleImageChange}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Designation
                  </label>
                  <input
                    type="text"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    About
                  </label>
                  <textarea
                    name="about"
                    rows={5}
                    value={formData.about}
                    onChange={handleChange}
                    placeholder="Tell people about yourself..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 resize-vertical"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    WhatsApp
                  </label>
                  <input
                    type="tel"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    placeholder="+1234567890"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instagram URL
                  </label>
                  <input
                    type="url"
                    name="instagram"
                    value={formData.instagram}
                    onChange={handleChange}
                    placeholder="https://instagram.com/username"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    YouTube URL
                  </label>
                  <input
                    type="url"
                    name="youtube"
                    value={formData.youtube}
                    onChange={handleChange}
                    placeholder="https://youtube.com/@username"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website URL
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://yourwebsite.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  />
                </div>

                <LinkManager
                  value={formData.others}
                  onChange={handleOthersChange}
                />

                <TemplateSelector
                  value={formData.template}
                  onChange={handleTemplateChange}
                />

                <GalleryUpload
                  value={formData.gallery}
                  onChange={handleGalleryChange}
                  maxImages={3}
                />

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-[#41287b] text-white py-2 px-4 rounded-md hover:bg-[#41287b]/90 focus:outline-none focus:ring-2 focus:ring-[#41287b] disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </form>

              {/* Action Buttons */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={handleSaveAsPDF}
                  className="bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 font-semibold flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Save Details (PDF)
                </button>
                <button
                  type="button"
                  onClick={handleShareDetails}
                  className="bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Share Details
                </button>
              </div>
            </div>

            {/* Preview */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Preview</h2>
              <div className="sticky top-8" ref={previewRef}>
                {/* Show preview with merged formData and profile */}
                <ProfileCard 
                  profile={{
                    ...profile,
                    name: formData.name || profile?.name,
                    designation: formData.designation || profile?.designation,
                    email: formData.email || profile?.email,
                    phone: formData.phone || profile?.phone,
                    whatsapp: formData.whatsapp || profile?.whatsapp,
                    instagram: formData.instagram || profile?.instagram,
                    linkedin: formData.linkedin || profile?.linkedin,
                    youtube: formData.youtube || profile?.youtube,
                    website: formData.website || profile?.website,
                    about: formData.about || profile?.about,
                    others: formData.others || profile?.others || {},
                    template: formData.template || profile?.template || 'template1',
                    gallery: formData.gallery || profile?.gallery_urls || profile?.gallery || [],
                    gallery_urls: formData.gallery || profile?.gallery_urls || profile?.gallery || [],
                    profile_image_url: formData.profile_image instanceof File 
                      ? URL.createObjectURL(formData.profile_image)
                      : formData.profile_image || profile?.profile_image_url,
                  }} 
                />
                {/* Debug info - remove in production */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="mt-4 p-2 bg-gray-100 rounded text-xs">
                    <strong>Debug - formData.others:</strong> {JSON.stringify(formData.others)}
                  </div>
                )}
                {user && (
                  <div className="mt-6 text-center">
                    <a
                      href={`/${user.username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#41287b] hover:text-[#41287b]/80 underline"
                    >
                      View Public Profile →
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default DashboardPage

