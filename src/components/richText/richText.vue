<template>
	<div>
		<!-- <el-main> -->
			<el-row type="flex" class="row-bg" justify='center'>
			  <el-col :span="20" :xs="20" :sm="18" :md="18" :lg="14">
				  <el-form label-position="top" label-width="80px" :model="formLabelAlign">
				  	<el-form-item label="标题">
				  		<el-input v-model="formLabelAlign.headline"></el-input>
				  	</el-form-item>
					
					<el-form-item label="标题图片">
						<div class="flex_row">
							<el-upload :limit=1 action="auto" :multiple='multiple' :on-progress="handleProgress" :auto-upload="autoUpload"
							 :on-change="fileChange" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove"
							 :file-list="fileList" :class="{hide:hideUpload}" class="contentImgStyle flex_row">
								<i class="el-icon-plus avatar-uploader-icon"></i>
							</el-upload>
							<el-dialog :visible.sync="dialogVisible">
								<img height="100%" :src="dialogImageUrl" alt="">
							</el-dialog>
						</div>
					</el-form-item>
					
				  	<el-form-item label="发布者">
				  		<el-input v-model="formLabelAlign.author" :placeholder="placeholder_author"></el-input>
				  	</el-form-item>
				  </el-form>
			  </el-col>
			</el-row>
			
			<el-row type="flex" justify='center'>
				<el-col :span="20" :xs="20" :sm="18" :md="18" :lg="14">
					<quill-editor v-model="content" ref="myQuillEditor" class="editor" :options="editorOption" @blur="onEditorBlur($event)"
					 @focus="onEditorFocus($event)" @change="onEditorChange($event)">
					</quill-editor>
				</el-col>
			</el-row>
			
			<el-row type="flex" justify="center">
				<el-col :span="6" :xs="18" :sm="18" :md="12" :lg="12">
					<div class="flex_row btnBox">
						<el-button type="primary" @click="upDate">确 定</el-button>
					</div>
			
				</el-col>
			</el-row>
		<!-- </el-main> -->
		
		
		
		<!-- <div>
      {{content}}
    </div> -->
	</div>
</template>
<script>
	// require styles 引入样式
	import 'quill/dist/quill.core.css'
	import 'quill/dist/quill.snow.css'
	import 'quill/dist/quill.bubble.css'
	import {
		quillEditor
	} from 'vue-quill-editor'
	import {
		getInfo,
		req_get,
		req_post
	} from '../../api/user.js'
	// 工具栏配置
	const toolbarOptions = [
		['bold', 'italic', 'underline', 'strike'], // 加粗 斜体 下划线 删除线 -----['bold', 'italic', 'underline', 'strike']
		['blockquote', 'code-block'], // 引用  代码块-----['blockquote', 'code-block']
		[{
			header: 1
		}, {
			header: 2
		}], // 1、2 级标题-----[{ header: 1 }, { header: 2 }]
		[{
			list: 'ordered'
		}, {
			list: 'bullet'
		}], // 有序、无序列表-----[{ list: 'ordered' }, { list: 'bullet' }]
		[{
			script: 'sub'
		}, {
			script: 'super'
		}], // 上标/下标-----[{ script: 'sub' }, { script: 'super' }]
		[{
			indent: '-1'
		}, {
			indent: '+1'
		}], // 缩进-----[{ indent: '-1' }, { indent: '+1' }]
		[{
			'direction': 'rtl'
		}], // 文本方向-----[{'direction': 'rtl'}]
		[{
			size: ['small', false, 'large', 'huge']
		}], // 字体大小-----[{ size: ['small', false, 'large', 'huge'] }]
		[{
			header: [1, 2, 3, 4, 5, 6, false]
		}], // 标题-----[{ header: [1, 2, 3, 4, 5, 6, false] }]
		[{
			color: []
		}, {
			background: []
		}], // 字体颜色、字体背景颜色-----[{ color: [] }, { background: [] }]
		[{
			font: []
		}], // 字体种类-----[{ font: [] }]
		[{
			align: []
		}], // 对齐方式-----[{ align: [] }]
		['clean'], // 清除文本格式-----['clean']
		['image'] // 链接、图片、视频-----['link', 'image', 'video']
	]
	export default {
		components: {
			quillEditor
		},
		data() {
			return {
				content: null,
				editorOption: {
					placeholder: '请输入文本...',
					theme: 'snow',
					modules: {
						toolbar: {
							container: toolbarOptions
						}
					}
				},
				formLabelAlign: {
					id:0,
					headline: '',
					author: '',
				},
				placeholder_author: '魔力Go',
				hideUpload: false,
				multiple: false,
				limitCount: 1,
				autoUpload: false,
				dialogImageUrl: '',
				dialogVisible: false,
				fileList: [],
				file: '',
				id:0,
				imgUrl:'',
			}
		},
		methods: {
			onEditorBlur() {
				// 失去焦点事件
			},
			onEditorFocus() {
				// 获得焦点事件
			},
			onEditorChange() {
				// 内容改变事件
			},
			upDate() {

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
				if(this.formLabelAlign.author == ""){
					this.formLabelAlign.author = this.placeholder_author
				}

				const formData = new FormData();
				formData.append("pic", that.file);
				that.$axios.post('/backend/opera/pic/upload', formData)
					.then(res => {
						// console.log(res)
						if (res.code == 0) {
							that.showchange = false
							that.imgUrl = 'https://img.mooligo.com/' + res.data
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
				that.$axios.post('/backend/opera/news/handler', {
						id: that.formLabelAlign.id,
						// img: this.imgUrl,
						img:that.imgUrl,
						title: that.formLabelAlign.headline,
						content: that.content,
						author:that.formLabelAlign.author,
						state: 1
					},).then(res => {
						// console.log(res)
						if (res.code == 0) {
							this.$message({
								message: '创建成功~',
								type: 'success',
								duration:1000,
								onClose:()=>{
									this.$router.go(-1)
								}
							});
							
						} else {
							this.$message.error('创建失败!');
						}
							
					})
					.catch(error => {
						that.$message.error("添加失败,请稍后重试");
					});
		
			},
		},
		props:['newsId','img','titleasdf','newsContent','author','state'],
		beforeCreate: function() {
			// vue实例的挂载元素el喝数据对象data都为undefined，还未初始化，————加loading事件
		},
		created: function() {
			//vue实例的数据对象data有了，el还没有，————结束loading，请求数据为mounted渲染做准备
			if(this.newsId){
				this.formLabelAlign.id = this.newsId
				this.formLabelAlign.headline = this.titleasdf
				this.formLabelAlign.author = this.author
				this.content = this.newsContent
				this.imgUrl = this.img
				this.fileList = [{
					url: this.imgUrl,
				}]
				if (this.fileList.lenght > 0) {
					this.hideUpload = false
				} else {
					this.hideUpload = true
				}
			}
			
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
	.hide .el-upload--picture-card {
		display: none;
	}
	.btnBox{
		margin-top: 100px;
		padding-bottom: 100px;
	}
	.btnBox button{
		width: 200px;
	}
	.editor {
		line-height: normal !important;
		height: 500px;
	}

	.ql-snow .ql-tooltip[data-mode=link]::before {
		content: "请输入链接地址:";
	}

	.ql-snow .ql-tooltip.ql-editing a.ql-action::after {
		border-right: 0px;
		content: '保存';
		padding-right: 0px;
	}

	.ql-snow .ql-tooltip[data-mode=video]::before {
		content: "请输入视频地址:";
	}

	.ql-snow .ql-picker.ql-size .ql-picker-label::before,
	.ql-snow .ql-picker.ql-size .ql-picker-item::before {
		content: '14px';
	}

	.ql-snow .ql-picker.ql-size .ql-picker-label[data-value=small]::before,
	.ql-snow .ql-picker.ql-size .ql-picker-item[data-value=small]::before {
		content: '10px';
	}

	.ql-snow .ql-picker.ql-size .ql-picker-label[data-value=large]::before,
	.ql-snow .ql-picker.ql-size .ql-picker-item[data-value=large]::before {
		content: '18px';
	}

	.ql-snow .ql-picker.ql-size .ql-picker-label[data-value=huge]::before,
	.ql-snow .ql-picker.ql-size .ql-picker-item[data-value=huge]::before {
		content: '32px';
	}

	.ql-snow .ql-picker.ql-header .ql-picker-label::before,
	.ql-snow .ql-picker.ql-header .ql-picker-item::before {
		content: '文本';
	}

	.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
	.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
		content: '标题1';
	}

	.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
	.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
		content: '标题2';
	}

	.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
	.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
		content: '标题3';
	}

	.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
	.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
		content: '标题4';
	}

	.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
	.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
		content: '标题5';
	}

	.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
	.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
		content: '标题6';
	}

	.ql-snow .ql-picker.ql-font .ql-picker-label::before,
	.ql-snow .ql-picker.ql-font .ql-picker-item::before {
		content: '标准字体';
	}

	.ql-snow .ql-picker.ql-font .ql-picker-label[data-value=serif]::before,
	.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=serif]::before {
		content: '衬线字体';
	}

	.ql-snow .ql-picker.ql-font .ql-picker-label[data-value=monospace]::before,
	.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=monospace]::before {
		content: '等宽字体';
	}
</style>
