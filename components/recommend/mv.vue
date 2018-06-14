<template>
	<div id="personalized_mv">
		<div class="content-block-title">
			推荐MV
			<nuxt-link to="/recommend/mv" class="pull-right color-gray" @tap.native="loadMoreMV">更多<span class="mui-icon mui-icon-arrowright"></span></nuxt-link>
		</div>
		<m-mv :mv="mv" :isImageLazyLoad="false" @changeVisible="changeVisible"></m-mv>
	</div>
</template>

<script>
	import mMv from '~/components/mv'
	
	export default {
		components: {
			mMv
		},
		computed: {
			mv() {
				return this.$store.state.personalized_mv.slice(0,6)
			}
		},
		methods: {
			loadMoreMV() {
				this.$router.push({
					path: '/recommend/mv'
				})
			},
			changeVisible(value) {
				this.$emit('changeVisible', {
					visible: value.visible,
					actions: value.actions
				})
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