<template>
	<div>
		<header class="mui-bar mui-bar-nav">
			<a class="mui-icon mui-icon-back mui-pull-left" href="javascript:history.back()"></a>
			<h1 class="mui-title">最近播放</h1>
			<span class="delete mui-pull-right" @tap="deleteAll">清空</span>
		</header>
		<div class="container">
			<m-batch :song="song" :type="2"></m-batch>
			<m-song :song="song" @on-current-song="onCurrentSong"></m-song>
		</div>
		<m-song-option 
			:optionVisible="optionVisible" 
			@changeVisible="changeVisible" 
			:currentSong="currentSong">
		</m-song-option>
	</div>
</template>

<script>
	import mSong from '~/components/song'
	import mSongOption from '~/components/song_option'
	import mBatch from '~/components/batch'
	import storage from '~/utils/storage'
	import { STORAGE_KEY } from '~/common/const'
	
	export default {
		components: {
			mSong,
			mSongOption,
			mBatch
		},
		data() {
			return {
				optionVisible: false,
				currentSong: {},
				song: []
			}
		},
		computed: {
			_song() {
				return this.$store.state.song
			}
		},
		methods: {
			changeVisible(value) {
				this.optionVisible = value
			},
			onCurrentSong(value) {
				this.optionVisible = value.visible
				this.currentSong = value.currentSong
			},
			deleteAll(){
				mui.confirm('确定清空所有最近播放记录？', e => {
					if(e.index){
						this.$store.state.song = []
						storage.removeItem(STORAGE_KEY.PLAY_HISTORY)
					}
				},'div')
			}
		},
		watch: {
			_song() {
				this.song = this.$store.state.song
			}
		},
		mounted() {
			this.$store.state.song = storage.getItem(STORAGE_KEY.PLAY_HISTORY) || []
		}
	}
</script>

<style scoped>
	.mui-icon-back{
		color:#fff
	}
	.container{
		padding-top:44px;
		padding-bottom:50px;
	}
	.delete{
		color: #fff;line-height: 44px;
	}
</style>