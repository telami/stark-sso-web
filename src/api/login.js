import {axios} from '@/utils/request'
import qs from 'qs'

export function login(parameter, oauth2Params, deviceId) {
  return axios({
    url: '/login' + oauth2Params,
    method: 'post',
    headers: {
      'deviceId': deviceId
    },
    data: qs.stringify(parameter)
  })
}


export function getImageCode(deviceId) {
  return axios({
    url: '/auth/code/image',
    method: 'post',
    headers: {
      'deviceId': deviceId
    }
  })
}

export function loginMobile(mobile, code) {
  return axios({
    url: '/login/mobile?mobile=' + mobile + '&smsCode=' + code + '&response_type=code&client_id=XnRFHdwI7KmOQ5nZ&redirect_uri=https://www.telami.cn&scope=USER_INFO',
    method: 'get'
  })
}

export function me() {
  return axios({
    url: '/user/me',
    method: 'get'
  })
}

export function qq(code, state) {
  return axios({
    url: '/auth/qq?code=' + code + "&state=" + state,
    method: 'get',
    headers: {
      'deviceId': new Date().getTime()
    }
  })
}

export function alipay(code, state) {
  return axios({
    url: '/auth/alipay?code=' + code + "&state=" + state,
    method: 'get',
    headers: {
      'deviceId': new Date().getTime()
    }
  })
}
