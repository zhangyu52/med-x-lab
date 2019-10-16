import request from '@/utils/request';
import store from '@/store'

function getToken() {
  if (store.getters.access_token) {
    return store.getters.access_token
  } else {
    return Vue.ls.get(ACCESS_TOKEN)
  }
}

export function getPermissionsNoPager() {
    return request({
      method: 'get',
      url: `/permission/no-pager`,
      headers: {
        'Authorization': 'Bearer ' + getToken()
      }
    })
  }