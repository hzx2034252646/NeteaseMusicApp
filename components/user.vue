<template>
	<ul class="mui-table-view" v-show="user.length > 0">
		<li class="mui-table-view-cell mui-media" v-for="(item,index) in user" :key="index" @tap="loadUserDetail(item.id)">
			<a href="javascript:;">
				<img class="mui-media-object mui-pull-left" v-lazy="item.picUrl">
				<div class="mui-media-body">
					<p class="mui-ellipsis" :style="{'max-width': isOption ? '85%':'100%'}">{{ item.name }}</p>
				</div>
			</a>
			<span class="option" @tap.stop="showOption(item.id)" v-if="isOption">
				<span class="fa fa-ellipsis-v"></span>
			</span>
		</li>
	</ul>
</template>

<script>
	export default {
		props: [
			'user',
			'isOption',
			'isNetease'
		],
		methods: {
			showOption(id) {
				this.$emit('on-current-user',{
					visible: true,
					currentUser: this.user.find(item => item.id == id)
				})
			},
			loadUserDetail(id) {
				if(this.isNetease){
					this.$router.push({ path: '/user/'+id})
				}else{
					this.$router.push({ path:'/my/user/'+id })
				}
			}
		}
	}
</script>

<style scoped>
	.mui-media-object{
		max-width:50px;
		height:50px;
	}
	.mui-media-body .mui-ellipsis{
		font-size:0.85rem;
		color:#000;
		margin:10px 0;
	}
	.option{
		position:absolute;top:0;right:0;line-height:72px;text-align: center;
		width:40px;height:100%;font-size:16px;color:#ccc
	}
</style>