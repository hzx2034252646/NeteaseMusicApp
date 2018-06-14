<template>
	<div id="album">
		<div class="container">
			<header class="mui-bar mui-bar-nav">
				<a class="mui-icon mui-icon-back mui-pull-left" href="javascript:history.back()"></a>
				<h1 class="mui-title">专辑</h1>
				<span class="mui-icon mui-icon-more mui-pull-right" @tap="albumOptionVisible = true"></span>
			</header>
			<div class="mui-card-header mui-card-media">
				<img :src="coverImgUrl" v-show="visible" id="coverImg"/>
				<div class="mui-media-body">
					{{ album.name }}
				</div>
			</div>
			<div class="bg-img">
				<img :src="bgImgUrl" alt="" style="width:100%"/>
			</div>
			<div class="bg-mask"></div>
			<div class="clearfix"></div>
			<m-batch :song="album.song"></m-batch>
			<m-song :song="album.song" @on-current-song="onCurrentSong"></m-song>
		</div>
		<m-song-option 
			:optionVisible="optionVisible" 
			@changeVisible="changeVisible" 
			:currentSong="currentSong">
		</m-song-option>
		<mt-popup 
			v-model="albumOptionVisible" 
			position="bottom" 
			:closeOnClickModal="false"
			style="width:100%"
			@tap.native="albumOptionVisible=false">
	      <mt-cell title="收藏专辑" is-link @tap.native="collectAlbum">
			  <img slot="icon" src="~/assets/images/icons/option_collect.png" width="24" height="24">
			</mt-cell>
	   </mt-popup>
	   <div id="album_detail">
	   	<div class="bg-img"></div>
			<div class="bg-mask">
				<div id="album_cover">
	   			<img :src="coverImg"/>
	   		</div>
	   		<p>{{ album.name }}</p>
	   		<p class="alias">{{ album.alias }}</p>
	   		<div id="album_desc">
	   			<p v-if="album.company">发行公司：{{ album.company }}</p>
	   			<p v-if="album.publishTime">发行时间：{{ album.publishTime }}</p>
	   			<p v-if="album.subType">专辑类别：{{ album.subType }}</p>
	   			<p v-html="album.desc" style="margin-top: 30px"></p>
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
				album: {},
				coverImg: '',
				coverImgUrl: '',
				bgImgUrl: '',
				visible: false,
				optionVisible: false,
				albumOptionVisible: false,
				currentSong: {}
			}
		},
		methods: {
			async loadData() {
				Indicator.open()
				await this.$store.dispatch('GET_ALBUM_DETAIL', this.$route.params.id)
				this.album = this.$store.state.album_detail
				this.coverImg = this.album.picUrl+'?param=400y400'
				this.coverImgUrl = this.album.picUrl+'?param=200y200'
				this.bgImgUrl = this.album.picUrl+'?param=300y200'
				$('#album_detail').find('.bg-img').css('background-image','url('+this.bgImgUrl+')')
				this.visible = true
				Indicator.close()
			},
			changeVisible(value) {
				this.optionVisible = value
			},
			onCurrentSong(value) {
				this.optionVisible = value.visible
				this.currentSong = value.currentSong
			},
			collectAlbum() {
				if (storage.getItem(STORAGE_KEY.TOKEN)){
		         let album = []
		         album.push({
		         	id: this.$route.params.id,
		         	name: this.album.name,
		         	singer: this.album.artist,
		         	pic: this.album.picUrl+'?param=100y100'
		         })
					this.$store.dispatch('ADD_USER_COLLECT_ALBUM', album)
				}else{
					Toast('请先登录')
				}
			},
			popstate() {
				if($('#album_detail').css('display')!='none'){
					$('#album_detail').hide()
					$('#__nuxt').css('position','static')
				}
			}
		},
		mounted() {
			this.loadData()
			$(document).delegate('.v-modal','tap',() => {
				this.albumOptionVisible = false
			})
			$('#coverImg').on('tap', function(){
				$('#album_detail').show()
				$('#album_detail').find('.bg-mask').scrollTop(0)
				history.pushState(null, null, document.URL)
				$('#__nuxt').css('position','fixed')
			})
			$('#album_detail').on('tap', function(){
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
		height:200px;overflow: hidden;
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
		-webkit-filter: blur(30px);overflow: hidden
	}
	.bg-mask{
		width:100%;height:200px;position:absolute;top:0;
		background:rgba(0,0,0,.5);z-index:-1
	}
	.container{
		padding-bottom: 50px;
	}
	#album_detail{
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		z-index: 999;
		background: #fff;
		color: #ddd;
		display: none;
	}
	#album_detail .bg-img{
		height: 100%;
		background-size: cover;
		background-position: 50%;
	}
	#album_detail .bg-mask{
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		overflow: auto;
	}
	#album_cover{
		width: 60%;
		margin-top: 20%;
	}
	#album_cover img{
		width: 100%;
		height: 100%;
	}
	.bg-mask > p{
		font-size: 20px;
		color: #fff;
	}
	.bg-mask .alias{
		color: #aaa;
		font-size: 14px;
		margin-top: 0;
	}
	#album_desc{
		width: 85%;
		margin-top: 30px;
		margin-bottom: 10%;
	}
	#album_desc p{
		color: #ddd;
	}
</style>