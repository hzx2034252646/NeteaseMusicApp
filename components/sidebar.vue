<template>
	<div class="sidebar">
		<div class="user" v-if="isLogin">
			<div class="avatar" @tap="loadUserDetail">
				<img :src="avatarUrl" />
			</div>
			<p style="color:#fff" @tap="loadUserDetail">{{ username }}</p>
			<div class="bg-img">
				<img :src="avatarUrl" alt="" style="width:100%"/>
			</div>
			<div class="bg-mask"></div>
		</div>
		<div class="login" v-else="isLogin">
			<p>登录网易云音乐</p>
			<p>私人音乐空间，听我想听的歌</p>
			<button type="button" class="mui-btn mui-btn-white mui-btn-outlined" @tap="login">立即登录</button>
		</div>
		<ul class="mui-table-view">
			<li class="mui-table-view-cell" @tap="loadPlayHistory">
				<span class="fa fa-clock-o"></span>
				最近播放
			</li>
			<div v-if="isLogin">
				<div class="divide"></div>
				<li class="mui-table-view-cell" @tap="loadMyMusic">
					<span class="fa fa-music"></span>
					我的音乐
				</li>
				<li class="mui-table-view-cell" @tap="loadMyCollect">
					<span class="fa fa-heart"></span>
					我的收藏
				</li>
				<li class="mui-table-view-cell" @tap="loadMyVideo">
					<span class="fa fa-video-camera"></span>
					我的视频
				</li>
				<div class="divide"></div>
				<li class="mui-table-view-cell" @tap="loadMyFollow">
					<span class="fa fa-star"></span>
					我的关注
				</li>
				<li class="mui-table-view-cell" @tap="loadMyFriend">
					<span class="fa fa-user"></span>
					我的好友
				</li>
				<li class="mui-table-view-cell" @tap="loadMyUser">
					<span class="fa fa-map-marker"></span>
					附近的人
				</li>
				<div class="divide"></div>
				<li class="mui-table-view-cell" @tap="loadMySetting">
					<span class="fa fa-cog"></span>
					个人设置
				</li>
				<li class="mui-table-view-cell" @tap="logout">
					<span class="fa fa-power-off"></span>
					退出登录
				</li>
			</div>
		</ul>
	</div>
</template>

<script>
	import API from '~/api'
	import storage from '~/utils/storage'
	import { STORAGE_KEY } from '~/common/const'
	
	export default {
		computed: {
			userId() {
				return storage.getItem(STORAGE_KEY.USERID)
			},
			username() {
				return storage.getItem(STORAGE_KEY.USERNAME)
			},
			avatarUrl() {
				return API.ROOT + '/upload/' + this.userId + '/' + this.userId + '.jpg?rnd='+Math.random()
			},
			isLogin() {
				return this.$store.state.isAuthenticated
			}
		},
		methods: {
			login() {
				this.$router.push({ path: '/login' })
			},
			logout() {
				mui.confirm('确定退出当前账号？', e => {
					if(e.index){
						this.$store.state.isAuthenticated = false
					   storage.removeItem(STORAGE_KEY.USERID)
		            storage.removeItem(STORAGE_KEY.USERNAME)
		            storage.removeItem(STORAGE_KEY.TOKEN)
		            storage.removeItem(STORAGE_KEY.LAST_LOGIN_TIME)
					}
				},'div')
			},
			loadPlayHistory() {
				this.$router.push({ path: '/recent_play' })
			},
			loadMyMusic() {
				this.$router.push({ path: '/my/music' })
			},
			loadMyCollect() {
				this.$router.push({ path: '/my/collect' })
			},
			loadMyFollow() {
				this.$router.push({ path: '/my/follow' })
			},
			loadMyVideo() {
				this.$router.push({ path: '/my/video' })
			},
			loadMyFriend() {
				this.$router.push({ path: '/my/friend' })
			},
			loadMySetting() {
				this.$router.push({ path: '/my/setting' })
			},
			loadMyUser() {
				this.$router.push({ path: '/my/user'})
			},
			loadUserDetail() {
				this.$router.push({ path:'/my/user/'+this.userId })
			}
		},
		mounted() {
			if(this.userId){
				this.$store.state.isAuthenticated = true
			}
		}
	}
</script>

<style scoped>
	.user {
		width: 100%;
		height: 150px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.avatar {
		width: 60px;
		height: 60px;
		border-radius: 50%;
		overflow: hidden;
	}
	.avatar img {
		width: 100%;
		height: 100%;
	}
	.bg-img{
		width:100%;height:200px;position:absolute;top:0;z-index:-2;
		-webkit-filter: blur(30px);
	}
	.bg-mask{
		width:100%;height:200px;position:absolute;top:0;
		background:rgba(0,0,0,.5);z-index:-1
	}
	.login{
		width: 100%;
		height: 150px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items:center;
		background: #333;
	}
	.login p{
		margin:0 0 10px 0
	}
	.login button{
		color:#ddd;border-color:#888
	}
	.mui-table-view-cell:after{
		height: 0
	}
	.divide{
		width: 100%;
		height: 10px;
		background: #f2f2f2;
	}
	.mui-table-view-cell{
		font-size: 16px;padding-left:50px;
	}
	.mui-table-view .fa{
		color: #ddd; position:absolute;left:20px;top:14px;
	}
</style>