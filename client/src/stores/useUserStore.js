import { create } from 'zustand'

// 用户信息
export default useUserStore = create((set) => ({
    name: '',
    setName: (username) => set((state) => ({ name: username }))
}))