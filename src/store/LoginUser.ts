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
    console.log('[LoginUserStore] setLoginUser 호출됨:', user)
  },
  clearLoginUser: () => {
    set({ loginUser: null })
    console.log('[LoginUserStore] clearLoginUser 호출됨: null')
  }
}))