<template>
	<div id="playlist">
		<header class="mui-bar mui-bar-nav">
			<a class="mui-icon mui-icon-back mui-pull-left" href="javascript:history.back()"></a>
			<h1 class="mui-title">歌单</h1>
			<span class="mui-icon mui-icon-more mui-pull-right" @tap="playlistOptionVisible = true"></span>
		</header>
		<div class="mui-card-header mui-card-media">
			<img :src="coverImgUrl" v-show="visible" id="coverImg"/>
			<div class="mui-media-body">
				{{ playlist.name }}
			</div>
			<div class="avatar" v-show="visible" @tap="loadUserDetail(playlist.creator.id)">
				<span id="avatar">
					<img :src="avatarImgUrl" alt="" />
				</span>
				<span class="mui-ellipsis">{{ playlist.creator ? playlist.creator.name: '' }}</span>
				<span class="mui-icon mui-icon-arrowright"></span>
			</div>
		</div>
		<div class="bg-img">
			<img :src="bgImgUrl" alt="" style="width:100%"/>
		</div>
		<div class="bg-mask"></div>
		<div class="clearfix"></div>
		<m-batch :song="playlist.song"></m-batch>
		<m-song :song="playlist.song" @on-current-song="onCurrentSong"></m-song>
		<m-song-option 
			:optionVisible="songOptionVisible" 
			@changeVisible="changeSongOptionVisible" 
			:currentSong="currentSong">
		</m-song-option>
		<mt-popup 
			v-model="playlistOptionVisible" 
			position="bottom" 
			:closeOnClickModal="false"
			style="width:100%"
			@tap.native="playlistOptionVisible=false">
	      <mt-cell title="收藏歌单" is-link @tap.native="collectPlaylist">
			  <img slot="icon" src="~/assets/images/icons/option_collect.png" width="24" height="24">
			</mt-cell>
	   </mt-popup>
	   <div id="playlist_detail">
	   	<div class="bg-img"></div>
			<div class="bg-mask">
				<div id="playlist_cover">
	   			<img :src="coverImg"/>
	   		</div>
	   		<p>{{ playlist.name }}</p>
	   		<div id="playlist_tag" v-if="playlist.tag.length>0">
	   			标签：
	   			<span class="tag" v-for="(item, index) in playlist.tag" :key="index">{{ item }}</span>
	   		</div>
	   		<div id="playlist_desc">
	   			<p v-html="playlist.desc"></p>
	   		</div>
			</div>
	   </div>
	</div>
</template>

<script>
	import { Indicator, Toast } from 'mint-ui'
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
					tag: [],
					song: []
				},
				coverImg: '',
				coverImgUrl: '',
				bgImgUrl: '',
				avatarImgUrl: '',
				visible: false,
				songOptionVisible: false,
				playlistOptionVisible: false,
				currentSong: {}
			}
		},
		methods: {
			async loadData() {
				Indicator.open()
				await this.$store.dispatch('GET_PLAYLIST_DETAIL', this.$route.params.id)
				this.playlist = this.$store.state.playlist_detail
				this.coverImg = this.playlist.picUrl+'?param=400y400'
				this.coverImgUrl = this.playlist.picUrl+'?param=200y200'
				this.bgImgUrl = this.playlist.picUrl+'?param=300y200'
				this.avatarImgUrl = this.playlist.creator.picUrl+'?param=50y50'
				$('#playlist_detail').find('.bg-img').css('background-image','url('+this.bgImgUrl+')')
				this.visible = true
				Indicator.close()
			},
			loadUserDetail(id) {
				this.$router.push({ path: '/user/'+id})
			},
			changeSongOptionVisible(value) {
				this.songOptionVisible = value
			},
			onCurrentSong(value) {
				this.songOptionVisible = value.visible
				this.currentSong = value.currentSong
			},
			collectPlaylist() {
				if (storage.getItem(STORAGE_KEY.TOKEN)){
		         let arr=[]
		         arr.push({
		         	id: this.$route.params.id,
		         	name: this.playlist.name,
		         	pic: this.playlist.picUrl+'?param=130y130'
		         })
					this.$store.dispatch('ADD_USER_COLLECT_PLAYLIST', arr)
				}else{
					Toast('请先登录')
				}
			},
			popstate() {
				if($('#playlist_detail').css('display')!='none'){
					$('#playlist_detail').hide()
					$('#__nuxt').css('position','static')
				}
			}
		},
		mounted() {
			this.loadData()
			$(document).delegate('.v-modal','tap',() => {
				this.playlistOptionVisible = false
			})
			$('#coverImg').on('tap', function(){
				$('#playlist_detail').show()
				$('#playlist_detail').find('.bg-mask').scrollTop(0)
				history.pushState(null, null, document.URL)
				$('#__nuxt').css('position','fixed')
			})
			$('#playlist_detail').on('tap', function(){
				$('body').scrollTop(0)
				history.back()
			})
			window.addEventListener('popstate', this.popstate)
		},
		destroyed() {
			window.removeEventListener('popstate', this.popstate)
		}
	}
</script>

<style scoped>
	#playlist{
		padding-bottom: 50px;
	}
	.mui-title {
		text-align: left;
	}
	.mui-icon-back {
		color: #fff;
	}
	.mui-icon-more{
		color:#fff;font-size:40px;padding-top:0
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
	#playlist_detail{
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		z-index: 999;
		background: #fff;
		color: #ddd;
		display: none;
	}
	#playlist_detail .bg-img{
		height: 100%;
		background-size: cover;
		background-position: 50%;
	}
	#playlist_detail .bg-mask{
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		overflow: auto;
	}
	#playlist_cover{
		width: 60%;
		margin-top: 20%;
	}
	#playlist_cover img{
		width: 100%;
		height: 100%;
	}
	.bg-mask > p{
		font-size: 20px;
		color: #fff;
	}
	#playlist_tag{
		width: 85%;
		margin-top: 30px;
		margin-bottom: 20px;
		font-size: 14px;
	}
	#playlist_tag .tag{
		padding:5px 15px;
		border: 1px solid #aaa;
		border-radius: 20px;
		margin-left: 10px;
	}
	#playlist_desc{
		width: 85%;
		margin-bottom: 10%;
	}
	#playlist_desc p{
		color: #ddd;
	}
</style>