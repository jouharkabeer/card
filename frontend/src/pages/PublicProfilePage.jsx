import { useEffect, useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { profileAPI, authAPI } from '../services/api'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import BusinessCard from '../components/templates/BusinessCard'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { toast } from 'react-toastify'
import { FaEnvelope, FaPhone, FaWhatsapp } from 'react-icons/fa'

const PublicProfilePage = () => {
  const { username } = useParams()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const cardRef = useRef(null)  // Ref for the card portion only
  const profileRef = useRef(null)  // Keep for full details if needed

  useEffect(() => {
    setIsLoggedIn(authAPI.isAuthenticated())
  }, [])

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        const data = await profileAPI.getProfile(username)
        setProfile(data)
      } catch (err) {
        setError(
          err.response?.data?.error || 'Profile not found'
        )
      } finally {
        setLoading(false)
      }
    }

    if (username) {
      fetchProfile()
    }
  }, [username])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-grow flex items-center justify-center py-12 px-4">
          <div className="max-w-md w-full">
            <ErrorMessage message={error} />
            <p className="text-center text-gray-600 mt-4">
              The profile you're looking for doesn't exist.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const handleSaveAsPDF = async () => {
    if (!cardRef.current) return
    
    try {
      toast.info('Generating PDF card...')
      // Get background color for canvas (check if gradient)
      const bgColor = profile?.background_color || '#E6E0F2'
      const canvasBg = bgColor.includes('gradient') ? '#E6E0F2' : bgColor
      
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: canvasBg,
        logging: false,
      })
      
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = canvas.width
      const imgHeight = canvas.height
      const ratio = Math.min((pdfWidth - 40) / imgWidth, (pdfHeight - 40) / imgHeight)
      const imgFinalWidth = imgWidth * ratio
      const imgFinalHeight = imgHeight * ratio
      
      // Center the card on the page
      const xOffset = (pdfWidth - imgFinalWidth) / 2
      const yOffset = (pdfHeight - imgFinalHeight) / 2
      
      // Add subtle border effect
      pdf.setDrawColor(200, 200, 200)
      pdf.setFillColor(255, 255, 255)
      if (typeof pdf.roundedRect === 'function') {
        pdf.roundedRect(xOffset - 2, yOffset - 2, imgFinalWidth + 4, imgFinalHeight + 4, 3, 3, 'FD')
      } else {
        pdf.rect(xOffset - 2, yOffset - 2, imgFinalWidth + 4, imgFinalHeight + 4, 'FD')
      }
      
      pdf.addImage(imgData, 'PNG', xOffset, yOffset, imgFinalWidth, imgFinalHeight)
      pdf.save(`${profile?.name || profile?.username || 'profile'}-card.pdf`)
      toast.success('Card saved as PDF!')
    } catch (err) {
      console.error('PDF generation error:', err)
      toast.error('Failed to generate PDF')
    }
  }

  const handleShareDetails = async () => {
    if (!profile) return
    
    const shareText = `
${profile.name || profile.username}${profile.designation ? ` - ${profile.designation}` : ''}

${profile.about ? `About: ${profile.about}\n` : ''}
${profile.email ? `Email: ${profile.email}\n` : ''}
${profile.phone ? `Phone: ${profile.phone}\n` : ''}
${profile.whatsapp ? `WhatsApp: ${profile.whatsapp}\n` : ''}
${profile.instagram ? `Instagram: ${profile.instagram}\n` : ''}
${profile.linkedin ? `LinkedIn: ${profile.linkedin}\n` : ''}
${profile.youtube ? `YouTube: ${profile.youtube}\n` : ''}
${profile.website ? `Website: ${profile.website}\n` : ''}
${profile.others && Object.keys(profile.others).length > 0 ? 
  Object.entries(profile.others).map(([label, url]) => `${label}: ${url}`).join('\n') : ''}

View full profile: ${window.location.href}
`.trim()

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profile.name || profile.username}'s Contact Details`,
          text: shareText,
        })
        toast.success('Shared successfully!')
      } catch (err) {
        if (err.name !== 'AbortError') {
          // Fallback to clipboard
          navigator.clipboard.writeText(shareText)
          toast.success('Copied to clipboard!')
        }
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(shareText)
      toast.success('Copied to clipboard!')
    }
  }

  const handleViewMore = () => {
    setShowDetails(!showDetails)
  }

  return (
    <>
      <Helmet>
        <title>{profile?.name || profile?.username} - LSofito Card</title>
        <meta name="description" content={`${profile?.name || profile?.username}'s digital business card`} />
        {/* Open Graph tags */}
        <meta property="og:title" content={`${profile?.name || profile?.username} - LSofito Card`} />
        <meta property="og:description" content={profile?.designation || profile?.about || `${profile?.name || profile?.username}'s digital business card`} />
        {profile?.profile_image_url && (
          <meta property="og:image" content={profile.profile_image_url} />
        )}
        <meta property="og:url" content={window.location.href} />
        <meta property="og:type" content="profile" />
      </Helmet>
      <div 
        className="min-h-screen flex flex-col"
        style={
          profile?.background_color?.includes('gradient') 
            ? { background: profile.background_color }
            : { backgroundColor: profile?.background_color || '#E6E0F2' }
        }
      >
        <Navbar />
        <main className="flex-grow">
          {/* Card Section - Only this portion will be saved as PDF */}
          <div ref={cardRef}>
            <BusinessCard 
              profile={profile} 
              onViewMore={handleViewMore}
              showDetails={false}
            />
          </div>

          {/* Expanded Details Section */}
          {showDetails && (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8" ref={profileRef}>
              <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">Contact Information</h2>
                <div className="space-y-2 sm:space-y-3">
                  {profile?.email && (
                    <div className="flex items-center gap-3">
                      <FaEnvelope className="text-[#41287b]" />
                      <a href={`mailto:${profile.email}`} className="text-gray-700 hover:text-[#41287b]">
                        {profile.email}
                      </a>
                    </div>
                  )}
                  {profile?.phone && (
                    <div className="flex items-center gap-3">
                      <FaPhone className="text-[#41287b]" />
                      <a href={`tel:${profile.phone}`} className="text-gray-700 hover:text-[#41287b]">
                        {profile.phone}
                      </a>
                    </div>
                  )}
                  {profile?.whatsapp && (
                    <div className="flex items-center gap-3">
                      <FaWhatsapp className="text-green-600" />
                      <a 
                        href={`https://wa.me/${profile.whatsapp.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-700 hover:text-green-600"
                      >
                        {profile.whatsapp}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {profile?.gallery_urls && profile.gallery_urls.length > 0 && (
                <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">Gallery</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    {profile.gallery_urls.map((url, index) => (
                      <img
                        key={index}
                        src={url}
                        alt={`Gallery ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              )}

              {profile?.others && Object.keys(profile.others).length > 0 && (
                <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">Additional Links</h2>
                  <div className="space-y-2 sm:space-y-3">
                    {Object.entries(profile.others).map(([label, url]) => (
                      <a
                        key={label}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-gray-700 hover:text-[#41287b]"
                      >
                        {label}: {url}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                <button
                  type="button"
                  onClick={handleSaveAsPDF}
                  className="bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 font-semibold flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Save Card
                </button>
                <button
                  type="button"
                  onClick={handleShareDetails}
                  className="bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Share Card
                </button>
              </div>
              
              {/* Get Your Card Button for Non-Logged-In Users */}
              {!isLoggedIn && (
                <div className="border-t pt-6 mt-6">
                  <div className="bg-gradient-to-r from-[#41287b] to-[#41287b]/90 rounded-lg p-6 text-center">
                    <h2 className="text-xl font-bold text-white mb-2">
                      Want Your Own Digital Business Card?
                    </h2>
                    <p className="text-white/90 mb-4 text-sm">
                      Create your professional digital business card in minutes
                    </p>
                    <Link
                      to="/register"
                      className="inline-block bg-white text-[#41287b] px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition shadow-lg"
                    >
                      Get Your Card
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  )
}

export default PublicProfilePage
