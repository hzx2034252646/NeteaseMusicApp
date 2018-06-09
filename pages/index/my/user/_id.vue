<template>
	<div id="user">
		<header class="mui-bar mui-bar-nav">
			<a class="mui-icon mui-icon-back mui-pull-left" href="javascript:history.back()"></a>
			<span class="mui-icon mui-icon-more mui-pull-right" @tap="optionVisible = true" v-show="!hidden"></span>
		</header>
		<div class="userImg">
			<img v-lazy="avatarUrl" alt="" />
			<div class="bg-mask"></div>
			<div class="wrapper" v-show="visible">
				<div class="avatar">
					<img :src="avatarUrl" alt="" />
				</div>
				<div class="nickname">
					{{ user.name }}
					<span class="fa" :class="{'fa-mars':user.sex=='男', 'fa-venus':user.sex=='女'}"></span>
				</div>
				<span>
					<span style="margin-right:30px">关注&nbsp;{{ user.followCount }}</span>
					<span>粉丝&nbsp;{{ user.fanCount }}</span>
				</span>
			</div>
		</div>
		<div class="buttons-tab">
			<a class="tab-link button tab-active">歌单</a>
			<a class="tab-link button">关注</a>
			<a class="tab-link button">粉丝</a>
			<a class="tab-link button">关于TA</a>
		</div>
		<div class="tabs">
	      <div class="tab active">
	      	<div class="divide" v-show="createlist.length>0">
	      		创建的歌单（{{ createlist.length }}）
	      	</div>
	      	<m-createlist 
					:playlist="createlist" 
					v-show="createlist.length>0">
				</m-createlist>
				<div class="divide" v-show="playlist.length>0">
	      		收藏的歌单（{{ playlist.length }}）
	      	</div>
	      	<m-collect-playlist :playlist="playlist"></m-collect-playlist>
	    		<p class="loading" v-show="loading"><span class="mui-spinner"></span>正在加载中</p>
	    		<p class="loading" v-show="notFound">暂无歌单</p>
	      </div>
	      <div class="tab">
	      	<div class="divide" v-show="follow_singer.length>0">
	      		歌手（{{ follow_singer.length }}）
	      	</div>
	      	<m-artist :artist="follow_singer"></m-artist>
	      	<div class="divide" v-show="follow_neteaseuser.length>0">
	      		网易云用户（{{ follow_neteaseuser.length }}）
	      	</div>
	      	<m-user 
	      		:user="follow_neteaseuser"
	      		:isNetease="true">
	      	</m-user>
	      	<div class="divide" v-show="follow_user.length>0">
	      		用户（{{ follow_user.length }}）
	      	</div>
	      	<m-user :user="follow_user"></m-user>
			   <p class="loading" v-show="loading"><span class="mui-spinner"></span>正在加载中</p>
			   <p class="loading" v-show="notFound">暂无关注</p>
	      </div>
	      <div class="tab">
	      	<m-user :user="fan"></m-user>
	         <p class="loading" v-show="loading"><span class="mui-spinner"></span>正在加载中</p>
			   <p class="loading" v-show="notFound">暂无粉丝</p>
	      </div>
	      <div class="tab user_detail">
	      	<div class="content-block">
	      		<p>昵称：{{ user.name }}</p>
	      		<p>性别：{{ user.sex }}</p>
	      		<p>个性签名：{{ user.signature ? user.signature:'暂无' }}</p>
	      	</div>
	      </div>
	  </div>
	   <m-follow-option 
			type="user"
			action="follow"
			:optionVisible="optionVisible" 
			@changeVisible="changeOptionVisible"
			:currentJson="currentJson">
		</m-follow-option>
	</div>
</template>

<script>
	import mPlaylist from '~/components/playlist'
	import mCreatelist from '~/components/createlist'
	import mCollectPlaylist from '~/components/collect_playlist'
	import mFollowOption from '~/components/follow_option'
	import mUser from '~/components/user'
	import mArtist from '~/components/artist'
	import storage from '~/utils/storage'
	import { STORAGE_KEY } from '~/common/const'
	
	export default {
		components: {
			mPlaylist,
			mUser,
			mArtist,
			mCreatelist,
			mCollectPlaylist,
			mFollowOption
		},
		data() {
			return {
				user: {},
				avatarUrl: '',
				visible: false,
				hidden: false,
				optionVisible: false,
				loading: false,
				notFound: false,
				currentJson: {}
			}
		},
		computed: {
			userId() {
				return this.$route.params.id
			},
			createlist() {
				return this.$store.state.createlist
			},
			playlist() {
				return this.$store.state.playlist
			},
			follow_singer() {
				return this.$store.state.artist
			},
			follow_user(){
				return this.$store.state.follow_user
			},
			follow_neteaseuser(){
				return this.$store.state.follow_neteaseuser
			},
			fan(){
				return this.$store.state.user
			}
		},
		methods: {
			async loadUserDetail() {
				await this.$store.dispatch('GET_MYUSER_DETAIL', this.userId)
				this.user = this.$store.state.user_detail
				this.avatarUrl = this.user.avatarUrl
				this.currentJson = {
					followId: this.user.id,
	            followName: this.user.name,
	            fanId: storage.getItem(STORAGE_KEY.USERID),
	            fanName: storage.getItem(STORAGE_KEY.USERNAME)
				}
				this.visible = true
				this.hidden = this.userId == storage.getItem(STORAGE_KEY.USERID)
			},
			async loadUserPlaylist() {
				this.loading = true
				this.notFound = false
				this.$store.state.createlist = []
				this.$store.state.playlist = []
				await this.$store.dispatch('GET_USER_CREATELIST', this.userId)
				await this.$store.dispatch('GET_USER_COLLECT_PLAYLIST', this.userId)
				this.loading = false
				if(this.createlist.length + this.playlist.length == 0){
					this.notFound = true
				}
			},
			async loadFollow() {
				this.loading = true
				this.notFound = false
				this.$store.state.artist = []
			   this.$store.state.follow_user = []
				this.$store.state.follow_neteaseuser = []
				await this.$store.dispatch('GET_USER_FOLLOW_SINGER', this.userId)
				await this.$store.dispatch('GET_USER_FOLLOW_NETEASEUSER', this.userId)
				await this.$store.dispatch('GET_USER_FOLLOW_USER', this.userId)
				this.loading = false
				if(this.follow_singer.length + this.follow_user.length + this.follow_neteaseuser.length == 0){
					this.notFound = true
				}
			},
			async loadFan() {
				this.loading = true
				this.notFound = false
				this.$store.state.user = []
				await this.$store.dispatch('GET_MYUSER_FAN', this.userId)
				this.loading = false
				if(this.fan.length == 0){
					this.notFound = true
				}
			},
			changeOptionVisible(value) {
				this.optionVisible = value
			},
			init() {
				this.loadUserDetail()
				this.loadUserPlaylist()
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
			let _this = this
			$('.tab-link').on('touchstart',function() {
				if($(this).hasClass('tab-active')){
					return
				}
				$(this).addClass('tab-active').siblings().removeClass('tab-active')
				let i = $(this).index()
				$('.tab').eq(i).addClass('active').siblings().removeClass('active')
				if(i == 0){
					_this.loadUserPlaylist()
				}else if(i == 1){
					_this.loadFollow()
				}else if(i == 2){
					_this.loadFan()
				}
			})
		}
	}
</script>

<style scoped>
	#user{
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
	.userImg{
		width:100%;height:300px;position: relative;
		overflow: hidden;
	}
	.userImg > img{
		width:100%;height:100%;vertical-align: middle;
		-webkit-filter: blur(30px);
	}
	.bg-mask{
		width:100%;height:100%;position:absolute;top:0;
		background:rgba(0,0,0,.5);z-index:1
	}
	.wrapper{
		width:100%;position:absolute;top:50%;z-index:2;
		margin-top:-90px;text-align:center;color:#fff;
	}
	.avatar{
		width:100px;height:100px;border-radius: 50%;overflow:hidden;
		margin:0 auto;
	}
	.avatar img{
		width:100%;height:100%;
	}
	.nickname{
		font-size:20px;margin:10px 0
	}
	.fa-venus{
		color:#FFB9D5
	}
	.fa-mars{
		color:#25A5E3
	}
	.user_detail p{
      line-height:2em;color:#666;
   }
   .divide{
		width: 100%;
		height: 30px;
		line-height: 30px;
		padding-left: 15px;
		background: #eee;
		color: #666;
		font-size: 12px;
	}
</style>