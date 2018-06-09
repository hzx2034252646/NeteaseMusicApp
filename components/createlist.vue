<template>
	<ul class="mui-table-view" v-show="playlist.length>0">
		<li class="mui-table-view-cell mui-media" v-for="(item,index) in playlist" :key="index" @tap="loadCreatelistMusic(item.id)">
			<a href="javascript:;">
				<img class="mui-media-object mui-pull-left" v-lazy="format(item.picUrl)">
				<div class="mui-media-body">
					<p class="list-name mui-ellipsis" :style="{'max-width': isOption ? '85%':'100%'}">{{ item.name }}</p>
					<p>{{ item.songCount }}首</p>
				</div>
			</a>
			<span class="option" @tap.stop="showOption(item.id)" v-if="isOption">
				<span class="fa fa-ellipsis-v"></span>
			</span>
		</li>
	</ul>
</template>

<script>
	import { formatPicUrl } from '~/common/function'
	
	export default {
		props: [
			'playlist',
			'isOption'
		],
		methods: {
			showOption(id) {
				this.$emit('on-current-playlist',{
					visible: true,
					currentPlaylist: this.playlist.find(item => item.id == id)
				})
			},
			loadCreatelistMusic(id) {
				this.$router.push({ path: '/my/playlist/'+ id })
			},
			format(pic) {
				return formatPicUrl(pic)
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