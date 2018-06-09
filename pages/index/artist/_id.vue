<template>
	<div id="artist">
		<div class="container">
			<header class="mui-bar mui-bar-nav">
				<a class="mui-icon mui-icon-back mui-pull-left" href="javascript:history.back()"></a>
				<span class="mui-icon mui-icon-more mui-pull-right" @tap="artistOptionVisible = true"></span>
			</header>
			<div id="artistImg">
				<img :src="picUrl" alt="" />
				<p class="artistName mui-ellipsis">{{ artist.name }}</p>
			</div>
			<div class="buttons-tab">
				<a class="tab-link button tab-active">热门单曲</a>
				<a class="tab-link button">所有专辑</a>
				<a class="tab-link button">相关MV</a>
				<a class="tab-link button">歌手介绍</a>
			</div>
			<div class="tabs">
		      <div class="tab active">
		         <m-song :song="song" @on-current-song="onCurrentSong"></m-song>
		    		<p class="loading" v-show="loading"><span class="mui-spinner"></span>正在加载中</p>
		    		<p class="loading" v-show="loadMore" @tap="loadArtistMusic(++page)">加载更多</p>
		    		<p class="loading" v-show="noMore">没有更多数据了</p>
		    		<p class="loading" v-show="notFound">暂无歌曲</p>
		      </div>
		      <div class="tab">
		          <m-album :album="album" :isImageLazyLoad="true" v-show="album.length>0"></m-album>
				    <p class="loading" v-show="loading"><span class="mui-spinner"></span>正在加载中</p>
				    <p class="loading" v-show="loadMore" @tap="loadArtistAlbum(++page)">加载更多</p>
				    <p class="loading" v-show="noMore">没有更多数据了</p>
				    <p class="loading" v-show="notFound">暂无专辑</p>
		      </div>
		      <div class="tab">
		          <m-mv :mv="mv" :isImageLazyLoad="true" v-show="mv.length>0" @changeVisible="changeMVOptionVisible"></m-mv>
		          <p class="loading" v-show="loading"><span class="mui-spinner"></span>正在加载中</p>
				    <p class="loading" v-show="loadMore" @tap="loadArtistMV(++page)">加载更多</p>
				    <p class="loading" v-show="noMore">没有更多数据了</p>
				    <p class="loading" v-show="notFound">暂无MV</p>
		      </div>
		      <div class="tab artist_desc">
		      	<div class="content-block" v-show="visible">
		      		<h2>{{ artist.name }}简介</h2>
			         <p style="text-indent:2em">{{ artist.briefDesc }}</p>
			         <div v-for="(json,index) in artist.desc" :key="index">
			            <h2>{{json.ti}}</h2>
			            <p v-html="json.txt"></p>
			         </div>
		      	</div>
		         <p class="loading" v-show="loading"><span class="mui-spinner"></span>正在加载中</p>
		      </div>
		    </div>
		</div>
		<m-song-option 
			:optionVisible="optionVisible" 
			@changeVisible="changeVisible" 
			:currentSong="currentSong">
		</m-song-option>
		<m-follow-option 
			type="singer"
			action="follow"
			:optionVisible="artistOptionVisible" 
			@changeVisible="changeOptionVisible"
			:currentJson="currentJson">
		</m-follow-option>
		<mt-popup
			v-model="mvOptionVisible"
	   	position="bottom"
	   	:closeOnClickModal="false"
			style="width:100%"
			@tap.native="mvOptionVisible=false">
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
	import mFollowOption from '~/components/follow_option'
	import mAlbum from '~/components/album'
	import mMv from '~/components/mv'
	import storage from '~/utils/storage'
	import { STORAGE_KEY } from '~/common/const'
	
	export default {
		validate({ params }) {
			return /^\d+$/.test(params.id)
		},
		components: {
			mSong,
			mSongOption,
			mFollowOption,
			mAlbum,
			mMv
		},
		data() {
			return {
				artist: {},
				picUrl: '',
				visible: false,
				loading: false,
				loadMore: false,
				noMore: false,
				notFound: false,
				optionVisible: false,
				artistOptionVisible: false,
				mvOptionVisible: false,
				actions: [],
				currentSong: {},
				currentJson: {},
				page: 1
			}
		},
		computed: {
			img_w() {
				return screen.width
			},
			img_h() {
				return Math.ceil(this.img_w/(640/520))
			},
			artistId() {
				return this.$route.params.id
			},
			song() {
				return this.$store.state.song
			},
			album() {
				return this.$store.state.album
			},
			mv() {
				return this.$store.state.mv
			}
		},
		methods: {
			async loadArtistDetail() {
				await this.$store.dispatch('GET_ARTIST_DETAIL', this.artistId)
				this.artist = this.$store.state.artist_detail
				this.picUrl = this.artist.picUrl+'?param='+this.img_w+'y'+this.img_h
				this.currentJson = {
					id: this.artist.id,
					name: this.artist.name,
					pic: this.artist.imgUrl+'?param=130y130'
				}
			},
			async loadArtistMusic(page) {
				this.loading = true
				this.loadMore = false
				this.noMore = false
				this.notFound = false
				let count = this.song.length
				await this.$store.dispatch('GET_ARTIST_MUSIC',{
					id: this.artistId,
					pages: page,
               count: 20
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
			async loadArtistAlbum(page) {
				this.loading = true
				this.loadMore = false
				this.noMore = false
				this.notFound = false
				let count = this.album.length
				await this.$store.dispatch('GET_ARTIST_ALBUM',{
					id: this.artistId,
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
			async loadArtistMV(page) {
				this.loading = true
				this.loadMore = false
				this.noMore = false
				this.notFound = false
				let count = this.mv.length
				await this.$store.dispatch('GET_ARTIST_MV',{
					id: this.artistId,
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
			async loadArtistDesc() {
				this.loading = true
				this.visible = false
				await this.$store.dispatch('GET_ARTIST_DESC',this.artistId)
				.then(res => {
					this.loading = false
					this.artist.briefDesc = this.$store.state.artist_desc.briefDesc
					this.artist.desc = this.$store.state.artist_desc.desc
					this.visible = true
				})
			},
			changeVisible(value) {
				this.optionVisible = value
			},
			changeOptionVisible(value) {
				this.artistOptionVisible = value
			},
			changeMVOptionVisible(value) {
				this.mvOptionVisible = value.visible
				this.actions = value.actions
			},
			onCurrentSong(value) {
				this.optionVisible = value.visible
				this.currentSong = value.currentSong
			},
			init() {
				this.$store.state.song = []
				this.loadArtistDetail()
				this.loadArtistMusic(this.page)
				$('body').scrollTop(0)
				$('.tab-link').eq(0).addClass('tab-active').siblings().removeClass('tab-active')
				$('.tab').eq(0).addClass('active').siblings().removeClass('active')
			}
		},
		watch: {
			'$route'() {
				this.init()
			}
		},
		mounted() {
			this.init()
			$('#artistImg').css('height', this.img_h+'px')
			let _this = this
			$('.tab-link').on('touchstart',function() {
				if($(this).hasClass('tab-active')){
					return
				}
				$('body').scrollTop(0)
				$(this).addClass('tab-active').siblings().removeClass('tab-active')
				let i = $(this).index()
				$('.tab').eq(i).addClass('active').siblings().removeClass('active')
				if(i == 0){
					_this.$store.state.song = []
					_this.page = 1
					_this.loadArtistMusic(_this.page)
				}else if(i == 1){
					_this.$store.state.album = []
					_this.page = 1
					_this.loadArtistAlbum(_this.page)
				}else if(i == 2){
					_this.$store.state.mv = []
					_this.page = 1
					_this.loadArtistMV(_this.page)
				}else{
					_this.loadArtistDesc()
				}
			})
			$(document).delegate('.v-modal','tap',() => {
				this.mvOptionVisible = false
			})
		}
	}
</script>

<style scoped>
	.container{
		padding-bottom: 50px;
	}
	.mui-title{
		text-align: left;
	}
	.mui-icon-back {
		color: #fff;
	}
	.mui-icon-more{
		color:#fff;font-size:40px;padding-top:0
	}
	.mui-bar {
		background: transparent;
		position: absolute;
	}
	.mui-bar-nav{
		box-shadow:none;
	}
	#artistImg{
		width:100%;
		position: relative;
	}
	#artistImg img{
		width:100%;
		vertical-align: middle;
	}
	#artistImg:after{
		content: '';
		position: absolute;
		z-index: 2;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 30%;
		background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAEsCAYAAAAGpQnoAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MkJFNzY3Rjk2NDRCMTFFN0I1RTZDQTFEOTRGNjM3NUQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MkJFNzY3RkE2NDRCMTFFN0I1RTZDQTFEOTRGNjM3NUQiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoyQkU3NjdGNzY0NEIxMUU3QjVFNkNBMUQ5NEY2Mzc1RCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoyQkU3NjdGODY0NEIxMUU3QjVFNkNBMUQ5NEY2Mzc1RCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Phj9YiIAAADDSURBVHja3JZLDsAgCAWBeP8r0y1WUVD8tN00JiAMEHwAAAi1D+UfpRlJsyTN6G3G8oA2H7DFgerV1EyU+0FDcovjSbW6cTyPo7wwG0fn0TPYxYMD4zLNc9n4G9Jp122kjUUGKA/c5il8si54y5sFnW6j42pWa2Dg6VeUHfs6hEf3+RuP14e6a4PUjbSaZ3rhG3l0fTDCs/MB8+qdxTz6xG/nCXmQ/6TfvsszonfO69Ej+u2y8T+r347whOg3rx59BBgAWEMu0EMXeGkAAAAASUVORK5CYII=') 0 0 repeat-x;
		background-size: contain;
	}
	.artistName{
		position: absolute;
		left: 15px;
		bottom: 10px;
		color: #fff;
		z-index: 3;
		margin: 0;
		max-width:100%;
	}
	.buttons-tab{
		z-index:100;
	}
	.tab-link{
		font-size: 14px
	}
	.artist_desc p{
      line-height:2em;color:#666;
   }
   .artist_desc h2{
      font-size:18px;margin:20px 0;
      font-weight: 600;color:#000;
   }
</style>