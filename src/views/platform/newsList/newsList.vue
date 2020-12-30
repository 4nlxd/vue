<template>
	<div>
		<el-header>新闻</el-header>
		<el-main>
			<el-row type="flex" justify='center'>
				<el-col :span="24" :xs="24" :sm="18" :md="16" :lg="16">
					<div @click="addNews" class="addnews">
						+ 添 加 新 闻
					</div>
				</el-col>
			</el-row>
			<el-row>
				<el-row type="flex" justify='center' v-for="(item,index) in newsList">
					<el-col :span="24" :xs="24" :sm="18" :md="16" :lg="16">
						<div class="newsBox flex_row" @click='changeNews(item)'>
							<div class="newsImg flex_row">
								<!-- <img :src="item.img" alt="图片无法加载"> -->
								<el-image
								      style="width: 100%;height: 100%;border-radius: 30px;"
								      :src="item.img"
								      fit="fill"></el-image>
							</div>
							<div class="newsCont flex_col justify_between">
								<div class="newsTit">
									<div>{{item.title}}</div>
								</div>
								<div class="newsMsg flex_row justify_between">
									<div>
										<span>作者：{{item.author}}</span>
									</div>
									<div>
										<span>时间：{{item.created}}</span>
									</div>
								</div>
							</div>
						</div>

					</el-col>
				</el-row>
			</el-row>



			<el-row style="margin-top: 30px;" :gutter="20" type="flex" justify='center'>
				<el-col :span="6" :xs="18" :sm="18" :md="24" :lg="24">
					<div class="flex_row">
						<el-pagination background layout="prev, pager, next" :page-size="page_size" :total="total" @current-change="currentChange">
						</el-pagination>
					</div>

				</el-col>
			</el-row>
		</el-main>
	</div>
</template>

<script>
	export default {
		name: 'news',
		data: function() {
			return {
				newsList: [],
				total: 0,
				page_size: 10,
				currentPage: 1
			}
		},
		methods: {
			changeNews: function(e) {
				// console.log(e)
				this.$router.push({
					path: '/newsCont',
					query: {
						newsItem: e
					}
				})
			},
			addNews() {
				this.$router.push({
					path: '/newsCont',
				})
			},
			currentChange(e) {
				// console.log(e)
				this.currentPage = e
				// this.$nextTick(()=>{

				// })
				this.getlist(this.currentPage)
			},
			// getlist
			getlist(currentPage) {
				const loading = this.$loading({
					lock: true,
					text: 'Loading',
					spinner: 'el-icon-loading',
					background: 'rgba(0, 0, 0, 0.7)'
				});
				this.$axios.get('/backend/opera/news/list?pn=' + this.currentPage, {})
					.then(res => {
						console.log(res)
						if (res.code == 0) {
							this.newsList = res.data.list,
								this.total = res.data.total
						}else{
							this.$message.error(res.message)
						}
						loading.close()
					})
					.catch(error => {
						that.$message.error("上传失败,请稍后重试");
					});
			}
		},
		components: {

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
		created: function(currentPage) {
			//vue实例的数据对象data有了，el还没有，————结束loading，请求数据为mounted渲染做准备
			this.getlist(this.currentPage)
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
	.newsBox {
		width: 100%;
		height: 150px;
		box-shadow: 0px 5px 10px #B5C0D2;
		margin-top: 30px;
		border-radius: 30px;
	}

	.newsImg {
		width: 28%;
		height: 80%;
		overflow: hidden;
		border-radius: 30px;
	}

	/* .newsImg img {
		display: block;
		width: 100%;
		height: auto;
		border-radius: 30px;
	} */

	.newsCont {
		width: 68%;
		height: 50%;
		margin-left: 1%;
	}

	.newsTit,
	.newsMsg {
		width: 95%;
		height: 50%;
	}

	.newsTit {
		font-size: 28rpx;
	}

	.newsMsg {
		font-size: 24;
		color: #666666;
	}

	.addnews {
		width: 100%;
		height: 60px;
		text-align: center;
		background-color: #008A00;
		line-height: 60px;
		color: #FFFFFF;
		border-radius: 20px;
		font-weight: bold;
	}
</style>
