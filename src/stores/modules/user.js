import { defineStore } from 'pinia'
import { ref } from 'vue'
import { userGetInfoService } from '@/api/user'

// y用户模块 token setToken removeToken
export const useUserStore = defineStore(
  'big-user',
  () => {
    const token = ref('')
    const setToken = (newToken) => {
      token.value = newToken
    }
    const removeToken = () => {
      token.value = ''
    }

    const user = ref({})
    const getUser = async () => {
      const res = await userGetInfoService() // 请求获取数据
      // console.log(res.data.data)
      user.value = res.data.data
    }
    const setUser = (obj) => {
      user.value = obj
    }

    return {
      token,
      setToken,
      removeToken,
      getUser,
      user,
      setUser
    }
  },
  {
    persist: true
  }
)
