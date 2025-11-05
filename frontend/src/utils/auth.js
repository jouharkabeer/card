import { authAPI } from '../services/api'

export const isAuthenticated = () => {
  return authAPI.isAuthenticated()
}

export const getCurrentUser = () => {
  return authAPI.getCurrentUser()
}

export const logout = () => {
  authAPI.logout()
}


