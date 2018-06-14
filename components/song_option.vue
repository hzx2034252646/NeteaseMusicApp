<template>
	<div id="song-option">
		<mt-popup 
			v-model="visible" 
			v-if="currentSong.id"
			position="bottom" 
			:closeOnClickModal="false"
			style="width:100%"
			@tap.native="visible=false">
			<mt-cell :title="'歌曲：'+currentSong.name" is-link>
			  <img slot="icon" src="~/assets/images/icons/option_music.png" width="24" height="24">
			</mt-cell>
			<mt-cell title="播放" is-link @tap.native="playMusic(currentSong.id)">
			  <img slot="icon" src="~/assets/images/icons/option_play.png" width="24" height="24">
			</mt-cell>
	      <mt-cell title="添加到播放列表" is-link @tap.native="addMusic(currentSong.id)">
			  <img slot="icon" src="~/assets/images/icons/option_add.png" width="24" height="24">
			</mt-cell>
	      <mt-cell title="收藏到歌单" is-link @tap.native="collectMusic(currentSong.id)">
			  <img slot="icon" src="~/assets/images/icons/option_collect.png" width="24" height="24">
			</mt-cell>
	      <mt-cell title="下载" is-link @tap.native="downloadMusic(currentSong.id)">
			  <img slot="icon" src="~/assets/images/icons/option_download.png" width="24" height="24">
			</mt-cell>
	      <mt-cell :title="'歌手：'+currentSong.artist" is-link @tap.native="showArtistList">
			  <img slot="icon" src="~/assets/images/icons/option_singer.png" width="24" height="24">
			</mt-cell>
	      <mt-cell :title="'专辑：'+currentSong.album.name" is-link @tap.native="loadAlbumDetail(currentSong.album.id)">
			  <img slot="icon" src="~/assets/images/icons/option_album.png" width="24" height="24">
			</mt-cell>
			<mt-cell title="删除" is-link v-if="isLogin" @tap.native="deleteMusic(currentSong.id)">
			  <img slot="icon" src="~/assets/images/icons/option_delete.png" width="24" height="24">
			</mt-cell>
	   </mt-popup>
	   <mt-popup
	   	v-model="artistListVisible"
	   	position="bottom"
	   	:closeOnClickModal="false"
	   	style="width:100%;height:50%;"
	   	@tap.native="artistListVisible=false">
	   	<div class="container">
		   	<mt-cell 
		   		@tap.native="loadArtistDetail(item.id)"
		   		:title="item.name" 
		   		is-link 
		   		v-for="(item,index) in currentSong.singer" 
		   		:key="index">
		   	</mt-cell>
			</div>
	   </mt-popup>
	   <mt-popup
	   	v-model="playlistVisible"
	   	position="bottom"
	   	:closeOnClickModal="false"
	   	style="width:100%;height:50%;"
	   	@tap.native="playlistVisible=false">
	   	<mt-cell title="收藏到歌单" style="z-index:100;position: absolute;top:0;width:100%"></mt-cell>
	   	<div class="container" style="padding-top:50px">
		   	<ul class="mui-table-view" id="collectlist">
					<li class="mui-table-view-cell mui-media" v-for="(item,index) in playlist" :key="index" @tap="collect(item.id)">
						<a href="javascript:;">
							<img class="mui-media-object mui-pull-left" v-lazy="format(item.picUrl)" style="max-width:50px;height:50px">
							<div class="mui-media-body">
								<p class="list-name mui-ellipsis">{{ item.name }}</p>
								<p>{{ item.songCount }}首</p>
							</div>
						</a>
					</li>
				</ul>
			</div>
	   </mt-popup>
	</div>
</template>

<script>
	import { Toast } from 'mint-ui'
	import storage from '~/utils/storage'
	import { STORAGE_KEY } from '~/common/const'
	import { formatPicUrl } from '~/common/function'
	
	export default {
		props: [
			'optionVisible',
			'currentSong',
			'isLogin'
		],
		data() {
			return {
				visible: this.optionVisible,
				artistListVisible: false,
				playlistVisible: false
			}
		},
		computed: {
			userId() {
				return storage.getItem(STORAGE_KEY.USERID)
			},
			playlist() {
				return this.$store.state.createlist
			}
		},
		watch: {
			optionVisible(value){
				this.visible = value
			},
			visible(value) {
				this.$emit('changeVisible', value)
			}
		},
		methods: {
			showArtistList() {
				if(this.currentSong.source != 'netease' || !this.currentSong.singer) {
					return
				}
				if(this.currentSong.singer.length>1){
					this.artistListVisible = true
				}else{
					this.loadArtistDetail(this.currentSong.singer[0].id)
				}
			},
			loadAlbumDetail(id) {
				if(this.currentSong.source != 'netease' || !id) {
					return
				}
				this.$router.push({ path: '/album/'+id })
			},
			loadArtistDetail(id) {
				if(this.currentSong.source != 'netease' || !id) {
					return
				}
				this.$router.push({ path: '/artist/'+id})
			},
			playMusic(id) {
				this.$store.dispatch('PLAY_MUSIC', id)
			},
			addMusic(id) {
				this.$store.dispatch('ADD_MUSIC', id).then(res => {
					Toast('已添加到播放列表')
				})
			},
			downloadMusic(id) {
				this.$store.dispatch('DOWNLOAD_MUSIC', id)
			},
			collectMusic(id) {
				if (storage.getItem(STORAGE_KEY.TOKEN)){
					this.$store.dispatch('GET_USER_CREATELIST', this.userId)
					this.$store.dispatch('COLLECT_MUSIC', id)
					this.playlistVisible = true
				}else{
					Toast('请先登录')
				}
			},
			collect(id) {
				this.$store.dispatch('COLLECT', id)
			},
			deleteMusic(id) {
				mui.confirm('确定删除歌曲？', e => {
					if(e.index){
						this.$store.dispatch('DELETE_MUSIC', {
							musicId: id,
							listId: this.$route.params.id
						})
					}
				},'div')
			},
			format(pic) {
				return formatPicUrl(pic)
			}
		},
		mounted() {
			$(document).delegate('.v-modal','tap',() => {
				this.visible = false
				this.artistListVisible = false
				this.playlistVisible = false
			})
		}
	}
</script>

<style>
	#collectlist .mui-media-body p{
		margin:0;line-height:1.6;max-width:85%
	}
	#collectlist .mui-media-body .list-name{
		font-size:0.85rem;
		color:#000
	}
	#song-option .container{
		overflow: auto;
		height:100%
	}
</style>