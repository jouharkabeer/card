import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'https://api-card.lsofito.com/api'

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refresh_token')
        if (refreshToken) {
          const response = await axios.post(`${API_URL}/token/refresh/`, {
            refresh: refreshToken,
          })
          const { access } = response.data
          localStorage.setItem('access_token', access)
          originalRequest.headers.Authorization = `Bearer ${access}`
          return api(originalRequest)
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

// API functions
export const authAPI = {
  login: async (username, password) => {
    const response = await api.post('/login/', { username, password })
    if (response.data.tokens) {
      localStorage.setItem('access_token', response.data.tokens.access)
      localStorage.setItem('refresh_token', response.data.tokens.refresh)
      localStorage.setItem('user', JSON.stringify(response.data.user))
    }
    return response.data
  },

  register: async (username, email, password, passwordConfirm) => {
    const response = await api.post('/register/', {
      username,
      email,
      password,
      password_confirm: passwordConfirm,
    })
    if (response.data.tokens) {
      localStorage.setItem('access_token', response.data.tokens.access)
      localStorage.setItem('refresh_token', response.data.tokens.refresh)
      localStorage.setItem('user', JSON.stringify(response.data.user))
    }
    return response.data
  },

  logout: () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('access_token')
  },
}

export const profileAPI = {
  getProfile: async (username) => {
    const response = await api.get(`/profile/${username}/`)
    return response.data
  },

  getMyProfile: async () => {
    const response = await api.get('/my-profile/')
    return response.data
  },

  updateProfile: async (data) => {
    const formData = new FormData()
    
    // Process 'others' field - filter out empty values and ensure it's a valid object
    if (data.others && typeof data.others === 'object') {
      const filteredOthers = {}
      Object.entries(data.others).forEach(([key, value]) => {
        if (key && key.trim() && value && value.trim()) {
          filteredOthers[key.trim()] = value.trim()
        }
      })
      // Only append if there are valid entries, otherwise send empty object
      formData.append('others', JSON.stringify(Object.keys(filteredOthers).length > 0 ? filteredOthers : {}))
    } else if (data.others === null || data.others === undefined) {
      formData.append('others', JSON.stringify({}))
    }
    
    // Process 'gallery' field - send as File objects
    // Gallery images are sent as separate files: gallery_0, gallery_1, gallery_2
    // Only send NEW File objects (not existing URLs from backend)
    if (data.gallery && Array.isArray(data.gallery)) {
      // Filter to only File objects (exclude string URLs)
      const fileObjects = data.gallery
        .filter(item => item instanceof File)
        .slice(0, 3)  // Limit to 3 images
      
      // Send each File object with its index
      fileObjects.forEach((file, index) => {
        if (file instanceof File) {
          formData.append(`gallery_${index}`, file)
        }
      })
    }
    
    // Add all other fields to FormData
    Object.keys(data).forEach((key) => {
      if (key === 'others' || key === 'gallery') return // Already handled above
      
      if (data[key] !== null && data[key] !== undefined) {
        if (key === 'profile_image' && data[key] instanceof File) {
          formData.append(key, data[key])
        } else if (key === 'profile_image' && typeof data[key] === 'string') {
          // Skip if it's a URL string (already uploaded image)
          return
        } else {
          formData.append(key, data[key])
        }
      }
    })

    const response = await api.put('/my-profile/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },
}

export const adminAPI = {
  getAllUsers: async () => {
    const response = await api.get('/admin/users/')
    return response.data
  },

  updateUserStatus: async (profileId, status) => {
    const response = await api.put(`/admin/users/${profileId}/status/`, { status })
    return response.data
  },
}

export default api

