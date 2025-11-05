import SocialLinkButton from '../SocialLinkButton'

const Template2 = ({ profile }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-center">
            {profile?.profile_image_url ? (
              <img
                src={profile.profile_image_url}
                alt={profile.name || profile.username}
                className="w-36 h-36 rounded-full border-4 border-white object-cover mx-auto shadow-xl mb-4"
              />
            ) : (
              <div className="w-36 h-36 rounded-full border-4 border-white bg-white flex items-center justify-center mx-auto shadow-xl mb-4">
                <span className="text-6xl text-blue-600 font-bold">
                  {(profile?.name || profile?.username)?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
            )}
            <h1 className="text-4xl font-bold text-white mb-2">
              {profile?.name || profile?.username}
            </h1>
            {profile?.designation && (
              <p className="text-xl text-white/90">{profile.designation}</p>
            )}
          </div>

          <div className="p-8">
            {/* About */}
            {profile?.about && (
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-3">About</h2>
                <p className="text-gray-700 whitespace-pre-line">{profile.about}</p>
              </div>
            )}

            {/* Contact & Social */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Contact</h3>
                <div className="space-y-2">
                  {profile?.email && <SocialLinkButton type="email" url={profile.email} label="Email" />}
                  {profile?.phone && <SocialLinkButton type="phone" url={profile.phone} phone={profile.phone} label="Phone" />}
                  {profile?.whatsapp && <SocialLinkButton type="whatsapp" url={profile.whatsapp} phone={profile.whatsapp} label="WhatsApp" />}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Social</h3>
                <div className="space-y-2">
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
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Gallery</h3>
                <div className="grid grid-cols-3 gap-3">
                  {profile.gallery_urls.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`Gallery ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
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

export default Template2

