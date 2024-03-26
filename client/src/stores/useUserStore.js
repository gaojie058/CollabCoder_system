import { create } from 'zustand'

// 用户信息
const useUserStore = create((set) => ({
    name: null,
    token: null,
    status: false,
    setName: (username) => set((state) => ({ name: username })),
    setToken: (token) => set((state) => ({ token: token })),
    setStatus: (status) => set((state) => ({ status: status })),
}))

export default useUserStore