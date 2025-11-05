import { Link, useNavigate, useLocation } from 'react-router-dom'
import { getCurrentUser, logout } from '../utils/auth'
import { authAPI } from '../services/api'
import { FaHome, FaUser, FaSignOutAlt, FaSignInAlt, FaTachometerAlt, FaUserShield } from 'react-icons/fa'

const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const user = getCurrentUser()
  const isAuthenticated = authAPI.isAuthenticated()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const isActive = (path) => {
    return location.pathname === path
  }

  // Mobile bottom navigation
  const MobileNav = () => (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 md:hidden">
      <div className="flex justify-around items-center h-16">
        <Link
          to="/"
          className={`flex flex-col items-center justify-center flex-1 h-full ${
            isActive('/') ? 'text-[#41287b]' : 'text-gray-600'
          }`}
        >
          <FaHome className="text-xl mb-1" />
          <span className="text-xs">Home</span>
        </Link>
        {isAuthenticated ? (
          <>
            <Link
              to="/dashboard"
              className={`flex flex-col items-center justify-center flex-1 h-full ${
                isActive('/dashboard') ? 'text-[#41287b]' : 'text-gray-600'
              }`}
            >
              <FaTachometerAlt className="text-xl mb-1" />
              <span className="text-xs">Dashboard</span>
            </Link>
            {user?.is_staff && (
              <Link
                to="/admin"
                className={`flex flex-col items-center justify-center flex-1 h-full ${
                  isActive('/admin') ? 'text-[#41287b]' : 'text-gray-600'
                }`}
              >
                <FaUserShield className="text-xl mb-1" />
                <span className="text-xs">Admin</span>
              </Link>
            )}
            <Link
              to={`/${user?.username}`}
              className={`flex flex-col items-center justify-center flex-1 h-full ${
                location.pathname === `/${user?.username}` ? 'text-[#41287b]' : 'text-gray-600'
              }`}
            >
              <FaUser className="text-xl mb-1" />
              <span className="text-xs">My Card</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex flex-col items-center justify-center flex-1 h-full text-gray-600"
            >
              <FaSignOutAlt className="text-xl mb-1" />
              <span className="text-xs">Logout</span>
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className={`flex flex-col items-center justify-center flex-1 h-full ${
              isActive('/login') ? 'text-[#41287b]' : 'text-gray-600'
            }`}
          >
            <FaSignInAlt className="text-xl mb-1" />
            <span className="text-xs">Login</span>
          </Link>
        )}
      </div>
    </nav>
  )

  // Desktop top navigation
  const DesktopNav = () => (
    <nav className="bg-white shadow-lg hidden md:block">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-[#41287b]">
              LSofito Card
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                    isActive('/dashboard')
                      ? 'text-[#41287b] bg-[#41287b]/10'
                      : 'text-gray-700 hover:text-[#41287b]'
                  }`}
                >
                  Dashboard
                </Link>
                {user?.is_staff && (
                  <Link
                    to="/admin"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                      isActive('/admin')
                        ? 'text-[#41287b] bg-[#41287b]/10'
                        : 'text-gray-700 hover:text-[#41287b]'
                    }`}
                  >
                    Admin
                  </Link>
                )}
                <Link
                  to={`/${user?.username}`}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                    location.pathname === `/${user?.username}`
                      ? 'text-[#41287b] bg-[#41287b]/10'
                      : 'text-gray-700 hover:text-[#41287b]'
                  }`}
                >
                  My Card
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-[#41287b] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#41287b]/90 transition"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )

  return (
    <>
      <DesktopNav />
      <MobileNav />
      {/* Spacer for mobile nav */}
      <div className="h-16 md:hidden"></div>
    </>
  )
}

export default Navbar
