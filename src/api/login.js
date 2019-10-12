import Vue from 'vue'
import request from '@/utils/request'
import store from '@/store'
import { ACCESS_TOKEN } from '@/store/mutation-types'
/**
 * login func
 * parameter: {
 *     username: '',
 *     password: '',
 *     remember_me: true,
 *     captcha: '12345'
 * }
 * @param parameter
 * @returns {*}
 */
export function authLogin (parameter) {
  return request({
    method: 'post',
    url: '/auth/login',
    data: parameter
  })
}

export function getInfo () {
  console.log('getInfo getInfo')
  if (store.getters.token) {
    return request({
      method: 'get',
      url: `/user/info/`,
      headers: {
        'Authorization': 'Bearer ' + store.getters.token
      }
    })
  } else {
    return request({
      method: 'get',
      url: `/user/info/`,
      headers: {
        'Authorization': 'Bearer ' + Vue.ls.get(ACCESS_TOKEN)
      }
    })
  }  
}

export function logout (token) {
  return request({
    method: 'post',
    url: '/user/logout',
    data: {
      token
    }
  })
}
