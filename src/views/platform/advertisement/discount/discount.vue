<template>
	<div>
		<el-header>优惠券</el-header>
		<Advertising :id="id" :pos="pos"></Advertising>


	</div>
</template>

<script>
	import Advertising from '@/components/Advertising/index.vue'
	export default {
		name: 'productList',
		data: function() {
			return {
				id:'9',
				pos:'5',
			}
		},
		methods: {

		},
		components: {
			Advertising,
		},
		props: {

		},
		computed: {

		},
		// 监听
		watch: {
			activeCode: function(val) {

			}
		},

		beforeCreate: function() {
			// vue实例的挂载元素el喝数据对象data都为undefined，还未初始化，————加loading事件
		},
		created: function() {
			//vue实例的数据对象data有了，el还没有，————结束loading，请求数据为mounted渲染做准备
			this.id = 9
			this.pos = 5
		},
		beforeMount: function() {
			//vue实例的el和data都初始化了，但还是虚拟的dom节点，具体的data.filter还未替换
		},
		mounted: function() {
			//vue实例挂载完成，data.filter成功渲染  ————配合路由钩子使用]
		},
		beforeUpdate: function() {
			//数据更新时调用，发生在虚拟 DOM 打补丁之前。这里适合在更新之前访问现有的 DOM，比如手动移除已添加的事件监听器
		},
		updated: function() {
			//由于数据更改导致的虚拟 DOM 重新渲染和打补丁，在这之后会调用该钩子。
		},
		beforeDestroy: function() {
			//实例销毁之前调用。在这一步，实例仍然完全可用。
		},
		destroyed: function() {
			//Vue 实例销毁后调用。调用后，Vue 实例指示的所有东西都会解绑定，所有的事件监听器会被移除，所有的子实例也会被销毁。
		}
	}
</script>

<style scoped>

</style>
