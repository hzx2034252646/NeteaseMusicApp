<template>
	<div id="artist">
		<header class="mui-bar mui-bar-nav">
			<a class="mui-icon mui-icon-back mui-pull-left" href="javascript:history.back()"></a>
			<h1 class="mui-title">热门歌手</h1>
		</header>
		<div class="buttons-tab">
			<a id="1" class="tab-link button tab-active">华语</a>
			<a id="2" class="tab-link button">欧美</a>
			<a id="3" class="tab-link button">韩国</a>
			<a id="4" class="tab-link button">日本</a>
		</div>
		<div class="container">
			<m-artist :artist="artist"></m-artist>
		   <p class="loading" v-show="loading"><span class="mui-spinner"></span>正在加载中</p>
		</div>
	</div>
</template>

<script>
	import mArtist from '~/components/artist'
	
	export default {
		components: {
			mArtist
		},
		data() {
			return {
				loading: false,
				areaId: 1
			}
		},
		computed: {
			artist() {
				return this.$store.state.artist
			}
		},
		methods: {
			async loadSinger() {
				this.$store.state.artist = []
				this.loading = true
				await this.$store.dispatch('GET_HOT_ARTIST', this.areaId).then(res => {
					this.loading = false
				})
			}
		},
		mounted() {
			this.loadSinger()
			let _this = this
			$('.tab-link').on('touchstart',function() {
				if($(this).hasClass('tab-active')){
					return
				}
				$(this).addClass('tab-active').siblings().removeClass('tab-active')
				$('body').scrollTop(0)
				_this.areaId = this.id
				_this.loadSinger()
			})
		}
	}
</script>

<style scoped>
	.mui-icon-back{
		color:#fff
	}
	.buttons-tab{
		width: 100%;
		z-index:100;
		position: fixed;
		top:44px;
	}
	.container{
		padding-top:84px;
		padding-bottom: 50px;
	}
</style>