import {
	getSongJSON,
	getMusicJSON,
	getAlbumJSON,
	getPlayListJSON,
	getNewPlayListJSON,
	getMVJSON,
	getNewMVJSON,
	getSingerMVJSON,
	getTopListJSON,
	getSingerJSON
} from '~/common/getJSON'
import {
	formatDate
} from '~/common/function'


const mutations = {
 	GET_PERSONALIZED_PLAYLIST(state, data) {
		let array = typeof data == 'object' ? data.result : JSON.parse(data.substring(1)).result
		state.personalized_playlist = getNewPlayListJSON(array).map(item => {
			return {
				id: item.id,
				name: item.name,
				picUrl: item.pic+'?param=200y200',
				playCount: item.playCount
			}
		})
	},
	GET_PERSONALIZED_ALBUM(state, data) {
		let array = typeof data == 'object' ? data.result : JSON.parse(data.substring(1)).result
		state.personalized_album = getAlbumJSON(array).map(item => {
			return {
				id: item.id,
				name: item.name,
				artist: item.singer,
				picUrl: item.pic+'?param=200y200'
			}
		})
	},
	GET_PERSONALIZED_MV(state, data) {
		let array = typeof data == 'object' ? data.result : JSON.parse(data.substring(1)).result
		state.personalized_mv = getNewMVJSON(array).map(item => {
			return {
				id: item.id,
				name: item.name,
				artist: item.singer,
				picUrl: item.pic+'?param=300y200',
				source: 'netease'
			}
		})
	},
	GET_TOPLIST(state, data) {
		state.toplist = getTopListJSON(data.list).map(item => {
			return {
				id: item.id,
				name: item.name,
				picUrl: item.pic+'?param=200y200',
				playCount: item.playCount
			}
		})
	},
	GET_HOT_MV(state, data) {
		state.mv = getMVJSON(data.data).map(item => {
			return {
				id: item.id,
				name: item.name,
				artist: item.singer,
				picUrl: item.pic+'?param=300y200',
				source: 'netease'
			}
		})
	},
	GET_PLAYLIST_DETAIL(state, data) {
		let song = getMusicJSON(data.playlist.tracks).map(item => {
			return {
				name: item.name,
	         artist: item.singer,
	         singer: item._singer,
	         source: item.source,
	         id: item.id,
	         picId: item.picId,
	         picUrl: item.pic,
	         album: {
	         	name: item.album,
	         	id: item.albumId
	         }
			}
		})
		state.playlist_detail = {
			song,
			id: data.playlist.id,
			name: data.playlist.name,
			picUrl: data.playlist.coverImgUrl,
			tag: data.playlist.tags,
			desc: data.playlist.description?data.playlist.description.replace(/\n/g,'<br>'):'',
			playCount: data.playlist.playCount,
			creator:{
				id: data.playlist.creator.userId,
				name: data.playlist.creator.nickname,
				picUrl: data.playlist.creator.avatarUrl
			}
		}
		state.song = song 
	},
	GET_PLAYLIST_CATEGORY(state, data) {
		let cat = data.sub, cat1=[], cat2=[], cat3=[], cat4=[], cat5=[]
		for(let i = 0; i<cat.length; i++){
			if(cat[i].category==0){
 				cat1.push(cat[i].name);
 			}
 			if(cat[i].category==1){
 				if(cat[i].name!='R&B/Soul'&&cat[i].name!='New Age'&&cat[i].name!='Bossa Nova'){
 					cat2.push(cat[i].name);
 				}
 			}
 			if(cat[i].category==2){
 				cat3.push(cat[i].name);
 			}
 			if(cat[i].category==3){
 				cat4.push(cat[i].name);
 			}
 			if(cat[i].category==4){
 				cat5.push(cat[i].name);
 			}
		}
		state.category = {
			language: cat1,
			style: cat2,
			scene: cat3,
			emotion: cat4,
			theme: cat5
		}
	},
	GET_PLAYLIST_BYCATEGORY(state, data) {
		let arr = state.playlist
		getPlayListJSON(data.playlists).forEach(item => {
			arr.push({
				id: item.id,
				name: item.name,
				picUrl: item.pic+'?param=200y200',
				playCount: item.playCount,
				creator: {
					id: item.userId,
					name: item.user
				}
			})
		})
		state.playlist = arr
	},
	GET_ALBUM_DETAIL(state, data) {
		let song = getMusicJSON(data.songs).map(item => {
			return {
				name: item.name,
	         artist: item.singer,
	         singer: item._singer,
	         source: item.source,
	         id: item.id,
	         picId: item.picId,
	         picUrl: item.pic,
	         album: {
	         	name: item.album,
	         	id: item.albumId
	         }
			}
		})
		let artist = data.album.artists[0].name
		if(data.album.artists.length > 1){
			for(let j = 1; j < data.album.artists.length; j++){
				artist = artist + '、' + data.album.artists[j].name
			}
		}
		state.album_detail = {
			song,
			id: data.album.id,
			name: data.album.name,
			alias: data.album.alias[0],
			artist, 
			picUrl: data.album.picUrl.replace(/http:\/\/(p3|p4)/,'http://p1'),
			desc: data.album.description?data.album.description.replace(/\n/g,'<br>'):'',
			company: data.album.company,
			publishTime: formatDate(data.album.publishTime),
			subType: data.album.subType
		}
		state.song = song
	},
	GET_NEW_ALBUM(state, data) {
		let arr = state.album
		getAlbumJSON(data.albums).forEach(item => {
			arr.push({
				id: item.id,
				name: item.name,
				artist: item.singer,
				picUrl: item.pic+'?param=200y200'
			})
		})
		state.album = arr
	},
	GET_NEW_SONG(state, data) {
		state.song = getSongJSON(data.data).map(item => {
			return {
				name: item.name,
	         artist: item.singer,
	         singer: item._singer,
	         source: item.source,
	         id: item.id,
	         picId: item.picId,
	         picUrl: item.pic,
	         album: {
	         	name: item.album,
	         	id: item.albumId
	         }
			}
		})
	},
	GET_HOT_ARTIST(state, data) {
		state.artist = getSingerJSON(data.list.artists).map(item => {
			return {
				id: item.id,
				name: item.name,
				picUrl: item.pic+'?param=100y100'
			}
		})
	},
	GET_ARTIST_DETAIL(state, data) {
		let artist = data.artist
		state.artist_detail = {
			id: artist.id,
			name: artist.trans?artist.name+'（'+artist.trans+'）':artist.name,
			picUrl: artist.picUrl.replace('http://p4','http://p3'),
			imgUrl: artist.img1v1Url
		}
	},
	GET_ARTIST_MUSIC(state, data) {
		let arr = state.song
		getSongJSON(data.songs).forEach(item => {
			arr.push({
				name: item.name,
	         artist: item.singer,
	         singer: item._singer,
	         source: item.source,
	         id: item.id,
	         picId: item.picId,
	         picUrl: item.pic,
	         album: {
	         	name: item.album,
	         	id: item.albumId
	         }
			})
		})
		state.song = arr
	},
	GET_ARTIST_ALBUM(state, data) {
		let arr = state.album
		getAlbumJSON(data.hotAlbums).forEach(item => {
			arr.push({
				id: item.id,
				name: item.name,
				artist: item.singer,
				picUrl: item.pic+'?param=200y200'
			})
		})
		state.album = arr
	},
	GET_ARTIST_MV(state, data) {
		let arr = state.mv
		getSingerMVJSON(data.mvs).forEach(item => {
			arr.push({
				id: item.id,
				name: item.name,
				artist: item.singer,
				picUrl: item.pic+'?param=300y200',
				source: 'netease'
			})
		})
		state.mv = arr
	},
	GET_ARTIST_DESC(state, data) {
		var info=data.introduction
		var json,arr=[]
		for(var i in info){
	      json={
	         ti:info[i].ti,
	         txt:info[i].txt.replace(/\n/g,'<br>')
	      }
	      arr.push(json)
	   }
	   state.artist_desc = {
	   	briefDesc: data.briefDesc,
	   	desc: arr
	   }
	},
	GET_SEARCH_SONG(state, data) {
		let arr = state.song
		if(typeof data.result.songs == 'undefined'){
			return
		}
		getSongJSON(data.result.songs).forEach(item => {
			arr.push({
				name: item.name,
	         artist: item.singer,
	         singer: item._singer,
	         source: item.source,
	         id: item.id,
	         picId: item.picId,
	         picUrl: item.pic,
	         album: {
	         	name: item.album,
	         	id: item.albumId
	         }
			})
		})
		state.song = arr
	},
	GET_SEARCH_ARTIST(state, data) {
		if(typeof data.result.artists == 'undefined'){
			return
		}
		state.artist = getSingerJSON(data.result.artists).map(item => {
			return {
				id: item.id,
				name: item.name,
				picUrl: item.pic+'?param=100y100'
			}
		})
	},
	GET_SEARCH_ALBUM(state, data) {
		let arr = state.album
		if(typeof data.result.albums == 'undefined'){
			return
		}
		getAlbumJSON(data.result.albums).forEach(item => {
			arr.push({
				id: item.id,
				name: item.name,
				artist: item.singer,
				picUrl: item.pic+'?param=200y200'
			})
		})
		state.album = arr
	},
	GET_SEARCH_MV(state, data) {
		let arr = state.mv
		if(typeof data.result.mvs == 'undefined'){
			return
		}
		getMVJSON(data.result.mvs).forEach(item => {
			arr.push({
				id: item.id,
				name: item.name,
				artist: item.singer,
				picUrl: item.pic+'?param=300y200',
				source: 'netease'
			})
		})
		state.mv = arr
	},
	GET_TENCENT_MV(state, data) {
		let arr = state.mv
		if(!data[0]){
			return
		}
		data.forEach(item => {
			let singer = item.artist[0]
	      if (item.artist.length > 1) {
	         for (let j = 1; j < item.artist.length; j++) {
	            singer = singer + '、' + item.artist[j]
	         }
	      }
			arr.push({
				id: item.id,
				name: item.name,
				artist: singer,
				source: item.source,
				picUrl: item.pic_url
			})
		})
		state.mv = arr
	},
	GET_KUGOU_MV(state, data) {
		let arr = state.mv
		if(!data[0]){
			return
		}
		data.forEach(item => {
			arr.push({
				id: item.id,
				name: item.name,
				artist: item.artist,
				source: item.source,
				picUrl: item.pic_url
			})
		})
		state.mv = arr
	},
	GET_SEARCH_PLAYLIST(state, data) {
		let arr = state.playlist
		if(typeof data.result.playlists == 'undefined'){
			return
		}
		getPlayListJSON(data.result.playlists).forEach(item => {
			arr.push({
				id: item.id,
				name: item.name,
				picUrl: item.pic+'?param=200y200',
				playCount: item.playCount,
				creator: {
					id: item.userId,
					name: item.user
				}
			})
		})
		state.playlist = arr
	},
	GET_SEARCH_USER(state, data) {
		let arr = state.user
		if(typeof data.result.userprofiles == 'undefined'){
			return
		}
		data.result.userprofiles.forEach(item => {
			arr.push({
				id: item.userId,
				name: item.nickname,
				picUrl: item.avatarUrl+'?param=100y100'
			})
		})
		state.user = arr
	},
	GET_SEARCH_SUGGEST(state, { data, keywords }) {
		function setColor(str){
         var substr=str.match(new RegExp(keywords,'i'))
         str=str.replace(substr,'<span style="color:#d43c33">'+substr+'</span>')
         return str
      }
		var arr1 = [],arr2 = []
		if(!data.result){
         return
      }
		var order = data.result.order
		if(data.result.artists){
         var singer = data.result.artists
         for(var i = 0;i<singer.length;i++) {
            arr1.push(setColor(singer[i].name))
         }
      }else{
         arr1 = []
      }
      if(data.result.songs){
         var song = data.result.songs
         for(var i = 0;i<song.length;i++){
            arr2.push(setColor(song[i].name+' - '+song[i].artists[0].name))
         }
      }else{
         arr2 = []
      }
      if(order[0] == 'artists'){
         state.search_result1 = arr1
         state.search_result2 = arr2
      }
      if(order[0] == 'songs'){
         state.search_result1 = arr2
         state.search_result2 = arr1
      }
	},
	GET_USER_DETAIL(state, data) {
		let user = data.profile
		state.user_detail = {
			id: user.userId,
			name: user.nickname,
			gender: user.gender,
			followCount: user.follows,
			fanCount: user.followeds,
			avatarUrl: user.avatarUrl, 
			bgUrl: user.backgroundUrl,
			signature: user.signature,
			desc: user.description
		}
	},
	GET_USER_PLAYLIST(state, data) {
		state.playlist = getPlayListJSON(data.playlist).map(item => {
			return {
				id: item.id,
				name: item.name,
				picUrl: item.pic+'?param=200y200',
				playCount: item.playCount,
				creator: {
					id: item.userId,
					name: item.user
				}
			}
		})
	},
	GET_USER_FOLLOW(state, data) {
		let arr = state.user
		data.follow.forEach(item => {
			arr.push({
				id: item.userId,
				name: item.nickname,
				picUrl: item.avatarUrl+'?param=100y100'
			})
		})
		state.user = arr
	},
	GET_USER_FAN(state, data) {
		let arr = state.user
		data.followeds.forEach(item => {
			arr.push({
				id: item.userId,
				name: item.nickname,
				picUrl: item.avatarUrl+'?param=100y100'
			})
		})
		state.user = arr
	},
	GET_USER_MUSIC(state, data) {
		state.song = data.map(item => {
			return {
				name: item.name,
	         artist: item.singer,
	         source: item.source,
	         id: item.id,
	         picId: item.picId,
	         picUrl: item.pic,
	         album: {
	         	name: item.album
	         }
			}
		}).reverse()
	},
	GET_USER_CREATELIST(state, data) {
		state.createlist = data.map(item => {
			return {
				id: item.id,
				name: item.name,
				picUrl: item.cover,
				songCount: item.songCount
			}
		}).reverse()
	},
	GET_USER_CREATELIST_MUSIC(state, data) {
		state.playlist_detail.song = data.map(item => {
			return {
				name: item.name,
	         artist: item.singer,
	         source: item.source,
	         id: item.id,
	         listId: item.listId,
	         picId: item.picId,
	         picUrl: item.pic,
	         album: {
	         	name: item.album
	         }
			}
		}).reverse()
		state.song = state.playlist_detail.song
	},
	COLLECT_MUSIC(state, music) {
		var arr = []
		music.forEach(item => {
			arr.push({
				id: item.id,
            name: item.name,
            singer: item.artist,
            album: item.album.name,
            picId: item.picId,
            pic: item.picUrl,
            source: item.source
			})
		})
      state.collect_music = arr
	},
	GET_USER_COLLECT_PLAYLIST(state, data) {
		state.playlist = data.map(item => {
			return {
				id: item.id,
				name: item.name,
				picUrl: item.pic
			}
		}).reverse()
	},
	GET_USER_COLLECT_ALBUM(state, data) {
		state.album = data.map(item => {
			return {
				id: item.id,
				name: item.name,
				artist: item.singer,
				picUrl: item.pic
			}
		}).reverse()
	}
}

export default mutations