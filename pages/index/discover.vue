<template>
	<div class="mui-off-canvas-wrap mui-draggable">
		<div class="mui-inner-wrap">
			<aside class="mui-off-canvas-left" id="offCanvasSide">
				<div class="mui-scroll-wrapper">
					<div class="mui-scroll">
						<m-sidebar></m-sidebar>
					</div>
				</div>
			</aside>
			<m-header></m-header>
			<div class="mui-content">
				<div class="buttons-tab">
					<nuxt-link to="/discover/recommend" id="recommend" href="#" class="tab-link button">推荐</nuxt-link>
					<nuxt-link to="/discover/toplist" id="toplist" href="#" class="tab-link button">排行榜</nuxt-link>
					<nuxt-link to="/discover/playlist" id="playlist" href="#" class="tab-link button">歌单</nuxt-link>
					<nuxt-link to="/discover/mv" id="mv" href="#" class="tab-link button">MV</nuxt-link>
				</div>
			</div>
			<nuxt-child class="container"></nuxt-child>
			<div class="mui-off-canvas-backdrop"></div>
		</div>
	</div>
</template>

<script>
	import mHeader from '~/components/header'
	import mSidebar from '~/components/sidebar'

	export default {
		components: {
			mHeader,
			mSidebar
		},
		mounted() {
			mui.init()
			let obj = this
			$('.tab-link').on('touchstart',function(ev){
				obj.$router.push({ path: '/discover/'+this.id})
			})
		}
	}
</script>

<style scoped>
	.buttons-tab{
		z-index:100
	}
	.container{
		margin-top:2rem
	}
	#offCanvasSide{
		background: #fff;
	}
</style>