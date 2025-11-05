import { useState } from 'react'
import { 
  FaTwitter, FaInstagram, FaLinkedin, FaYoutube, FaGithub, FaEnvelope,
  FaPhone, FaWhatsapp, FaGlobe 
} from 'react-icons/fa'
import { SiDevdotto, SiDribbble, SiFigma } from 'react-icons/si'

const BusinessCard = ({ profile, onViewMore, showDetails = false }) => {
  // Helper function to check if a string is a gradient
  const isGradient = (color) => {
    return color && (color.includes('gradient') || color.includes('linear-gradient') || color.includes('radial-gradient'))
  }

  // Get background color/style (supports gradient)
  const getBackgroundStyle = (color) => {
    if (!color) return {}
    if (isGradient(color)) {
      return { background: color }
    }
    return { backgroundColor: color }
  }

  // Get button color/style (supports gradient)
  const getButtonStyle = (color) => {
    if (!color) return {}
    if (isGradient(color)) {
      return { background: color }
    }
    return { backgroundColor: color }
  }

  const bgColor = profile?.background_color || '#E6E0F2'
  const cardColor = profile?.card_color || '#FFFFFF'
  const buttonColor = profile?.button_color || '#1E3A8A'
  
  // Get initials for logo
  const getInitials = () => {
    if (!profile?.name) return profile?.username?.substring(0, 2).toUpperCase() || 'U'
    const names = profile.name.split(' ')
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase()
    }
    return profile.name.substring(0, 2).toUpperCase()
  }

  // Get social links - main links first, then others
  const socialLinks = [
    { icon: FaTwitter, url: profile?.twitter, key: 'twitter' },
    { icon: FaInstagram, url: profile?.instagram, key: 'instagram' },
    { icon: SiDribbble, url: profile?.others?.dribbble, key: 'dribbble' },
    { icon: FaLinkedin, url: profile?.linkedin, key: 'linkedin' },
    { icon: FaGithub, url: profile?.others?.github, key: 'github' },
    { icon: SiFigma, url: profile?.figma, key: 'figma' },
    { icon: SiDevdotto, url: profile?.others?.dev, key: 'dev' },
  ].filter(link => link.url)

  return (
    <div 
      className="flex justify-center items-center min-h-screen p-4"
      style={getBackgroundStyle(bgColor)}
    >
      <div 
        className="shadow-lg w-full max-w-md relative mx-auto"
        style={{ 
          ...getBackgroundStyle(cardColor),
          borderRadius: '1.5rem',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
          overflow: 'hidden',
          minHeight: 'fit-content'
        }}
      >
        {/* Logo Icon - Top Left */}
        <div 
          className="absolute top-4 left-4 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm z-10"
          style={getButtonStyle(buttonColor)}
        >
          {getInitials()}
        </div>

        {/* Avatar */}
        <div className="flex justify-center pt-16 pb-4">
          {profile?.profile_image_url ? (
            <div 
              className="w-32 h-32 rounded-full p-1"
              style={{ 
                border: '4px solid #FFD700',
                backgroundColor: '#FFD700'
              }}
            >
              <img
                src={profile.profile_image_url}
                alt={profile.name || profile.username}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
          ) : (
            <div 
              className="w-32 h-32 rounded-full flex items-center justify-center text-4xl font-bold text-gray-700"
              style={{ 
                border: '4px solid #FFD700',
                backgroundColor: '#f0f0f0'
              }}
            >
              {(profile?.name || profile?.username)?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          )}
        </div>

        {/* Name */}
        <div className="text-center px-6 pb-2">
          <h1 className="text-2xl font-semibold text-gray-800 mb-1">
            {profile?.name || profile?.username}
          </h1>
          {profile?.designation && (
            <p className="text-base text-[#6A5ACD] font-normal">
              {profile.designation}
            </p>
          )}
        </div>

        {/* Description */}
        {profile?.about && (
          <div className="px-6 pb-6">
            <p className="text-sm text-gray-700 text-center leading-relaxed">
              {profile.about}
            </p>
          </div>
        )}

        {/* Email Button */}
        {profile?.email && (
          <div className="px-6 pb-4">
            <a
              href={`mailto:${profile.email}`}
              className="block w-full py-3 px-4 rounded-lg text-white font-normal text-center transition hover:opacity-90"
              style={getButtonStyle(buttonColor)}
            >
              {profile.email}
            </a>
          </div>
        )}

        {/* Social Icons */}
        {socialLinks.length > 0 && (
          <div className="flex justify-center gap-4 px-6 pb-6">
            {socialLinks.map(({ icon: Icon, url, key }) => (
              <a
                key={key}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:opacity-70"
                style={
                  isGradient(buttonColor)
                    ? { background: buttonColor, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', color: 'transparent' }
                    : { color: buttonColor }
                }
                aria-label={key}
              >
                <Icon size={20} />
              </a>
            ))}
          </div>
        )}

        {/* View More / Less Button */}
        {onViewMore && (
          <div className="px-6 pb-6 text-center">
            <button
              onClick={onViewMore}
              className="text-sm font-medium transition hover:opacity-70"
              style={
                isGradient(buttonColor) 
                  ? { 
                      background: buttonColor,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      color: 'transparent'
                    }
                  : { color: buttonColor }
              }
            >
              {showDetails ? 'View Less' : 'View More'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default BusinessCard

