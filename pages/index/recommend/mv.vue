<template>
	<div id="personalized_album">
		<header class="mui-bar mui-bar-nav">
			<a class="mui-icon mui-icon-back mui-pull-left" href="javascript:history.back()"></a>
			<h1 class="mui-title">推荐MV</h1>
		</header>
		<div class="container">
			<m-mv :mv="mv" :isImageLazyLoad="true" v-show="visible" @changeVisible="changeVisible"></m-mv>
		</div>
		<mt-popup
			v-model="optionVisible"
	   	position="bottom"
	   	:closeOnClickModal="false"
			style="width:100%"
			@tap.native="optionVisible=false">
			<ul class="mui-table-view">
				<li class="mui-table-view-cell text-center" v-for="(item,index) in actions" :key="index" @tap="item.method">
					<a href="#">{{ item.name }}</a>
				</li>
			</ul>
		</mt-popup>
	</div>
</template>

<script>
	import { Indicator } from 'mint-ui'
	import mMv from '~/components/mv'
	
	export default {
		components: {
			mMv
		},
		data() {
			return {
				visible: false,
				optionVisible: false,
				actions: []
			}
		},
		computed: {
			mv() {
				return this.$store.state.personalized_mv
			}
		},
		methods: {
			async loadData() {
				Indicator.open()
				await this.$store.dispatch('GET_PERSONALIZED_MV', 100)
				this.visible = true
				Indicator.close()
			},
			changeVisible(value) {
				this.actions = value.actions
				this.optionVisible = value.visible
			}
		},
		mounted() {
			if(this.mv.length != 100){
				this.loadData()
			}else{
				this.visible = true
			}
			$(document).delegate('.v-modal','tap',() => {
				this.optionVisible = false
			})
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