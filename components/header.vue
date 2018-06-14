<template>
	<header class="mui-bar mui-bar-nav">
		<a class="mui-icon mui-action-menu mui-icon-bars mui-pull-left" href="#offCanvasSide"></a>
		<a class="mui-icon mui-icon-search mui-pull-right" href="javascript:;" @tap="search"></a>
		<h1 class="mui-title">网易云音乐</h1>
	</header>
</template>

<script>
	export default {
		methods: {
			search() {
				this.$router.push({ path: '/search'})
			}
		}
	}
</script>

<style scoped>
	.mui-icon{
		color:#fff;
	}
</style>