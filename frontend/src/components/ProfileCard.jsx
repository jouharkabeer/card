import SocialLinkButton from './SocialLinkButton'

const ProfileCard = ({ profile }) => {
  if (!profile) return null

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-2xl mx-auto">
      {/* Profile Image */}
      <div className="bg-gradient-to-r from-[#41287b] to-[#41287b]/90 py-8">
        <div className="flex justify-center">
          {profile.profile_image_url ? (
            <img
              src={profile.profile_image_url}
              alt={profile.name}
              className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-lg"
            />
          ) : (
            <div className="w-32 h-32 rounded-full border-4 border-white bg-white flex items-center justify-center">
              <span className="text-4xl text-primary font-bold">
                {profile.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Profile Info */}
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">
          {profile.name || profile.username}
        </h1>
        {profile.designation && (
          <p className="text-gray-600 text-center mb-6">{profile.designation}</p>
        )}

        {/* About Section */}
        {profile.about && (
          <div className="mb-6 px-4">
            <p className="text-gray-700 text-center text-sm leading-relaxed whitespace-pre-line">
              {profile.about}
            </p>
          </div>
        )}

        {/* Contact Information */}
        <div className="space-y-3 mb-6">
          {profile.email && (
            <SocialLinkButton type="email" url={profile.email} label="Email" />
          )}
          {profile.phone && (
            <SocialLinkButton type="phone" url={profile.phone} phone={profile.phone} label="Phone" />
          )}
          {profile.whatsapp && (
            <SocialLinkButton
              type="whatsapp"
              url={profile.whatsapp}
              phone={profile.whatsapp}
              label="WhatsApp"
            />
          )}
        </div>

        {/* Social Links */}
        <div className="space-y-3">
          {profile.instagram && (
            <SocialLinkButton type="instagram" url={profile.instagram} />
          )}
          {profile.linkedin && (
            <SocialLinkButton type="linkedin" url={profile.linkedin} />
          )}
          {profile.youtube && (
            <SocialLinkButton type="youtube" url={profile.youtube} />
          )}
          {profile.website && (
            <SocialLinkButton type="website" url={profile.website} />
          )}
        </div>

        {/* Additional Links */}
        {profile.others && Object.keys(profile.others).length > 0 && (
          <div className="mt-6 space-y-3">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">More Links</h3>
            {Object.entries(profile.others).map(([label, url]) => (
              <SocialLinkButton key={label} type="website" url={url} label={label} />
            ))}
          </div>
        )}

        {/* Gallery */}
        {profile.gallery && profile.gallery.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Gallery</h3>
            <div className="grid grid-cols-3 gap-3">
              {profile.gallery.map((url, index) => (
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
  )
}

export default ProfileCard

