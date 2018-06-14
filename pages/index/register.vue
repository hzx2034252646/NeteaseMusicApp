<template>
	<div>
		<header class="mui-bar mui-bar-nav">
			<a class="mui-icon mui-icon-back mui-pull-left" href="javascript:history.back()"></a>
			<h1 class="mui-title">用户注册</h1>
		</header>
		<div class="mui-content">
			<div class="input-group">
				<div class="mui-input-row">
					<label>用户名</label>
					<input v-model.trim='username' type="text" class="mui-input" placeholder="请输入用户名">
				</div>
				<div class="mui-input-row">
					<label>密码</label>
					<input v-model='password' type="password" class="mui-input" placeholder="请输入密码">
				</div>
				<div class="mui-input-row">
					<label>确认密码</label>
					<input v-model='confirmPassword' type="password" class="mui-input" placeholder="请再次输入密码">
				</div>
			</div>
			<div class="mui-content-padded">
				<button class="mui-btn mui-btn-block mui-btn-danger" @tap="submit">注册</button>
				<div class="link-area">
					<nuxt-link to="/login">已有账号？立即登录</nuxt-link>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import { Toast } from 'mint-ui'
	import storage from '~/utils/storage'
	import { STORAGE_KEY } from '~/common/const'
	import { Base64 } from '~/common/base64'
	
	export default {
		data() {
			return {
				username: '',
				password: '',
				confirmPassword: ''
			}
		},
		methods: {
			submit() {
				if(!this.username){
					return Toast('请输入用户名')
				}else if(this.username.length < 2){
					return Toast('用户名不能小于2位')
				}else if(this.username.length > 10){
					return Toast('用户名不能大于10位')
				}
				if(!this.password){
					return Toast('请输入密码')
				}else if(this.password.search(/\s/g) != -1){
					return Toast('密码不允许有空格')
				}else if(this.password.length < 6){
					return Toast('密码不能小于6位')
				}else if(this.password.length > 16){
					return Toast('密码不能大于16位')
				}
				if(!this.confirmPassword){
					return Toast('请再次输入密码')
				}else if(this.password != this.confirmPassword){
					return Toast('密码不一致，请确认后重新输入')
				}
				let bs = new Base64()
				let upa = encodeURIComponent(bs.encode(bs.encode(this.username)+'#'+bs.encode(this.password)))
				this.$store.dispatch('REGISTER', upa)
			}
		}
	}
</script>

<style scoped>
	.mui-icon-back {
		color: #fff;
	}
	.input-group {
		margin-top: 10px;
	}
	
	.input-group:first-child {
		margin-top: 20px;
	}
	
	.input-group label {
		width: 28%;
	}
	.mui-input-row{
		margin:20px 0
	}
	.mui-input-row input {
		width: 72%;
	}
	
	.mui-content-padded {
		margin-top: 25px;
	}
	
	.mui-btn {
		padding: 10px;border-radius:30px;
	}
	
	.link-area {
		display: block;
		margin-top: 25px;
		text-align: center;
	}
	.link-area a{
		color:#d43c33
	}
</style>