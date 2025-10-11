import { create } from 'zustand'
import type { GetLoginCheck } from '@/api/auth'

interface LoginUserState {
  loginUser: GetLoginCheck | null
  setLoginUser: (user: GetLoginCheck | null) => void
  clearLoginUser: () => void
}

export const useLoginUserStore = create<LoginUserState>((set) => ({
  loginUser: null,
  setLoginUser: (user) => {
    set({ loginUser: user })
  },
  clearLoginUser: () => {
    set({ loginUser: null })
  }
}))