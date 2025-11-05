import SocialLinkButton from '../SocialLinkButton'

const Template3 = ({ profile }) => {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Minimal Header */}
        <div className="text-center mb-12">
          {profile?.profile_image_url ? (
            <img
              src={profile.profile_image_url}
              alt={profile.name || profile.username}
              className="w-24 h-24 rounded-full object-cover mx-auto mb-6 border-2 border-gray-200"
            />
          ) : (
            <div className="w-24 h-24 rounded-full border-2 border-gray-200 bg-gray-100 flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl text-gray-400 font-bold">
                {(profile?.name || profile?.username)?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
          )}
          <h1 className="text-4xl font-light text-gray-900 mb-2">
            {profile?.name || profile?.username}
          </h1>
          {profile?.designation && (
            <div className="h-px w-24 bg-gray-300 mx-auto my-4"></div>
          )}
          {profile?.designation && (
            <p className="text-lg text-gray-600">{profile.designation}</p>
          )}
        </div>

        {/* About */}
        {profile?.about && (
          <div className="mb-12 text-center">
            <p className="text-gray-700 leading-relaxed whitespace-pre-line max-w-2xl mx-auto">
              {profile.about}
            </p>
          </div>
        )}

        {/* Contact */}
        <div className="mb-12">
          <div className="space-y-4">
            {profile?.email && <SocialLinkButton type="email" url={profile.email} label="Email" />}
            {profile?.phone && <SocialLinkButton type="phone" url={profile.phone} phone={profile.phone} label="Phone" />}
            {profile?.whatsapp && <SocialLinkButton type="whatsapp" url={profile.whatsapp} phone={profile.whatsapp} label="WhatsApp" />}
          </div>
        </div>

        {/* Social Links */}
        <div className="mb-12">
          <div className="space-y-4">
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
          <div className="grid grid-cols-3 gap-4">
            {profile.gallery_urls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Gallery ${index + 1}`}
                className="w-full aspect-square object-cover"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Template3

