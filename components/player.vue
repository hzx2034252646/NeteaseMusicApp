<template>
	<div class="player">
		<ul class="mui-table-view" @tap="showPlayer" id="playerbar">
			<li class="mui-table-view-cell mui-media">
				<a href="javascript:;">
					<img class="mui-media-object mui-pull-left" :src="audio.picUrl" v-if="audio.picUrl">
					<img class="mui-media-object mui-pull-left" src="../assets/images/default_album.png" v-else="audio.picUrl">
					<div class="mui-media-body">
						<p class="mui-ellipsis">{{ audio.title }}</p>
						<p class="mui-ellipsis">{{ audio.artist }} </p>
					</div>
				</a>
				<span class="play" @tap.stop="play"></span>
				<span class="pause" @tap.stop="pause"></span>
				<span class="list" @tap.stop="showPlaylist"></span>
			</li>
		</ul>
		<mt-popup
			id="player"
	   	v-model="playerVisible"
	   	position="bottom"
	   	:modal="false"
	   	style="width:100%;height:100%;">
	   	<header class="mui-bar mui-bar-nav">
				<a class="mui-icon mui-icon-back mui-pull-left" href="javascript:history.back()"></a>
				<h1 class="mui-title">{{ audio.title }}</h1>
				<span class="mui-icon mui-icon-more mui-pull-right" @tap="showOption"></span>
			</header>
			<div class="container" @tap="showLyric">
	         <div class="pic">
	            <img :src="coverImg" alt="" v-if="audio.picUrl">
	            <img src="../assets/images/error.png" alt="" v-else="audio.picUrl"/>
	         </div>
	         <div class="content">
	            <div class="lyric"></div>
	         </div>
	         <span class="mui-icon mui-icon-info" @tap.stop="showSettingOption"></span>
	      </div>
	      <div id="recommend_song">
	      	<div class="top">猜你喜欢</div>
      		<ul class="mui-table-view" v-show="recommend_song.length>0">
				   <li class="mui-table-view-cell mui-media" v-for="(item,index) in recommend_song" :key="index" @tap="playMusic(item.id)">
						<a href="javascript:;" class="mui-navigate-right">
							<img class="mui-media-object mui-pull-left" v-lazy="item.picUrl" />
							<div class="mui-media-body">
								<p class="song-name mui-ellipsis">{{ item.name }}</p>
								<p class="mui-ellipsis">{{ item.artist }}</p>
							</div>
						</a>
					</li>
				</ul>
				<p class="loading" v-show="loading"><span class="wave"></span>正在加载中</p>
	      </div>
	      <div class="control">
	      	<div class="wrapper">
		         <span id="current-time">{{ audio.currentTime }}</span>
		         <div id="progress">
		         	<div class="progress">
			            <div id="progressbar1" class="progressbar"></div>
			            <div id="progressbar2" class="progressbar"></div>
			            <div id="ball">
			            	<div class="red-dot"></div>
			            </div>
			         </div>
		         </div>
		         <span id="total-time">{{ audio.totalTime }}</span>
		      </div>
		      <div class="wrapper">
		      	<span>
		      		<span class="singlePlay" @tap="setListLoop"></span>
		      		<span class="listLoop" @tap="setRandomPlay"></span>
		      		<span class="randomPlay" @tap="setSingleLoop"></span>
		      	</span>
		      	<span class="prev" @tap="prev"></span>
		      	<span class="play" @tap="play"></span>
		      	<span class="pause" @tap="pause"></span>
		      	<span class="next" @tap="next"></span>
		      	<span class="mui-icon mui-action-menu mui-icon-bars" @tap="showPlaylist"></span>
		      </div>
	      </div>
	      <div class="blur_bg blur"></div>
	      <div class="bg_mask"></div>
	      <div class="bgColor"></div>
	      <audio src="" hidden loop autoplay></audio>
	   </mt-popup>
	   <m-playlist 
	   	:listVisible="listVisible"
	   	@changeVisible="changeVisible"
	   	:song="song">
	   </m-playlist>
	   <m-song-option 
	   	v-if="isOptionCreated"
			:optionVisible="optionVisible" 
			@changeVisible="changeSongOptionVisible" 
			:currentSong="currentSong">
		</m-song-option>
		<mt-popup 
			v-model="settingVisible" 
			position="bottom" 
			:closeOnClickModal="false"
			style="width:100%">
			<ul class="mui-table-view">
			   <li class="mui-table-view-cell">
			               歌词翻译
			      <div class="mui-switch mui-switch-mini mui-switch-blue mui-active" id="switch">
					  <div class="mui-switch-handle"></div>
					</div>
			   </li>
			   <li class="mui-table-view-cell">
			      <div class="mui-input-row mui-input-range">
			          <label style="padding-left:0">歌词字号</label>
			          <input type="range" min="12" max="20" value="16" id="range">
			      </div>
			   </li>
			   <ul class="mui-table-view mui-table-view-radio" id="bgOption">
				   <li class="mui-table-view-cell" id="blurCover">
				      <a class="mui-navigate-right">专辑封面（模糊）</a>
				   </li>
				   <li class="mui-table-view-cell" id="cover">
				      <a class="mui-navigate-right">专辑封面（清晰）</a>
				   </li>
				   <li class="mui-table-view-cell" id="randomColor">
				      <a class="mui-navigate-right">随机颜色（渐变）</a>
				   </li>
				</ul>
			</ul>
		</mt-popup>
	</div>
</template>

<script>
	import { Toast } from 'mint-ui'
	import mPlaylist from '~/components/play-list'
	import mSongOption from '~/components/song_option'
	import storage from '~/utils/storage'
	import { STORAGE_KEY } from '~/common/const'
	
	export default {
		components: {
			mPlaylist,
			mSongOption
		},
		data() {
			return {
				loading: false,
				isOptionCreated:false,
				playerVisible: false,
				listVisible: false,
				optionVisible: false,
				settingVisible: false,
				song: [],
				currentSong: {}
			}
		},
		computed: {
			audio() {
				return this.$store.state.audio
			},
			coverImg() {
				return this.audio.picUrl
			},
			music() {
				return storage.getItem(STORAGE_KEY.MUSIC)
			},
			recommend_song() {
				return this.$store.state.recommend_song
			}
		},
		methods: {
			play() {
				if(!this.$store.state.audio.picUrl){
					return
				}
				$('.play').hide()
				$('.pause').show()
				$('audio').get(0).play()
			},
			pause() {
				$('.pause').hide()
				$('.play').show()
				$('audio').get(0).pause()
			},
			prev() {
				if(!this.song[0]){
					return 
				}
				let i = this.song.findIndex(item => item.id == this.$store.state.audio.id)
            if (i == 0) {
               i = this.song.length
            }
            this.$store.dispatch('PLAY_MUSIC', this.song[i-1].id)
			},
			next() {
				if(!this.song[0]){
					return 
				}
				let i = this.song.findIndex(item => item.id == this.$store.state.audio.id)
            if (i == this.song.length - 1) {
               i = -1
            }
            this.$store.dispatch('PLAY_MUSIC', this.song[i+1].id)
			},
			singleLoop() {
				$('audio').get(0).loop=true
			},
			loop(){
            let i = this.song.findIndex(item => item.id == this.$store.state.audio.id)
            if (i == this.song.length - 1) {
               i = -1
            }
            this.$store.dispatch('PLAY_MUSIC', this.song[++i].id)
         },
         listLoop() {
         	var audio=$('audio').get(0)
            audio.loop=false
            audio.removeEventListener('ended',this.random)
            audio.addEventListener('ended',this.loop)
         },
         random(){
            let i=Math.floor(Math.random()*this.song.length)
            this.$store.dispatch('PLAY_MUSIC', this.song[i].id)
         },
         randomPlay(){
            var audio=$('audio').get(0)
            audio.loop=false
            audio.removeEventListener('ended',this.loop)
            audio.addEventListener('ended',this.random)
         },
         setSingleLoop() {
         	Toast('单曲循环')
				$('.singlePlay').css('display','inline-block').siblings().hide()
				this.singleLoop()
         },
			setListLoop() {
				Toast('列表循环')
				$('.listLoop').css('display','inline-block').siblings().hide()
				this.listLoop()
			},
			setRandomPlay() {
				Toast('随机播放')
				$('.randomPlay').css('display','inline-block').siblings().hide()
				this.randomPlay()
			},
			playMusic(id) {
				this.$store.dispatch('PLAY_MUSIC', id)
			},
			showPlayer() {
				this.playerVisible = true
				history.pushState(null, null, document.URL)
			},
			showLyric() {
				if($('#player .pic').css('display')!='none'){
					$('#player .pic').hide()
					$('#player .content').css('height','100%')
				}else{
					$('#player .pic').show()
					$('#player .content').css('height','40%')
				}
			},
			changeVisible(value) {
				this.listVisible = value
			},
			changeSongOptionVisible(value) {
				this.optionVisible = value
			},
			showPlaylist() {
				this.listVisible=true
				this.song = storage.getItem(STORAGE_KEY.MUSIC)
			},
			showOption() {
				if(!this.$store.state.audio.picUrl){
					return
				}
				this.optionVisible = true
				this.isOptionCreated = true
				this.currentSong =  this.$store.state.song.find(item => item.id == this.$store.state.audio.id) || storage.getItem(STORAGE_KEY.MUSIC).find(item => item.id == this.$store.state.audio.id)
			},
			showSettingOption() {
				this.settingVisible = true
				$('#bgOption').find('li[id='+ this.$store.state.audio.background +']').addClass('mui-selected')
			},
			getRecommendSong() {
				let currentId = this.$store.state.audio.id
				let song = this.$store.state.song.find(item => item.id == currentId) || storage.getItem(STORAGE_KEY.MUSIC).find(item => item.id == currentId)
				if(!song){
					return
				}
				$('#recommend_song').show()
				$('#player').find('.container').hide()
				let artist
				if(typeof song.singer != 'undefined'&&song.singer.length > 0){
					artist = song.singer[0].name
				}else{
					artist = song.artist.split('、')[0]
				}
				this.loading = true
				this.$store.state.recommend_song = []
				this.$store.dispatch('GET_RECOMMEND_SONG', artist).then(res => {
					let song = this.$store.state.recommend_song
					if(song.length > 6){
						let music = []
						for(var i = 0; i < 6; i++){
							let j = Math.floor(Math.random()*song.length)
							music.push(song.splice(j, 1)[0])
						}
						this.$store.state.recommend_song = music
					}
					this.loading = false
				})
			}
		},
		mounted() {
			let _this = this
			window.addEventListener('popstate', () => {
				if(this.playerVisible){
					this.playerVisible = false
				}
			})
         $('#progress').on('touchstart',function (ev) {
            var oEvent=ev||event
            var disX=oEvent.touches[0].clientX-$('#progress').offset().left-(1/2)*$('#ball').get(0).offsetWidth
            if(disX<0){
               disX=0
            }else if(disX>$('#progress').width()){
               disX=$('#progress').width()
            }else if($('#progressbar2').width()!=0&&disX>$('#progressbar2').width()){
               disX=$('#progressbar2').width()
            }else{
            	$('#ball').css({ left: disX })
            	$('#progressbar1').css({ width: disX })
            }
            if(_this.$store.state.audio.picUrl){
            	let audio = $('audio').get(0)
            	audio.currentTime=disX/$('#progress').width()*audio.duration
            }
         })
         $(document).delegate('.v-modal','tap',() => {
				this.settingVisible = false
			})
         $('#bgOption').find('li').on('touchstart', function() {
				_this.$store.state.audio.background = this.id
				switch(this.id){
					case 'cover':
						$('.bgColor').hide()
		            $('.blur_bg').show()
		            $('.blur_bg').removeClass('blur')
		            break
		         case 'blurCover':
		         	$('.bgColor').hide()
		            $('.blur_bg').show()
		            $('.blur_bg').addClass('blur')
		            break
		         case 'randomColor': 
		         	$('.blur_bg').hide()
            		$('.bgColor').show()
				}
			})
         $('#switch').get(0).addEventListener('toggle', event => {
			  if(event.detail.isActive){
			  	  this.$store.state.audio.trans = true
			     $('.trans').show()
			  }else{
			  	  this.$store.state.audio.trans = false
			     $('.trans').hide()
			  }
			})
         $('#range').change(function(){
         	$('.lyric').find('p').css('font-size', this.value+'px')
         	_this.$store.state.audio.fontSize = this.value+'px'
         })
         if(this.music && this.music[0]){
         	this.$store.dispatch('PLAY_MUSIC', this.music[0].id)
         	this.song = storage.getItem(STORAGE_KEY.MUSIC)
         }
         $('#player').find('.container').get(0).addEventListener('swipeleft', function(){
         	_this.getRecommendSong()
         })
         $('#player').find('#recommend_song').get(0).addEventListener('tap', function(){
         	$('#recommend_song').hide()
				$('#player').find('.container').show()
         })
		}
	}
</script>

<style scoped>
	.player {
		width: 100%;
		height: 50px;
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 200;
	}
	#playerbar .mui-media-body p{
		margin:0;max-width:65% !important;
	}
	.mui-media-body p:nth-child(1){
		font-size:0.75rem;
		color:#000
	}
	.player .mui-media{
		padding:8px 10px;
	}
	.player .mui-media .play{
		width: 50px;height: 50px;display: inline-block;
		background:url('../assets/images/icons/playbar_btn_play.png');
		background-size: cover;
		position:absolute;right:50px;top:-4px
	}
	.player .mui-media .pause{
		width: 50px;height: 50px;
		background:url('../assets/images/icons/playbar_btn_pause.png');
		background-size: cover;
		position:absolute;right:50px;top:-4px;
		display:none;
	}
	.player .mui-media .list{
		width: 60px;height: 60px;display: inline-block;
		background:url('../assets/images/icons/playbar_btn_playlist.png');
		background-size: cover;
		position:absolute;right:-3px;top:-8px
	}
	.mui-icon-back{
		color:#ccc;
	}
	.mui-icon-more{
		color:#ccc;font-size:40px;padding-top:0;display:inline-block !important
	}
	.mui-bar {
		background: transparent;
	}
	.mui-title{
		text-align: left;color:#ccc;
	}
	.mui-bar-nav{
		box-shadow:none;
	}
	.mui-icon-info{
		position: absolute; bottom: 0; right: -20px;color: #ccc
	}
	#recommend_song{
		width: 100%;
		height: 65%;
		margin-bottom:5%;
		overflow: auto;
		display: none;
	}
	#recommend_song .top{
		width: 100%;
		height: 30px;
		line-height: 30px;
		background: rgba(0,0,0,.3);
		color: #ccc;
		font-size: 14px;
		text-align: center;
	}
	#recommend_song ul{
		background: transparent;
	}
	#recommend_song .mui-media-object{
		max-width:50px;
		height:50px;
	}
	#recommend_song .mui-media-body p{
		margin:0;
		line-height:1.6;
		max-width:85%;
		color: #ccc
	}
	#recommend_song .mui-media-body .song-name{
		color:#fff
	}
	#recommend_song .mui-active{
		background: rgba(0,0,0,.1) !important;
	}
	#recommend_song .loading{
		color: #fff !important;
		font-size: 14px;
	}
</style>