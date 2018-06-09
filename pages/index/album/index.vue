<template>
	<div id="newAlbum">
		<header class="mui-bar mui-bar-nav">
			<a class="mui-icon mui-icon-back mui-pull-left" href="javascript:history.back()"></a>
			<h1 class="mui-title">新碟上架</h1>
		</header>
		<div class="buttons-tab">
			<a id="ALL" class="tab-link button tab-active">全部</a>
			<a id="ZH" class="tab-link button">内地</a>
			<a id="EA" class="tab-link button">欧美</a>
			<a id="KR" class="tab-link button">韩国</a>
			<a id="JP" class="tab-link button">日本</a>
		</div>
		<div class="container">
			<m-album :album="album" :isImageLazyLoad="true"></m-album>
		   <p class="loading" v-show="loading"><span class="mui-spinner"></span>正在加载中</p>
		   <p class="loading" v-show="loadMore" @tap="loadNewAlbum(++page)">加载更多</p>
		   <p class="loading" v-show="noMore">没有更多数据了</p>
		</div>
	</div>
</template>

<script>
	import mAlbum from '~/components/album'
	
	export default {
		components: {
			mAlbum
		},
		data() {
			return {
				loading: false,
				loadMore: false,
				noMore: false,
				type: 'ALL',
				page: 1
			}
		},
		computed: {
			album() {
				return this.$store.state.album
			}
		},
		methods: {
			async loadNewAlbum(page) {
				this.loading = true
				this.loadMore = false
				this.noMore = false
				let count = this.album.length
				await this.$store.dispatch('GET_NEW_ALBUM',{
					offset: (page-1)*20,
               limit: 20,
               type: this.type
				}).then(res => {
					this.loading = false
					if(this.album.length != count){
						this.loadMore = true
					}else{
						this.noMore = true
					}
				})
			}
		},
		mounted() {
			this.$store.state.album = []
			this.loadNewAlbum(this.page)
			let _this = this
			$('.tab-link').on('touchstart',function() {
				if($(this).hasClass('tab-active')){
					return
				}
				$(this).addClass('tab-active').siblings().removeClass('tab-active')
				$('body').scrollTop(0)
				_this.type = this.id
				_this.page = 1
				_this.$store.state.album = []
				_this.loadNewAlbum(_this.page)
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