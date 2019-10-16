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

export function getParameters () {
  return request({
    url: '/api/parameters',
    method: 'get',
    headers: {
      'Authorization': 'Bearer ' + getToken()
    }
  })
}

export function addParameter (parameter) {
  return request({
    url: '/api/parameter',
    method: 'post',
    data: parameter,
    headers: {
      'Authorization': 'Bearer ' + getToken()
    }
  })
}

export function addDeviceType (parameter) {
  return request({
    url: '/api/device_type',
    method: 'post',
    data: parameter,
    headers: {
      'Authorization': 'Bearer ' + getToken()
    }
  })
}

export function getDeviceTypes () {
  return request({
    url: '/api/device_types',
    method: 'get',
    headers: {
      'Authorization': 'Bearer ' + getToken()
    }
  })
}

export function addDevice (parameter) {
  return request({
    url: '/api/device',
    method: 'post',
    data: parameter,
    headers: {
      'Authorization': 'Bearer ' + getToken()
    }
  })
}

export function getDevices () {
  return request({
    url: '/api/devices',
    method: 'get',
    headers: {
      'Authorization': 'Bearer ' + getToken()
    }
  })
}
