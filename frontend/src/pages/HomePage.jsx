import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { authAPI } from '../services/api'
import { FaIdCard, FaMobileAlt, FaLink, FaSync, FaAward, FaUsers, FaShieldAlt, FaGlobe } from 'react-icons/fa'

const HomePage = () => {
  const isAuthenticated = authAPI.isAuthenticated()

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[#41287b] via-[#41287b]/90 to-[#41287b]/80 text-white py-16 sm:py-20 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="mb-6">
                <span className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold mb-4 text-white">
                  Powered by Lsofito Innovations & Adocity Ads
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-white">
                Your Digital Business Card
              </h1>
              <p className="text-xl sm:text-2xl md:text-3xl mb-8 text-white/90 max-w-3xl mx-auto">
                Share your contact information instantly with NFC technology. 
                Connect, network, and grow your business effortlessly.
              </p>
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="bg-white text-[#41287b] px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition inline-block shadow-lg"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <Link
                  to="/register"
                  className="bg-white text-[#41287b] px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition inline-block shadow-lg"
                >
                  Get Your Card
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* Collaboration Section */}
        <section className="py-12 sm:py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
                A Collaboration of Innovation
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                LSofito NFC Business Card is a powerful collaboration between 
                <strong className="text-primary"> Lsofito Innovations</strong> and 
                <strong className="text-primary"> Adocity Ads</strong>, bringing you 
                cutting-edge technology and innovative marketing solutions.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-primary">
                <h3 className="text-xl font-bold text-gray-800 mb-3">Lsofito Innovations</h3>
                <p className="text-gray-600">
                  Leading the way in innovative technology solutions, Lsofito Innovations 
                  brings expertise in NFC technology and digital transformation.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-primary">
                <h3 className="text-xl font-bold text-gray-800 mb-3">Adocity Ads</h3>
                <p className="text-gray-600">
                  Specializing in creative marketing solutions, Adocity Ads ensures your 
                  digital presence makes a lasting impression.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Card Types Section */}
        <section className="py-12 sm:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
              Choose Your Card Type
            </h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-2xl shadow-lg border-2 border-gray-200 hover:border-primary transition">
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4">🔩</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Metal Card</h3>
                  <p className="text-gray-600">
                    Premium metal card with elegant finish
                  </p>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center text-gray-700">
                    <span className="text-primary mr-3">✓</span>
                    <span>Durable and long-lasting</span>
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="text-primary mr-3">✓</span>
                    <span>Premium metallic finish</span>
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="text-primary mr-3">✓</span>
                    <span>Professional appearance</span>
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="text-primary mr-3">✓</span>
                    <span>NFC technology embedded</span>
                  </li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-2xl shadow-lg border-2 border-gray-200 hover:border-primary transition">
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4">💳</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">PVC Card</h3>
                  <p className="text-gray-600">
                    Lightweight and flexible PVC card
                  </p>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center text-gray-700">
                    <span className="text-primary mr-3">✓</span>
                    <span>Lightweight and portable</span>
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="text-primary mr-3">✓</span>
                    <span>Customizable design</span>
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="text-primary mr-3">✓</span>
                    <span>Cost-effective solution</span>
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="text-primary mr-3">✓</span>
                    <span>NFC technology embedded</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 sm:py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
              Why Choose LSofito NFC Card?
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
                <div className="text-4xl text-primary mb-4">
                  <FaIdCard />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Instant Sharing</h3>
                <p className="text-gray-600">
                  Share your contact information with a simple tap. No need for physical cards or typing.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
                <div className="text-4xl text-primary mb-4">
                  <FaLink />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">All Your Links</h3>
                <p className="text-gray-600">
                  Connect all your social media profiles, website, and contact information in one place.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
                <div className="text-4xl text-primary mb-4">
                  <FaSync />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Always Updated</h3>
                <p className="text-gray-600">
                  Update your information anytime, anywhere. Your card always shows the latest details.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
                <div className="text-4xl text-primary mb-4">
                  <FaMobileAlt />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Mobile Optimized</h3>
                <p className="text-gray-600">
                  Perfect experience on all devices. Designed for mobile-first interactions.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
                <div className="text-4xl text-primary mb-4">
                  <FaAward />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Professional</h3>
                <p className="text-gray-600">
                  Make a lasting impression with a professional digital presence.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
                <div className="text-4xl text-primary mb-4">
                  <FaUsers />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Network Easily</h3>
                <p className="text-gray-600">
                  Build connections faster with instant contact sharing at events and meetings.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
                <div className="text-4xl text-primary mb-4">
                  <FaShieldAlt />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Secure</h3>
                <p className="text-gray-600">
                  Your data is secure and you control what information is shared.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
                <div className="text-4xl text-primary mb-4">
                  <FaGlobe />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Global Reach</h3>
                <p className="text-gray-600">
                  Share your profile with anyone, anywhere in the world instantly.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-12 sm:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
              How It Works
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Get Your Card</h3>
                <p className="text-gray-600">
                  Register and choose between Metal or PVC card. Create your profile with all your details.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Customize Your Profile</h3>
                <p className="text-gray-600">
                  Add your photo, contact info, social links, and about section. Update anytime.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Share Instantly</h3>
                <p className="text-gray-600">
                  Tap your card to someone's phone and they instantly get your contact information.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-12 sm:py-16 bg-gradient-to-br from-[#41287b] via-[#41287b]/90 to-[#41287b]/80 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12 text-white">
              Simple Pricing
            </h2>
            <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
                <div className="text-center mb-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">Metal Card</h3>
                  <div className="text-5xl font-bold mb-2">$49</div>
                  <p className="text-white/80">Premium option</p>
                </div>
                <ul className="space-y-3 mb-8 text-white">
                  <li className="flex items-center">
                    <span className="mr-3">✓</span>
                    <span>Premium metal card</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-3">✓</span>
                    <span>Custom profile page</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-3">✓</span>
                    <span>All social media links</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-3">✓</span>
                    <span>Unlimited updates</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-3">✓</span>
                    <span>Mobile-optimized</span>
                  </li>
                </ul>
                {!isAuthenticated && (
                  <Link
                    to="/register"
                    className="block w-full bg-white text-[#41287b] text-center py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
                  >
                    Get Started
                  </Link>
                )}
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
                <div className="text-center mb-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">PVC Card</h3>
                  <div className="text-5xl font-bold mb-2">$29</div>
                  <p className="text-white/80">Standard option</p>
                </div>
                <ul className="space-y-3 mb-8 text-white">
                  <li className="flex items-center">
                    <span className="mr-3">✓</span>
                    <span>PVC card</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-3">✓</span>
                    <span>Custom profile page</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-3">✓</span>
                    <span>All social media links</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-3">✓</span>
                    <span>Unlimited updates</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-3">✓</span>
                    <span>Mobile-optimized</span>
                  </li>
                </ul>
                {!isAuthenticated && (
                  <Link
                    to="/register"
                    className="block w-full bg-white text-[#41287b] text-center py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
                  >
                    Get Started
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 sm:py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              Join thousands of professionals who are networking smarter with LSofito NFC Cards.
            </p>
            {!isAuthenticated && (
              <Link
                to="/register"
                className="bg-[#41287b] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#41287b]/90 transition inline-block shadow-lg"
              >
                Create Your Card Now
              </Link>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default HomePage
