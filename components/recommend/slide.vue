<template>
	<div id="slider" class="mui-slider">
		<div class="mui-slider-group mui-slider-loop">
			<!-- 额外增加的一个节点(循环轮播：第一个节点是最后一张轮播) -->
			<div class="mui-slider-item mui-slider-item-duplicate">
				<a href="#">
					<img :src="banner[banner.length-1]">
				</a>
			</div>
			<div class="mui-slider-item" v-for="(item,index) in banner" :key="index">
				<a href="#">
					<img :src="item">
				</a>
			</div>
			<!-- 额外增加的一个节点(循环轮播：最后一个节点是第一张轮播) -->
			<div class="mui-slider-item mui-slider-item-duplicate">
				<a href="#">
					<img :src="banner[0]">
				</a>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		computed: {
			banner() {
				return this.$store.state.banner
			}
		},
		mounted(){
			var gallery = mui('.mui-slider')
			gallery.slider({
			  interval:3000
			})
		}
	}
</script>

<style>

</style>