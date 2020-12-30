<template>
	<div>
		<el-main>
			<el-row type="flex" justify="center">
				<el-col :span="6" :xs="18" :sm="18" :md="12" :lg="12">

					<div class="flex_row">
						<el-upload :limit=1 action="auto" :multiple='multiple' :on-progress="handleProgress" :auto-upload="autoUpload"
						 :on-change="fileChange" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove"
						 :file-list="fileList" :class="{hide:hideUpload}" class="contentImgStyle flex_row">
							<i class="el-icon-plus avatar-uploader-icon"></i>
						</el-upload>
						<el-dialog :visible.sync="dialogVisible">
							<img height="100%" :src="dialogImageUrl" alt="图片无法加载">
						</el-dialog>
					</div>
				</el-col>
			</el-row>

			<el-row type="flex" justify="center">
				<el-col :span="24" :xs="24" :sm="24" :md="8" :lg="8">
					<div class="flex_col spanBox">
						<div class="flex_row">
							<span>文字说明 </span>
							<el-input style="width: 70%; margin: 0;" :placeholder="titlePlace" v-model="inputTitle" clearable>
							</el-input>
						</div>
						<div class="flex_row">
							<span> URL </span>
							<el-input style="width: 70%; margin: 0;" :placeholder="pathPlace" v-model="inputPath" clearable>
							</el-input>
						</div>
					</div>
				</el-col>
			</el-row>

			<el-row type="flex" justify="center">
				<el-col :span="6" :xs="18" :sm="18" :md="12" :lg="12">
					<div class="flex_row btnBox">

						<!-- <el-button type="primary" v-if="fileList.lenght > 0" @click="upload">添加</el-button> -->
						<!-- <el-button type="primary" v-else @click="changeFile">修改</el-button> -->

						<el-button type="primary" @click="modification">确 定</el-button>
					</div>

				</el-col>
			</el-row>

		</el-main>


	</div>
</template>

<script>
	export default {
		name: 'productList',
		data: function() {

			return {
				// id: '',
				// pos: '',
				hideUpload: false,
				multiple: false,
				limitCount: 1,
				autoUpload: false,
				dialogImageUrl: '',
				dialogVisible: false,
				inputTitle: '',
				inputPath: '',
				titlePlace: '请输入标题',
				pathPlace: '请输入跳转路径',
				file: '',
				fileName: '',
				fileList: [
					// 	{
					// 	id: 1,
					// 	memo: "说明",
					// 	pic: "aa.jpg",
					// 	pos: 1,
					// 	path:'http://baidu.com',
					// 	url: "https://img.mooligo.com/20200802/15972124810134bg.jpg",
					// },
				],
				showchange: false, //弹框

			}
		},
		methods: {
			changeFile() {
				this.showchange = !this.showchange
				this.fileList = []
			},
			modification() {
				// console.log(this.file)
				if (this.file) {
					this.upload()
				} else {
					this.handleSuccess()
					// this.$message({
					// 	message: '请先选择图片',
					// 	type: 'warning'
					// });
				}
			},
			upload() {
				var that = this
				const formData = new FormData();
				formData.append("pic", that.file);
				formData.append("memo", that.inputTitle);
				formData.append("url", that.inputPath);
				formData.append("id", this.id);
				formData.append('pos', this.pos);
				// console.log(formData)
				// console.log(that.file)
				that.$axios.post(process.env.VUE_APP_BASE_API + '/backend/opera/pic/upload', formData)
					.then(res => {
						if (res.code == 0) {
							that.showchange = false
							that.fileList = [{
								id: this.id,
								memo: that.inputTitle,
								pic: 'https://img.mooligo.com/' + res.data,
								pos: this.pos,
								url: 'https://img.mooligo.com/' + res.data,
								path: that.inputPath,
							}]
							// console.log(that.fileList)
							that.handleSuccess()
							this.$message({
								message: '上传成功',
								type: 'success'
							});
						}

					})
					.catch(error => {
						that.$message.error("上传失败,请稍后重试");
					});
			},
			//文件状态改变 
			fileChange(file) {
				// console.log("文件改变")
				// console.log(file)
				// console.log(this.fileList)
				this.file = file.raw;
				this.fileName = file.name;
				// this.hideUpload = this.fileList.length >= this.limitCount;
				this.hideUpload = true
			},
			// 上传时
			handleProgress(event, file, fileList) {
				// console.log(event)
				// console.log(file)
				// console.log(fileList)
			},
			// 删除
			handleRemove(file, fileList) {
				// console.log("删除")
				// console.log(file);
				// console.log(fileList)
				// this.hideUpload = this.fileList.length >= this.limitCount;
				this.hideUpload = false
			},
			// 点击文件列表中已上传的文件时的钩子
			handlePictureCardPreview(file) {
				this.dialogImageUrl = file.url;
				this.dialogVisible = true;
			},
			// 	// 上传成功以后
			handleSuccess() {
				// console.log("上传成功以后")
				var that = this
				// console.log(this.file)
				this.$axios.post('/backend/opera/ad/update', {
						id: this.id,
						memo: this.inputTitle,
						pic: that.fileList[0].pic,
						pos: this.pos,
						// path:'http://baidu.com',
						url: that.fileList[0].path,
					}, ).then(res => {
						// console.log(res)
						if (res.code == 0) {
							this.$message({
								message: '修改成功~',
								type: 'success'
							});
						} else {
							this.$message.error('修改失败!');
						}
					})
					.catch(e => {})
			},
		},
		components: {

		},
		props: {
			id: '',
			pos: '',
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
			// console.log(req_get())
			// this.upHeaders.Authorization = getToken()
			// console.log(process.env.VUE_APP_BASE_API)
			// this.upPath = process.env.VUE_APP_BASE_API + '/backend/opera/pic/upload'


			this.$axios.get('/backend/opera/ad/list', {}).then(res => {
				if (res.code == 0) {
					for (var i = 0; i < res.data.length; i++) {
						if (this.id == res.data[i].id && this.pos == res.data[i].pos) {
							const imgCode = {
								id: res.data[i].id,
								memo: res.data[i].memo,
								pic: res.data[i].pic,
								pos: res.data[i].pos,
								url: res.data[i].pic,
								path: res.data[i].url,
							}
							this.fileList.push(imgCode)

							this.inputTitle = this.fileList[0].memo
							this.titlePlace = this.fileList[0].memo
							this.pathPlace = this.fileList[0].path
							this.inputPath = this.fileList[0].path
							this.id = this.fileList[0].id
							this.pos = this.fileList[0].pos
							// console.log(this.fileList.length)
							if (this.fileList.lenght > 0) {
								this.hideUpload = false
							} else {
								this.hideUpload = true
							}
						}
					}

				}
			}).catch(e => {})
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

<style>
	.el-upload-list--picture-card .el-upload-list__item{
		min-width: 100px;
		width: 100%!important;
		height: auto!important;
		min-height: 50px;
		border: none;
		margin: 0;
	}
	.el-dialog__body{
		overflow: hidden;
	}
	.el-dialog{
		width: 80%;
	}
	.el-dialog__body img{
		display: block;
		width: 100%;
		height: auto;
		
	}
	.uploadBox {
		width: 100%;

	}

	.hide .el-upload--picture-card {
		display: none;
	}

	.el-upload-list__item {
		transition: none !important;
	}

	.contentImgStyle {
		width: 100%;
	}

	.spanBox span {
		width: 30%;
		line-height: 40px;
	}

	.spanBox div {
		margin-top: 20px;
		width: 100%;
	}

	.btnBox {
		margin-top: 20px;
	}
</style>
