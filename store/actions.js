import axios from 'axios'
import API from '~/api'
import { Toast } from 'mint-ui'
import {
	formatTime,
	loadLyric,
	GetRandomColor
} from '~/common/function'
import storage from '~/utils/storage'
import { STORAGE_KEY } from '~/common/const'

const http = axios.create({
	baseURL: API.ROOT
})

const actions = {
	//初始化
	async nuxtServerInit({ dispatch }) {
//		await dispatch('GET_BANNER')
//		await dispatch('GET_PERSONALIZED_PLAYLIST', 6)
//		await dispatch('GET_PERSONALIZED_ALBUM', 6)
//		await dispatch('GET_PERSONALIZED_MV', 6)
	},
	
	//获取banner
	async GET_BANNER({ state }) {
		let { data } = await http.get(API.GET_BANNER)
		state.banner = JSON.parse(data.substring(1)).map(item => item.picUrl)
	},
	
	//获取推荐歌单
	async GET_PERSONALIZED_PLAYLIST({ commit }, limit) {
		let { data } = await http.get(API.GET_PERSONALIZED_PLAYLIST,{
			params: {
				limit
			}
		})
		commit('GET_PERSONALIZED_PLAYLIST', data)
	},
	//获取推荐专辑
	async GET_PERSONALIZED_ALBUM({ commit }, limit) {
		let { data } = await http.get(API.GET_PERSONALIZED_ALBUM, {
			params: {
				limit
			}
		})
		commit('GET_PERSONALIZED_ALBUM', data)
	},
	//获取推荐MV
	async GET_PERSONALIZED_MV({ commit }, limit) {
		let { data } = await http.get(API.GET_PERSONALIZED_MV, {
			params: {
				limit
			}
		})
		commit('GET_PERSONALIZED_MV', data)
	},
	//获取歌曲排行榜
	async GET_TOPLIST({ commit }) {
		let { data } = await http.get(API.GET_TOPLIST)
		commit('GET_TOPLIST', data)
	},
	//获取热门MV
	async GET_HOT_MV({ commit }, area) {
		let { data } = await http.get(API.GET_HOT_MV, {
			params: {
				area
			}
		})
		commit('GET_HOT_MV', data)
	},
	
	//获取MV链接
	async GET_MV_URL({ state }, params) {
		let { data } = await http.get(API.GET_MV_URL, {
			params
		})
		state.mv_url = data
	},
	
	//获取歌单详情
	async GET_PLAYLIST_DETAIL({ commit }, id) {
		let { data } = await http.get(API.GET_PLAYLIST_DETAIL,{
			params: {
				id
			},
			baseURL: API.NODE
		})
		commit('GET_PLAYLIST_DETAIL', data)
	},
	//获取歌单分类
	async GET_PLAYLIST_CATEGORY({ commit }) {
		let { data } = await http.get(API.GET_PLAYLIST_CATEGORY)
		commit('GET_PLAYLIST_CATEGORY', data)
	},
	//按歌单分类获取歌单
	async GET_PLAYLIST_BYCATEGORY({ commit }, params) {
		let { data } = await http.get(API.GET_PLAYLIST_BYCATEGORY, {
			params
		})
		commit('GET_PLAYLIST_BYCATEGORY', data)
	},
	//获取专辑详情
	async GET_ALBUM_DETAIL({ commit }, id) {
		let { data } = await http.get(API.GET_ALBUM_DETAIL, {
			params: {
				id
			},
			baseURL: API.NODE
		})
		commit('GET_ALBUM_DETAIL', data)
	},
	//获取最新专辑
	async GET_NEW_ALBUM({ commit }, params) {
		let { data } = await http.get(API.GET_NEW_ALBUM, {
			params,
			baseURL: API.NODE
		})
		commit('GET_NEW_ALBUM', data)
	},
	//获取最新歌曲
	async GET_NEW_SONG({ commit }, id) {
		let { data } = await http.get(API.GET_NEW_SONG, {
			params: {
				id
			}
		})
		commit('GET_NEW_SONG', data)
	},
	//获取热门歌手
	async GET_HOT_ARTIST({ commit }, id) {
		let { data } = await http.get(API.GET_HOT_ARTIST, {
			params: {
				areaId: id
			}
		})
		commit('GET_HOT_ARTIST', data)
	},
	//获取歌手详情
	async GET_ARTIST_DETAIL({ commit }, id) {
		let { data } = await http.get(API.GET_ARTIST_DETAIL, {
			params: {
				id
			},
			baseURL: API.NODE
		})
		commit('GET_ARTIST_DETAIL', data)
	},
	//获取歌手热门单曲
	async GET_ARTIST_MUSIC({ commit }, params) {
		let { data } = await http.get(API.GET_ARTIST_MUSIC, {
			params
		})
		commit('GET_ARTIST_MUSIC', data)
	},
	//获取歌手所有专辑
	async GET_ARTIST_ALBUM({ commit }, params) {
		let { data } = await http.get(API.GET_ARTIST_ALBUM, {
			params
		})
		commit('GET_ARTIST_ALBUM', data)
	},
	//获取歌手相关MV
	async GET_ARTIST_MV({ commit }, params) {
		let { data } = await http.get(API.GET_ARTIST_MV, {
			params
		})
		commit('GET_ARTIST_MV', data)
	},
	//获取歌手介绍
	async GET_ARTIST_DESC({ commit }, id) {
		let { data } = await http.get(API.GET_ARTIST_DESC, {
			params: {
				id
			}
		})
		commit('GET_ARTIST_DESC', data)
	},
	//播放歌曲
	async PLAY_MUSIC({ state, dispatch }, id) {
		let audio=$('audio').get(0)
		let currentTime = Date.now()
      let protectTime = 100 
      if ((currentTime - state.audio.lastRunTime) < protectTime) {
         return
      }
      audio.pause()
      state.audio.lastRunTime = Date.now()
		let currentSong = state.song.find(item => item.id == id) || storage.getItem(STORAGE_KEY.MUSIC).find(item => item.id == id) || state.recommend_song.find(item => item.id == id)
		state.audio.id = id
		state.audio.title = currentSong.name
		state.audio.artist = currentSong.artist
		state.audio.picUrl = currentSong.picUrl
		if($('#player .pic').css('display')!='none'){
      	$('.lyric').html('<p style="margin-top:20%;color:#fff"><span class="wave"></span>歌词加载中</p>')
      }else{
      	$('.lyric').html('<p style="margin-top:50%;color:#fff"><span class="wave"></span>歌词加载中</p>')
      }
      $('#player').find('#recommend_song').hide()
      $('#player').find('.container').show()
      var bgcolor = '-webkit-linear-gradient(left top,' + GetRandomColor() + ',' + GetRandomColor() + ')'
      $('#progressbar1,.bgColor').css({ 'background': bgcolor })
      let bgUrl = state.audio.picUrl
      $('.blur_bg').css({ 'background-image': 'url(' + bgUrl + ')' })
		dispatch('ADD_MUSIC', id)
		await http.get(API.GET_MUSIC_URL,{
         params:{
            source: currentSong.source,
            id: id
         }
      }).then(res => {
      	let url = res.data.url.replace(/http:\/\/(m7c|m8c)/,'http://m7')
      	dispatch('AUDIO_INIT', url)
      })
		await http.get(API.GET_MUSIC_LYRIC,{
         params:{
            source: currentSong.source,
            id: id
         }
      }).then(res => {
      	loadLyric(res.data.lyric, res.data.tlyric)
      	if(state.audio.trans){
      		$('.trans').show()
      	}else{
      		$('.trans').hide()
      	}
      	$('.lyric').find('p').css('font-size', state.audio.fontSize)
      })
      let music = []
      if(storage.getItem(STORAGE_KEY.PLAY_HISTORY)){
      	music = storage.getItem(STORAGE_KEY.PLAY_HISTORY)
      }
      let index = music.findIndex(item => item.id == id)
      if(index > -1){
      	music.splice(index, 1)
      }
      music.unshift(currentSong)
      storage.setItem(STORAGE_KEY.PLAY_HISTORY, music)
	},
	//音频初始化
	AUDIO_INIT({ state, dispatch }, url){
      var audio=$('audio').get(0)
      audio.src = url
      audio.load()
      audio.addEventListener('durationchange', function() {
		   state.audio.totalTime = formatTime(audio.duration)
      })
      audio.addEventListener('canplay', function() {
		   audio.play()
      })
      audio.addEventListener('timeupdate', function() {
      	var $progress = $('#progress')
		   var dis = audio.currentTime / audio.duration * $progress.width()
		   var timeRanges = audio.buffered
		   try {
		      var timeBuffered = timeRanges.end(timeRanges.length - 1)
		   } catch (err) { }
		   var dis1 = timeBuffered / audio.duration * $progress.width()
		   state.audio.currentTime = formatTime(audio.currentTime)
		   $('#ball').get(0).style.left = dis + 'px'
		   $('#progressbar1').get(0).style.width = dis + 'px'
		   $('#progressbar2').get(0).style.width = dis1 + 'px'
      })
      audio.addEventListener('timeupdate', function() {
      	if ($('audio').get(0).paused) {
      		$('.pause').hide()
		      $('.play').show()
		      $('.pic').find('img').css('animation', 'rotate 20s linear infinite paused')
		   } else {
		   	$('.play').hide()
		      $('.pause').show()
		      $('.pic').find('img').css('animation', 'rotate 20s linear infinite running')
		   }
		   let $li = $('#playList').find('li[id='+ state.audio.id +']')
		   $li.addClass('active').siblings().removeClass('active')
		   $li.find('.singer').addClass('active').closest('li').siblings().find('.singer').removeClass('active')
      })
      audio.onerror = function () {
         Toast('该歌曲暂时无法播放')
      }
   },
   //添加歌曲到播放列表
   ADD_MUSIC({ state }, id){
      let json, storage_music = []
      json = state.song.find(item => item.id == id) || state.recommend_song.find(item => item.id == id)
      if (storage.getItem(STORAGE_KEY.MUSIC)) {
         storage_music = storage.getItem(STORAGE_KEY.MUSIC)
      }
      let index = storage_music.findIndex(item => item.id == id)
      if (index == -1) {
         storage_music.unshift(json)
      	storage.setItem(STORAGE_KEY.MUSIC, storage_music)
      }
   },
   //下载歌曲
   DOWNLOAD_MUSIC({ state }, id){
      let json = state.song.find(item => item.id == id) || state.recommend_song.find(item => item.id == id) || storage.getItem(STORAGE_KEY.MUSIC).find(item => item.id == id)
      http.get(API.GET_MUSIC_URL,{
         params:{
            source: json.source,
            id: json.id
         }
      }).then(res=>{
      	let url = res.data.url
      	let fileName = json.name
      	if (!url) {
      		Toast('该歌曲暂时无法下载')
	         return
	      }
	      function download(url, fileName) {
	         var aLink = document.createElement('a')
	         aLink.href = url
	         aLink.download = fileName
	         var evt = document.createEvent("MouseEvents")
	         evt.initMouseEvent("click", false, false)
	         aLink.dispatchEvent(evt)
	      }
	      download(url, fileName)
      })
   },
   //搜索歌曲
   async GET_SEARCH_SONG({ commit }, params) {
   	let { data } = await http.get(API.GET_SEARCH_SONG,{
   		params
   	})
   	commit('GET_SEARCH_SONG', data)
   },
   async GET_SEARCH_MUSIC({ state }, params) {
   	let { data } = await http.get(API.GET_SEARCH_MUSIC,{
   		params
   	})
   	let song = data
   	let music = state.song
   	for(var i=0;i<song.length;i++){
         var json = {
         	name: song[i].name,
	         artist: song[i].artist[0],
	         singer: [],
	         source: song[i].source,
	         id: song[i].id,
	         picId: song[i].pic_id,
	         picUrl: song[i].pic_url,
	         album: {
	         	name: song[i].album,
	         	id: ''
	         }
         }
         music.push(json)
      }
   	state.song = music
   },
   async GET_RECOMMEND_SONG({ state }, s) {
   	let { data } = await http.get(API.GET_SEARCH_MUSIC,{
   		params: {
   			name: s,
				source: 'tencent',
            count: 20,
            pages: 1
   		}
   	})
   	let song = data
   	let music = []
   	for(var i=0;i<song.length;i++){
         var json = {
         	name: song[i].name,
	         artist: song[i].artist[0],
	         singer: [],
	         source: song[i].source,
	         id: song[i].id,
	         picId: song[i].pic_id,
	         picUrl: song[i].pic_url,
	         album: {
	         	name: song[i].album,
	         	id: ''
	         }
         }
         music.push(json)
      }
   	state.recommend_song = music
   },
   //搜索歌手
   async GET_SEARCH_ARTIST({ commit }, name) {
   	let { data } = await http.get(API.GET_SEARCH_ARTIST, {
   		params: {
   			name
   		}
   	})
   	commit('GET_SEARCH_ARTIST', data)
   },
   //搜索专辑
   async GET_SEARCH_ALBUM({ commit }, params) {
   	let { data } = await http.get(API.GET_SEARCH_ALBUM, {
   		params
   	})
   	commit('GET_SEARCH_ALBUM', data)
   },
   //搜索MV
   async GET_SEARCH_MV({ commit }, params) {
   	let { data } = await http.get(API.GET_SEARCH_MV, {
   		params
   	})
   	commit('GET_SEARCH_MV', data)
   },
   //搜索腾讯MV
   async GET_TENCENT_MV({ commit }, params) {
   	let { data } = await http.get(API.GET_TENCENT_MV, {
   		params
   	})
   	commit('GET_TENCENT_MV', data)
   },
   //搜索酷狗MV
   async GET_KUGOU_MV({ commit }, params) {
   	let { data } = await http.get(API.GET_KUGOU_MV, {
   		params
   	})
   	commit('GET_KUGOU_MV', data)
   },
   //搜索歌单
   async GET_SEARCH_PLAYLIST({ commit }, params) {
   	let { data } = await http.get(API.GET_SEARCH_PLAYLIST, {
   		params
   	})
   	commit('GET_SEARCH_PLAYLIST', data)
   },
   //搜索用户
   async GET_SEARCH_USER({ commit }, params) {
   	let { data } = await http.get(API.GET_SEARCH_USER, {
   		params
   	})
   	commit('GET_SEARCH_USER', data)
   },
   //搜索建议
   async GET_SEARCH_SUGGEST({ commit }, keywords) {
   	let { data } = await http.get(API.GET_SEARCH_SUGGEST, {
   		params: {
   			keywords
   		},
   		baseURL: API.NODE
   	})
   	commit('GET_SEARCH_SUGGEST', { data, keywords })
   },
   //获取用户详情
   async GET_USER_DETAIL({ commit }, id) {
   	let { data } = await http.get(API.GET_USER_DETAIL, {
   		params: {
   			uid: id
   		}
   	})
   	commit('GET_USER_DETAIL', data)
   },
   //获取用户歌单
   async GET_USER_PLAYLIST({ commit }, id) {
   	let { data } = await http.get(API.GET_USER_PLAYLIST, {
   		params: {
   			uid: id,
	         count: 1000,
	         page: 1
   		}
   	})
   	commit('GET_USER_PLAYLIST', data)
   },
   //获取用户关注
   async GET_USER_FOLLOW({ commit }, params) {
   	let { data } = await http.get(API.GET_USER_FOLLOW, {
   		params
   	})
   	commit('GET_USER_FOLLOW', data)
   },
   //获取用户粉丝
   async GET_USER_FAN({ commit }, params) {
   	let { data } = await http.get(API.GET_USER_FAN, {
   		params
   	})
   	commit('GET_USER_FAN', data)
   },
   //用户登录
   async LOGIN({ commit }, upa) {
   	let { data } = await http.post(API.LOGIN,{
         upa
      },{
         headers:{
            'Content-Type':'application/x-www-form-urlencoded'
         },
         transformRequest:(obj)=>{
            var str = []
            for (var i in obj) {
               str.push(encodeURIComponent(i) + "=" + encodeURIComponent(obj[i]))
            }
            return str.join("&")
         }
      })
   	if(data.code == 1){
   		Toast('登录成功')
   		storage.setItem(STORAGE_KEY.USERNAME, data.username)
         storage.setItem(STORAGE_KEY.USERID, data.userId)
         storage.setItem(STORAGE_KEY.TOKEN, data.user_token)
         storage.setItem(STORAGE_KEY.LAST_LOGIN_TIME, data.last_login_time)
   	}else{
   		Toast('用户名或密码错误')
   	}
   },
   //用户注册
   async REGISTER({ commit }, upa) {
   	let { data } = await http.post(API.REGISTER,{
         upa
      },{
         headers:{
            'Content-Type':'application/x-www-form-urlencoded'
         },
         transformRequest:(obj)=>{
            var str = []
            for (var i in obj) {
               str.push(encodeURIComponent(i) + "=" + encodeURIComponent(obj[i]))
            }
            return str.join("&")
         }
      })
   	if(data.code == 1){
   		Toast('注册成功')
   	}else{
   		Toast('该用户名已被注册')
   	}
   },
   //获取用户收藏的所有歌曲
   async GET_USER_MUSIC({ commit }, userId) {
   	let { data } = await http.get(API.GET_USER_MUSIC, {
   		params: {
   			userId
   		}
   	})
   	commit('GET_USER_MUSIC', data)
   },
   //获取用户创建的歌单
   async GET_USER_CREATELIST({ commit }, userId) {
   	let { data } = await http.get(API.GET_USER_CREATELIST, {
   		params: {
   			userId
   		}
   	})
   	commit('GET_USER_CREATELIST', data)
   },
   //添加用户创建的歌单
   async ADD_USER_CREATELIST({ state }, name) {
   	let { data } = await http.post(API.ADD_USER_CREATELIST,{
         name,
         cover: API.ROOT + '/image/default_album.jpg',
         userId: storage.getItem(STORAGE_KEY.USERID),
         csrf_token: storage.getItem(STORAGE_KEY.TOKEN)
      })
   	if(data.code == 0){
         return Toast('歌单已存在')
      }
      let json = {
         id: data.id,
         name,
         picUrl: API.ROOT + '/image/default_album.jpg',
         songCount: 0
      }
      state.createlist.unshift(json)
   },
   //编辑用户创建的歌单
   async UPDATE_USER_CREATELIST({ state }, { id, name }) {
   	let { data } = await http.post(API.UPDATE_USER_CREATELIST,{
	      id,
	      name,
	      userId:storage.getItem(STORAGE_KEY.USERID),
	      csrf_token:storage.getItem(STORAGE_KEY.TOKEN)
	   })
   	if(data.code == 0){
         return Toast('歌单已存在')
      }
      let json= state.createlist.find(item => item.id == id)
      json.name = name
      Toast('修改成功')
   },
   //删除用户创建的歌单
   async DELETE_USER_CREATELIST({ state }, id) {
   	let { data } = await http.post(API.DELETE_USER_CREATELIST,{
         id,
         userId: storage.getItem(STORAGE_KEY.USERID),
         csrf_token: storage.getItem(STORAGE_KEY.TOKEN)
      })
   	if(data.code == 1){
         let index= state.createlist.findIndex(item => item.id == id)
         state.createlist.splice(index, 1)
         Toast('已删除')
      }
   },
   //获取用户创建歌单详情
   async GET_USER_CREATELIST_DETAIL({ state }, { userId, listId }) {
   	let { data } = await http.get(API.GET_USER_CREATELIST_DETAIL, {
         params: {
            userId,
            listId
         }
      })
   	state.playlist_detail.name = data.name
   	state.playlist_detail.picUrl = data.cover
   	state.playlist_detail.creator = {
   		id: data.userId,
   		name: data.username,
   		picUrl: API.ROOT + '/upload/' + data.userId + '/' + data.userId + '.jpg?rnd='+Math.random()
   	}
   },
   //获取用户创建歌单歌曲
   async GET_USER_CREATELIST_MUSIC({ commit }, { userId, listId }) {
   	let { data } = await http.get(API.GET_USER_CREATELIST_MUSIC, {
         params: {
            userId,
            listId
         }
      })
   	commit('GET_USER_CREATELIST_MUSIC', data)
   },
   //收藏歌曲
   COLLECT_MUSIC({ state, commit }, id) {
   	var json = state.song.find(item => item.id == id) || storage.getItem(STORAGE_KEY.MUSIC).find(item => item.id == id) || state.recommend_song.find(item => item.id == id)
      var music = []
      music.push(json)
      state.createlist_cover = json.picUrl
      commit('COLLECT_MUSIC', music)
   },
   COLLECT_ALL_MUSIC({ state, commit }) {
   	let song = []
   	$('.check').each(function (i) {
      	if(this.checked){
      		song.unshift(state.song[i])
      	}
      })
      state.createlist_cover = song[song.length - 1].picUrl
      commit('COLLECT_MUSIC', song)
   },
   async COLLECT({ state }, listId) {
   	let { data } = await http.post(API.ADD_USER_CREATELIST_MUSIC,{
         listId,
         music: state.collect_music,
         userId: storage.getItem(STORAGE_KEY.USERID),
         csrf_token: storage.getItem(STORAGE_KEY.TOKEN)
      })
   	if(data.code == 1){
   		await http.post(API.UPDATE_USER_CREATELIST_COVER,{
            id: listId,
            cover: state.createlist_cover,
            userId: storage.getItem(STORAGE_KEY.USERID),
            csrf_token: storage.getItem(STORAGE_KEY.TOKEN)
         }).then( res => {
            if(res.data.code == 1){
               Toast('已收藏到歌单')
            }
         })
   	}
   },
   //取消收藏歌曲
   async UNCOLLECT({ state }, { music, listId }){
      let { data } = await http.post(API.DELETE_USER_CREATELIST_MUSIC, {
         music,
         userId: storage.getItem(STORAGE_KEY.USERID),
         csrf_token: storage.getItem(STORAGE_KEY.TOKEN)
      })
      if(data.code == 1){
      	music.forEach(item => {
      		var index = state.song.findIndex(value => value.id == item.id)
            state.song.splice(index,1)
      	})
      	let { data: song } = await http.get(API.GET_USER_CREATELIST_MUSIC, {
	         params: {
	            listId,
	            userId: storage.getItem(STORAGE_KEY.USERID)
	         }
	      })
         var cover= song.length == 0 ? API.ROOT + '/image/default_album.jpg' : song[song.length-1].pic
         await http.post(API.UPDATE_USER_CREATELIST_COVER, {
            id: listId,
            cover: cover,
            userId: storage.getItem(STORAGE_KEY.USERID),
            csrf_token: storage.getItem(STORAGE_KEY.TOKEN)
         })
         Toast('已删除')
      }
   },
   DELETE_MUSIC({ dispatch, state }, { musicId, listId }) {
   	let json = state.song.find(item => item.id == musicId)
      let music = []
      music.push(json)
      dispatch('UNCOLLECT', { music, listId })
   },
   DELETE_ALL_MUSIC({ dispatch, state }, listId) {
   	let music = []
   	$('.check').each(function (i) {
      	if(this.checked){
      		music.unshift(state.song[i])
      	}
      })
   	dispatch('UNCOLLECT', { music, listId })
   },
   //获取用户收藏的歌单
   async GET_USER_COLLECT_PLAYLIST({ commit }, userId) {
   	let { data } = await http.get(API.GET_USER_COLLECT_PLAYLIST, {
   		params: {
   			userId
   		}
   	})
   	commit('GET_USER_COLLECT_PLAYLIST', data)
   },
   //删除用户收藏的歌单
   async DELETE_USER_COLLECT_PLAYLIST({ state }, id) {
   	let { data } = await http.post(API.DELETE_USER_COLLECT_PLAYLIST, {
         id,
         userId: storage.getItem(STORAGE_KEY.USERID),
         csrf_token: storage.getItem(STORAGE_KEY.TOKEN)
      })
   	if(data.code == 1){
   		id.forEach(item => {
      		var index = state.playlist.findIndex(value => value.id == item)
            state.playlist.splice(index,1)
      	})
         Toast('已删除')
      }
   },
   //添加用户收藏的歌单
   async ADD_USER_COLLECT_PLAYLIST({ state }, collectlist) {
   	await http.post(API.ADD_USER_COLLECT_PLAYLIST,{
         collectlist,
         userId: storage.getItem(STORAGE_KEY.USERID),
         csrf_token: storage.getItem(STORAGE_KEY.TOKEN)
      }).then(res=>{
         Toast('已收藏')
      })
   },
   //获取用户收藏的专辑
   async GET_USER_COLLECT_ALBUM({ commit }, userId) {
   	let { data } = await http.get(API.GET_USER_COLLECT_ALBUM, {
   		params: {
   			userId
   		}
   	})
   	commit('GET_USER_COLLECT_ALBUM', data)
   },
   //添加用户收藏的专辑
   async ADD_USER_COLLECT_ALBUM({ state }, album) {
   	await http.post(API.ADD_USER_COLLECT_ALBUM,{
         album,
         userId: storage.getItem(STORAGE_KEY.USERID),
         csrf_token: storage.getItem(STORAGE_KEY.TOKEN)
      }).then(res=>{
         Toast('已收藏')
      })
   },
   //删除用户收藏的专辑
   async DELETE_USER_COLLECT_ALBUM({ state }, id) {
   	let { data } = await http.post(API.DELETE_USER_COLLECT_ALBUM, {
         id,
         userId: storage.getItem(STORAGE_KEY.USERID),
         csrf_token: storage.getItem(STORAGE_KEY.TOKEN)
      })
   	if(data.code == 1){
   		id.forEach(item => {
      		var index = state.album.findIndex(value => value.id == item)
         	state.album.splice(index,1)
      	})
         Toast('已删除')
      }
   },
   //获取用户关注的歌手
   async GET_USER_FOLLOW_SINGER({ state }, userId) {
   	let { data } = await http.get(API.GET_USER_FOLLOW_SINGER, {
   		params: {
   			userId
   		}
   	})
   	state.artist = data.map(item => {
			return {
				id: item.id,
				name: item.name,
				picUrl: item.pic
			}
		}).reverse()
   },
   //添加用户关注的歌手
   async ADD_USER_FOLLOW_SINGER({ state }, singer) {
   	await http.post(API.ADD_USER_FOLLOW_SINGER, {
   		singer,
         userId: storage.getItem(STORAGE_KEY.USERID),
         csrf_token: storage.getItem(STORAGE_KEY.TOKEN)
   	}).then(res => {
   		Toast('已关注')
   	})
   },
   //删除用户关注的歌手
   async DELETE_USER_FOLLOW_SINGER({ state }, id) {
   	let { data } = await http.post(API.DELETE_USER_FOLLOW_SINGER, {
   		id,
         userId: storage.getItem(STORAGE_KEY.USERID),
         csrf_token: storage.getItem(STORAGE_KEY.TOKEN)
   	})
   	if(data.code == 1){
   		id.forEach(item => {
      		var index = state.artist.findIndex(value => value.id == item)
         	state.artist.splice(index,1)
      	})
   		Toast('已取消关注')
   	}
   },
   //获取用户关注的网易云用户
   async GET_USER_FOLLOW_NETEASEUSER({ state }, userId) {
   	let { data } = await http.get(API.GET_USER_FOLLOW_NETEASEUSER, {
   		params: {
   			userId
   		}
   	})
   	state.user = data.map(item => {
			return {
				id: item.id,
				name: item.name,
				picUrl: item.pic
			}
		}).reverse()
		state.follow_neteaseuser = state.user
   },
   //添加用户关注的网易云用户
   async ADD_USER_FOLLOW_NETEASEUSER({ state }, user) {
   	await http.post(API.ADD_USER_FOLLOW_NETEASEUSER, {
   		user,
         userId: storage.getItem(STORAGE_KEY.USERID),
         csrf_token: storage.getItem(STORAGE_KEY.TOKEN)
   	}).then(res => {
   		Toast('已关注')
   	})
   },
   //删除用户关注的网易云用户
   async DELETE_USER_FOLLOW_NETEASEUSER({ state }, id) {
   	let { data } = await http.post(API.DELETE_USER_FOLLOW_NETEASEUSER, {
   		id,
         userId: storage.getItem(STORAGE_KEY.USERID),
         csrf_token: storage.getItem(STORAGE_KEY.TOKEN)
   	})
   	if(data.code == 1){
   		id.forEach(item => {
      		var index = state.user.findIndex(value => value.id == item)
         	state.user.splice(index,1)
      	})
   		Toast('已取消关注')
   	}
   },
   //获取用户上传的视频
   async GET_USER_VIDEO({ state }, userId) {
   	let { data } = await http.get(API.GET_USER_VIDEO, {
   		params: {
   			userId
   		}
   	})
   	state.mv = data.reverse().map(item => {
   		return {
   			id: item.id,
   			name: item.name,
   			artist: item.singer,
   			picUrl: API.ROOT + '/upload/' + userId + '/cover/' + item.id + '.jpg'
   		}
   	})
   },
   //上传视频
   async UPLOAD_VIDEO({ state }, { title, singer, formData }) {
   	let { data } = await http.post(API.ADD_USER_VIDEO_INFO,{
         title,
         singer,
         userId: storage.getItem(STORAGE_KEY.USERID),
         csrf_token: storage.getItem(STORAGE_KEY.TOKEN)
      })
   	if(data.code == 1){
   		state.upload_percent = 0
   		await http.post(API.UPLOAD_USER_VIDEO, formData, {
            headers:{
               'Content-Type':'multipart/form-data'
            },
            onUploadProgress: progressEvent => {
               let loaded = progressEvent.loaded
               let total = progressEvent.total
               state.upload_percent = parseInt(loaded/total*100)
            }
         }).then(res => {
         	if(res.data.code == 1){
         		Toast('上传成功')
         	}
         })
   	}
   },
   //删除用户上传的视频
   async DELETE_USER_VIDEO({ state }, id) {
   	let { data } = await http.post(API.DELETE_USER_VIDEO,{
         id,
         userId: storage.getItem(STORAGE_KEY.USERID),
         csrf_token: storage.getItem(STORAGE_KEY.TOKEN)
      })
   	if(data.code == 1){
   		var index = state.mv.findIndex(value => value.id == id)
         state.mv.splice(index, 1)
         Toast('已删除')
   	}
   },
   //判断用户上传视频名称是否已存在
   async IS_VIDEO_EXIST({ state }, name) {
   	let { data } = await http.get(API.IS_VIDEO_EXIST,{
         params: {
            name,
            userId: storage.getItem(STORAGE_KEY.USERID)
         }
      })
   	if(data.code == 0){
   		Toast('视频名称重复，请重新输入')
   		state.is_video_exist = true
   	}else{
   		state.is_video_exist = false
   	}
   },
   //获取用户关注
   async GET_USER_FOLLOW_USER({ state }, userId) {
   	let { data } = await http.get(API.GET_USER_FOLLOW_USER, {
   		params: {
   			userId
   		}
   	})
   	state.user = data.map(item => {
			return {
				id: item.followId,
				name: item.followName,
				picUrl: API.ROOT + '/upload/' + item.followId + '/' + item.followId + '.jpg'
			}
		}).reverse()
		state.follow_user = state.user
   },
   //获取用户粉丝
   async GET_MYUSER_FAN({ state }, userId) {
   	let { data } = await http.get(API.GET_MYUSER_FAN, {
   		params: {
   			userId
   		}
   	})
   	state.user = data.map(item => {
			return {
				id: item.fanId,
				name: item.fanName,
				picUrl: API.ROOT + '/upload/' + item.fanId + '/' + item.fanId + '.jpg'
			}
		}).reverse()
   },
   //删除用户关注的用户
   async DELETE_USER_FOLLOW_USER({ state }, id) {
   	let { data } = await http.post(API.DELETE_USER_FOLLOW_USER, {
   		id,
         userId: storage.getItem(STORAGE_KEY.USERID),
         csrf_token: storage.getItem(STORAGE_KEY.TOKEN)
   	})
   	if(data.code == 1){
   		id.forEach(item => {
      		var index = state.user.findIndex(value => value.id == item)
         	state.user.splice(index,1)
      	})
   		Toast('已取消关注')
   	}
   },
   //添加用户关注的用户
   async ADD_USER_FOLLOW_USER({ state }, user) {
   	await http.post(API.ADD_USER_FOLLOW_USER, {
   		user,
         userId: storage.getItem(STORAGE_KEY.USERID),
         csrf_token: storage.getItem(STORAGE_KEY.TOKEN)
   	}).then(res => {
   		Toast('已关注')
   	})
   },
   //获取用户信息
   async GET_USER_INFO({ state }, userId) {
   	let { data } = await http.get(API.GET_USER_INFO, {
   		params: {
   			userId
   		}
   	})
   	state.user_detail = {
   		nickname: data.username,
   		sex: data.sex,
   		signature: data.userInfo,
   		avatarUrl: API.ROOT + '/upload/' + data.userId + '/' + data.userId + '.jpg?rnd='+Math.random()
   	}
   },
   //修改用户信息
   async UPDATE_USER_INFO({ state }, { name, sex, desc }) {
   	let { data } = await http.post(API.UPDATE_USER_INFO, {
			userId: storage.getItem(STORAGE_KEY.USERID),
         csrf_token: storage.getItem(STORAGE_KEY.TOKEN),
         username: storage.getItem(STORAGE_KEY.USERNAME),
         name,
         sex,
         desc
   	})
   	if(data.code == 1){
   		storage.setItem(STORAGE_KEY.USERNAME, name)
   		state.is_nickname_exist = false
   	}else{
   		Toast('该昵称已存在')
   		state.is_nickname_exist = true
   	}
   },
   //上传用户头像
   async UPLOAD_USER_AVATAR({ state }, dataUrl){
   	function dataURLtoBlob(url) {
         var arr = url.split(','), mime = arr[0].match(/:(.*?);/)[1],
         bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n)
         while(n--){
            u8arr[n] = bstr.charCodeAt(n)
         }
         return new Blob([u8arr], {type:mime})
      }
   	var formData = new FormData()
      formData.append("file", dataURLtoBlob(dataUrl))
      formData.append('userId', storage.getItem(STORAGE_KEY.USERID))
      formData.append('csrf_token', storage.getItem(STORAGE_KEY.TOKEN))
   	let { data } = await http.post(API.UPLOAD_USER_AVATAR, formData, {
         headers: {
            'Content-Type': 'multipart/form-data'
         }
      })
   },
   //播放全部歌曲
   PLAY_ALL_MUSIC({ state, dispatch }){
   	let storage_music = []
      if (storage.getItem(STORAGE_KEY.MUSIC)) {
         storage_music = storage.getItem(STORAGE_KEY.MUSIC)
      }
      state.song.forEach((item) => {
      	var index = storage_music.findIndex(value => value.id == item.id)
         if (index > -1) {
            storage_music.splice(index, 1)
         }
      })
      storage.setItem(STORAGE_KEY.MUSIC, state.song.concat(storage_music))
      if(state.song[0]){
      	dispatch('PLAY_MUSIC', state.song[0].id)
      }
   },
   //下一首播放
   PLAY_NEXT_SONG({ state, dispatch }){
   	let storage_music = []
   	let song = []
   	if($('.check:checked').length == 0){
   		return Toast('请选择操作的歌曲')
   	}
      if (storage.getItem(STORAGE_KEY.MUSIC)) {
         storage_music = storage.getItem(STORAGE_KEY.MUSIC)
      }
      $('.check').each(function (i) {
      	if(this.checked){
      		song.push(state.song[i])
      	}
      })
      song.forEach((item) => {
      	var index = storage_music.findIndex(value => value.id == item.id)
         if (index > -1) {
            storage_music.splice(index, 1)
         }
      })
      if(state.audio.picUrl){
      	let i =  storage_music.findIndex(item => item.id == state.audio.id)
      	storage_music.splice(i+1, 0, ...song)
      	storage.setItem(STORAGE_KEY.MUSIC, storage_music)
      }else{
      	dispatch('PLAY_MUSIC', song[0].id)
      	storage.setItem(STORAGE_KEY.MUSIC, song)
      }
      Toast('已添加到下一首播放')
   },
   //获取用户位置信息
   GET_USER_LOCATION({ state }){
   	if(storage.getItem(STORAGE_KEY.TOKEN)){
			let geolocation = new BMap.Geolocation()
			geolocation.getCurrentPosition(function(r){
				let lng = r.point.lng
				let lat = r.point.lat
				http.post(API.GET_USER_LOCATION, { 
					lng, 
					lat,
					userId: storage.getItem(STORAGE_KEY.USERID),
         		csrf_token: storage.getItem(STORAGE_KEY.TOKEN)
				})
			})
		}
   },
   //获取附近的用户
   async GET_NEARBY_USER({ state }){
   	let { data } = await http.get(API.GET_NEARBY_USER, {
   		params: {
   			userId: storage.getItem(STORAGE_KEY.USERID)
   		}
   	})
   	state.user = data.map(item => {
			return {
				id: item.userId,
				name: item.username,
				picUrl: API.ROOT + '/upload/' + item.userId + '/' + item.userId + '.jpg',
				distance: (item.distance < 0.01 ? '<0.01' : item.distance.toFixed(2)) + 'km'
			}
		}).reverse()
   },
   //获取用户详情
   async GET_MYUSER_DETAIL({ state }, userId) {
   	let { data } = await http.get(API.GET_MYUSER_DETAIL, {
   		params: {
   			userId
   		}
   	})
   	state.user_detail = {
			id: data.userId,
			name: data.username,
			sex: data.sex,
			followCount: data.followCount,
			fanCount: data.fanCount,
			avatarUrl: API.ROOT + '/upload/' + data.userId + '/' + data.userId + '.jpg?rnd='+Math.random(), 
			signature: data.userInfo
		}
   }
}

export default actions