<template>
	<ul class="mui-table-view album" v-show="album.length>0">
		<li class="mui-table-view-cell mui-media" v-for="(item,index) in album" :key="index" @tap="loadAlbumDetail(item.id)">
			<a href="javascript:;">
				<img class="mui-media-object mui-pull-left" v-lazy="item.picUrl">
				<div class="mui-media-body">
					<p class="list-name mui-ellipsis" :style="styleObject">{{ item.name }}</p>
					<p class="mui-ellipsis" :style="styleObject">{{ item.artist }}</p>
				</div>
			</a>
			<span class="option" @tap.stop="showOption(item.id)" v-if="isOption">
				<span class="fa fa-ellipsis-v"></span>
			</span>
		</li>
	</ul>
</template>

<script>
	export default {
		props: [
			'album',
			'isOption'
		],
		data() {
			return {
				styleObject: {
					'max-width': this.isOption ? '85%':'100%'
				}
			}
		},
		methods: {
			showOption(id) {
				this.$emit('on-current-album',{
					visible: true,
					currentAlbum: this.album.find(item => item.id == id)
				})
			},
			loadAlbumDetail(id) {
				this.$router.push({ path:'/album/'+id })
			}
		}
	}
</script>

<style scoped>
	.mui-media-object{
		max-width:50px;
		height:50px;
	}
	.mui-media-body p{
		margin:0;line-height:1.6;
	}
	.mui-media-body .list-name{
		font-size:0.85rem;
		color:#000
	}
	.option{
		position:absolute;top:0;right:0;line-height:72px;text-align: center;
		width:40px;height:100%;font-size:16px;color:#ccc
	}
</style>