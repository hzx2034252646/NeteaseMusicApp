<template>
	<mt-popup 
		v-model="visible" 
		position="bottom" 
		:closeOnClickModal="false"
		style="width:100%"
		@tap.native="visible=false">
		<mt-cell title="取消关注" is-link @tap.native="unfollow(currentId)" v-if="action=='unfollow'">
		  <img slot="icon" src="~/assets/images/icons/option_delete.png" width="24" height="24">
		</mt-cell>
		<mt-cell title="关注TA" is-link @tap.native="follow(currentJson)" v-if="action=='follow'">
		  <img slot="icon" src="~/assets/images/icons/option_collect.png" width="24" height="24">
		</mt-cell>
  </mt-popup>
</template>

<script>
	import storage from '~/utils/storage'
	import { STORAGE_KEY } from '~/common/const'
	import { Toast } from 'mint-ui'
	
	export default {
		props: [
			'optionVisible',
			'currentId',
			'currentJson',
			'type',
			'action'
		],
		data() {
			return {
				visible: this.optionVisible
			}
		},
		watch: {
			optionVisible(value){
				this.visible = value
			},
			visible(value) {
				this.$emit('changeVisible', value)
			}
		},
		methods: {
			unfollow(id) {
				mui.confirm('确定取消关注？', e => {
					if(e.index){
						let arr = []
						arr.push(id)
						switch(this.type){
							case 'singer': 
								this.$store.dispatch('DELETE_USER_FOLLOW_SINGER', arr)
								break
							case 'neteaseUser':
								this.$store.dispatch('DELETE_USER_FOLLOW_NETEASEUSER', arr)
								break
							case 'user':
								this.$store.dispatch('DELETE_USER_FOLLOW_USER', arr)
								break
						}
					}
				},'div')
			},
			follow(json) {
				if (!storage.getItem(STORAGE_KEY.TOKEN)){
					return Toast('请先登录')	
				}
				let arr = []
				arr.push(json)
				switch(this.type){
					case 'singer': 
						this.$store.dispatch('ADD_USER_FOLLOW_SINGER', arr)
						break
					case 'neteaseUser':
						this.$store.dispatch('ADD_USER_FOLLOW_NETEASEUSER', arr)
						break
					case 'user':
			         this.$store.dispatch('ADD_USER_FOLLOW_USER', arr)
						break
				}
			}
		},
		mounted() {
			$(document).delegate('.v-modal','tap',() => {
				this.visible = false
			})
		}
	}
</script>
