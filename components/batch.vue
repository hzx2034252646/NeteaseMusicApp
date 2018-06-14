<template>
	<div v-show="song && song.length > 0">
		<ul class="mui-table-view" id="batch">
	   	<li class="mui-table-view-cell">
	   		<span class="pull-left" @tap="playAllMusic">
	   			<img src="../assets/images/icons/play_icon.png" />
	   			播放全部
	   			<span style="color:#999">({{ song ? song.length : 0 }}首)</span>
	   		</span>
	   		<span class="pull-right" @tap="showOption">
	   			<i class="fa fa-list-ul" style="margin-right: 5px"></i>
	   			多选
	   		</span>
	   	</li>
		</ul>
		<mt-popup 
			:modal="false"
			class="batch">
			<header class="mui-bar mui-bar-nav">
				<a class="mui-icon mui-icon-back mui-pull-left" href="javascript:history.back()"></a>
				<h1 class="mui-title">已选择{{ count }}项</h1>
				<span class="mui-pull-right" @tap="checkAll">{{ song ? (count == song.length ? '取消全选' : '全选'):'全选'}}</span>
			</header>
			<div class="container">
				<ul class="mui-table-view">
					<li class="mui-table-view-cell mui-media" v-for="(item,index) in song" :key="index" @tap="check($event)">
						<a href="javascript:;">
							<div class="mui-checkbox mui-pull-left">
							  <input name="checkbox" type="checkbox" class="check" :id="item.id">
							</div>
							<div class="mui-media-body">
								<p class="song-name mui-ellipsis">{{ item.name }}</p>
								<p class="mui-ellipsis">{{ item.artist }}</p>
							</div>
						</a>
					</li>
				</ul>
			</div>
			<nav class="mui-bar mui-bar-tab" style="background: #fff">
			   <span class="mui-tab-item" @tap="playNextSong">
			      <img class="mui-icon" src="../assets/images/icons/play_icon.png"/>
			      <span class="mui-tab-label">下一首播放</span>
			   </span>
			   <span class="mui-tab-item" @tap="collectMusic">
			      <img class="mui-icon" src="../assets/images/icons/playlist-add.png"/>
			      <span class="mui-tab-label">收藏到歌单</span>
			   </span>
			   <span class="mui-tab-item" v-if="type > 0" @tap="deleteAll">
			      <img class="mui-icon" src="../assets/images/icons/delete_icon.png"/>
			      <span class="mui-tab-label">删除</span>
			   </span>
			</nav>
	  </mt-popup>
	  <mt-popup
	   	v-model="playlistVisible"
	   	position="bottom"
	   	:closeOnClickModal="false"
	   	style="width:100%;height:50%"
	   	@tap.native="playlistVisible=false">
	   	<mt-cell title="收藏到歌单" style="z-index:100;position: absolute;top:0;width:100%"></mt-cell>
	   	<div class="container" style="padding-top:50px;overflow: auto;height:100%">
		   	<ul class="mui-table-view" id="collectlist">
					<li class="mui-table-view-cell mui-media" v-for="(item,index) in playlist" :key="index" @tap="collect(item.id)">
						<a href="javascript:;">
							<img class="mui-media-object mui-pull-left" v-lazy="item.picUrl" style="max-width:50px;height:50px">
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
	
	export default {
		props: [
			'song',
			'type'
		],
		data() {
			return {
				count: 0,
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
		methods: {
			showOption() {
				$('.batch').show()
				$('.batch .container').scrollTop(0)
				history.pushState(null, null, document.URL)
				$('.check').each(function(){
					this.checked = false
				})
				this.count = 0
				$('#__nuxt').css('position','fixed')
			},
			playAllMusic() {
				this.$store.dispatch('PLAY_ALL_MUSIC')
			},
			playNextSong() {
				this.$store.dispatch('PLAY_NEXT_SONG')
			},
			check(ev) {
				let _this = $(ev.target).closest('li').find('.check').get(0)
				_this.checked = !_this.checked
				this.count = $('.check:checked').length
			},
			checkAll() {
				if(this.count != this.song.length){
					$('.check').each(function(){
						this.checked = true
					})
					this.count = this.song.length
				}else{
					$('.check').each(function(){
						this.checked = false
					})
					this.count = 0
				}
			},
			collectMusic() {
				if (storage.getItem(STORAGE_KEY.TOKEN)){
					if($('.check:checked').length == 0){
			   		return Toast('请选择操作的歌曲')
			   	}
					this.$store.dispatch('GET_USER_CREATELIST', this.userId)
					this.$store.dispatch('COLLECT_ALL_MUSIC')
					this.playlistVisible = true
				}else{
					Toast('请先登录')
				}
			},
			collect(id) {
				this.$store.dispatch('COLLECT', id)
			},
			deleteAll() {
				if($('.check:checked').length == 0){
		   		return Toast('请选择操作的歌曲')
		   	}
				switch(this.type){
					case 1:
						mui.confirm('确定将所选歌曲从歌单中删除？', e => {
							if(e.index){
								this.$store.dispatch('DELETE_ALL_MUSIC', this.$route.params.id)
								$('.check:checked').each(function(){
									this.checked = false
								})
								this.count = 0
							}
						},'div')
						break
					case 2:
						let _this = this
						mui.confirm('确定将所选歌曲从播放记录中删除？', e => {
							if(e.index){
								$('.check').each(function () {
						      	if(this.checked){
						      		let i = _this.$store.state.song.findIndex(item => item.id == this.id)
						      		_this.$store.state.song.splice(i, 1)
						      	}
						      })
								storage.setItem(STORAGE_KEY.PLAY_HISTORY, _this.$store.state.song)
								$('.check:checked').each(function(){
									this.checked = false
								})
								_this.count = 0
								Toast('已删除')
							}
						},'div')
						break
				}
			},
			popstate() {
				if($('.batch').css('display') != 'none'){
					$('.batch').hide()
					$('#__nuxt').css('position','static')
				}
			}
		},
		mounted() {
			window.addEventListener('popstate', this.popstate)
			$(document).delegate('.v-modal','tap',() => {
				this.playlistVisible = false
			})
		},
		destroyed() {
			window.removeEventListener('popstate', this.popstate)
		}
	}
</script>

<style scoped>
	#batch li{
		padding: 0 !important;
	}
	#batch li>span{
		font-size: 14px;
		padding: 11px 15px;
	}
	#batch img{
		width: 20px;
		height: 20px;
		vertical-align: middle;
		margin-right: 5px;
		position: relative;
		top:-1px;
	}
	.mui-icon-back{
		color:#fff
	}
	.batch{
		width: 100%; 
		height: 100%;
		z-index: 2000;
	}
	.batch .mui-pull-right{
		color: #fff;
		line-height: 44px;
		position: relative;
		z-index: 1;
	}
	.batch nav img{
		width: 24px;
		height: 24px;
	}
	.mui-media-body p{
		margin:0;line-height:1.6;max-width:100%
	}
	.mui-media-body .song-name{
		font-size:0.85rem;
		color:#000
	}
	.container{
		padding-top: 44px;
		padding-bottom: 50px;
		height: 100%;
		overflow: auto;
	}
	.container .mui-checkbox{
		width:30px;height:45px;margin-right:10px
	}
	.container .check{
		top: 8px;
		right: 0;
	}
	#collectlist .mui-media-body p{
		margin:0;line-height:1.6;max-width:85%
	}
	#collectlist .mui-media-body .list-name{
		font-size:0.85rem;
		color:#000
	}
</style>