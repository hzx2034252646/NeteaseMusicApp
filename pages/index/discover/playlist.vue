<template>
	<div class="mui-scroll-wrapper mui-content">
		<div class="mui-scroll">
		    <p>
		    	<span class="button button-round" @tap="categoryVisible=true">
		    		{{ cat }}
		    		<span class="mui-icon mui-icon-arrowright"></span>
		    	</span>
		    	<span class="mui-pull-right">
		    		<span id="hot" :class="{ active: order == 'hot' }" @tap="changeOrder('hot')">热门</span>
		    		<span id="new" :class="{ active: order == 'new' }" @tap="changeOrder('new')">最新</span>
		    	</span>
		    </p>
		    <m-playlist :playlist="playlist" :isImageLazyLoad="true" v-show="playlist.length>0"></m-playlist>
		    <p class="loading" v-show="loading"><span class="mui-spinner"></span>正在加载中</p>
		    <p class="loading" v-show="loadMore" @tap="loadPlaylist(++page)">加载更多</p>
		    <p class="loading" v-show="noMore">没有更多数据了</p>
		</div>
		<mt-popup
			v-model="categoryVisible"
	   	position="left"
	   	:modal="false"
	   	style="width:100%;height:100%;">
			<div class="mui-scroll-wrapper" style="padding-top:84px;padding-bottom:50px">
				<div class="mui-scroll">
					<ul class="mui-table-view mui-table-view-chevron">
						<li class="mui-table-view-cell" style="text-align:center;padding-right:0">
							<span class="mui-icon mui-icon-arrowleft mui-pull-left" @tap="categoryVisible=false"></span>选择分类
						</li>
						<li class="mui-table-view-cell" @tap="changeCategory('全部歌单')">
							<a class="mui-navigate-right" href="#">全部歌单</a>
						</li>
						<li class="mui-table-view-cell mui-collapse">
							<a class="mui-navigate-right" href="#">语种</a>
							<ul class="mui-table-view mui-table-view-chevron">
								<li class="mui-table-view-cell" v-for="(item,index) in category.language" :key="index" @tap="changeCategory(item)">
									<a class="mui-navigate-right" href="#">{{ item }}</a>
								</li>
							</ul>
						</li>
						<li class="mui-table-view-cell mui-collapse">
							<a class="mui-navigate-right" href="#">风格</a>
							<ul class="mui-table-view mui-table-view-chevron">
								<li class="mui-table-view-cell" v-for="(item,index) in category.style" :key="index" @tap="changeCategory(item)">
									<a class="mui-navigate-right" href="#">{{ item }}</a>
								</li>
							</ul>
						</li>
						<li class="mui-table-view-cell mui-collapse">
							<a class="mui-navigate-right" href="#">场景</a>
							<ul class="mui-table-view mui-table-view-chevron">
								<li class="mui-table-view-cell" v-for="(item,index) in category.scene" :key="index" @tap="changeCategory(item)">
									<a class="mui-navigate-right" href="#">{{ item }}</a>
								</li>
							</ul>
						</li>
						<li class="mui-table-view-cell mui-collapse">
							<a class="mui-navigate-right" href="#">情感</a>
							<ul class="mui-table-view mui-table-view-chevron">
								<li class="mui-table-view-cell" v-for="(item,index) in category.emotion" :key="index" @tap="changeCategory(item)">
									<a class="mui-navigate-right" href="#">{{ item }}</a>
								</li>
							</ul>
						</li>
						<li class="mui-table-view-cell mui-collapse">
							<a class="mui-navigate-right" href="#">主题</a>
							<ul class="mui-table-view mui-table-view-chevron">
								<li class="mui-table-view-cell" v-for="(item,index) in category.theme" :key="index" @tap="changeCategory(item)">
									<a class="mui-navigate-right" href="#">{{ item }}</a>
								</li>
							</ul>
						</li>
					</ul>
				</div>
			</div>
		</mt-popup>
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
				loading: false,
				loadMore: false,
				noMore: false,
				categoryVisible: false,
				cat: '全部歌单',
				order: 'hot',
				page: 1
			}
		},
		computed: {
			category() {
				return this.$store.state.category
			},
			playlist() {
				return this.$store.state.playlist
			}
		},
		methods: {
			async loadCategory() {
				await this.$store.dispatch('GET_PLAYLIST_CATEGORY')
			},
			async loadPlaylist(page) {
				this.loading = true
				this.loadMore = false
				this.noMore = false
				let count = this.playlist.length
				await this.$store.dispatch('GET_PLAYLIST_BYCATEGORY',{
					count: 20,
					cat: this.cat,
					order: this.order,
					pages: page
				}).then(res => {
					this.loading = false
					if(this.playlist.length != count){
						this.loadMore = true
					}else{
						this.noMore = true
					}
				})
			},
			changeCategory(value) {
				this.cat = value
				this.categoryVisible = false
				this.page = 1
				this.$store.state.playlist = []
				this.loadPlaylist(this.page)
			},
			changeOrder(value) {
				this.order = value
				this.page = 1
				this.$store.state.playlist = []
				this.loadPlaylist(this.page)
			}
		},
		mounted() {
			if(!this.category.style){
				this.loadCategory()
			}
			mui('.mui-scroll-wrapper').scroll()
			$(document).delegate('.v-modal','tap',() => {
				this.categoryVisible = false
			})
			this.$store.state.playlist = []
			this.loadPlaylist(this.page)
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
	#hot,#new{
		margin-right:20px;margin-top:3px;display: inline-block;
	}
	.active{
		color:#d43c33
	}
</style>