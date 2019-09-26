import {axios} from '@/utils/request'
import qs from 'qs'

export function login(parameter) {
  return axios({
    url: '/login?response_type=code&client_id=XnRFHdwI7KmOQ5nZ&redirect_uri=https://www.telami.cn&scope=USER_INFO',
    method: 'post',
    data: qs.stringify(parameter)
  })
}

export function loginMobile(mobile, code) {
  return axios({
    url: '/login/mobile?mobile=' + mobile + '&smsCode=' + code + '&response_type=code&client_id=XnRFHdwI7KmOQ5nZ&redirect_uri=https://www.telami.cn&scope=USER_INFO',
    method: 'get'
  })
}
