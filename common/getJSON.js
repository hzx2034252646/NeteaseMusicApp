import Vue from 'vue'
import API from '~/api'

function getSongJSON(music){
   let arr=[]
	let title,singer,_singer,album,pic,picId,json
	for(let i=0;i<music.length;i++){
			title=music[i].transNames?music[i].name+'('+music[i].transNames[0]+')':music[i].name
		singer=music[i].artists[0].name
		_singer = [
      	{ name: singer, id: music[i].artists[0].id }
      ]
		if(music[i].artists.length>1){
			for(let j=1;j<music[i].artists.length;j++){
				singer=singer+'、'+music[i].artists[j].name
				_singer.push({
            	name: music[i].artists[j].name,
            	id: music[i].artists[j].id
            })
			}
		}
		album=music[i].album.transNames?music[i].album.name+'('+music[i].album.transNames[0]+')':music[i].album.alias[0]?music[i].album.name+'('+music[i].album.alias[0]+')':music[i].album.name
		pic=music[i].album.picUrl + '?param=400y400'
		picId=music[i].album.picId_str?music[i].album.picId_str:music[i].album.picId
		json={
			name:title,
			singer:singer,
			_singer:_singer,
			album:album,
			source:'netease',
			id:music[i].id,
			picId:picId,
			albumId:music[i].album.id,
			pic:pic
		}
		arr.push(json)
    }
    return arr
}

function getMusicJSON(music) {
   let arr = []
   let title, singer, _singer, album, pic, picId, json
   for (let i = 0; i < music.length; i++) {
      title = music[i].tns ? music[i].name + '(' + music[i].tns[0] + ')' : music[i].name
      singer = music[i].ar[0].tns && music[i].ar[0].tns[0] ? music[i].ar[0].name + '(' + music[i].ar[0].tns[0] + ')' : music[i].ar[0].name
      _singer = [
      	{ name: singer, id: music[i].ar[0].id }
      ]
      if (music[i].ar.length > 1) {
         for (let j = 1; j < music[i].ar.length; j++) {
            let artist = music[i].ar[j].tns && music[i].ar[j].tns[0] ? music[i].ar[j].name + '(' + music[i].ar[j].tns[0] + ')' : music[i].ar[j].name
            singer = singer + '、' + artist
            _singer.push({
            	name: artist,
            	id: music[i].ar[j].id
            })
         }
      }
      album = music[i].al.tns&&music[i].al.tns[0]? music[i].al.name + '(' + music[i].al.tns[0] + ')' : music[i].al.name
      try{
      	pic = music[i].al.picUrl + '?param=400y400'
      }catch(err){}
      picId = music[i].al.pic_str ? music[i].al.pic_str : music[i].al.pic
      json = {
         name: title,
         singer: singer,
         _singer: _singer,
         album: album,
         source: 'netease',
         id: music[i].id,
         picId: picId,
         albumId: music[i].al.id,
         pic: pic
      }
      arr.push(json)
   }
   return arr
}

function getMVJSON(mv) {
   let arr=[]
   let singer, pic, json
   for (let i = 0; i < mv.length; i++) {
      if (!mv[i].artists[0]) {
         singer = mv[i].artistName
      } else {
         singer = mv[i].artists[0].name
      }
      if (mv[i].artists.length > 1) {
         for (let j = 1; j < mv[i].artists.length; j++) {
            singer = singer + '、' + mv[i].artists[j].name
         }
      }
      pic = mv[i].cover.replace(/http:\/\/(p3|p4)/,'http://p1')
      json = {
         name: mv[i].name,
         singer: singer,
         id: mv[i].id,
         pic: pic
      }
      arr.push(json)
   }
   return arr
}
function getNewMVJSON(mv) {
   let arr = []
   let singer, pic, json
   for (let i = 0; i < mv.length; i++) {
      singer = mv[i].artists[0].name
      if (mv[i].artists.length > 1) {
         for (let j = 1; j < mv[i].artists.length; j++) {
            singer = singer + '、' + mv[i].artists[j].name
         }
      }
      pic = mv[i].picUrl
      json = {
         name: mv[i].name,
         singer: singer,
         id: mv[i].id,
         pic: pic
      }
      arr.push(json)
   }
   return arr
}
function getSingerMVJSON(mv) {
   let arr = []
   let singer, pic, json
   for (let i = 0; i < mv.length; i++) {
      singer = mv[i].artistName
      pic = mv[i].imgurl.replace(/http:\/\/(p3|p4)/,'http://p1')
      json = {
         name: mv[i].name,
         singer: singer,
         id: mv[i].id,
         pic: pic
      }
      arr.push(json)
   }
   return arr
}
function getSingerJSON(singer) {
   let arr=[]
   let artist, pic, json
   for (let i = 0; i < singer.length; i++) {
      artist = singer[i].name
      artist = singer[i].transNames ? artist + '(' + singer[i].transNames[0] + ')' : artist
      pic = singer[i].img1v1Url
      json = {
         name: artist,
         id: singer[i].id,
         pic: pic
      }
      arr.push(json)
   }
   return arr
}

function getPlayListJSON(playlist) {
   let arr=[]
   let json, pic, count
   for (let i = 0; i < playlist.length; i++) {
      pic = playlist[i].coverImgUrl
      count = playlist[i].playCount
      if (count / 10000 >= 10) {
         count = parseInt(count / 10000) + '万'
      }
      json = {
         name: playlist[i].name,
         id: playlist[i].id,
         playCount: count,
         pic: pic,
         user: playlist[i].creator.nickname,
         userId: playlist[i].creator.userId
      }
      arr.push(json)
   }
   return arr
}
function getNewPlayListJSON(playlist) {
   let arr = []
   let json, pic, count
   for (let i = 0; i < playlist.length; i++) {
      pic = playlist[i].picUrl 
      count = playlist[i].playCount
      if (count / 10000 >= 10) {
         count = parseInt(count / 10000) + '万'
      }
      json = {
         name: playlist[i].name,
         id: playlist[i].id,
         playCount: count,
         pic: pic
      }
      arr.push(json)
   }
   return arr;
}
function getTopListJSON(playlist) {
   let arr = []
   let json, pic, count
   for (let i = 0; i < playlist.length; i++) {
      pic = playlist[i].coverImgUrl 
      count = playlist[i].playCount
      if (count / 10000 >= 10) {
         count = parseInt(count / 10000) + '万'
      }
      json = {
         name: playlist[i].name,
         id: playlist[i].id,
         playCount: count,
         pic: pic
      }
      arr.push(json)
   }
   return arr;
}
function getAlbumJSON(album) {
   let arr = []
   let title, singer, pic, json
   for (let i = 0; i < album.length; i++) {
      title = album[i].transNames ? album[i].name + '(' + album[i].transNames[0] + ')' : album[i].name
      singer = album[i].artists[0].name
      if (album[i].artists.length > 1) {
         for (let j = 1; j < album[i].artists.length; j++) {
            singer = singer + '、' + album[i].artists[j].name
         }
      }
      pic = album[i].picUrl ? album[i].picUrl.replace(/http:\/\/(p3|p4)/,'http://p1'):''
      json = {
         name: title,
         singer: singer,
         id: album[i].id,
         pic: pic
      }
      arr.push(json)
   }
   return arr
}

export {
   getSongJSON,
   getMusicJSON,
   getMVJSON,
   getNewMVJSON,
   getSingerMVJSON,
   getSingerJSON,
   getPlayListJSON,
   getNewPlayListJSON,
   getTopListJSON,
   getAlbumJSON
}
