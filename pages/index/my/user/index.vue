<template>
	<div>
		<header class="mui-bar mui-bar-nav">
			<a class="mui-icon mui-icon-back mui-pull-left" href="javascript:history.back()"></a>
			<h1 class="mui-title">附近的人</h1>
		</header>
		<div class="container">
			<ul class="mui-table-view" v-show="user.length>0">
				<li class="mui-table-view-cell mui-media" v-for="(item,index) in user" :key="index" @tap="loadUserDetail(item.id)">
					<a href="javascript:;">
						<img class="mui-media-object mui-pull-left" v-lazy="item.picUrl">
						<div class="mui-media-body">
							<p class="mui-ellipsis">{{ item.name }}</p>
						</div>
					</a>
					<span class="location">
						<span class="mui-icon mui-icon-location"></span>
						<span>{{ item.distance }}</span>
					</span>
				</li>
			</ul>
			<p class="loading" v-show="loading"><span class="mui-spinner"></span>正在加载中</p>
			<p class="loading" v-show="notFound">附近没有用户</p>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				loading: false,
				notFound: false
			}
		},
		computed: {
			user() {
				return this.$store.state.user
			}
		},
		methods: {
			loadUser() {
				this.loading = true
				this.$store.state.user = []
				this.$store.dispatch('GET_NEARBY_USER').then(res => {
					this.loading = false
					if(this.user.length == 0){
						this.notFound = true
					}
				})
			},
			loadUserDetail(id) {
				this.$router.push({ path:'/my/user/'+id })
			},
		},
		mounted() {
			this.loadUser()
		}
	}
</script>

<style scoped>
	.mui-icon-back{
		color:#fff
	}
	.container{
		padding-top:44px;
		padding-bottom:50px;
	}
	.mui-media-object{
		max-width:50px;
		height:50px;
		border-radius: 50%;
	}
	.mui-media-body p{
		font-size:0.85rem;
		color:#000;
		margin:10px 0;
		max-width:85%
	}
	.location{
		position:absolute;top:0;right:10px;line-height:72px;
		color:#999;
	}
	.location span:nth-child(1){
		font-size: 18px;
	}
	.location span:nth-child(2){
		font-size: 16px;
		margin-left: 3px;
	}
</style>