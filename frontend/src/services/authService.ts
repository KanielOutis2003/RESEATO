import { supabase } from '../config/supabase'
import { UserRole } from '../../../shared/types'

class AuthService {
  async register(data: any) {
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
    
    // In many Supabase setups, signup also signs you in immediately 
    // depending on confirmation settings.
    if (authData.session) {
      sessionStorage.setItem('token', authData.session.access_token)
      const normalized = this.normalizeUser(authData.user)
      sessionStorage.setItem('user', JSON.stringify(normalized))
    }
    
    return { user: authData.user, token: authData.session?.access_token }
  }

  async login(credentials: any) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password
    })

    if (error) throw new Error(error.message)
    sessionStorage.setItem('token', data.session?.access_token || '')

    const normalized = this.normalizeUser(data.user)
    sessionStorage.setItem('user', JSON.stringify(normalized))
    
    return { user: data.user, token: data.session?.access_token }
  }

  async logout() {
    await supabase.auth.signOut()
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('user')
  }

  isAuthenticated() {
    return !!sessionStorage.getItem('token')
  }

  getStoredUser() {
    const userStr = sessionStorage.getItem('user')
    if (!userStr) return null
    try {
      const raw = JSON.parse(userStr)
      if (raw && (raw.firstName || raw.lastName)) return raw
      return this.normalizeUser(raw)
    } catch {
      return null
    }
  }

  private normalizeUser(user: any) {
    if (!user) return null
    const meta = user.user_metadata || {}
    const firstName = meta.first_name || meta.firstName || ''
    const lastName = meta.last_name || meta.lastName || ''
    const role: UserRole = (meta.role as UserRole) || UserRole.CUSTOMER
    return {
      id: user.id,
      email: user.email,
      firstName,
      lastName,
      phone: meta.phone || '',
      role,
      createdAt: user.created_at || new Date().toISOString(),
      updatedAt: user.updated_at || user.created_at || new Date().toISOString(),
    }
  }

  async getProfile() {
    const { data, error } = await supabase.auth.getUser()
    if (error) throw new Error(error.message)
    const normalized = this.normalizeUser(data.user)
    return normalized
  }

  async updateProfile(data: { firstName: string; lastName: string; phone?: string }) {
    const { data: res, error } = await supabase.auth.updateUser({
      data: {
        first_name: data.firstName,
        last_name: data.lastName,
        phone: data.phone || '',
      },
    })
    if (error) throw new Error(error.message)
    const normalized = this.normalizeUser(res.user)
    sessionStorage.setItem('user', JSON.stringify(normalized))
    return normalized
  }

  async forgotPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) throw new Error(error.message)
    return true
  }

  async resetPassword(password: string) {
    const { error } = await supabase.auth.updateUser({
      password: password
    })
    if (error) throw new Error(error.message)
    return true
  }
}

export default new AuthService()
