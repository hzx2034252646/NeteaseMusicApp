<template>
	<div id="user">
		<header class="mui-bar mui-bar-nav">
			<a class="mui-icon mui-icon-back mui-pull-left" href="javascript:history.back()"></a>
			<span class="mui-icon mui-icon-more mui-pull-right" @tap="optionVisible = true"></span>
		</header>
		<div class="userImg">
			<img v-lazy="bgUrl" alt="" />
			<div class="bg-mask"></div>
			<div class="wrapper" v-show="visible">
				<div class="avatar">
					<img :src="avatarUrl" alt="" />
				</div>
				<div class="nickname">
					{{ user.name }}
					<span class="fa" :class="{'fa-mars':user.gender==1, 'fa-venus':user.gender==0}"></span>
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
	      	<m-playlist :playlist="playlist" :isImageLazyLoad="true" v-show="playlist.length>0"></m-playlist>
	    		<p class="loading" v-show="loading"><span class="mui-spinner"></span>正在加载中</p>
	      </div>
	      <div class="tab">
	      	<m-user :user="userlist" :isNetease="true"></m-user>
			   <p class="loading" v-show="loading"><span class="mui-spinner"></span>正在加载中</p>
			   <p class="loading" v-show="loadMore" @tap="loadFollow(++page)">加载更多</p>
			   <p class="loading" v-show="noMore">没有更多数据了</p>
			   <p class="loading" v-show="notFound">暂无关注</p>
	      </div>
	      <div class="tab">
	      	<m-user :user="userlist" :isNetease="true"></m-user>
	         <p class="loading" v-show="loading"><span class="mui-spinner"></span>正在加载中</p>
			   <p class="loading" v-show="loadMore" @tap="loadFan(++page)">加载更多</p>
			   <p class="loading" v-show="noMore">没有更多数据了</p>
			   <p class="loading" v-show="notFound">暂无粉丝</p>
	      </div>
	      <div class="tab user_detail">
	      	<div class="content-block">
	      		<h2>个人信息</h2>
	      		<p>昵称：{{ user.name }}</p>
	      		<p>性别：{{ ['女','男','保密'][user.gender] }}</p>
	      		<p>描述：{{ user.desc ? user.desc:'暂无' }}</p>
	      		<h2>个人介绍</h2>
	      		<p>{{ user.signature ? user.signature:'暂无' }}</p>
	      	</div>
	      </div>
	   </div>
		<m-follow-option 
			type="neteaseUser"
			action="follow"
			:optionVisible="optionVisible" 
			@changeVisible="changeOptionVisible"
			:currentJson="currentJson">
		</m-follow-option>
	</div>
</template>

<script>
	import mPlaylist from '~/components/playlist'
	import mUser from '~/components/user'
	import mFollowOption from '~/components/follow_option'
	import storage from '~/utils/storage'
	import { STORAGE_KEY } from '~/common/const'
	
	export default {
		components: {
			mPlaylist,
			mUser,
			mFollowOption
		},
		data() {
			return {
				user: {},
				bgUrl: '',
				avatarUrl: '',
				visible: false,
				optionVisible: false,
				loading: false,
				loadMore: false,
				noMore: false,
				notFound: false,
				page: 1,
				currentJson: {}
			}
		},
		computed: {
			userId() {
				return this.$route.params.id
			},
			playlist() {
				return this.$store.state.playlist
			},
			userlist() {
				return this.$store.state.user
			}
		},
		methods: {
			async loadUserDetail() {
				await this.$store.dispatch('GET_USER_DETAIL', this.userId)
				this.user = this.$store.state.user_detail
				this.bgUrl = this.user.bgUrl
				this.avatarUrl = this.user.avatarUrl+'?param=200y200'
				this.currentJson = {
					id: this.user.id,
					name: this.user.name,
					pic: this.user.avatarUrl+'?param=130y130'
				}
				this.visible = true
			},
			async loadUserPlaylist() {
				this.loading = true
				await this.$store.dispatch('GET_USER_PLAYLIST', this.userId)
				this.loading = false
			},
			async loadFollow(page) {
				this.loading = true
				this.loadMore = false
				this.noMore = false
				this.notFound = false
				let count = this.userlist.length
				await this.$store.dispatch('GET_USER_FOLLOW',{
					uid: this.userId,
               count: 20,
               pages: page
				}).then(res => {
					this.loading = false
					if(this.userlist.length == 0) {
						return this.notFound = true
					}
					if(this.userlist.length < 20) {
						return
					}
				   if(this.userlist.length%20 != 0){
				   	return this.noMore = true
				   }
					if(this.userlist.length != count){
						this.loadMore = true
					}else{
						this.noMore = true
					}
				})
			},
			async loadFan(page) {
				this.loading = true
				this.loadMore = false
				this.noMore = false
				this.notFound = false
				let count = this.userlist.length
				await this.$store.dispatch('GET_USER_FAN',{
					uid: this.userId,
               count: 20,
               pages: page
				}).then(res => {
					this.loading = false
					if(this.userlist.length == 0) {
						return this.notFound = true
					}
					if(this.userlist.length < 20) {
						return
					}
				   if(this.userlist.length%20 != 0){
				   	return this.noMore = true
				   }
					if(this.userlist.length != count){
						this.loadMore = true
					}else{
						this.noMore = true
					}
				})
			},
			changeOptionVisible(value) {
				this.optionVisible = value
			},
			init() {
				this.$store.state.playlist = []
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
					_this.$store.state.playlist = []
					_this.loadUserPlaylist()
				}else if(i == 1){
					_this.$store.state.user = []
					_this.page = 1
					_this.loadFollow(_this.page)
				}else if(i == 2){
					_this.$store.state.user = []
					_this.page = 1
					_this.loadFan(_this.page)
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
	.userImg img{
		width:100%;height:100%;vertical-align: middle;
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
	.user_detail h2{
      font-size:18px;margin:20px 0;
      font-weight: 600;color:#000;
   }
	.user_detail p{
      line-height:2em;color:#666;
   }
</style>