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
    method: 'get',
    headers: {
      'deviceId': deviceId
    }
  })
}

export function loginMobile(parameter, oauth2Params, deviceId) {
  return axios({
    url: '/login/mobile' + oauth2Params,
    method: 'post',
    headers: {
      'deviceId': deviceId
    },
    data: qs.stringify(parameter)
  })
}

export function me() {
  return axios({
    url: '/user/me',
    method: 'get'
  })
}

export function qq(code, state, deviceId) {
  return axios({
    url: '/auth/qq?code=' + code + "&state=" + state,
    method: 'get',
    headers: {
      'deviceId': deviceId
    }
  })
}

export function alipay(code, state, deviceId) {
  return axios({
    url: '/auth/alipay?code=' + code + "&state=" + state,
    method: 'get',
    headers: {
      'deviceId': deviceId
    }
  })
}

export function dingtalk(code, state, deviceId) {
  return axios({
    url: '/auth/dingtalk?code=' + code + "&state=" + state,
    method: 'get',
    headers: {
      'deviceId': deviceId
    }
  })
}

export function weibo(code, state, deviceId) {
  return axios({
    url: '/auth/weibo?code=' + code + "&state=" + state,
    method: 'get',
    headers: {
      'deviceId': deviceId
    }
  })
}

export function oschina(code, state, deviceId) {
  return axios({
    url: '/auth/oschina?code=' + code + "&state=" + state,
    method: 'get',
    headers: {
      'deviceId': deviceId
    }
  })
}

export function getSmsCaptcha(mobile, deviceId) {
  return axios({
    url: '/auth/code/sms?mobile=' + mobile,
    method: 'get',
    headers: {
      'deviceId': deviceId
    }
  })
}
