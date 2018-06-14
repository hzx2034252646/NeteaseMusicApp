<template>
	<div class="mui-scroll-wrapper mui-content">
		<div class="mui-scroll">
			<div v-show="visible">
				<m-playlist :playlist="toplist" :isImageLazyLoad="true"></m-playlist>
			</div>
			<p class="loading" v-show="loading"><span class="mui-spinner"></span>正在加载中</p>
		</div>
	</div>
</template>

<script>
	import mPlaylist from '~/components/playlist'
	
	export default {
		components: {
			mPlaylist
		},
		data() {
			return {
				visible: false,
				loading: false
			}
		},
		computed: {
			toplist() {
				return this.$store.state.toplist
			}
		},
		methods: {
			async loadData() {
				this.loading = true
				await this.$store.dispatch('GET_TOPLIST')
				this.visible = true
				this.loading = false
			}
		},
		mounted() {
			if(this.toplist.length == 0) {
				this.loadData()
			} else {
				this.visible = true
			}
			mui('.mui-scroll-wrapper').scroll()
		}
	}
</script>