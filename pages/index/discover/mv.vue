<template>
	<div class="mui-scroll-wrapper mui-content">
		<div class="mui-scroll">
		    <p>
		    	<span class="button button-round" @tap="categoryVisible=true">
		    		{{ area }}
		    		<span class="mui-icon mui-icon-arrowright"></span>
		    	</span>
		    </p>
		    <m-mv :mv="mv" :isImageLazyLoad="true" v-show="mv.length>0" @changeVisible="changeVisible"></m-mv>
		    <p class="loading" v-show="loading"><span class="mui-spinner"></span>正在加载中</p>
		</div>
		<mt-popup
			v-model="categoryVisible"
	   	position="left"
	   	:modal="false"
	   	style="width:100%;height:100%">
			<ul class="mui-table-view mui-table-view-chevron" style="padding-top:84px">
				<li class="mui-table-view-cell" style="text-align:center;padding-right:0">
					<span class="mui-icon mui-icon-arrowleft mui-pull-left" @tap="categoryVisible=false"></span>选择分类
				</li>
				<li class="mui-table-view-cell" @tap="changeCategory('内地')">
					<a class="mui-navigate-right" href="#">内地</a>
				</li>
				<li class="mui-table-view-cell" @tap="changeCategory('港台')">
					<a class="mui-navigate-right" href="#">港台</a>
				</li>
				<li class="mui-table-view-cell" @tap="changeCategory('欧美')">
					<a class="mui-navigate-right" href="#">欧美</a>
				</li>
				<li class="mui-table-view-cell" @tap="changeCategory('韩国')">
					<a class="mui-navigate-right" href="#">韩国</a>
				</li>
				<li class="mui-table-view-cell" @tap="changeCategory('日本')">
					<a class="mui-navigate-right" href="#">日本</a>
				</li>
			</ul>
		</mt-popup>
		<mt-popup
			v-model="visible"
	   	position="bottom"
	   	:closeOnClickModal="false"
			style="width:100%"
			@tap.native="visible=false">
			<ul class="mui-table-view">
				<li class="mui-table-view-cell text-center" v-for="(item,index) in actions" :key="index" @tap="item.method">
					<a href="#">{{ item.name }}</a>
				</li>
			</ul>
		</mt-popup>
	</div>
</template>

<script>
	import mMv from '~/components/mv'
	
	export default {
		components: {
			mMv
		},
		data() {
			return {
				area: '内地',
				categoryVisible: false,
				loading: false,
				visible: false,
				actions: []
			}
		},
		computed: {
			mv() {
				return this.$store.state.mv
			}
		},
		methods: {
			changeCategory(value) {
				this.area = value
				this.categoryVisible = false
				this.loadMV(this.area)
			},
			changeVisible(value) {
				this.actions = value.actions
				this.visible = value.visible
			},
			async loadMV(area) {
				this.loading = true
				this.$store.state.mv = []
				await this.$store.dispatch('GET_HOT_MV',area)
				this.loading = false
			}
		},
		mounted() {
			this.loadMV(this.area)
			mui('.mui-scroll-wrapper').scroll()
			$(document).delegate('.v-modal','tap',() => {
				this.visible = false
			})
		}
	}
</script>

<style scoped>
	.mui-icon-arrowright{
		font-size:18px;
	}
	.button{
		display:inline-block;
		padding:0 0.2rem 0 0.6rem;
		color:#d43c33;
		border:1px solid #d43c33;
		margin-left:15px;
		line-height: 1.35rem
	}
</style>