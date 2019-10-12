import request from '@/utils/request'
import store from '@/store'

export function getParameters() {
    return request({
        url: '/api/parameters',
        method: 'get',
        headers: {
            'Authorization': 'Bearer ' + store.getters.token
        }
    })
}

export function addParameter(parameter) {
    return request({
        url: '/api/parameter',
        method: 'post',
        data: parameter,
        headers: {
            'Authorization': 'Bearer ' + store.getters.token
        }
    })
}

export function addDeviceType(parameter) {
    return request({
        url: '/api/device_type',
        method: 'post',
        data: parameter,
        headers: {
            'Authorization': 'Bearer ' + store.getters.token
        }
    })
}

export function getDeviceTypes() {
    return request({
        url: '/api/device_types',
        method: 'get',
        headers: {
            'Authorization': 'Bearer ' + store.getters.token
        }
    })
}

export function addDevice(parameter) {
    return request({
        url: '/api/device',
        method: 'post',
        data: parameter,
        headers: {
            'Authorization': 'Bearer ' + store.getters.token
        }
    })
}

export function getDevices() {
    return request({
        url: '/api/devices',
        method: 'get',
        headers: {
            'Authorization': 'Bearer ' + store.getters.token
        }
    })
}