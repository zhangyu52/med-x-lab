import request from '@/utils/request';

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
export function login(parameter) {
  return request({
    method: 'post',
    url: '/auth/login',
    data: {
      name,
      password
    }
  });
}

export function getSmsCaptcha(parameter) {
  return axios({
    url: api.SendSms,
    method: 'post',
    data: parameter
  })
}

export function getInfo() {
  return request({
    method: 'get',
    url: `/user/info/`,
  });
}

export function getCurrentUserNav(token) {
  return axios({
    url: '/user/nav',
    method: 'get'
  })
}

export function logout(token) {
  return request({
    method: 'post',
    url: '/user/logout',
    data: {
      token
    }
  });
}

