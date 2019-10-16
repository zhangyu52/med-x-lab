import Vue from 'vue'
import request from '@/utils/request'
import store from '@/store'
import { ACCESS_TOKEN } from '@/store/mutation-types'

function getToken() {
  if (store.getters.access_token) {
    return store.getters.access_token
  } else {
    return Vue.ls.get(ACCESS_TOKEN)
  }
}

export function authLogin(parameter) {
  return request({
    method: 'post',
    url: '/auth/login',
    data: parameter
  })
}

export function getInfo() {
  return request({
    method: 'get',
    url: `/user/info/`,
    headers: {
      'Authorization': 'Bearer ' + getToken()
    }
  })
}

export function logout(token) {
  return request({
    method: 'post',
    url: '/user/logout',
    data: {
      token
    }
  })
}
