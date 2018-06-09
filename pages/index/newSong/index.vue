<template>
	<div id="newSong">
		<header class="mui-bar mui-bar-nav">
			<a class="mui-icon mui-icon-back mui-pull-left" href="javascript:history.back()"></a>
			<h1 class="mui-title">新歌首发</h1>
		</header>
		<div class="buttons-tab">
			<a id="0" class="tab-link button tab-active">全部</a>
			<a id="7" class="tab-link button">华语</a>
			<a id="96" class="tab-link button">欧美</a>
			<a id="16" class="tab-link button">韩国</a>
			<a id="8" class="tab-link button">日本</a>
		</div>
		<div class="container">
			<m-batch :song="song"></m-batch>
			<m-song :song="song" @on-current-song="onCurrentSong"></m-song>
		   <p class="loading" v-show="loading"><span class="mui-spinner"></span>正在加载中</p>
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
	
	export default {
		components: {
			mSong,
			mSongOption,
			mBatch
		},
		data() {
			return {
				loading: false,
				optionVisible: false,
				currentSong: {},
				areaId: 0
			}
		},
		computed: {
			song() {
				return this.$store.state.song
			}
		},
		methods: {
			async loadNewSong() {
				this.$store.state.song = []
				this.loading = true
				await this.$store.dispatch('GET_NEW_SONG', this.areaId).then(res => {
					this.loading = false
				})
			},
			changeVisible(value) {
				this.optionVisible = value
			},
			onCurrentSong(value) {
				this.optionVisible = value.visible
				this.currentSong = value.currentSong
			}
		},
		mounted() {
			this.loadNewSong()
			let _this = this
			$('.tab-link').on('touchstart',function() {
				if($(this).hasClass('tab-active')){
					return
				}
				$(this).addClass('tab-active').siblings().removeClass('tab-active')
				$('body').scrollTop(0)
				_this.areaId = this.id
				_this.loadNewSong()
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
		padding-bottom:50px;
	}
</style>