<template>
	<div id="personalized_album">
		<div class="content-block-title">
			推荐专辑
			<nuxt-link to="/recommend/album" class="pull-right color-gray" @tap.native="loadMoreAlbum">更多<span class="mui-icon mui-icon-arrowright"></span></nuxt-link>
		</div>
		<m-album :album="album" :isImageLazyLoad="false"></m-album>
	</div>
</template>

<script>
	import mAlbum from '~/components/album'
	
	export default {
		components: {
			mAlbum
		},
		computed: {
			album() {
				return this.$store.state.personalized_album.slice(0,6)
			}
		},
		methods: {
			loadMoreAlbum() {
				this.$router.push({ path: '/recommend/album' })
			}
		}
	}
</script>

<style scoped>
	.color-gray {
		position: relative;
		top: -5px;
	}
</style>