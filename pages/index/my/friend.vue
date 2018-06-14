<template>
	<div>
		<header class="mui-bar mui-bar-nav">
			<a class="mui-icon mui-icon-back mui-pull-left" href="javascript:history.back()"></a>
			<h1 class="mui-title">我的好友</h1>
			<span class="mui-icon mui-icon-search mui-pull-right" @tap="showSearchOption"></span>
		</header>
		<div class="buttons-tab">
			<a class="tab-link button tab-active">关注</a>
			<a class="tab-link button">粉丝</a>
		</div>
		<div class="container">
			<div class="tabs">
				<div class="tab active">
					<m-user 
						:user="user" 
						:isOption="true"
						@on-current-user="onCurrentFollowUser">
					</m-user>
					<p class="loading" v-show="loading"><span class="mui-spinner"></span>正在加载中</p>
					<p class="loading" v-show="notFound">还没有关注用户</p>
				</div>
				<div class="tab">
					<m-user 
						:user="user" 
						:isOption="true"
						@on-current-user="onCurrentFanUser">
					</m-user>
					<p class="loading" v-show="loading"><span class="mui-spinner"></span>正在加载中</p>
					<p class="loading" v-show="notFound">还没有粉丝</p>
				</div>
			</div>
		</div>
		<m-follow-option 
			type="user"
			:action="action"
			:optionVisible="optionVisible" 
			@changeVisible="changeOptionVisible"
			:currentJson="currentJson"
			:currentId="currentId">
		</m-follow-option>
		<mt-popup 
	   	v-model="searchOptionVisible" 
			:modal="false"
			position="right" 
		   style="width:100%;height:100%;">
			<header class="mui-bar mui-bar-nav">
				<a class="mui-icon mui-icon-back mui-pull-left" href="javascript:history.back()"></a>
				<div class="search">
					<input type="text" v-model.trim="keyword" placeholder="搜索用户" @keyup="search"/>
					<span class="mui-icon mui-icon-closeempty" @tap="clear" v-show="isClear"></span>
				</div>
			</header>
			<div class="container" style="padding-top:44px;height:100%;overflow: auto;">
				<m-user 
					:user="search_follow" 
					:isOption="true"
					@on-current-user="onCurrentFollowUser">
				</m-user>
				<m-user 
					:user="search_fan" 
					:isOption="true"
					@on-current-user="onCurrentFanUser">
				</m-user>
			</div>
	  </mt-popup>
	</div>
</template>

<script>
	import mUser from '~/components/user'
	import mFollowOption from '~/components/follow_option'
	import storage from '~/utils/storage'
	import { STORAGE_KEY } from '~/common/const'
	
	export default {
		components: {
			mUser,
			mFollowOption
		},
		data() {
			return {
				loading: false,
				notFound: false,
				optionVisible: false,
				searchOptionVisible: false,
				isClear: false,
				currentId: '',
				currentJson: {},
				action: '',
				search_follow: [],
				search_fan: [],
				keyword: '',
				n: 1
			}
		},
		computed: {
			userId() {
				return storage.getItem(STORAGE_KEY.USERID)
			},
			user() {
				return this.$store.state.user
			}
		},
		methods: {
			loadFollow() {
				this.$store.state.user = []
				this.loading = true
				this.notFound = false
				this.$store.dispatch('GET_USER_FOLLOW_USER', this.userId).then(res => {
					this.loading = false
					if(this.user.length == 0){
						this.notFound = true
					}
				})
			},
			loadFan() {
				this.$store.state.user = []
				this.loading = true
				this.notFound = false
				this.$store.dispatch('GET_MYUSER_FAN', this.userId).then(res => {
					this.loading = false
					if(this.user.length == 0){
						this.notFound = true
					}
				})
			},
			changeOptionVisible(value) {
				this.optionVisible = value
			},
			onCurrentFollowUser(value) {
				this.optionVisible = value.visible
				this.currentId = value.currentUser.id
				this.action = 'unfollow'
			},
			onCurrentFanUser(value) {
				this.optionVisible = value.visible
				this.currentJson = {
					followId: value.currentUser.id,
	            followName: value.currentUser.name,
	            fanId: storage.getItem(STORAGE_KEY.USERID),
	            fanName: storage.getItem(STORAGE_KEY.USERNAME)
				}
				this.action = 'follow'
			},
			showSearchOption() {
				this.searchOptionVisible = true
				this.clear()
				history.pushState(null, null, document.URL)
			},
			clear() {
				this.keyword = ''
				this.isClear = false
				this.search_follow = []
				this.search_fan = []
			},
			search() {
				switch(this.n){
					case 1:
						if(this.keyword){
							this.isClear = true
							let s = this.keyword.toLowerCase()
							let user = []
							this.user.forEach((item, index) => {
								if(item.name.toLowerCase().match(s)){
									user.push(item)
								}
							})
							this.search_follow = user
						}else{
							this.isClear = false
							this.search_follow = []
						}
						break;
					case 2:
					   if(this.keyword){
							this.isClear = true
							let s = this.keyword.toLowerCase()
							let user = []
							this.user.forEach((item, index) => {
								if(item.name.toLowerCase().match(s)){
									user.push(item)
								}
							})
							this.search_fan = user
						}else{
							this.isClear = false
							this.search_fan = []
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
			this.loadFollow()
			let _this = this
			$('.tab-link').on('touchstart',function() {
				if($(this).hasClass('tab-active')){
					return
				}
				$(this).addClass('tab-active').siblings().removeClass('tab-active')
				let i = $(this).index()
				if(i == 0){
					_this.loadFollow()
					_this.n = 1
				}else{
					_this.loadFan()
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
</style>