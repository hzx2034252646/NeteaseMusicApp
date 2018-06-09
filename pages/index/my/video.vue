<template>
	<div>
		<header class="mui-bar mui-bar-nav">
			<nuxt-link to="/discover/recommend" class="mui-icon mui-icon-back mui-pull-left"></nuxt-link>
			<h1 class="mui-title">我的视频</h1>
			<span class="mui-icon mui-icon-search mui-pull-right" @tap="showSearchOption"></span>
		</header>
		<div class="container">
			<ul class="mui-table-view" id="upload">
		   	<li class="mui-table-view-cell">
		   		<span class="pull-left" @tap="uploadVideo">
		   			<i class="fa fa-upload fa-lg" style="margin-right: 5px"></i>
		   			上传视频
		   		</span>
		   	</li>
			</ul>
			<ul class="mui-table-view" v-show="video.length>0">
				<li class="mui-table-view-cell mui-media" v-for="(item,index) in video" :key="index" @tap="playVideo(item.id)">
					<a href="javascript:;">
						<img class="mui-media-object mui-pull-left" v-lazy="item.picUrl">
						<div class="mui-media-body">
							<p class="list-name mui-ellipsis">{{ item.name }}</p>
							<p class="mui-ellipsis">{{ item.artist }}</p>
						</div>
					</a>
					<span class="option" @tap.stop="showOption(item.id)">
						<span class="fa fa-ellipsis-v"></span>
					</span>
				</li>
			</ul>
      	<p class="loading" v-show="loading"><span class="mui-spinner"></span>正在加载中</p>
      	<p class="loading" v-show="notFound">还没有上传视频</p>
		</div>
		<mt-popup 
			v-model="deleteOptionVisible" 
			position="bottom" 
			:closeOnClickModal="false"
			style="width:100%"
			@tap.native="deleteOptionVisible=false">
			<mt-cell title="删除视频" is-link @tap.native="deleteVideo">
			  <img slot="icon" src="~/assets/images/icons/option_delete.png" width="24" height="24">
			</mt-cell>
	  </mt-popup>
	  <mt-popup 
	   	v-model="searchOptionVisible" 
			:modal="false"
			position="right" 
		   style="width:100%;height:100%;">
			<header class="mui-bar mui-bar-nav">
				<a class="mui-icon mui-icon-back mui-pull-left" href="javascript:history.back()"></a>
				<div class="search">
					<input type="text" v-model.trim="keyword" placeholder="搜索视频" @keyup="search"/>
					<span class="mui-icon mui-icon-closeempty" @tap="clear" v-show="isClear"></span>
				</div>
			</header>
			<div class="container" style="padding-top:44px;height:100%;overflow: auto;">
				<ul class="mui-table-view" v-show="search_video.length>0">
					<li class="mui-table-view-cell mui-media" v-for="(item,index) in search_video" :key="index" @tap="playVideo(item.id)">
						<a href="javascript:;">
							<img class="mui-media-object mui-pull-left" v-lazy="item.picUrl">
							<div class="mui-media-body">
								<p class="list-name mui-ellipsis">{{ item.name }}</p>
								<p class="mui-ellipsis">{{ item.artist }}</p>
							</div>
						</a>
						<span class="option" @tap.stop="showOption(item.id)">
							<span class="fa fa-ellipsis-v"></span>
						</span>
					</li>
				</ul>
			</div>
	  </mt-popup>
	</div>
</template>

<script>
	import API from '~/api'
	import storage from '~/utils/storage'
	import { STORAGE_KEY } from '~/common/const'
	
	export default {
		data() {
			return {
				loading: false,
				notFound: false,
				deleteOptionVisible: false,
				searchOptionVisible: false,
				isClear: false,
				videoId: '',
				search_video: [],
				keyword: '',
			}
		},
		computed: {
			userId() {
				return storage.getItem(STORAGE_KEY.USERID)
			},
			video() {
				return this.$store.state.mv
			}
		},
		methods: {
			loadVideo() {
				this.$store.state.mv = []
				this.loading = true
				this.notFound = false
				this.$store.dispatch('GET_USER_VIDEO', this.userId).then(res => {
					this.loading = false
					if(this.video.length == 0){
						this.notFound = true
					}
				})
			},
			playVideo(id) {
				function open_without_referrer(link){ 
			     window.open('javascript:window.name;', '<script>location.replace("'+link+'")<\/script>');
			   }
				let url = API.ROOT + '/upload/' + this.userId + '/video/' + id + '.mp4'
				open_without_referrer(url)
			},
			uploadVideo() {
				this.$router.push({ path: '/my/video_upload' })
			},
			showOption(id) {
				this.deleteOptionVisible = true
				this.videoId = id
			},
			deleteVideo() {
				mui.confirm('确定删除视频？', e => {
					if(e.index){
						this.$store.dispatch('DELETE_USER_VIDEO', this.videoId)
					}
				},'div')
			},
			showSearchOption() {
				this.searchOptionVisible = true
				this.clear()
				history.pushState(null, null, document.URL)
			},
			clear() {
				this.keyword = ''
				this.isClear = false
				this.search_video = []
			},
			search() {
				if(this.keyword){
					this.isClear = true
					let s = this.keyword.toLowerCase()
					let video = []
					this.video.forEach((item, index) => {
						let a = item.name.toLowerCase().match(s)
						let b = item.artist.toLowerCase().match(s)
						if(a || b){
							video.push(item)
						}
					})
					this.search_video = video
				}else{
					this.isClear = false
					this.search_video = []
				}
			},
			popstate() {
				if(this.searchOptionVisible){
					this.searchOptionVisible = false
				}
			}
		},
		mounted() {
			this.loadVideo()
			$(document).delegate('.v-modal','tap',() => {
				this.deleteOptionVisible = false
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
	.container{
		padding-top:44px;
		padding-bottom:50px;
	}
	.mui-media-object{
		width: 100px;
		max-width:100px;
		height:57px;
	}
	.mui-media-body p{
		margin:0;line-height:1.8;max-width:85%
	}
	.mui-media-body .list-name{
		font-size:0.85rem;
		color:#000
	}
	.option{
		position:absolute;top:0;right:0;line-height:79px;text-align: center;
		width:40px;height:100%;font-size:16px;color:#ccc
	}
	#upload li{
		padding: 0 !important;
	}
	#upload li>span{
		font-size: 14px;
		padding: 11px 15px;
	}
</style>