


const	IP = 'localhost'


const API = {
	ROOT: `http://${IP}:80/api`,

	NODE: `http://${IP}:3000`,

	/*
	   网易云相关接口
	*/
	
	GET_BANNER: '/api.php?type=banner&source=tencent', //获取banner

	GET_NEW_SONG: '/NeteaseAPI.php?types=newSong', //获取最新单曲
	
	GET_PERSONALIZED_PLAYLIST: '/NeteaseAPI.php?types=personalized_playlist', //获取推荐歌单

	GET_PERSONALIZED_ALBUM: '/NeteaseAPI.php?types=personalized_album', //获取推荐专辑

	GET_PERSONALIZED_MV: '/NeteaseAPI.php?types=personalized_mv', //获取推荐MV

	GET_ALBUM_DETAIL: '/album', //获取专辑详情

	GET_NEW_ALBUM: '/top/album', //获取最新专辑

	GET_TOPLIST: '/NeteaseAPI.php?types=toplist', //获取排行榜

	GET_HOT_MV: '/NeteaseAPI.php?types=mvTopList', //获取MV排行榜
	
	GET_MV_URL: '/api.php?type=mv_url', //获取MV链接

	GET_HOT_ARTIST: '/NeteaseAPI.php?types=artistTopList', //获取热门歌手

	GET_PLAYLIST_CATEGORY: '/NeteaseAPI.php?types=category', //获取歌单类别

	GET_PLAYLIST_BYCATEGORY: '/NeteaseAPI.php?types=playlist', //获取分类歌单

	GET_PLAYLIST_DETAIL: '/playlist/detail', //获取歌单详情

	GET_ARTIST_DETAIL: '/artists', //获取歌手详情

	GET_ARTIST_MUSIC: '/NeteaseAPI.php?types=singer_song', //获取歌手歌曲

	GET_ARTIST_ALBUM: '/NeteaseAPI.php?types=singer_album', //获取歌手专辑

	GET_ARTIST_MV: '/NeteaseAPI.php?types=singer_mv', //获取歌手MV

	GET_ARTIST_DESC: '/NeteaseAPI.php?types=singer_desc', //获取歌手介绍

	GET_USER_DETAIL: '/NeteaseAPI.php?types=user_detail', //获取用户详情

	GET_USER_PLAYLIST: '/NeteaseAPI.php?types=user_playlist', //获取用户歌单

	GET_USER_FOLLOW: '/NeteaseAPI.php?types=follow', //获取用户关注

	GET_USER_FAN: '/NeteaseAPI.php?types=fan', //获取用户粉丝

	GET_MUSIC_URL: '/api.php?type=url', //获取歌曲链接

	GET_MUSIC_PIC: '/api.php?type=pic', //获取歌曲图片

	GET_MUSIC_LYRIC: '/api.php?type=lyric', //获取歌曲歌词

	/*
	   搜索相关接口
	*/

	GET_SEARCH_MUSIC: '/api.php?type=search', //搜索多平台歌曲

	GET_SEARCH_SONG: '/NeteaseAPI.php?types=search&type=1', //搜索网易云歌曲

	GET_SEARCH_ARTIST: '/NeteaseAPI.php?types=search&type=100', //搜索网易云歌手

	GET_SEARCH_ALBUM: '/NeteaseAPI.php?types=search&type=10', //搜索网易云专辑

	GET_SEARCH_MV: '/NeteaseAPI.php?types=search&type=1004', //搜索网易云MV
	
	GET_TENCENT_MV: '/api.php?type=search&source=tencent', //搜索腾讯MV
	
	GET_KUGOU_MV: '/api.php?type=kugou_mv&source=kugou', //搜索酷狗MV

	GET_SEARCH_PLAYLIST: '/NeteaseAPI.php?types=search&type=1000', //搜索网易云歌单

	GET_SEARCH_USER: '/NeteaseAPI.php?types=search&type=1002', //搜索网易云用户

	GET_SEARCH_SUGGEST: '/search/suggest', //搜索建议
	
	/*
	   用户相关接口
	*/

	REGISTER: '/register.php', //用户注册

	LOGIN: '/login.php', //用户登录
	
	GET_USER_LOCATION: '/add.php?type=location', //获取用户位置信息
	
	GET_NEARBY_USER: '/load.php?type=nearby_user', //获取附近的用户

	GET_MYUSER_DETAIL: '/load.php?type=myUser_detail', //获取用户详情

	GET_MYUSER_FAN: '/load.php?type=fan', //获取用户的粉丝

	/*
	   用户创建歌单相关接口
	*/

	GET_USER_CREATELIST: '/load.php?type=createlist', //获取用户创建的歌单

	GET_ALL_USER_CREATELIST: '/load.php?type=createlist_all', //获取所有用户创建的歌单

	GET_USER_CREATELIST_DETAIL: '/load.php?type=createlist_detail', //获取用户创建的歌单详情

	ADD_USER_CREATELIST: '/add.php?type=createlist', //添加用户创建的歌单

	UPDATE_USER_CREATELIST: '/modify.php?type=createlist', //编辑用户创建的歌单

	DELETE_USER_CREATELIST: '/delete.php?type=createlist', //删除用户创建的歌单

	UPDATE_USER_CREATELIST_COVER: '/modify.php?type=createlist_cover', //修改用户创建的歌单封面

	/*
	   用户收藏歌曲相关接口
	*/
	GET_USER_MUSIC: '/load.php?type=music_all', //获取用户收藏的所有歌曲

	GET_USER_CREATELIST_MUSIC: '/load.php?type=music', //获取用户收藏的歌曲

	ADD_USER_CREATELIST_MUSIC: '/add.php?type=music', //添加用户收藏的歌曲

	DELETE_USER_CREATELIST_MUSIC: '/delete.php?type=music', //删除用户收藏的歌曲

	/*
	   用户收藏歌单相关接口
	*/

	GET_USER_COLLECT_PLAYLIST: '/load.php?type=collectlist', //获取用户收藏的歌单

	ADD_USER_COLLECT_PLAYLIST: '/add.php?type=collectlist', //添加用户收藏的歌单

	DELETE_USER_COLLECT_PLAYLIST: '/delete.php?type=collectlist', //删除用户收藏的歌单

	/*
	   用户收藏专辑相关接口
	*/
	
	GET_USER_COLLECT_ALBUM: '/load.php?type=album', //获取用户收藏的专辑

	ADD_USER_COLLECT_ALBUM: '/add.php?type=album', //添加用户收藏的专辑

	DELETE_USER_COLLECT_ALBUM: '/delete.php?type=album', //删除用户收藏的专辑

	/*
	   用户上传视频相关接口
	*/

	GET_USER_VIDEO: '/load.php?type=video', //获取用户上传的视频信息

	ADD_USER_VIDEO_INFO: '/add.php?type=video', //添加用户上传的视频信息

	UPLOAD_USER_VIDEO: '/upload.php?type=video', //添加用户上传的视频

	DELETE_USER_VIDEO: '/delete.php?type=video', //删除用户上传的视频及信息

	IS_VIDEO_EXIST: '/load.php?type=is_video_exist', //判断用户上传视频名称是否重复

	/*
	   关注歌手相关接口
	*/

	GET_USER_FOLLOW_SINGER: '/load.php?type=follow_singer', //获取用户关注的歌手

	ADD_USER_FOLLOW_SINGER: '/add.php?type=follow_singer', //添加用户关注的歌手

	DELETE_USER_FOLLOW_SINGER: '/delete.php?type=follow_singer', //删除用户关注的歌手

	/*
	   关注网易云用户相关接口
	*/

	GET_USER_FOLLOW_NETEASEUSER: '/load.php?type=follow_neteaseUser', //获取用户关注的网易云用户

	ADD_USER_FOLLOW_NETEASEUSER: '/add.php?type=follow_neteaseUser', //添加用户关注的网易云用户

	DELETE_USER_FOLLOW_NETEASEUSER: '/delete.php?type=follow_neteaseUser', //删除用户关注的网易云用户

	/*
	   关注用户相关接口
	*/

	GET_USER_FOLLOW_USER: '/load.php?type=follow_user', //获取用户关注的用户

	ADD_USER_FOLLOW_USER: '/add.php?type=follow_user', //添加用户关注的用户

	DELETE_USER_FOLLOW_USER: '/delete.php?type=follow_user', //删除用户关注的用户

	/*
	   用户个人设置相关接口
	*/

	UPDATE_USER_INFO: '/modify.php?type=userInfo', //修改用户个人信息

	GET_USER_INFO: '/load.php?type=userInfo', //获取用户个人信息

	UPLOAD_USER_AVATAR: '/upload.php?type=avatar', //上传用户头像

	UPDATE_USER_PASSWORD: '/modify.php?type=password', //修改用户密码

}

export default API