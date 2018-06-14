<template>
	<div id="personalized_album">
		<header class="mui-bar mui-bar-nav">
			<a class="mui-icon mui-icon-back mui-pull-left" href="javascript:history.back()"></a>
			<h1 class="mui-title">推荐专辑</h1>
		</header>
		<div class="container">
			<m-album :album="album" :isImageLazyLoad="true" v-show="visible"></m-album>
		</div>
	</div>
</template>

<script>
	import { Indicator } from 'mint-ui'
	import mAlbum from '~/components/album'
	
	export default {
		components: {
			mAlbum
		},
		data() {
			return {
				visible: false,
			}
		},
		computed: {
			album() {
				return this.$store.state.personalized_album
			}
		},
		methods: {
			async loadData() {
				Indicator.open()
				await this.$store.dispatch('GET_PERSONALIZED_ALBUM', 100)
				this.visible = true
				Indicator.close()
			}
		},
		mounted() {
			if(this.album.length != 100){
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
		padding-top: 44px;
		padding-bottom: 50px;
	}
</style>