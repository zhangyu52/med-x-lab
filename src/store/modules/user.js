import Vue from 'vue'
import { authLogin, getInfo, logout } from '@/api/login'
import { ACCESS_TOKEN, REFRESH_TOKEN } from '@/store/mutation-types'
import { welcome } from '@/utils/util'

const user = {
  state: {
    access_token: '',
    refresh_token: '',
    name: '',
    welcome: '',
    avatar: '',
    roles: [],
    info: {}
  },

  mutations: {
    SET_ACCESS_TOKEN: (state, access_token) => {
      state.access_token = access_token
    },
    SET_REFRESH_TOKEN: (state, refresh_token) => {
      state.refresh_token = refresh_token
    },
    SET_NAME: (state, { name, welcome }) => {
      state.name = name
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      state.info = info
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        authLogin(userInfo).then(response => {
          Vue.ls.set(ACCESS_TOKEN, response.data.ACCESS_TOKEN, 1 * 60 * 1000) //expiry 1 minute
          Vue.ls.set(REFRESH_TOKEN, response.data.REFRESH_TOKEN, 2 * 60 * 1000) //expiry 2 minutes
          commit('SET_ACCESS_TOKEN', response.data.ACCESS_TOKEN)
          commit('SET_REFRESH_TOKEN', response.data.REFRESH_TOKEN)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit }) {
      return new Promise((resolve, reject) => {
        getInfo().then(response => {
          if (response.data.roles.permissions.length > 0) {
            response.data.roles.permissions.map(permission => {
              if (permission.actionEntitySet.length > 0) {
                const action = permission.actionEntitySet.map(action => { return action.action })
                permission.actionList = action
              }
            })
            response.data.roles.permissionList = response.data.roles.permissions.map(permission => { return permission.permissionId })
            commit('SET_ROLES', response.data.roles)
            commit('SET_INFO', response.data)
          } else {
            reject(new Error('getInfo: roles must be a non-null array !'))
          }
          commit('SET_NAME', { name: response.data.name, welcome: welcome() })
          commit('SET_AVATAR', response.data.avatar)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    Logout({ commit, state }) {
      return new Promise((resolve) => {
        logout(state.access_token).then(() => {
          resolve()
        }).catch(() => {
          resolve()
        }).finally(() => {
          commit('SET_ACCESS_TOKEN', '')
          commit('SET_REFRESH_TOKEN', '')
          commit('SET_ROLES', [])
          console.log('remove')
          Vue.ls.remove(ACCESS_TOKEN)
        })
      })
    }

  }
}

export default user
