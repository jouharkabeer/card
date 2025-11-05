import SocialLinkButton from '../SocialLinkButton'
import { FaInstagram, FaLinkedin, FaYoutube, FaGlobe } from 'react-icons/fa'

const Template1 = ({ profile }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#41287b] via-[#41287b]/90 to-[#41287b]/80 text-white py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            {profile?.profile_image_url ? (
              <img
                src={profile.profile_image_url}
                alt={profile.name || profile.username}
                className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white object-cover shadow-2xl mb-6"
              />
            ) : (
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white bg-white flex items-center justify-center shadow-2xl mb-6">
                <span className="text-5xl sm:text-6xl text-[#41287b] font-bold">
                  {(profile?.name || profile?.username)?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
            )}
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">
              {profile?.name || profile?.username}
            </h1>
            {profile?.designation && (
              <p className="text-xl sm:text-2xl text-white/90 mb-4">{profile.designation}</p>
            )}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* About */}
        {profile?.about && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">About</h2>
            <p className="text-gray-700 whitespace-pre-line">{profile.about}</p>
          </div>
        )}

        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Contact</h2>
          <div className="space-y-3">
            {profile?.email && (
              <SocialLinkButton type="email" url={profile.email} label="Email" />
            )}
            {profile?.phone && (
              <SocialLinkButton type="phone" url={profile.phone} phone={profile.phone} label="Phone" />
            )}
            {profile?.whatsapp && (
              <SocialLinkButton type="whatsapp" url={profile.whatsapp} phone={profile.whatsapp} label="WhatsApp" />
            )}
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Connect</h2>
          <div className="space-y-3">
            {profile?.instagram && <SocialLinkButton type="instagram" url={profile.instagram} />}
            {profile?.linkedin && <SocialLinkButton type="linkedin" url={profile.linkedin} />}
            {profile?.youtube && <SocialLinkButton type="youtube" url={profile.youtube} />}
            {profile?.website && <SocialLinkButton type="website" url={profile.website} />}
            {profile?.others && Object.entries(profile.others).map(([label, url]) => (
              <SocialLinkButton key={label} type="website" url={url} label={label} />
            ))}
          </div>
        </div>

        {/* Gallery */}
        {profile?.gallery_urls && profile.gallery_urls.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Gallery</h2>
            <div className="grid grid-cols-3 gap-4">
              {profile.gallery_urls.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Template1

