<template>
	<div class="mui-scroll-wrapper mui-content">
		<div class="mui-scroll">
			<m-slide></m-slide>
			<m-grid></m-grid>
			<m-playlist></m-playlist>
			<m-album></m-album>
			<m-mv @changeVisible="changeVisible"></m-mv>
		</div>
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
	import mSlide from '~/components/recommend/slide'
	import mGrid from '~/components/recommend/grid'
	import mPlaylist from '~/components/recommend/playlist'
	import mAlbum from '~/components/recommend/album'
	import mMv from '~/components/recommend/mv'

	export default {
		components: {
			mSlide,
			mGrid,
			mPlaylist,
			mAlbum,
			mMv
		},
		data() {
			return {
				visible: false,
				actions: []
			}
		},
		methods: {
			changeVisible(value) {
				this.actions = value.actions
				this.visible = value.visible
			}
		},
		mounted() {
			mui('.mui-scroll-wrapper').scroll()
			$(document).delegate('.v-modal','tap',() => {
				this.visible = false
			})
		}
	}
</script>