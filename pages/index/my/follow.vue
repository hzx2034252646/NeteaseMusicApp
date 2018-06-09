<template>
	<div>
		<header class="mui-bar mui-bar-nav">
			<a class="mui-icon mui-icon-back mui-pull-left" href="javascript:history.back()"></a>
			<h1 class="mui-title">我的关注</h1>
			<span class="mui-icon mui-icon-search mui-pull-right" @tap="showSearchOption"></span>
		</header>
		<div class="buttons-tab">
			<a class="tab-link button tab-active">歌手</a>
			<a class="tab-link button">用户</a>
		</div>
		<div class="container">
			<div class="tabs">
				<div class="tab active">
					<m-artist 
						:artist="artist" 
						:isOption="true" 
						@on-current-singer="onCurrentSinger">
					</m-artist>
					<p class="loading" v-show="loading"><span class="mui-spinner"></span>正在加载中</p>
					<p class="loading" v-show="notFound">还没有关注歌手</p>
				</div>
				<div class="tab">
					<m-user 
						:user="user" 
						:isOption="true"
						:isNetease="true"
						@on-current-user="onCurrentUser">
					</m-user>
					<p class="loading" v-show="loading"><span class="mui-spinner"></span>正在加载中</p>
					<p class="loading" v-show="notFound">还没有关注用户</p>
				</div>
			</div>
		</div>
		<m-follow-option 
			:type="type"
			action="unfollow"
			:optionVisible="optionVisible" 
			@changeVisible="changeOptionVisible" 
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
					<input type="text" v-model.trim="keyword" :placeholder="n == 1 ? '搜索歌手':'搜索用户'" @keyup="search"/>
					<span class="mui-icon mui-icon-closeempty" @tap="clear" v-show="isClear"></span>
				</div>
			</header>
			<div class="container" style="padding-top:44px;height:100%;overflow: auto;">
				<m-artist 
					:artist="search_singer" 
					:isOption="true" 
					@on-current-singer="onCurrentSinger">
				</m-artist>
				<m-user 
					:user="search_user" 
					:isOption="true"
					:isNetease="true"
					@on-current-user="onCurrentUser">
				</m-user>
			</div>
	  </mt-popup>
	</div>
</template>

<script>
	import mArtist from '~/components/artist'
	import mUser from '~/components/user'
	import mFollowOption from '~/components/follow_option'
	import storage from '~/utils/storage'
	import { STORAGE_KEY } from '~/common/const'
	
	export default {
		components: {
			mArtist,
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
				type: '',
				search_singer: [],
				search_user: [],
				keyword: '',
				n: 1
			}
		},
		computed: {
			userId() {
				return storage.getItem(STORAGE_KEY.USERID)
			},
			artist() {
				return this.$store.state.artist
			},
			user() {
				return this.$store.state.user
			}
		},
		methods: {
			loadArtist() {
				this.$store.state.artist = []
				this.loading = true
				this.notFound = false
				this.$store.dispatch('GET_USER_FOLLOW_SINGER', this.userId).then(res => {
					this.loading = false
					if(this.artist.length == 0){
						this.notFound = true
					}
				})
			},
			loadUser() {
				this.$store.state.user = []
				this.loading = true
				this.notFound = false
				this.$store.dispatch('GET_USER_FOLLOW_NETEASEUSER', this.userId).then(res => {
					this.loading = false
					if(this.user.length == 0){
						this.notFound = true
					}
				})
			},
			changeOptionVisible(value) {
				this.optionVisible = value
			},
			onCurrentSinger(value) {
				this.optionVisible = value.visible
				this.currentId = value.currentSinger.id
				this.type = 'singer'
			},
			onCurrentUser(value) {
				this.optionVisible = value.visible
				this.currentId = value.currentUser.id
				this.type = 'neteaseUser'
			},
			showSearchOption() {
				this.searchOptionVisible = true
				this.clear()
				history.pushState(null, null, document.URL)
			},
			clear() {
				this.keyword = ''
				this.isClear = false
				this.search_singer = []
				this.search_user = []
			},
			search() {
				switch(this.n){
					case 1:
						if(this.keyword){
							this.isClear = true
							let s = this.keyword.toLowerCase()
							let singer = []
							this.artist.forEach((item, index) => {
								if(item.name.toLowerCase().match(s)){
									singer.push(item)
								}
							})
							this.search_singer = singer
						}else{
							this.isClear = false
							this.search_singer = []
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
							this.search_user = user
						}else{
							this.isClear = false
							this.search_user = []
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
			this.loadArtist()
			let _this = this
			$('.tab-link').on('touchstart',function() {
				if($(this).hasClass('tab-active')){
					return
				}
				$(this).addClass('tab-active').siblings().removeClass('tab-active')
				let i = $(this).index()
				if(i == 0){
					_this.loadArtist()
					_this.n = 1
				}else{
					_this.loadUser()
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