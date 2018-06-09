/*
    本地存储
*/

const prefix = 'NM'

export const STORAGE_KEY = {
   'USERNAME': prefix + 'USERNAME',
   'USERID': prefix + 'USERID',
   'TOKEN': prefix + 'SESSION_KEY',
   'LAST_LOGIN_TIME': prefix + 'LAST_LOGIN_TIME',
   'MUSIC': prefix + 'MUSIC',
   'SEARCH_HISTORY': prefix + 'SEARCH_HISTORY',
   'PLAY_HISTORY': prefix + 'PLAY_HISTORY'
}

// 登录的过期时间，默认为7天
export const MAX_LOGIN_TIME = 7*24*60*60

