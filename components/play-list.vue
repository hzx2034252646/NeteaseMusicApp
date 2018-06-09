<template>
	<mt-popup 
		v-model="visible" 
		position="bottom" 
		:closeOnClickModal="false"
		style="width:100%;height:50%;">
		<mt-cell :title="'播放列表（'+ count +'）'" class="playlist">
			<span class="fa fa-trash fa-lg" @tap="deleteAll"></span>
		</mt-cell>
		<div class="container">
			<ul class="mui-table-view" id="playList">
				<li class="mui-table-view-cell mui-transitioning" v-for="(item,index) in music" :key="index" :id="item.id" @tap="playMusic(item.id)">
					<div class="mui-slider-right mui-disabled">
						<a class="mui-btn mui-btn-danger" @tap.stop="deleteMusic(item.id)">删除</a>
					</div>
					<div class="mui-slider-handle mui-ellipsis">
						{{ item.name }}
						<span class="singer"> - {{ item.artist }}</span>
					</div>
				</li>
			</ul>
		</div>
	</mt-popup>
</template>

<script>
	import storage from '~/utils/storage'
	import { STORAGE_KEY } from '~/common/const'
	import { MessageBox } from 'mint-ui'
	
	export default {
		data() {
			return {
				visible: this.listVisible,
				music: []
			}
		},
		computed: {
			count() {
				return this.music ? this.music.length : 0
			}
		},
		props: [
			'listVisible',
			'song'
		],
		watch: {
			song(value) {
				this.music = value
			},
			listVisible(value) {
				this.visible = value
			},
			visible(value) {
				if(value){
					$('#__nuxt').css('position','fixed')
				}else{
					$('#__nuxt').css('position','static')
				}
				this.$emit('changeVisible', value)
			}
		},
		methods: {
			delete() {
				this.music = []
				this.visible = false
      		storage.removeItem(STORAGE_KEY.MUSIC)
      		let audio = $('audio').get(0)
      		audio.pause()
      		$('.lyric').html('')
      		this.$store.state.audio.picUrl = ''
      		this.$store.state.audio.title = '网易云音乐'
      		this.$store.state.audio.artist = ''
			},
			deleteAll() {
				mui.confirm('确定清空播放列表？', e => {
					if(e.index){
						this.delete()
					}
				},'div')
			},
			deleteMusic(id){
            var i=this.music.findIndex(item=>item.id==id)
            if(this.$store.state.audio.id == id){
               if(i==0){
                  this.music.splice(i,1)
                  i=this.music.length
               }
               if(this.music.length == 0){
                  this.delete()
               }else{
                  this.$store.dispatch('PLAY_MUSIC', this.music[i-1].id)
               }
            }
            this.music.splice(i,1)
            storage.setItem(STORAGE_KEY.MUSIC,this.music)
            $('#playList').find('li,.mui-disabled').removeClass('mui-selected')
            $('#playList').find('.mui-slider-handle,.mui-btn').css('transform','translate(0px, 0px)')
         },
         playMusic(id) {
         	this.$store.dispatch('PLAY_MUSIC', id)
         }
		},
		mounted() {
			$(document).delegate('.v-modal','tap',() => {
				this.visible = false
			})
		}
	}
</script>
<style scoped>
	.singer{
		font-size:14px; color: #999;
	}
	.container{
		padding-top: 50px;
		overflow: auto;
		height:100%
	}
	.playlist{
		z-index:3;position:absolute;top:0;
		width: 100%;
	}
	.active{
		color: #d43c33;
	}
</style>