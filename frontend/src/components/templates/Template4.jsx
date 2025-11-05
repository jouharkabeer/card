import SocialLinkButton from '../SocialLinkButton'

const Template4 = ({ profile }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Elegant Card Design */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Top Banner */}
          <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 h-32 relative">
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
              {profile?.profile_image_url ? (
                <img
                  src={profile.profile_image_url}
                  alt={profile.name || profile.username}
                  className="w-32 h-32 rounded-full border-6 border-white object-cover shadow-xl"
                />
              ) : (
                <div className="w-32 h-32 rounded-full border-6 border-white bg-white flex items-center justify-center shadow-xl">
                  <span className="text-5xl text-purple-600 font-bold">
                    {(profile?.name || profile?.username)?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="pt-20 pb-8 px-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {profile?.name || profile?.username}
              </h1>
              {profile?.designation && (
                <p className="text-xl text-gray-600 italic">{profile.designation}</p>
              )}
            </div>

            {/* About */}
            {profile?.about && (
              <div className="mb-8 pb-8 border-b border-gray-200">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">About</h2>
                <p className="text-gray-700 leading-relaxed text-center whitespace-pre-line">
                  {profile.about}
                </p>
              </div>
            )}

            {/* Contact & Social Grid */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="w-1 h-8 bg-purple-600 mr-3"></span>
                  Contact Information
                </h3>
                <div className="space-y-3">
                  {profile?.email && <SocialLinkButton type="email" url={profile.email} label="Email" />}
                  {profile?.phone && <SocialLinkButton type="phone" url={profile.phone} phone={profile.phone} label="Phone" />}
                  {profile?.whatsapp && <SocialLinkButton type="whatsapp" url={profile.whatsapp} phone={profile.whatsapp} label="WhatsApp" />}
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="w-1 h-8 bg-pink-600 mr-3"></span>
                  Social Links
                </h3>
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
            </div>

            {/* Gallery */}
            {profile?.gallery_urls && profile.gallery_urls.length > 0 && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Gallery</h3>
                <div className="grid grid-cols-3 gap-4">
                  {profile.gallery_urls.map((url, index) => (
                    <div key={index} className="relative group overflow-hidden rounded-lg">
                      <img
                        src={url}
                        alt={`Gallery ${index + 1}`}
                        className="w-full h-40 object-cover transition-transform group-hover:scale-110"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Template4

