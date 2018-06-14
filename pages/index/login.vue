<template>
	<div>
		<header class="mui-bar mui-bar-nav">
			<a class="mui-icon mui-icon-back mui-pull-left" href="javascript:history.back()"></a>
			<h1 class="mui-title">用户登录</h1>
		</header>
		<div class="mui-content">
			<div class="input-group">
				<div class="mui-input-row">
					<label>用户名</label>
					<input v-model.trim='username' type="text" class="mui-input" placeholder="请输入用户名">
				</div>
				<div class="mui-input-row">
					<label>密码</label>
					<input v-model.trim='password' type="password" class="mui-input" placeholder="请输入密码">
				</div>
			</div>
			<div class="mui-content-padded">
				<button class="mui-btn mui-btn-block mui-btn-danger" @tap="submit">登录</button>
				<div class="link-area">
					<nuxt-link to="/register">没有账号？立即注册</nuxt-link>
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
				password: ''
			}
		},
		methods: {
			submit() {
				if(!this.username){
					return Toast('请输入用户名')
				}
				if(!this.password){
					return Toast('请输入密码')
				}
				let bs = new Base64()
				let upa = encodeURIComponent(bs.encode(bs.encode(this.username)+'#'+bs.encode(this.password)))
				this.$store.dispatch('LOGIN', upa).then(() => {
					if(storage.getItem(STORAGE_KEY.USERID)){
						this.$router.push({ path: '/discover/recommend' })
						this.$store.dispatch('GET_USER_LOCATION')
					}
				})
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