<template>
	<ul class="mui-table-view">
		<li class="mui-table-view-cell mui-media" v-for="(item,index) in playlist" :key="index" @tap="loadPlaylistDetail(item.id)">
			<a href="javascript:;">
				<img v-if="isImageLazyLoad" class="mui-media-object mui-pull-left" v-lazy="item.picUrl">
				<img v-else="isImageLazyLoad" class="mui-media-object mui-pull-left" :src="item.picUrl">
				<div class="mui-media-body">
					<p class="mui-ellipsis">{{ item.name }}</p>
					<p class="mui-ellipsis">{{ item.creator ? 'by':'' }} {{ item.creator ? item.creator.name:'' }}</p>
					<p class="mui-ellipsis">播放量：{{ item.playCount }}</p>
				</div>
			</a>
		</li>
	</ul>
</template>

<script>
	export default {
		props: [
			'playlist',
			'isImageLazyLoad'
		],
		methods: {
			loadPlaylistDetail(id) {
				this.$router.push({ path:'/playlist/'+id })
			}
		}
	}
</script>

<style scoped>
	.mui-media-object{
		max-width:100px;
		height:100px;
	}
	.mui-media-body p{
		margin:0;line-height:2;max-width:100%
	}
	.mui-media-body p:nth-child(1){
		font-size:0.85rem;
		color:#000;
		margin-top:5px;
	}
</style>