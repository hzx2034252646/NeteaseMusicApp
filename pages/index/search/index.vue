<template>
	<div>
		<header class="mui-bar mui-bar-nav">
			<a class="mui-icon mui-icon-back mui-pull-left" href="javascript:history.back()"></a>
			<h1 class="mui-title">搜索</h1>
		</header>
		<div class="bar bar-header-secondary">
		  <div class="searchbar">
		    <div class="search-input">
		    	<span :class="['icon','icons', icon]" @tap="settingVisible = true"></span>
		      <input type="search" id="search" placeholder="搜索歌曲、歌手" v-model.trim="search_key" @keyup="keyupToSuggest($event)" @tap="tapToSuggest">
		    </div>
		  </div>
		</div>
		<div class="buttons-tab" v-show="isNetease&&isSearch">
			<a class="tab-link button tab-active">单曲</a>
			<a class="tab-link button">歌手</a>
			<a class="tab-link button">专辑</a>
			<a class="tab-link button">MV</a>
			<a class="tab-link button">歌单</a>
			<a class="tab-link button">用户</a>
		</div>
		<div class="buttons-tab" v-show="!isNetease&&isSearch&&isMVIncluded">
			<a class="tab-link button tab-active">单曲</a>
			<a class="tab-link button">MV</a>
		</div>
		<div class="container2" v-show="isSuggest">
			<ul class="mui-table-view">
				<li class="mui-table-view-cell mui-ellipsis" style="color:#d43c33">搜索"{{ search_key }}"</li>
			   <li class="mui-table-view-cell mui-ellipsis" v-for="(item,index) in search_result1" :key="index" v-html="item" @tap="tapToSearch($event)"></li>
			   <li class="mui-table-view-cell mui-ellipsis" v-for="(item,index) in search_result2" :key="index" v-html="item" @tap="tapToSearch($event)"></li>
			</ul>
		</div>
		<div class="container2" v-show="isHistory">
			<ul class="mui-table-view">
				<li class="mui-table-view-cell mui-ellipsis" style="color:#d43c33">
					搜索历史
					<span class="fa fa-trash fa-lg mui-pull-right" @tap="clearHistory"></span>
				</li>
			   <li class="mui-table-view-cell mui-ellipsis" v-for="(item,index) in search_history" :key="index" @tap="tapToSearch($event)">{{ item }}</li>
			</ul>
		</div>
		<div class="container1" v-if="isNetease&&isSearch">
			<div class="tabs">
		      <div class="tab active">
		         <m-song :song="song" @on-current-song="onCurrentSong"></m-song>
		    		<p class="loading" v-show="loading"><span class="mui-spinner"></span>正在加载中</p>
		    		<p class="loading" v-show="loadMore" @tap="loadSong(++page)">加载更多</p>
		    		<p class="loading" v-show="noMore">没有更多数据了</p>
		    		<p class="loading" v-show="notFound">暂无歌曲</p>
		      </div>
		      <div class="tab">
		          <m-artist :artist="artist" v-show="artist.length>0"></m-artist>
				    <p class="loading" v-show="loading"><span class="mui-spinner"></span>正在加载中</p>
				    <p class="loading" v-show="notFound">暂无歌手</p>
		      </div>
		      <div class="tab">
		          <m-album :album="album" :isImageLazyLoad="true" v-show="album.length>0"></m-album>
				    <p class="loading" v-show="loading"><span class="mui-spinner"></span>正在加载中</p>
				    <p class="loading" v-show="loadMore" @tap="loadAlbum(++page)">加载更多</p>
				    <p class="loading" v-show="noMore">没有更多数据了</p>
				    <p class="loading" v-show="notFound">暂无专辑</p>
		      </div>
		      <div class="tab">
		          <m-mv :mv="mv" :isImageLazyLoad="true" v-show="mv.length>0" @changeVisible="changeVisible"></m-mv>
		          <p class="loading" v-show="loading"><span class="mui-spinner"></span>正在加载中</p>
				    <p class="loading" v-show="loadMore" @tap="loadMV(++page)">加载更多</p>
				    <p class="loading" v-show="noMore">没有更多数据了</p>
				    <p class="loading" v-show="notFound">暂无MV</p>
		      </div>
		      <div class="tab">
		          <m-playlist :playlist="playlist" :isImageLazyLoad="true" v-show="playlist.length>0"></m-playlist>
		          <p class="loading" v-show="loading"><span class="mui-spinner"></span>正在加载中</p>
				    <p class="loading" v-show="loadMore" @tap="loadPlaylist(++page)">加载更多</p>
				    <p class="loading" v-show="noMore">没有更多数据了</p>
				    <p class="loading" v-show="notFound">暂无歌单</p>
		      </div>
		      <div class="tab">
		          <m-user :user="user" :isNetease="true"></m-user>
		          <p class="loading" v-show="loading"><span class="mui-spinner"></span>正在加载中</p>
				    <p class="loading" v-show="loadMore" @tap="loadUser(++page)">加载更多</p>
				    <p class="loading" v-show="noMore">没有更多数据了</p>
				    <p class="loading" v-show="notFound">暂无用户</p>
		      </div>
		   </div>
		</div>
		<div class="container1" v-if="!isNetease&&isSearch&&isMVIncluded">
			<div class="tabs">
		      <div class="tab active">
		         <m-song :song="song" @on-current-song="onCurrentSong"></m-song>
		    		<p class="loading" v-show="loading"><span class="mui-spinner"></span>正在加载中</p>
		    		<p class="loading" v-show="loadMore" @tap="loadMusic(++page)">加载更多</p>
		    		<p class="loading" v-show="noMore">没有更多数据了</p>
		      </div>
		      <div class="tab">
		         <m-mv :mv="mv" :isImageLazyLoad="true" v-show="mv.length>0" @changeVisible="changeVisible"></m-mv>
		         <p class="loading" v-show="loading"><span class="mui-spinner"></span>正在加载中</p>
				   <p class="loading" v-show="loadMore" @tap="loadOtherMV(++page)">加载更多</p>
				   <p class="loading" v-show="noMore">没有更多数据了</p>
				   <p class="loading" v-show="notFound">暂无MV</p>
		      </div>
		   </div>
		</div>
		<div class="container2" v-if="!isMVIncluded&&isSearch">
			<m-song :song="song" @on-current-song="onCurrentSong"></m-song>
    		<p class="loading" v-show="loading"><span class="mui-spinner"></span>正在加载中</p>
    		<p class="loading" v-show="loadMore" @tap="loadMusic(++page)">加载更多</p>
    		<p class="loading" v-show="noMore">没有更多数据了</p>
		</div>
		<m-song-option 
			:optionVisible="optionVisible" 
			@changeVisible="changeOptionVisible" 
			:currentSong="currentSong">
		</m-song-option>
		<mt-popup 
			v-model="settingVisible" 
			position="bottom" 
			:closeOnClickModal="false"
			@tap.native="settingVisible = false"
			style="width:100%">
			<ul class="mui-table-view mui-table-view-radio" id="source">
			   <li :class="['mui-table-view-cell',{ 'mui-selected': source == 'netease' }]" id="netease">
			      <a class="mui-navigate-right">
			      	<span class="icons netease-icon"></span>
			      	网易云音乐
			      </a>
			   </li>
			   <li :class="['mui-table-view-cell',{ 'mui-selected': source == 'tencent' }]" id="tencent">
			      <a class="mui-navigate-right">
			      	<span class="icons tencent-icon"></span>
			      	QQ音乐
			      </a>
			   </li>
			   <li :class="['mui-table-view-cell',{ 'mui-selected': source == 'kugou' }]" id="kugou">
			      <a class="mui-navigate-right">
			      	<span class="icons kugou-icon"></span>
			      	酷狗音乐
			      </a>
			   </li>
			   <li :class="['mui-table-view-cell',{ 'mui-selected': source == 'xiami' }]" id="xiami">
			      <a class="mui-navigate-right">
			      <span class="icons xiami-icon"></span>
			      	虾米音乐
			      </a>
			   </li>
			   <li :class="['mui-table-view-cell',{ 'mui-selected': source == 'baidu' }]" id="baidu">
			      <a class="mui-navigate-right">
			      	<span class="icons baidu-icon"></span>
			      	百度音乐
			      </a>
			   </li>
			</ul>
	   </mt-popup>
	   <mt-popup
			v-model="visible"
	   	position="bottom"
	   	:closeOnClickModal="false"
			style="width:100%"
			@tap.native="visible=false">
			<ul class="mui-table-view">
				<li class="mui-table-view-cell text-center" v-for="(item,index) in actions" :key="index" @tap="item.method">
					<a href="#">{{ item.name }}</a>
				</li>
			</ul>
		</mt-popup>
	</div>
</template>

<script>
	import mSong from '~/components/song'
	import mSongOption from '~/components/song_option'
	import mArtist from '~/components/artist'
	import mAlbum from '~/components/album'
	import mMv from '~/components/mv'
	import mPlaylist from '~/components/playlist'
	import mUser from '~/components/user'
	import storage from '~/utils/storage'
	import { STORAGE_KEY } from '~/common/const'
	
	export default {
		data() {
			return {
				isSearch: false,
				isNetease: false,
				isMVIncluded: true,
				isSuggest: false,
				isHistory: false,
				loading: false,
				loadMore: false,
				noMore: false,
				notFound: false,
				search_key: '',
				search_history: [],
				page: 1,
				keyword: '',
				visible: false,
				optionVisible: false,
				settingVisible: false,
				actions: [],
				currentSong: {},
				count: 0
			}
		},
		components: {
			mSong,
			mSongOption,
			mArtist,
			mAlbum,
			mMv,
			mPlaylist,
			mUser
		},
		computed: {
			song() {
				return this.$store.state.song
			},
			artist() {
				return this.$store.state.artist
			},
			album() {
				return this.$store.state.album
			},
			mv() {
				return this.$store.state.mv
			},
			playlist() {
				return this.$store.state.playlist
			},
			user() {
				return this.$store.state.user
			},
			search_result1() {
				return this.$store.state.search_result1
			},
			search_result2() {
				return this.$store.state.search_result2
			},
			source() {
				return this.$store.state.source
			},
			icon() {
				return this.source + '-icon'
			}
		},
		methods: {
			search() {
				if(!this.search_key){
					return
				}
				this.isSuggest = false
				this.isHistory = false
				this.isSearch = true
				this.isMVIncluded = true
				this.keyword = this.search_key
				this.saveHistory(this.keyword)
				if(this.source == 'netease'){
					this.isNetease = true
					this.init()
				}else{
					if(this.source == 'xiami'||this.source == 'baidu'){
						this.isMVIncluded = false
					}
					this.isNetease = false
					this.$store.state.song = []
					this.$store.state.mv = []
					this.page = 1
					this.count = 0
					this.loadMusic(this.page)
					$('.tab-link').eq(6).addClass('tab-active').siblings().removeClass('tab-active')
					$('body').scrollTop(0)
				}
			},
			tapToSearch(ev) {
				this.search_key = $(ev.target).text()
				this.search()
			},
			suggest() {
				if(!this.search_key){
					this.isSuggest = false
					this.isSearch = false
					this.showHistory()
					return
				}
				this.isHistory = false
				this.isSearch = false
				this.$store.dispatch('GET_SEARCH_SUGGEST', this.search_key).then(res => {
					this.isSuggest = true
				})
			},
			keyupToSuggest(ev) {
				if(ev.which == 13){
					this.search()
				}else{
					this.suggest()
				}
			},
			tapToSuggest() {
				this.suggest()
			},
			saveHistory(txt){
            var flag=1,arr=[]
            if(storage.getItem(STORAGE_KEY.SEARCH_HISTORY)){
               arr=storage.getItem(STORAGE_KEY.SEARCH_HISTORY)
            }
            let i = arr.findIndex(item => item == txt)
            if(i > -1){
            	arr.splice(i,1)
               flag=0
            }
            if(arr.length==6&&flag==1){
               arr.shift()
            }
            arr.push(txt)
            storage.setItem(STORAGE_KEY.SEARCH_HISTORY,arr)
         },
         showHistory(){
            if(!storage.getItem(STORAGE_KEY.SEARCH_HISTORY)){
               this.isHistory = false
               return
            }
            this.search_history = storage.getItem(STORAGE_KEY.SEARCH_HISTORY).reverse()
            this.isHistory = true
         },
         clearHistory() {
         	mui.confirm('确定清空所有搜索记录？', e => {
         		if(e.index){
         			storage.removeItem(STORAGE_KEY.SEARCH_HISTORY)
            		this.isHistory = false
         		}
         	},'div')
         },
			loadMusic(page) {
				this.loading = true
				this.loadMore = false
				this.noMore = false
				this.notFound = false
				let count = this.song.length
				this.$store.dispatch('GET_SEARCH_MUSIC', {
					name: this.keyword,
					source: this.$store.state.source,
               count: 20,
               pages: page
				}).then(res => {
					this.loading = false
					if(this.song.length == 0) {
						return this.notFound = true
					}
					if(this.song.length < 20) {
						return
					}
				   if(this.song.length%20 != 0){
				   	return this.noMore = true
				   }
					if(this.song.length != count){
						this.loadMore = true
					}else{
						this.noMore = true
					}
				})
			},
			loadSong(page) {
				this.loading = true
				this.loadMore = false
				this.noMore = false
				this.notFound = false
				let count = this.song.length
				this.$store.dispatch('GET_SEARCH_SONG', {
					name: this.keyword,
               count: 20,
               pages: page
				}).then(res => {
					this.loading = false
					if(this.song.length == 0) {
						return this.notFound = true
					}
					if(this.song.length < 20) {
						return
					}
				   if(this.song.length%20 != 0){
				   	return this.noMore = true
				   }
					if(this.song.length != count){
						this.loadMore = true
					}else{
						this.noMore = true
					}
				})
			},
			loadArtist() {
				this.loading = true
				this.notFound = false
				this.$store.dispatch('GET_SEARCH_ARTIST', this.keyword).then(res => {
					this.loading = false
					if(this.artist.length == 0) {
						this.notFound = true
					}
				})
			},
			loadAlbum(page) {
				this.loading = true
				this.loadMore = false
				this.noMore = false
				this.notFound = false
				let count = this.album.length
				this.$store.dispatch('GET_SEARCH_ALBUM', {
					name: this.keyword,
               count: 20,
               pages: page
				}).then(res => {
					this.loading = false
					if(this.album.length == 0) {
						return this.notFound = true
					}
					if(this.album.length < 20) {
						return
					}
				   if(this.album.length%20 != 0){
				   	return this.noMore = true
				   }
					if(this.album.length != count){
						this.loadMore = true
					}else{
						this.noMore = true
					}
				})
			},
			loadMV(page) {
				this.loading = true
				this.loadMore = false
				this.noMore = false
				this.notFound = false
				let count = this.mv.length
				this.$store.dispatch('GET_SEARCH_MV', {
					name: this.keyword,
               count: 20,
               pages: page
				}).then(res => {
					this.loading = false
					if(this.mv.length == 0) {
						return this.notFound = true
					}
					if(this.mv.length < 20) {
						return
					}
				   if(this.mv.length%20 != 0){
				   	return this.noMore = true
				   }
					if(this.mv.length != count){
						this.loadMore = true
					}else{
						this.noMore = true
					}
				})
			},
			loadOtherMV(page) {
				this.loading = true
				this.loadMore = false
				this.noMore = false
				this.notFound = false
				let count = this.mv.length
				switch(this.source){
					case 'tencent':
						this.$store.dispatch('GET_TENCENT_MV', {
							name: this.keyword,
		               count: 20,
		               pages: page,
		               t: 12
						}).then(res => {
							this.loading = false
							if(this.mv.length == 0) {
								return this.notFound = true
							}
							if(this.mv.length < 20) {
								return
							}
						   if(this.mv.length%20 != 0){
						   	return this.noMore = true
						   }
							if(this.mv.length != count){
								this.loadMore = true
							}else{
								this.noMore = true
							}
						})
						break
					case 'kugou':
						this.$store.dispatch('GET_KUGOU_MV', {
							name: this.keyword,
		               count: 20,
		               pages: page
						}).then(res => {
							this.loading = false
							if(this.mv.length == 0) {
								return this.notFound = true
							}
							if(this.mv.length < 20) {
								return
							}
						   if(this.mv.length%20 != 0){
						   	return this.noMore = true
						   }
							if(this.mv.length != count){
								this.loadMore = true
							}else{
								this.noMore = true
							}
						})
						break
				}
				
			},
			loadPlaylist(page) {
				this.loading = true
				this.loadMore = false
				this.noMore = false
				this.notFound = false
				let count = this.playlist.length
				this.$store.dispatch('GET_SEARCH_PLAYLIST', {
					name: this.keyword,
               count: 20,
               pages: page
				}).then(res => {
					this.loading = false
					if(this.playlist.length == 0) {
						return this.notFound = true
					}
					if(this.playlist.length < 20) {
						return
					}
				   if(this.playlist.length%20 != 0){
				   	return this.noMore = true
				   }
					if(this.playlist.length != count){
						this.loadMore = true
					}else{
						this.noMore = true
					}
				})
			},
			loadUser(page) {
				this.loading = true
				this.loadMore = false
				this.noMore = false
				this.notFound = false
				let count = this.user.length
				this.$store.dispatch('GET_SEARCH_USER', {
					name: this.keyword,
               count: 20,
               pages: page
				}).then(res => {
					this.loading = false
					if(this.user.length == 0) {
						return this.notFound = true
					}
					if(this.user.length < 20) {
						return
					}
				   if(this.user.length%20 != 0){
				   	return this.noMore = true
				   }
					if(this.user.length != count){
						this.loadMore = true
					}else{
						this.noMore = true
					}
				})
			},
			init() {
				this.page = 1
				this.$store.state.song = []
				this.$store.state.artist = []
				this.$store.state.album = []
				this.$store.state.mv = []
				this.$store.state.playlist = []
				this.$store.state.user = []
				this.loadSong(this.page)
				$('body').scrollTop(0)
				$('.tab-link').eq(0).addClass('tab-active').siblings().removeClass('tab-active')
				$('.tab').eq(0).addClass('active').siblings().removeClass('active')
			},
			changeOptionVisible(value) {
				this.optionVisible = value
			},
			changeVisible(value) {
				this.actions = value.actions
				this.visible = value.visible
			},
			onCurrentSong(value) {
				this.optionVisible = value.visible
				this.currentSong = value.currentSong
			}
		},
		mounted() {
			let _this = this
			this.$store.state.song = []
			this.$store.state.artist = []
			this.$store.state.album = []
			this.$store.state.mv = []
			this.$store.state.playlist = []
			this.$store.state.user = []
			this.showHistory()
			$('.tab-link').on('touchstart',function() {
				if($(this).hasClass('tab-active')){
					return
				}
				$(this).addClass('tab-active').siblings().removeClass('tab-active')
				$('body').scrollTop(0)
				let i = $(this).index()
				$('.tab').eq(i).addClass('active').siblings().removeClass('active')
				_this.page = 1
				if(i == 0){
					_this.$store.state.song = []
					if(_this.isNetease){
						_this.loadSong(_this.page)
					}else{
						_this.loadMusic(_this.page)
					}
				}else if(i == 1){
					if(_this.isNetease){
						_this.$store.state.artist = []
						_this.loadArtist(_this.page)
					}else{
						_this.$store.state.mv = []
						_this.loadOtherMV(_this.page)
					}
				}else if(i == 2){
					_this.$store.state.album = []
					_this.loadAlbum(_this.page)
				}else if(i == 3){
					_this.$store.state.mv = []
					_this.loadMV(_this.page)
				}else if(i == 4){
					_this.$store.state.playlist = []
					_this.loadPlaylist(_this.page)
				}else{
					_this.$store.state.user = []
					_this.loadUser(_this.page)
				}
			})
			$(document).delegate('.v-modal','tap',() => {
				this.settingVisible = false
				this.visible = false
			})
			$('#source').find('li').on('touchstart', function() {
				_this.$store.state.source = this.id
				_this.settingVisible = false
				_this.suggest()
			})
//			var preRemoveArray = []
//			var nextRemoveArray = []
//			document.body.addEventListener('touchmove',function(e){
//				if(this.scrollTop < 200){
//					if(preRemoveArray[0]){
//						let arr = preRemoveArray.splice(preRemoveArray.lenth-20,20)
//						_this.song.unshift(...arr)
//						arr = _this.song.splice(_this.song.length-20,20)
//						nextRemoveArray.push(...arr)
//						document.body.scrollTop = document.body.scrollTop + arr.length*72
//					}
//				}
//				if($(this).height()+this.scrollTop>=this.scrollHeight){
//					let arr
//					if(_this.song.length > 40){
//						arr = _this.song.splice(0,20)
//						preRemoveArray.push(...arr)
//						document.body.scrollTop = document.body.scrollTop - arr.length*72
//					}
//					if(nextRemoveArray[0]){
//						arr = nextRemoveArray.splice(nextRemoveArray.length-20,20)
//						_this.song.push(...arr)
//						arr = _this.song.splice(0,20)
//						preRemoveArray.push(...arr)
//						document.body.scrollTop = document.body.scrollTop - arr.length*72
//					}
//				}
//				console.log(preRemoveArray.length,nextRemoveArray.length,_this.song.length)
//			})
		}
	}
</script>

<style scoped>
	.container1{
		padding-top:128px;
		padding-bottom: 50px;
	},
	.container2{
		padding-bottom:50px;padding-top:96px
	}
	.mui-icon-back {
		color: #fff
	}
	.bar{
		width: 100%;
		z-index:100;
		position: fixed;
		top:44px;
	}
	.searchbar{
		background:#fff
	}
	.search-input input{
		height: 1.8rem;
		background: rgba(0,0,0,.06);
		border-radius: 0.8rem;
		padding-left: 2.2rem;
	}
	.bar:after{
		height: 0px
	}
	.buttons-tab{
		width: 100%;
		z-index:100;
		position: fixed;
		top:88px;
	}
	.fa-trash{
		margin-top:5px
	}
	.icon{
		left: 0.5rem;
	}
	.icons{
		width: 23px;
		height: 23px;
		display: inline-block;
		background: url('../../../assets/images/icons/icon.jpg') no-repeat;
		background-size: auto 23px;
	}
	#source .icons{
		vertical-align: middle;
		position: relative;
		top: -1px;
		margin-right: 5px;
	}
	.netease-icon{
		background-position: 0 0;
	}
	.tencent-icon{
		background-position: -23px 0;
	}
	.kugou-icon{
		background-position: -69px 0;
	}
	.xiami-icon{
		background-position: -46px 0;
	}
	.baidu-icon{
		background-position: -92px 0;
	}
</style>