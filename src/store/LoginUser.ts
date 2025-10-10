import { create } from 'zustand'
import type { LoginUserInfo } from '@/api/auth'

interface LoginUserState {
  loginUser: LoginUserInfo | null
  setLoginUser: (user: LoginUserInfo | null) => void
  clearLoginUser: () => void
}

export const useLoginUserStore = create<LoginUserState>((set) => ({
  loginUser: null,
  setLoginUser: (user) => set({ loginUser: user }),
  clearLoginUser: () => set({ loginUser: null })
}))