<template>
	<ul class="mui-table-view" v-show="song && song.length > 0">
		<li class="mui-table-view-cell mui-media" v-for="(item,index) in song" :key="index" @tap="playMusic(item.id)">
			<a href="javascript:;">
				<img class="mui-media-object mui-pull-left" v-lazy="format(item.picUrl,item.source)" />
				<div class="mui-media-body">
					<p class="song-name mui-ellipsis">{{ item.name }}</p>
					<p class="mui-ellipsis">{{ item.artist }}</p>
				</div>
			</a>
			<span class="option" @tap.stop="showOption(item.id)">
				<span class="fa fa-ellipsis-v"></span>
			</span>
		</li>
	</ul>
</template>

<script>
	import { formatPicUrl } from '~/common/function'
	
	export default {
		props: [
			'song'
		],
		methods: {
			showOption(id) {
				this.$emit('on-current-song',{
					visible: true,
					currentSong: this.song.find(item => item.id == id)
				})
			},
			playMusic(id) {
				this.$store.dispatch('PLAY_MUSIC', id)
			},
			format(pic, source) {
				return formatPicUrl(pic, source)
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
		margin:0;line-height:1.6;max-width:85%
	}
	.mui-media-body .song-name{
		font-size:0.85rem;
		color:#000
	}
	.option{
		position:absolute;top:0;right:0;line-height:72px;text-align: center;
		width:40px;height:100%;font-size:16px;color:#ccc
	}
</style>