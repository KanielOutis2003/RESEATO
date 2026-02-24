// frontend/src/services/authService.ts
import { supabase } from '../config/supabase'

class AuthService {
  async register(data: any) {
    // Sign up with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          first_name: data.firstName,
          last_name: data.lastName,
          phone: data.phone,
          role: data.role || 'customer'
        }
      }
    })

    if (authError) throw new Error(authError.message)
    return { user: authData.user, token: authData.session?.access_token }
  }

  async login(credentials: any) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password
    })

    if (error) throw new Error(error.message)
    
    // Store user info
    localStorage.setItem('token', data.session?.access_token || '')
    localStorage.setItem('user', JSON.stringify(data.user))
    
    return { user: data.user, token: data.session?.access_token }
  }

  async logout() {
    await supabase.auth.signOut()
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  isAuthenticated() {
    return !!localStorage.getItem('token')
  }

  getStoredUser() {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  }
}

export default new AuthService()