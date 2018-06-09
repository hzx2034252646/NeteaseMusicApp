<template>
	<ul class="mui-table-view mui-grid-view mui-grid-9">
		<li class="mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-3">
			<a href="javascript:;" @tap="loadNewSong">
				<span class="mui-icon music-icon"></span>
				<div class="mui-media-body">新歌</div>
			</a>
		</li>
		<li class="mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-3">
			<a href="javascript:;" @tap="loadSinger">
				<span class="mui-icon singer-icon"></span>
				<div class="mui-media-body">歌手</div>
			</a>
		</li>
		<li class="mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-3">
			<a href="javascript:;" @tap="loadNewAlbum">
				<span class="mui-icon album-icon"></span>
				<div class="mui-media-body">专辑</div>
			</a>
		</li>
	</ul>
</template>

<script>
	export default {
		methods: {
			loadNewSong() {
				this.$router.push({ path: '/newSong' })
			},
			loadSinger() {
				this.$router.push({ path: '/artist' })
			},
			loadNewAlbum() {
				this.$router.push({ path: '/album' })
			}
		}
	}
</script>

<style scoped>
	.music-icon{
		width:32px;
		height:32px;
		background: url('~/assets/images/icons/grid_music.png');
		background-size: contain;
	}
	.singer-icon{
		width:32px;
		height:32px;
		background: url('~/assets/images/icons/grid_singer.png');
		background-size: contain;
	}
	.album-icon {
		width: 32px;
		height: 32px;
		background: url('~/assets/images/icons/grid_album.png');
		background-size: contain;
	}
</style>