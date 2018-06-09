import Vuex from 'vuex'
import mutations from './mutations'
import actions from './actions'

const state = {
	banner: [],
	personalized_playlist: [],
	personalized_album: [],
	personalized_mv: [],
	recommend_song: [],
	toplist: [],
	mv: [],
	mv_url: '',
	playlist: [],
	playlist_detail: {},
	album: [],
	album_detail: {},
	category: {},
	song: [],
	artist: [],
	artist_detail: {},
	artist_desc: {},
	user: [],
	user_detail: {},
	follow_user: {},
	follow_neteaseuser: {},
	search_result1: [],
	search_result2: [],
	collect_music: [],
	createlist: [],
	creatlist_cover: '',
	audio: {
		id: '',
		picUrl: '',
		title: '网易云音乐',
		artist: '',
		currentTime: '00:00',
		totalTime: '',
		lastRunTime: 0,
		trans: true,
		background: 'blurCover',
		fontSize: '16px'
	},
	source: 'netease',
	isAuthenticated: false,
	is_video_exist: false,
	upload_percent: 0,
	is_nickname_exist: false
}

export default() => {
	return new Vuex.Store({
		state,
		mutations,
		actions
	})
}