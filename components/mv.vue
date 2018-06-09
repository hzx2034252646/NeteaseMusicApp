<template>
	<ul class="mui-table-view">
		<li class="mui-table-view-cell mui-media" v-for="(item,index) in mv" :key="index" @tap="playMV(item.id,item.source)">
			<a href="javascript:;">
				<img v-if="isImageLazyLoad" class="mui-media-object mui-pull-left" v-lazy="item.picUrl">
				<img v-else="isImageLazyLoad" class="mui-media-object mui-pull-left" :src="item.picUrl">
				<div class="mui-media-body">
					<p class="mui-ellipsis">{{ item.name }}</p>
					<p class="mui-ellipsis">{{ item.artist }}</p>
				</div>
			</a>
		</li>
	</ul>
</template>

<script>
	import { Indicator } from 'mint-ui'

	export default {
		props: [
			'mv',
			'isImageLazyLoad'
		],
		computed: {
			mv_url() {
				return this.$store.state.mv_url
			}
		},
		methods: {
			async playMV(id,source) {
				function open_without_referrer(link){ 
			     	window.open('javascript:window.name;', '<script>location.replace("'+link+'")<\/script>');
			   }
				let json = {
					'240': '流畅（240p）',
					'480': '标清（480p）',
					'720': '高清（720p）',
					'1080': '超清（1080p）'
				}
				let actions = []
				Indicator.open()
				switch(source){
					case 'netease':
						this.$store.dispatch('GET_MV_URL', {
							id,
							source: 'netease'
						}).then(res => {
							let url = this.mv_url
							Object.keys(url).forEach(item => {
								actions.push({
									name: json[item],
									method: function(){
										open_without_referrer(url[item])
									}
								})
							})
							this.$emit('changeVisible', {
								visible: true,
								actions
							})
							Indicator.close()
						})
						break
					case 'tencent':
						this.$store.dispatch('GET_MV_URL', {
							id,
							source: 'tencent'
						}).then(res => {
							let url = this.mv_url
							Object.keys(url).forEach(item => {
								actions.push({
									name: json[item],
									method: function(){
										open_without_referrer(url[item])
									}
								})
							})
							this.$emit('changeVisible', {
								visible: true,
								actions
							})
							Indicator.close()
						})
						break
					case 'kugou':
						this.$store.dispatch('GET_MV_URL', {
							id, 
							source: 'kugou'
						}).then(res => {
							let url = this.mv_url
							Object.keys(url).forEach(item => {
								actions.push({
									name: json[item],
									method: function(){
										open_without_referrer(url[item])
									}
								})
							})
							this.$emit('changeVisible', {
								visible: true,
								actions
							})
							Indicator.close()
						})
						break
				}
			}
		}
	}
</script>

<style scoped>
	.mui-media-object{
		width: 150px;
		max-width:150px;
		height:100px;
	}
	.mui-media-body p{
		margin:0;line-height:2;max-width:100%
	}
	.mui-media-body p:nth-child(1){
		font-size:0.85rem;
		color:#000;
		margin-top:15px;
	}
</style>