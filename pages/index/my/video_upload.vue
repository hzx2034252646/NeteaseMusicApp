<template>
	<div style="height: 100%">
		<header class="mui-bar mui-bar-nav">
			<a class="mui-icon mui-icon-back mui-pull-left" href="javascript:history.back()"></a>
			<h1 class="mui-title">上传视频</h1>
		</header>
		<div class="container">
			<ul class="mui-table-view" style="margin-top:20px">
			   <li class="mui-table-view-cell" @tap="chooseVideoFile">
			      <a class="mui-navigate-right">
			      	视频文件
			      	<span class="mui-pull-right mui-ellipsis color-gray">{{ videoFileName }}</span>
			      </a>
			      <input type="file" id="videoFile" hidden @change="changeVideoFile($event)">
			   </li>
			</ul>
			<ul class="mui-table-view" style="margin-top:20px">
			   <li class="mui-table-view-cell" @tap="editTitle">
			      <a class="mui-navigate-right">
			      	视频名称
			      	<span class="mui-pull-right mui-ellipsis color-gray">{{ videoTitle }}</span>
			      </a>
			   </li>
			</ul>
			<ul class="mui-table-view" style="margin-top:20px">
			   <li class="mui-table-view-cell" @tap="editSinger">
			      <a class="mui-navigate-right">
			      	相关歌手
			      	<span class="mui-pull-right mui-ellipsis color-gray">{{ videoSinger }}</span>
			      </a>
			   </li>
			</ul>
			<ul class="mui-table-view" style="margin-top:20px">
			   <li class="mui-table-view-cell" @tap="chooseImageFile">
			      <a class="mui-navigate-right">
			      	视频封面
			      	<span class="mui-pull-right mui-ellipsis color-gray">{{ imageFileName }}</span>
			      </a>
			      <input type="file" id="imageFile" hidden @change="changeImageFile($event)">
			   </li>
			</ul>
			<ul class="mui-table-view" style="margin-top:20px">
			   <li class="mui-table-view-cell text-center" @tap="upload">
			      	上传视频
			   </li>
			</ul>
			<div class="upload_progress" v-show="showUploadProgress">
				<p>
					视频上传中
					<span style="margin-left:10px">{{ percent }}%</span>
				</p>
				<mt-progress 
					:value="percent" 
					:bar-height="5" 
					style="width:95%">
				</mt-progress>
			</div>
			
		</div>
		<mt-popup 
			v-model="titleOptionVisible" 
			position="right" 
			:modal="false">
			<header class="mui-bar mui-bar-nav">
				<a class="mui-icon mui-icon-back mui-pull-left" href="javascript:history.back()"></a>
				<h1 class="mui-title">视频名称</h1>
				<span class="mui-pull-right save" @tap="validateTitle">保存</span>
			</header>
			<div class="mui-input-group">
			   <div class="mui-input-row">
			      <input type="text" placeholder="请输入视频名称" v-model.trim="title">
			   </div>
			</div>
	   </mt-popup>
		<mt-popup 
			v-model="singerOptionVisible" 
			position="right" 
			:modal="false">
			<header class="mui-bar mui-bar-nav">
				<a class="mui-icon mui-icon-back mui-pull-left" href="javascript:history.back()"></a>
				<h1 class="mui-title">相关歌手</h1>
				<span class="mui-pull-right save" @tap="validateSinger">保存</span>
			</header>
			<div class="mui-input-group">
			   <div class="mui-input-row">
			      <input type="text" placeholder="请输入歌手名称" v-model.trim="singer">
			   </div>
			</div>
	  </mt-popup>
	</div>
</template>

<script>
	import { Toast, Progress } from 'mint-ui'
	import storage from '~/utils/storage'
	import { STORAGE_KEY } from '~/common/const'
	
	export default {
		data() {
			return {
				videoFile: '',
				videoFileName: '',
				imageFile: '',
				imageFileName: '',
				title: '',
				videoTitle: '',
				titleOptionVisible: false,
				singer: '',
				videoSinger: '',
				singerOptionVisible: false,
				showUploadProgress: false
			}
		},
		computed: {
			percent() {
				return this.$store.state.upload_percent
			}
		},
		methods: {
			chooseVideoFile() {
				$('#videoFile').click()
			},
			chooseImageFile(){
            $('#imageFile').click()
         },
			changeVideoFile(ev){
            var file = ev.target.files[0]
            if(!file){
               return
            }
            var fileName = file.name
            var fileSize = file.size
            var fileType = fileName.substring(fileName.lastIndexOf('.')+1).toLowerCase()
            if(fileType != 'mp4'){
               return Toast('暂不支持该格式')
            }
            if(fileSize > 500 * 1024 * 1024){
               return Toast('上传文件大小不能超过500M')
            }
            this.videoFile = file
            this.videoFileName = fileName
         },
         changeImageFile(ev){
            var file = ev.target.files[0]
            if(!file){
               return
            }
            var fileName = file.name
            var fileSize = file.size
            var fileType = fileName.substring(fileName.lastIndexOf('.')+1).toLowerCase()
            if(fileType != 'gif' && fileType != 'jpeg' && fileType != 'png' && fileType != 'jpg'){
               return Toast('暂不支持该格式')
            }
            if(fileSize > 2* 1024 * 1024){
               return Toast('上传文件大小不能超过2M')
            }
            this.imageFile = file
            this.imageFileName = fileName
         },
         editTitle() {
         	this.titleOptionVisible = true
         	history.pushState(null, null, document.URL)
         },
         editSinger() {
         	this.singerOptionVisible = true
         	history.pushState(null, null, document.URL)
         },
         validateTitle() {
         	if(!this.title){
         		return Toast('请输入视频名称')
         	}else if(this.title.length > 50){
         		return Toast('视频名称不能多于50字')
         	}
         	this.$store.dispatch('IS_VIDEO_EXIST', this.title).then(res => {
         		if(!this.$store.state.is_video_exist){
         			this.videoTitle = this.title
         			history.back()
         		}
         	})
         },
         validateSinger() {
         	if(!this.singer){
         		return Toast('请输入歌手名称')
         	}else if(this.singer.length > 50){
         		return Toast('歌手名称不能多于50字')
         	}
         	this.videoSinger = this.singer
         	history.back()
         },
         upload() {
         	if(!this.videoFile){
         		return Toast('请选择视频文件')
         	}else if(!this.videoTitle){
         		return Toast('请输入视频名称')
         	}else if(!this.videoSinger){
         		return Toast('请输入歌手名称')
         	}else if(!this.imageFile){
         		return Toast('请选择视频封面')
         	}
         	let formData = new FormData()
            formData.append('imageFile', this.imageFile)
            formData.append('videoFile', this.videoFile)
            formData.append('title', this.videoTitle)
            formData.append('userId', storage.getItem(STORAGE_KEY.USERID))
            formData.append('csrf_token', storage.getItem(STORAGE_KEY.TOKEN))
            this.showUploadProgress = true
            history.pushState(null,null,document.URL)
         	this.$store.dispatch('UPLOAD_VIDEO', {
         		title: this.videoTitle,
         		singer: this.videoSinger,
         		formData
         	}).then(res => {
         		if(this.percent == 100){
         			this.showUploadProgress = false
         			this.$router.push({ path: '/my/video' })
         		}
         	})
         },
         popstate() {
         	if(this.titleOptionVisible){
					this.titleOptionVisible = false
				}
				if(this.singerOptionVisible){
					this.singerOptionVisible = false
				}
				if(this.showUploadProgress){
					mui.alert('视频上传中，请耐心等候')
					history.pushState(null,null,document.URL)
				}
         }
		},
		mounted() {
			window.addEventListener('popstate', this.popstate)
		},
		destroyed() {
			window.removeEventListener('popstate', this.popstate)
		}
	}
</script>

<style scoped>
	.mui-icon-back{
		color:#fff
	}
	.mui-icon-more{
		color:#fff;font-size:40px;padding-top:0
	}
	.container{
		height: 100%;
		padding-top:44px;
		padding-bottom:50px;
		background: #efeff4;
	}
	.color-gray{
		margin-right: 25px; max-width:50%;
	}
	.save{
		color: #fff;line-height: 44px;
	}
	.mui-input-group{
		margin-top: 60px
	}
	.mint-popup{
		width:100%;height:100%;z-index:200 !important
	}
	.upload_progress{
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		background: rgba(0,0,0,.8);
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		z-index: 300;
	}
	.upload_progress > p{
		font-size: 20px;
		color: #fff;
		margin: 0
	}
</style>