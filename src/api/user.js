import request from '@/utils/request'
import store from '@/store'

function getToken() {
    if (store.getters.access_token) {
        return store.getters.access_token
    } else {
        return Vue.ls.get(ACCESS_TOKEN)
    }
}

export function getUserGroups(parameter) {
    return request({
        url: '/api/usergroups',
        method: 'get',
        params: parameter,
        headers: {
            'Authorization': 'Bearer ' + getToken()
        }
    })
}

export function addUserGroup(userGroup, userGroupItems) {
    return request({
        url: '/api/usergroup',
        method: 'post',
        data: { userGroup, userGroupItems },
        headers: {
            'Authorization': 'Bearer ' + getToken()
        }
    })
}

export function getUserGroupItems(parameter) {
    return request({
        url: `/api/usergroupitems/${parameter}`,
        method: 'get',
        headers: {
            'Authorization': 'Bearer ' + getToken()
        }
    })
}

export function updateUserGroup(parameter) {
    return request({
        url: `/api/usergroup`,
        method: 'put',
        data: parameter,
        headers: {
            'Authorization': 'Bearer ' + getToken()
        }
    })
}

export function deleteUserGroup(parameter) {
    console.log(parameter)
    return request({
        url: `/api/usergroup/${parameter.id}`,
        method: 'delete',
        data: parameter,
        headers: {
            'Authorization': 'Bearer ' + getToken()
        }
    })
}

export function addUser(parameter) {
    return request({
        url: '/api/user',
        method: 'post',
        data: parameter,
        headers: {
            'Authorization': 'Bearer ' + getToken()
        }
    })
}

export function updateUserGroupItems(user_group_id, userGroupItems) {
    return request({
        url: `/api/usergroupitems`,
        method: 'put',
        data: { user_group_id, userGroupItems },
        headers: {
            'Authorization': 'Bearer ' + getToken()
        }
    })
}

export function getUsers(parameter) {
    return request({
        url: '/api/users',
        method: 'get',
        params: parameter,
        headers: {
            'Authorization': 'Bearer ' + getToken()
        }
    })
}