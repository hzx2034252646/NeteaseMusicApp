<template>
	<mt-popup 
		v-model="visible" 
		position="bottom" 
		:closeOnClickModal="false"
		style="width:100%"
		@tap.native="visible=false">
		<mt-cell title="删除专辑" is-link @tap.native="deleteAlbum(currentAlbum.id)">
		  <img slot="icon" src="~/assets/images/icons/option_delete.png" width="24" height="24">
		</mt-cell>
   </mt-popup>
</template>

<script>
	export default {
		props: [
			'optionVisible',
			'currentAlbum'
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
			deleteAlbum(id) {
				mui.confirm('确定删除专辑？', e => {
					if(e.index){
						let arr = []
						arr.push(id)
						this.$store.dispatch('DELETE_USER_COLLECT_ALBUM', arr)
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
