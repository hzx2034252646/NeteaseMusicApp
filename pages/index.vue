<template>
	<div class="container">
		<nuxt-child></nuxt-child>
		<m-player></m-player>
	</div>
</template>

<script>
	import mPlayer from '~/components/player'
	import storage from '~/utils/storage'
	import { STORAGE_KEY, MAX_LOGIN_TIME } from '~/common/const'
	
	export default {
		components: {
			mPlayer
		},
		methods: {
			checkAuth() {
				//判断登录是否超时
			   let lastLoginTime = storage.getItem(STORAGE_KEY.LAST_LOGIN_TIME) || 0
			   if (Date.now()/1000 - lastLoginTime > MAX_LOGIN_TIME) { // 登录超时
			      storage.removeItem(STORAGE_KEY.USERID)
			      storage.removeItem(STORAGE_KEY.USERNAME)
			      storage.removeItem(STORAGE_KEY.TOKEN)
			      storage.removeItem(STORAGE_KEY.LAST_LOGIN_TIME)
			      this.$store.state.isAuthenticated = false
			   }
			}
		},
		watch: {
			'$route': 'checkAuth'
		},
		mounted() {
			if((!storage.getItem(STORAGE_KEY.TOKEN) && this.$route.path.match('my')) || (storage.getItem(STORAGE_KEY.TOKEN) && this.$route.path.match(/login|register/))){
				this.$router.push({ path: '/discover/recommend' })
			}
			function getDistance( lng1,  lat1,  lng2,  lat2){
			    var radLat1 = lat1*Math.PI / 180.0
			    var radLat2 = lat2*Math.PI / 180.0
			    var a = radLat1 - radLat2
			    var  b = lng1*Math.PI / 180.0 - lng2*Math.PI / 180.0
			    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) +
			    Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)))
			    s = s *6371 
			    s = Math.round(s * 10000) / 10000
			    return (s/1000).toFixed(2)
			}
			this.$store.dispatch('GET_USER_LOCATION')
		}
	}
</script>

<style scoped>
	.container{
		height:100%;
		padding-bottom: 50px;
	}
</style>
