import request from '@/utils/request';
import store from '@/store'

export function getPermissionsNoPager() {
    return request({
      method: 'get',
      url: `/permission/no-pager`,
      headers: {
        'Authorization': 'Bearer ' + store.getters.token
      }
    })
  }