<template>
	<div id="playlist">
		<header class="mui-bar mui-bar-nav">
			<a class="mui-icon mui-icon-back mui-pull-left" href="javascript:history.back()"></a>
			<h1 class="mui-title">歌单</h1>
		</header>
		<div class="mui-card-header mui-card-media">
			<img :src="playlist.picUrl" v-show="visible"/>
			<div class="mui-media-body">
				{{ playlist.name }}
			</div>
			<div class="avatar" v-show="visible">
				<span id="avatar" @tap="loadUserDetail">
					<img :src="playlist.creator.picUrl" alt="" />
				</span>
				<span class="mui-ellipsis" @tap="loadUserDetail">{{ playlist.creator.name }}</span>
				<span class="mui-icon mui-icon-arrowright"></span>
			</div>
		</div>
		<div class="bg-img">
			<img :src="playlist.picUrl" alt="" style="width:100%"/>
		</div>
		<div class="bg-mask"></div>
		<div class="clearfix"></div>
		<m-batch :song="playlist.song" :type="type"></m-batch>
		<m-song :song="playlist.song" @on-current-song="onCurrentSong"></m-song>
		<p class="loading" v-show="notFound">还没有收藏歌曲</p>
		<m-song-option 
			:isLogin="isLogin" 
			:optionVisible="songOptionVisible" 
			@changeVisible="changeSongOptionVisible" 
			:currentSong="currentSong">
		</m-song-option>
	</div>
</template>

<script>
	import { Indicator } from 'mint-ui'
	import mSong from '~/components/song'
	import mSongOption from '~/components/song_option'
	import mBatch from '~/components/batch'
	import storage from '~/utils/storage'
	import { STORAGE_KEY } from '~/common/const'

	export default {
		validate({ params }) {
			return /^\d+$/.test(params.id)
		},
		components: {
			mSong,
			mSongOption,
			mBatch
		},
		data() {
			return {
				playlist: {
					creator: {}
				},
				visible: false,
				notFound: false,
				songOptionVisible: false,
				isLogin: false,
				currentSong: {}
			}
		},
		computed: {
			userId() {
				return storage.getItem(STORAGE_KEY.USERID)
			},
			type() {
				return this.isLogin ? 1 : 0
			}
		},
		methods: {
			async loadData() {
				Indicator.open()
				await this.$store.dispatch('GET_USER_CREATELIST_DETAIL', {
					userId: this.userId,
					listId: this.$route.params.id
				})
				await this.$store.dispatch('GET_USER_CREATELIST_MUSIC', {
					userId: this.userId,
					listId: this.$route.params.id
				})
				this.playlist = this.$store.state.playlist_detail
				if(this.playlist.song.length == 0){
					this.notFound = true
				}
				this.visible = true
				this.isLogin = this.userId == this.playlist.creator.id
				Indicator.close()
			},
			loadUserDetail() {
				this.$router.push({ path:'/my/user/'+ this.playlist.creator.id })
			},
			changeSongOptionVisible(value) {
				this.songOptionVisible = value
			},
			onCurrentSong(value) {
				this.songOptionVisible = value.visible
				this.currentSong = value.currentSong
			},
			playAllMusic() {
				this.$store.dispatch('PLAY_ALL_MUSIC')
			}
		},
		mounted() {
			this.loadData()
		}
	}
</script>

<style scoped>
	.mui-title {
		text-align: left;
	}
	.mui-icon-back {
		color: #fff;
	}
	.mui-bar {
		background: transparent;
		position: absolute;
	}
	.mui-bar-nav{
		box-shadow:none;
	}
	.mui-card-media{
		height:200px;overflow:hidden;
	}
	.mui-card-media img{
		width:100px;height:100px;margin:50px 20px
	}
	.mui-card-media .mui-media-body{
		margin-top:50px;line-height:1.5 !important;
		color:#fff !important;font-size:16px !important
	}
	.mui-card-media .mui-media-body p{
		display:flex;flex-direction:row;justify-content: space-around;
	}
	.bg-img{
		width:100%;height:200px;position:absolute;top:0;z-index:-2;
		-webkit-filter: blur(30px);overflow: hidden;
	}
	.bg-mask{
		width:100%;height:200px;position:absolute;top:0;
		background:rgba(0,0,0,.5);z-index:-1
	}
	#playlist{
		padding-bottom: 50px;
	}
	.avatar{
		margin:20px 0 0 40%;height:30px;
	}
	#avatar{
		width:30px;height:30px;display: inline-block;
		border-radius:50%;overflow:hidden;
	}
	#avatar img{
		width:100%;height:100%;margin:0
	}
	.avatar .mui-ellipsis{
		position:relative;top:-4px;left:10px;max-width:60%;width:auto;
		display:inline-block;font-size:16px;
	}
	.avatar .mui-icon-arrowright{
		position:relative;top:-11px;left:15px;font-size:18px;
	}
	.mint-cell-title{
		width:80%;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}
	.mint-cell-text{
		margin-left:5px
	}
</style>