import axios from 'axios'
import Vue from 'vue'
import { ACCESS_TOKEN, REFRESH_TOKEN } from '@/store/mutation-types'
import store from '@/store'
import router from '@/router'

const request = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000
})

const isRefreshing = { isRefreshing: false }

function ToLogin () {
  Vue.ls.remove(ACCESS_TOKEN)
  Vue.ls.remove(REFRESH_TOKEN)
  router.replace({
    path: '/user/login',
    query: { redirect: router.currentRoute.fullPath }
  })
}

// Add a request interceptor
request.interceptors.request.use(function (config) {
  // Do something before request is sent
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

// Add a response interceptor
request.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response
}, function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  if (error.response.status === 401) {
    console.log('catch 401 error', isRefreshing.isRefreshing)
    if (isRefreshing.isRefreshing === true) {
      isRefreshing.isRefreshing = false
      ToLogin()
    } else {
      isRefreshing.isRefreshing = true
      return request({
        url: `/api/refresh_token/${Vue.ls.get(REFRESH_TOKEN)}`,
        method: 'get',
        headers: {
          'Authorization': 'Bearer ' + Vue.ls.get(REFRESH_TOKEN)
        }
      }).then((res) => {
        isRefreshing.isRefreshing = false
        if (res.data.code === 1) {
          Vue.ls.set(ACCESS_TOKEN, res.data.ACCESS_TOKEN, 30 * 60 * 1000) //  expiry half hours
          Vue.ls.set(REFRESH_TOKEN, res.data.REFRESH_TOKEN) //  expiry half hours
          store.commit('SET_ACCESS_TOKEN', res.data.ACCESS_TOKEN)
          store.commit('SET_REFRESH_TOKEN', res.data.REFRESH_TOKEN)

          error.config.__isRetryRequest = true
          error.config.headers.Authorization = 'Bearer ' + res.data.ACCESS_TOKEN
          error.config.url = error.config.url.substr(8, error.config.url.length - 8)
          return axios(error.config)
        } else {
          // 刷新token失败 清除token信息并跳转到登录页面
          ToLogin()
        }
      }).catch(() => {
        ToLogin()
      })
    }
  }
  return Promise.reject(error)
})

export default request
