import { FaInstagram, FaLinkedin, FaYoutube, FaGlobe, FaWhatsapp, FaEnvelope, FaPhone } from 'react-icons/fa'

const iconMap = {
  instagram: FaInstagram,
  linkedin: FaLinkedin,
  youtube: FaYoutube,
  website: FaGlobe,
  whatsapp: FaWhatsapp,
  email: FaEnvelope,
  phone: FaPhone,
}

const SocialLinkButton = ({ type, url, label, phone }) => {
  const Icon = iconMap[type.toLowerCase()] || FaGlobe

  if (!url && !phone) return null

  const getHref = () => {
    if (type === 'whatsapp' && phone) {
      return `https://wa.me/${phone.replace(/[^0-9]/g, '')}`
    }
    if (type === 'email' && url) {
      return `mailto:${url}`
    }
    if (type === 'phone' && phone) {
      return `tel:${phone}`
    }
    return url
  }

  const getLabel = () => {
    if (label) return label
    if (type === 'whatsapp') return 'Chat on WhatsApp'
    if (type === 'email') return 'Send Email'
    if (type === 'phone') return 'Call'
    return type.charAt(0).toUpperCase() + type.slice(1)
  }

  return (
    <a
      href={getHref()}
      target={type === 'email' || type === 'phone' || type === 'whatsapp' ? '_self' : '_blank'}
      rel={type === 'email' || type === 'phone' || type === 'whatsapp' ? '' : 'noopener noreferrer'}
      className="flex items-center space-x-3 bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 hover:border-primary"
    >
      <Icon className="text-2xl text-primary" />
      <span className="text-gray-800 font-medium">{getLabel()}</span>
    </a>
  )
}

export default SocialLinkButton

