import request from '@/utils/request'
import store from '@/store'

const api = {
    usergroups: '/usergroups',
    role: '/role',
    service: '/service',
    permission: '/permission',
    permissionNoPager: '/permission/no-pager',
    orgTree: '/org/tree'
}

export function getRoles(parameter) {
    return request({
        url: '/roles',
        method: 'get',
        params: parameter,
        headers: {
            'Authorization': 'Bearer ' + store.getters.token
        }
    })
}