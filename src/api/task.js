import Vue from 'vue'
import request from '@/utils/request'
import store from '@/store'
import { ACCESS_TOKEN } from '@/store/mutation-types'

function getToken () {
  if (store.getters.access_token) {
    return store.getters.access_token
  } else {
    return Vue.ls.get(ACCESS_TOKEN)
  }
}

export function getStartTask (deviceId, deviceIpAddr) {
  return request({
    url: '/api/task/start_task',
    method: 'post',
    data: { deviceId, deviceIpAddr },
    headers: {
      'Authorization': 'Bearer ' + getToken()
    }
  })
}

export function getStopTask (deviceId, deviceIpAddr) {
  return request({
    url: '/api/task/stop_task',
    method: 'post',
    data: { deviceId, deviceIpAddr },
    headers: {
      'Authorization': 'Bearer ' + getToken()
    }
  })
}

export function getTaskParameters () {
  return request({
    url: '/api/task/parameters',
    method: 'get',
    headers: {
      'Authorization': 'Bearer ' + getToken()
    }
  })
}


export function updateTaskParameter (deviceIpAddr, index, value) {
  return request({
    url: '/api/task/parameter',
    method: 'put',
    data: {deviceIpAddr, index, value},
    headers: {
      'Authorization': 'Bearer ' + getToken()
    }
  })
}