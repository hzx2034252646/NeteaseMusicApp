<template>
	<div id="personalized_playlist">
		<header class="mui-bar mui-bar-nav">
			<a class="mui-icon mui-icon-back mui-pull-left" href="javascript:history.back()"></a>
			<h1 class="mui-title">推荐歌单</h1>
		</header>
		<div class="container">
			<div v-show="visible">
				<m-playlist :playlist="playlist" :isImageLazyLoad="true"></m-playlist>
			</div>
		</div>
	</div>
</template>

<script>
	import { Indicator } from 'mint-ui'
	import mPlaylist from '~/components/playlist'
	
	export default {
		data() {
			return {
				visible: false
			}
		},
		components: {
			mPlaylist
		},
		computed: {
			playlist() {
				return this.$store.state.personalized_playlist
			}
		},
		methods: {
			async loadData() {
				Indicator.open()
				await this.$store.dispatch('GET_PERSONALIZED_PLAYLIST', 100)
				this.visible = true
				Indicator.close()
			},
			loadPlaylistDetail(id) {
				this.$router.push({ path:'/playlist/'+id })
			}
		},
		mounted() {
			if(this.playlist.length != 100){
				this.loadData()
			}else{
				this.visible = true
			}
		}
	}
</script>

<style scoped>
	.mui-icon {
		color: #fff;
	}
	.container{
		padding-top:44px;
		padding-bottom: 50px;
	}
</style>