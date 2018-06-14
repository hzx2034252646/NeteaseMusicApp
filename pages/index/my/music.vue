<template>
	<div>
		<header class="mui-bar mui-bar-nav">
			<a class="mui-icon mui-icon-back mui-pull-left" href="javascript:history.back()"></a>
			<h1 class="mui-title">我的音乐</h1>
			<span class="mui-icon mui-icon-search mui-pull-right" @tap="showSearchOption"></span>
		</header>
		<div class="buttons-tab">
			<a class="tab-link button tab-active">单曲</a>
			<a class="tab-link button">歌单</a>
		</div>
		<div class="container">
			<div class="tabs">
		      <div class="tab active">
		      	<m-batch :song="song"></m-batch>
		      	<m-song 
		      		:song="song" 
		      		@on-current-song="onCurrentSong">
		      	</m-song>
		    		<p class="loading" v-show="loading"><span class="mui-spinner"></span>正在加载中</p>
		    		<p class="loading" v-show="notFound">还没有收藏歌曲</p>
		      </div>
		      <div class="tab">
		      	<ul class="mui-table-view" id="upload">
				   	<li class="mui-table-view-cell">
				   		<span class="pull-left" @tap="createPlaylist">
				   			<i class="fa fa-plus-square-o fa-lg" style="margin-right: 5px"></i>
				   			新建歌单
				   		</span>
				   	</li>
					</ul>
		      	<m-createlist 
		      		:playlist="playlist" 
		      		:isOption="true"
		      		@on-current-playlist="onCurrentPlaylist">
		      	</m-createlist>
		      	<p class="loading" v-show="loading"><span class="mui-spinner"></span>正在加载中</p>
		      	<p class="loading" v-show="notFound">还没有创建歌单</p>
		      </div>
		   </div>
		</div>
		<m-song-option 
			:optionVisible="songOptionVisible" 
			@changeVisible="changeSongOptionVisible" 
			:currentSong="currentSong">
		</m-song-option>
	   <m-createlist-option 
			:optionVisible="createlistOptionVisible" 
			@changeVisible="changeCreatelistOptionVisible" 
			:currentPlaylist="currentPlaylist">
		</m-createlist-option>
	   <mt-popup 
	   	v-model="searchOptionVisible" 
			:modal="false"
			position="right" 
		   style="width:100%;height:100%;">
			<header class="mui-bar mui-bar-nav">
				<a class="mui-icon mui-icon-back mui-pull-left" href="javascript:history.back()"></a>
				<div class="search">
					<input type="text" v-model.trim="keyword" :placeholder="n == 1 ? '搜索歌曲':'搜索歌单'" @keyup="search"/>
					<span class="mui-icon mui-icon-closeempty" @tap="clear" v-show="isClear"></span>
				</div>
			</header>
			<div class="container" style="padding-top:44px;height:100%;overflow: auto;">
				<m-song 
					:song="search_song" 
					@on-current-song="onCurrentSong">
				</m-song>
				<m-createlist 
					:playlist="search_playlist" 
					:isOption="true"
					@on-current-playlist="onCurrentPlaylist">
				</m-createlist>
			</div>
	  </mt-popup>
	</div>
</template>

<script>
	import mSong from '~/components/song'
	import mSongOption from '~/components/song_option'
	import mBatch from '~/components/batch'
	import mCreatelist from '~/components/createlist'
	import mCreatelistOption from '~/components/createlist_option'
	import storage from '~/utils/storage'
	import { STORAGE_KEY } from '~/common/const'
	import { Toast } from 'mint-ui'
	
	export default {
		components: {
			mSong,
			mSongOption,
			mBatch,
			mCreatelist,
			mCreatelistOption
		},
		data() {
			return {
				loading: false,
				notFound: false,
				songOptionVisible: false,
				createlistOptionVisible: false,
				searchOptionVisible: false,
				isClear: false,
				currentSong: {},
				currentPlaylist: {},
				search_song: [],
				search_playlist: [],
				keyword: '',
				n: 1
			}
		},
		computed: {
			userId() {
				return storage.getItem(STORAGE_KEY.USERID)
			},
			song() {
				return this.$store.state.song
			},
			playlist() {
				return this.$store.state.createlist
			}
		},
		methods: {
			loadMyMusic() {
				this.$store.state.song = []
				this.loading = true
				this.notFound = false
				this.$store.dispatch('GET_USER_MUSIC', this.userId).then(res => {
					this.loading = false
					if(this.song.length == 0){
						this.notFound = true
					}
				})
			},
			loadCreatelist() {
				this.$store.state.createlist = []
				this.loading = true
				this.notFound = false
				this.$store.dispatch('GET_USER_CREATELIST', this.userId).then(res => {
					this.loading = false
					if(this.playlist.length == 0){
						this.notFound = true
					}
				})
			},
			changeSongOptionVisible(value) {
				this.songOptionVisible = value
			},
			changeCreatelistOptionVisible(value) {
				this.createlistOptionVisible = value
			},
			onCurrentSong(value) {
				this.songOptionVisible = value.visible
				this.currentSong = value.currentSong
			},
			onCurrentPlaylist(value) {
				this.createlistOptionVisible = value.visible
				this.currentPlaylist = value.currentPlaylist
			},
			showSearchOption() {
				this.searchOptionVisible = true
				this.clear()
				history.pushState(null, null, document.URL)
			},
			createPlaylist() {
				mui.prompt('', '请输入歌单标题', '新建歌单', e => {
					if(e.index){
						let name = $.trim(e.value)
						if(!name){
							Toast('歌单标题不能为空')
						}else if(name.length>20){
							Toast('歌单标题不能不能多于20字')
						}else{
							this.$store.dispatch('ADD_USER_CREATELIST', name).then(res => {
								this.notFound = false
							})
						}
					}
				},'div')
			},
			clear() {
				this.keyword = ''
				this.isClear = false
				this.search_song = []
				this.search_playlist = []
			},
			search() {
				switch(this.n){
					case 1:
						if(this.keyword){
							this.isClear = true
							let s = this.keyword.toLowerCase()
							let music = []
							this.song.forEach((item, index) => {
								let a = item.name.toLowerCase().match(s)
								let b = item.artist.toLowerCase().match(s)
								if(a || b){
									music.push(item)
								}
							})
							this.search_song = music
						}else{
							this.isClear = false
							this.search_song = []
						}
						break;
					case 2:
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
				}
			},
			popstate() {
				if(this.searchOptionVisible){
					this.searchOptionVisible = false
				}
			}
		},
		mounted() {
			this.loadMyMusic()
			let _this = this
			$('.tab-link').on('touchstart',function() {
				if($(this).hasClass('tab-active')){
					return
				}
				$(this).addClass('tab-active').siblings().removeClass('tab-active')
				let i = $(this).index()
				if(i == 0){
					_this.loadMyMusic()
					_this.n = 1
				}else{
					_this.loadCreatelist()
					_this.n = 2
				}
				$('.tab').eq(i).addClass('active').siblings().removeClass('active')
				$('body').scrollTop(0)
			})
			$(document).delegate('.v-modal','tap',() => {
				this.playlistOptionVisible = false
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
	.mui-media-object{
		max-width:50px;
		height:50px;
	}
	.mui-media-body p{
		margin:0;line-height:1.6;max-width:85%
	}
	.mui-media-body .list-name{
		font-size:0.85rem;
		color:#000
	}
	.option{
		position:absolute;top:0;right:0;line-height:72px;text-align: center;
		width:40px;height:100%;font-size:16px;color:#ccc
	}
	#upload li{
		padding: 0 !important;
	}
	#upload li>span{
		font-size: 14px;
		padding: 11px 15px;
	}
	.mint-popup-right{
		z-index: 150 !important;
	}
</style>