<template>
	<div id="personalized_playlist">
		<div class="content-block-title">
			推荐歌单
			<nuxt-link to="/recommend/playlist" class="pull-right color-gray" @tap.native="loadMorePlaylist">更多<span class="mui-icon mui-icon-arrowright"></span></nuxt-link>
		</div>
		<m-playlist :playlist="playlist" :isImageLazyLoad="false"></m-playlist>
	</div>
</template>

<script>
	import mPlaylist from '~/components/playlist'
	
	export default {
		components: {
			mPlaylist
		},
		computed: {
			playlist() {
				return this.$store.state.personalized_playlist.slice(0,6)
			}
		},
		methods: {
			loadMorePlaylist() {
				this.$router.push({
					path: '/recommend/playlist'
				})
			}
		},
		mounted() {
			$('.mui-icon-more').hide()
			$('.mui-media-body p').css('max-width','100%')
		}
	}
</script>

<style scoped>
	.color-gray {
		position: relative;
		top: -5px;
	}
</style>