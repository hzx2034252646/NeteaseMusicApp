<template>
	<div>
		<header class="mui-bar mui-bar-nav">
			<a class="mui-icon mui-icon-back mui-pull-left" href="javascript:history.back()"></a>
			<h1 class="mui-title">我的收藏</h1>
			<span class="mui-icon mui-icon-search mui-pull-right" @tap="showSearchOption"></span>
		</header>
		<div class="buttons-tab">
			<a class="tab-link button tab-active">歌单</a>
			<a class="tab-link button">专辑</a>
		</div>
		<div class="container">
			<div class="tabs">
				<div class="tab active">
					<m-collect-playlist 
						:playlist="playlist" 
						:isOption="true"
						@on-current-playlist="onCurrentPlaylist">
					</m-collect-playlist>
					<p class="loading" v-show="loading"><span class="mui-spinner"></span>正在加载中</p>
					<p class="loading" v-show="notFound">还没有收藏歌单</p>
				</div>
				<div class="tab">
					<m-collect-album 
						:album="album" 
						:isOption="true"
						@on-current-album="onCurrentAlbum">
					</m-collect-album>
					<p class="loading" v-show="loading"><span class="mui-spinner"></span>正在加载中</p>
					<p class="loading" v-show="notFound">还没有收藏专辑</p>
				</div>
			</div>
		</div>
		<m-playlist-option 
			:optionVisible="playlistOptionVisible" 
			@changeVisible="changePlaylistOptionVisible" 
			:currentPlaylist="currentPlaylist">
		</m-playlist-option>
		<m-album-option 
			:optionVisible="albumOptionVisible" 
			@changeVisible="changeAlbumOptionVisible" 
			:currentAlbum="currentAlbum">
		</m-album-option>
	   <mt-popup 
	   	v-model="searchOptionVisible" 
			:modal="false"
			position="right" 
		   style="width:100%;height:100%;">
			<header class="mui-bar mui-bar-nav">
				<a class="mui-icon mui-icon-back mui-pull-left" href="javascript:history.back()"></a>
				<div class="search">
					<input type="text" v-model.trim="keyword" :placeholder="n == 1 ? '搜索歌单':'搜索专辑'" @keyup="search"/>
					<span class="mui-icon mui-icon-closeempty" @tap="clear" v-show="isClear"></span>
				</div>
			</header>
			<div class="container" style="padding-top:44px;height:100%;overflow: auto;">
				<m-collect-playlist 
					:playlist="search_playlist" 
					:isOption="true"
					@on-current-playlist="onCurrentPlaylist">
				</m-collect-playlist>
				<m-collect-album 
					:album="search_album" 
					:isOption="true"
					@on-current-album="onCurrentAlbum">
				</m-collect-album>
			</div>
	  </mt-popup>
	</div>
</template>

<script>
	import mCollectPlaylist from '~/components/collect_playlist'
	import mCollectAlbum from '~/components/collect_album'
	import mPlaylistOption from '~/components/playlist_option'
	import mAlbumOption from '~/components/album_option'
	import storage from '~/utils/storage'
	import { STORAGE_KEY } from '~/common/const'
	
	export default {
		components: {
			mCollectPlaylist,
			mCollectAlbum,
			mPlaylistOption,
			mAlbumOption
		},
		data() {
			return {
				loading: false,
				notFound: false,
				playlistOptionVisible: false,
				albumOptionVisible: false,
				searchOptionVisible: false,
				isClear: false,
				currentPlaylist: {},
				currentAlbum: {},
				search_album: [],
				search_playlist: [],
				keyword: '',
				n: 1
			}
		},
		computed: {
			userId() {
				return storage.getItem(STORAGE_KEY.USERID)
			},
			playlist() {
				return this.$store.state.playlist
			},
			album() {
				return this.$store.state.album
			}
		},
		methods: {
			loadPlaylist() {
				this.$store.state.playlist = []
				this.loading = true
				this.notFound = false
				this.$store.dispatch('GET_USER_COLLECT_PLAYLIST', this.userId).then(res => {
					this.loading = false
					if(this.playlist.length == 0){
						this.notFound = true
					}
				})
			},
			loadAlbum() {
				this.$store.state.album = []
				this.loading = true
				this.notFound = false
				this.$store.dispatch('GET_USER_COLLECT_ALBUM', this.userId).then(res => {
					this.loading = false
					if(this.album.length == 0){
						this.notFound = true
					}
				})
			},
			changePlaylistOptionVisible(value) {
				this.playlistOptionVisible = value
			},
			changeAlbumOptionVisible(value) {
				this.albumOptionVisible = value
			},
			onCurrentPlaylist(value) {
				this.playlistOptionVisible = value.visible
				this.currentPlaylist = value.currentPlaylist
			},
			onCurrentAlbum(value) {
				this.albumOptionVisible = value.visible
				this.currentAlbum = value.currentAlbum
			},
			showSearchOption() {
				this.searchOptionVisible = true
				this.clear()
				history.pushState(null, null, document.URL)
			},
			clear() {
				this.keyword = ''
				this.isClear = false
				this.search_album = []
				this.search_playlist = []
			},
			search() {
				switch(this.n){
					case 1:
						if(this.keyword){
							this.isClear = true
							let s = this.keyword.toLowerCase()
							let playlist = []
							this.playlist.forEach((item, index) => {
								if(item.name.toLowerCase().match(s)){
									playlist.push(item)
								}
							})
							this.search_playlist = playlist
						}else{
							this.isClear = false
							this.search_playlist = []
						}
						break;
					case 2:
					   if(this.keyword){
							this.isClear = true
							let s = this.keyword.toLowerCase()
							let album = []
							this.album.forEach((item, index) => {
								let a = item.name.toLowerCase().match(s)
								let b = item.artist.toLowerCase().match(s)
								if(a || b){
									album.push(item)
								}
							})
							this.search_album = album
						}else{
							this.isClear = false
							this.search_album = []
						}
						break;
				}
			},
			popstate() {
				if(this.searchOptionVisible){
					this.searchOptionVisible = false
				}
			}
		},
		mounted() {
			this.loadPlaylist()
			let _this = this
			$('.tab-link').on('touchstart',function() {
				if($(this).hasClass('tab-active')){
					return
				}
				$(this).addClass('tab-active').siblings().removeClass('tab-active')
				let i = $(this).index()
				if(i == 0){
					_this.loadPlaylist()
					_this.n = 1
				}else{
					_this.loadAlbum()
					_this.n = 2
				}
				$('.tab').eq(i).addClass('active').siblings().removeClass('active')
				$('body').scrollTop(0)
			})
			window.addEventListener('popstate', this.popstate)
		},
		destroyed() {
			window.removeEventListener('popstate', this.popstate)
		}
	}
</script>

<style scoped>
	.mui-icon-back{
		color:#fff
	}
	.mui-icon-search{
		color:#fff;
	}
	.buttons-tab{
		width: 100%;
		z-index:100;
		position: fixed;
		top:44px;
	}
	.container{
		padding-top:84px;
		padding-bottom:50px;
	}
	.mint-popup-right{
		z-index: 150 !important;
	}
</style>