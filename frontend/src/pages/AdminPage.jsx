import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminAPI, authAPI } from '../services/api'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import LoadingSpinner from '../components/LoadingSpinner'
import { toast } from 'react-toastify'
import { FaCheckCircle, FaPrint, FaTruck, FaBox, FaSpinner } from 'react-icons/fa'

const AdminPage = () => {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState({})

  useEffect(() => {
    // Check if user is authenticated and is admin
    const user = authAPI.getCurrentUser()
    if (!authAPI.isAuthenticated() || !user?.is_staff) {
      toast.error('Access denied. Admin privileges required.')
      navigate('/login')
      return
    }
    
    fetchUsers()
  }, [navigate])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const data = await adminAPI.getAllUsers()
      setUsers(data)
    } catch (err) {
      console.error('Error fetching users:', err)
      toast.error('Failed to load users')
      if (err.response?.status === 403) {
        navigate('/login')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (profileId, newStatus) => {
    try {
      setUpdating(prev => ({ ...prev, [profileId]: true }))
      await adminAPI.updateUserStatus(profileId, newStatus)
      toast.success('Status updated successfully!')
      fetchUsers() // Refresh the list
    } catch (err) {
      console.error('Error updating status:', err)
      toast.error('Failed to update status')
    } finally {
      setUpdating(prev => ({ ...prev, [profileId]: false }))
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'payment_received':
        return <FaCheckCircle className="text-green-600" />
      case 'printing':
        return <FaPrint className="text-blue-600" />
      case 'shipped':
        return <FaTruck className="text-yellow-600" />
      case 'delivered':
        return <FaBox className="text-purple-600" />
      default:
        return <FaSpinner className="text-gray-400" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'payment_received':
        return 'bg-green-100 text-green-800 border-green-300'
      case 'printing':
        return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'shipped':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'delivered':
        return 'bg-purple-100 text-purple-800 border-purple-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case 'payment_received':
        return 'Payment Received'
      case 'printing':
        return 'Printing'
      case 'shipped':
        return 'Shipped'
      case 'delivered':
        return 'Delivered'
      default:
        return 'Unknown'
    }
  }

  const statusOptions = [
    { value: 'payment_received', label: 'Payment Received' },
    { value: 'printing', label: 'Printing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Manage users and their card status</p>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Current Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Change Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date Joined
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                        No users found
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {user.username}
                          </div>
                          {(user.first_name || user.last_name) && (
                            <div className="text-sm text-gray-500">
                              {[user.first_name, user.last_name].filter(Boolean).join(' ')}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{user.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {user.status_value ? (
                            <div className="flex items-center gap-2">
                              {getStatusIcon(user.status_value)}
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(user.status_value)}`}>
                                {getStatusLabel(user.status_value)}
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">No Profile</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {user.profile_id ? (
                            <select
                              value={user.status_value || ''}
                              onChange={(e) => handleStatusChange(user.profile_id, e.target.value)}
                              disabled={updating[user.profile_id]}
                              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#41287b] focus:border-[#41287b] sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {statusOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <span className="text-sm text-gray-400">N/A</span>
                          )}
                          {updating[user.profile_id] && (
                            <FaSpinner className="inline-block ml-2 animate-spin text-[#41287b]" />
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.date_joined).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-6 text-sm text-gray-600">
            <p>Total Users: <strong>{users.length}</strong></p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default AdminPage

