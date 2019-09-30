import request from '@/utils/request';
import store from '@/store'
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
      'Authorization': 'Bearer ' + store.getters.token
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
