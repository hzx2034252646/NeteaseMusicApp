<template>
	<mt-popup 
		v-model="visible" 
		v-if="currentPlaylist.id"
		position="bottom" 
		:closeOnClickModal="false"
		style="width:100%"
		@tap.native="visible=false">
		<mt-cell title="编辑歌单" is-link @tap.native="editPlaylist(currentPlaylist.id)">
		  <img slot="icon" src="~/assets/images/icons/option_edit.png" width="24" height="24">
		</mt-cell>
		<mt-cell title="删除歌单" is-link @tap.native="deletePlaylist(currentPlaylist.id)">
		  <img slot="icon" src="~/assets/images/icons/option_delete.png" width="24" height="24">
		</mt-cell>
   </mt-popup>
</template>

<script>
	import { Toast } from 'mint-ui'
	
	export default {
		props: [
			'optionVisible',
			'currentPlaylist'
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
			editPlaylist(id) {
				mui.prompt('', '请输入歌单标题', '编辑歌单', e => {
					if(e.index){
						let name = $.trim(e.value)
						if(!name){
							Toast('歌单标题不能为空')
						}else if(name.length>20){
							Toast('歌单标题不能不能多于20字')
						}else{
							this.$store.dispatch('UPDATE_USER_CREATELIST', { id, name })
						}
					}
				},'div')
			},
			deletePlaylist(id) {
				mui.confirm('确定删除歌单？', e => {
					if(e.index){
						this.$store.dispatch('DELETE_USER_CREATELIST', id)
					}
				},'div')
			}
		},
		mounted() {
			$(document).delegate('.v-modal','tap',() => {
				this.visible = false
			})
		}
	}
</script>
