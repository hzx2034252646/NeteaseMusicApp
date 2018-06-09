<template>
	<div style="height: 100%">
		<header class="mui-bar mui-bar-nav">
			<a class="mui-icon mui-icon-back mui-pull-left" href="javascript:history.back()"></a>
			<h1 class="mui-title">个人设置</h1>
		</header>
		<div class="container">
			<ul class="mui-table-view" style="margin-top:20px">
				<li class="mui-table-view-cell mui-media" @tap="choosePicFile">
			      <a href="javascript:;">
			         <img class="mui-media-object mui-pull-right" :src="avatarUrl">
			         <div class="mui-media-body">
			            <p>头像</p>
			         </div>
			         <input type="file" id="picFile" hidden @change="changePicFile($event)">
			      </a>
			   </li>
			</ul>
			<ul class="mui-table-view" style="margin-top:20px">
			   <li class="mui-table-view-cell" @tap="editNickname">
			      <a>
			      	昵称
			      	<span class="mui-pull-right mui-ellipsis color-gray">{{ nickname }}</span>
			      </a>
			   </li>
			</ul>
			<ul class="mui-table-view" style="margin-top:20px">
			   <li class="mui-table-view-cell" @tap="editSex">
			      <a>
			      	性别
			      	<span class="mui-pull-right mui-ellipsis color-gray">{{ sex }}</span>
			      </a>
			   </li>
			</ul>
			<ul class="mui-table-view" style="margin-top:20px">
			   <li class="mui-table-view-cell" @tap="editSignature">
			      <a>
			      	个性签名
			      	<span class="mui-pull-right mui-ellipsis color-gray">{{ signature ? signature : '暂无'  }}</span>
			      </a>
			   </li>
			</ul>
		</div>
		<mt-popup 
			v-model="nicknameOptionVisible" 
			position="right" 
			:modal="false">
			<header class="mui-bar mui-bar-nav">
				<a class="mui-icon mui-icon-back mui-pull-left" href="javascript:history.back()"></a>
				<h1 class="mui-title">昵称</h1>
				<span class="mui-pull-right save" @tap="validateNickname">保存</span>
			</header>
			<div class="mui-input-group">
			   <div class="mui-input-row">
			      <input type="text" placeholder="请输入昵称" v-model.trim="name">
			   </div>
			</div>
	   </mt-popup>
		<mt-popup 
			v-model="signatureOptionVisible" 
			position="right" 
			:modal="false">
			<header class="mui-bar mui-bar-nav">
				<a class="mui-icon mui-icon-back mui-pull-left" href="javascript:history.back()"></a>
				<h1 class="mui-title">个性签名</h1>
				<span class="mui-pull-right save" @tap="validateSignature">保存</span>
			</header>
			<div class="mui-input-group">
			   <textarea rows="5" placeholder="请输入个性签名" v-model.trim="desc"></textarea>
			</div>
	  </mt-popup>
		<mt-popup 
			v-model="avatarOptionVisible" 
			position="right" 
			:modal="false">
			<header class="mui-bar mui-bar-nav">
				<a class="mui-icon mui-icon-back mui-pull-left" href="javascript:history.back()"></a>
				<h1 class="mui-title">图片裁剪</h1>
				<span class="mui-pull-right save" @tap="saveImage">确定</span>
			</header>
			<div id="edit-area">
            <img alt="" id="avatar">
         </div>
         <canvas id="canvas" width="150" height="150" style="display:none"></canvas>
	  </mt-popup>
	  <mt-popup 
	  		class="setOption"
			v-model="sexOptionVisible" 
			position="bottom" 
			:closeOnClickModal="false"
			@tap.native="sexOptionVisible=false"
			style="width:100%">
			<ul class="mui-table-view mui-table-view-radio">
			   <li class="mui-table-view-cell" :class="{ 'mui-selected': sex == '男' }" @tap="modifySex('男')">
			      <a class="mui-navigate-right">男</a>
			   </li>
			   <li class="mui-table-view-cell" :class="{ 'mui-selected': sex == '女' }" @tap="modifySex('女')">
			      <a class="mui-navigate-right">女</a>
			   </li>
			   <li class="mui-table-view-cell" :class="{ 'mui-selected': sex == '保密' }" @tap="modifySex('保密')">
			      <a class="mui-navigate-right">保密</a>
			   </li>
			</ul>
	   </mt-popup>
	</div>
</template>

<script>
	import { Toast, Progress } from 'mint-ui'
	import API from '~/api'
	import storage from '~/utils/storage'
	import { STORAGE_KEY } from '~/common/const'
	
	export default {
		data() {
			return {
				avatarUrl: '',
				avatarOptionVisible: false,
				imgUrl: '',
				sex: '',
				sexOptionVisible: false,
				nickname: '',
				name: '',
				nicknameOptionVisible: false,
				signature: '',
				desc: '',
				signatureOptionVisible: false
			}
		},
		computed: {
			userId() {
				return storage.getItem(STORAGE_KEY.USERID)
			}
		},
		methods: {
			choosePicFile(){
				$('#picFile').val('')
            $('#picFile').click()
         },
         changePicFile(ev){
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
               return Toast('图片大小不能超过2M')
            }
            this.avatarOptionVisible = true
            history.pushState(null, null, document.URL)
            var reader=new FileReader()
            reader.readAsDataURL(file)
            reader.onload= (ev)=>{
            	$('#avatar').cropper('replace', ev.target.result ,false)
            	let e = $('#avatar').cropper('getData', true)
            	let img = document.getElementById("avatar")
               let ctx = document.getElementById("canvas").getContext("2d")
               ctx.drawImage(img, e.x, e.y, e.width, e.height, 0, 0, 150, 150)
            }
         },
         editNickname() {
         	this.nicknameOptionVisible = true
         	this.name = this.nickname
         	history.pushState(null, null, document.URL)
         },
         editSignature() {
         	this.signatureOptionVisible = true
         	this.desc = this.signature
         	history.pushState(null, null, document.URL)
         },
         editSex() {
         	this.sexOptionVisible = true
         },
         modifySex(sex) {
         	this.sex = sex
         	this.$store.dispatch('UPDATE_USER_INFO', {
         		name: this.nickname,
         		sex: this.sex,
         		desc: this.signature
         	})
         },
         validateNickname() {
         	if(!this.name){
         		return Toast('请输入昵称')
         	}else if(this.name.length < 2){
         		return Toast('昵称不能少于2位')
         	}else if(this.name.length > 10){
         		return Toast('昵称不能多于10位')
         	}
         	this.$store.dispatch('UPDATE_USER_INFO', {
         		name: this.name,
         		sex: this.sex,
         		desc: this.signature
         	}).then(res => {
         		if(!this.$store.state.is_nickname_exist){
         			this.nickname = this.name
         			history.back()
         		}
         	})
         },
         validateSignature() {
				if(this.desc.length > 100){
         		return Toast('个性签名不能多于100字')
         	}
         	this.$store.dispatch('UPDATE_USER_INFO', {
         		name: this.nickname,
         		sex: this.sex,
         		desc: this.desc
         	}).then(res => {
         		this.signature = this.desc
         		history.back()
         	})
         },
         getUserDetail() {
         	this.$store.dispatch('GET_USER_INFO', this.userId).then(res => {
         		let desc = this.$store.state.user_detail.signature
         		this.nickname = this.$store.state.user_detail.nickname
         		this.signature = desc
         		this.sex = this.$store.state.user_detail.sex
         		this.avatarUrl = this.$store.state.user_detail.avatarUrl
         	})
         },
         saveImage() {
         	let dataUrl = $('#canvas').get(0).toDataURL()
         	this.$store.dispatch('UPLOAD_USER_AVATAR', dataUrl)
         	this.avatarUrl = dataUrl
         	history.back()
         },
         popstate() {
         	if(this.nicknameOptionVisible){
					this.nicknameOptionVisible = false
				}
				if(this.signatureOptionVisible){
					this.signatureOptionVisible = false
				}
				if(this.avatarOptionVisible){
					this.avatarOptionVisible = false
				}
         }
		},
		mounted() {
			this.getUserDetail()
			window.addEventListener('popstate', this.popstate)
			$(document).delegate('.v-modal','tap',() => {
				this.sexOptionVisible = false
			})
			$('#avatar').cropper({
				viewMode: 1,
				aspectRatio: 1/1,
				guides: false,
      		crop: function(e){
      			let img = document.getElementById("avatar")
               let ctx = document.getElementById("canvas").getContext("2d")
               ctx.drawImage(img, e.detail.x, e.detail.y, e.detail.width, e.detail.height, 0, 0, 150, 150)
      		}
      	})
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
	   max-width:50%;
	}
	.save{
		color: #fff;line-height: 44px;
	}
	.mui-input-group{
		margin-top: 60px
	}
	.mint-popup:not(.setOption){
		width:100%;height:100%;z-index:200 !important
	}
	.mui-media-object{
		max-width:50px;
		height:50px;
		border-radius: 50%;
	}
	.mui-media-body p{
		font-size:0.85rem;
		color:#000;
		margin:10px 0;
	}
	#edit-area{
		width: 100%; height: 100%; position: absolute; top: 0;
		display: flex; flex-direction: column; justify-content: center;
	}
	#edit-area img{
		width: 100%;
	}
</style>