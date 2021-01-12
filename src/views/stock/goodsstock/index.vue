<template>
	<div class="app-goodsstock">
		<div class='titleBtn'>
			<el-button type="success" class='btn' @click='handleMask(2)'>增加货品</el-button>
		</div>
		<div class='titleContent'>
			<span class='title'>仓库</span>
			<el-select class='select' v-model="value" placeholder="请选择" @change="handleChange()">
				<el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id">
				</el-option>
			</el-select>
		</div>
		<div class='tableContent'>
			<el-table :data="tableData" border style="width: 97%">
				<el-table-column prop="id" label="货品ID">
				</el-table-column>
				<el-table-column prop="name" label="货品">
				</el-table-column>
				<el-table-column  label="出货价格">
					<template slot-scope="scope">
						<span>￥{{scope.row.price}}</span>
					</template>
				</el-table-column>
				<el-table-column  label="库存量">
					<template slot-scope="scope">
						<span class='color' v-if='scope.row.stock==0'>{{scope.row.stock}}沽清</span>
						<span v-if='scope.row.stock>0'>{{scope.row.stock}}</span>
					</template>
				</el-table-column>
				<el-table-column prop="unit" label="单位">
				</el-table-column>
				<el-table-column  label="状态">
					<template slot-scope="scope">
						<span class='color' v-if='scope.row.stockStatus==0'>暂停</span>
						<span  v-if='scope.row.stockStatus==1'>正常</span>
					</template>
				</el-table-column>
				<el-table-column label="库存操作">
					<template slot-scope="scope">
						<el-button @click="handleMask(1,scope.row)" type="text" size="small">货品入库</el-button>
						<el-button @click="handleMask(3,scope.row)" type="text" size="small">修改库存</el-button>
					</template>
				</el-table-column>
				<el-table-column label="状态修改">
					<template slot-scope="scope">
						<el-button v-if='scope.row.stockStatus==1' @click="handleSucess(scope.row)" type="text" size="small">暂定出库</el-button>
						<el-button class='color' v-if='scope.row.stockStatus==0'@click="handleSucess(scope.row)" type="text" size="small">恢复出库</el-button>
					</template>
				</el-table-column>
				<el-table-column label="修改货品">
					<template slot-scope="scope">
						<el-button @click='handleMask(4,scope.row)' type="text" size="small">修改货品信息</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<div class='mask' v-if="isMask">
			<div class="maskContent">
				<i class="el-icon-close" @click='handleMask(0)'></i>
				<div class='maskMain'>
					<h2 class='maskTitle'>{{title}} </h2>
					<div class='mainContent' v-if="isShow==4">
						<span class='mainTtile'>ID:</span>
						<span class='mainName'>{{showData.id}}</span>
					</div>
					<div class='mainContent' v-if="isShow!=2 && isShow!=4">
						<span class='mainTtile'>货品:</span>
						<span class='mainName'>{{showData.name}}</span>
					</div>
					<div class='mainContent' v-if="isShow!=2 && isShow!=4">
						<span class='mainTtile'>库存:</span>
						<span class='mainName'>{{showData.stock}}</span>
					</div>
					<div class='mainContent' v-if="isShow!=2 && isShow!=4">
						<span class='mainTtile'>单位:</span>
						<span class='mainName'>{{showData.unit}}</span>
					</div>
					<div class='mainContent' v-if="isShow==2 || isShow==4">
						<span class='mainTtile'>货品名:</span>
						<el-input class='input' v-model="productName" placeholder="请输入货品名"></el-input>
					</div>
					<div class='mainContent' v-if="isShow==2 || isShow==4">
						<span class='mainTtile'>货品价格:</span>
						<el-input class='input' v-model="productPrice" placeholder="请输入货品价格"></el-input>
					</div>
					<div class='mainContent' v-if="isShow==2 || isShow==4">
						<span class='mainTtile'>单位:</span>
						<el-input class='input' v-model="company" placeholder="请输入单位"></el-input>
					</div>
					<div class='mainContent' v-if="isShow==1">
						<span class='mainTtile'>入库数量:</span>
						<el-input class='input' v-model="storageQuantity" placeholder="请输入入库数量"></el-input>
					</div>
					<div class='mainContent' v-if="isShow==3">
						<span class='mainTtile'>原因:</span>
						<el-input class='input' v-model="reason" placeholder="请输入原因"></el-input>
					</div>
					<div class='mainContent' v-if="isShow==3">
						<span class='mainTtile'>库存增删:</span>
						<el-input class='input' v-model="inventory" placeholder="请输入库存增删数量"></el-input>
					</div>
					<div class='bottombtn'>
						<el-button type="primary" class='btn' @click='handleAdd()'>{{btnContent}}</el-button>
						<el-button type="primary" class='btn' @click='handleMask(0)'>取消</el-button>
					</div>
				</div>
			</div>
		</div>
		<div class='bottom'>
			<el-pagination class='page' @current-change="handleCurrentChange" background layout="prev, pager, next" :total='total'>
			</el-pagination>
		</div>
	</div>
</template>

<script>
	import {
		getList,
		storeroomAll,
		goodsAdd,
		goodsUpdate,
		goodsStockUpdate,
		goodsStatusUpdate
	} from '@/api/stock'
	import {
		parseTime
	} from '@/utils/index'
	import {
		MessageBox,
		Message
	} from 'element-ui'
	export default {
		filters: {
			statusFilter(status) {
				const statusMap = {
					published: 'success',
					draft: 'gray',
					deleted: 'danger'
				}
				return statusMap[status]
			}
		},
		data() {
			return {
				tableData: [],
				listLoading: true,
				datatime: [],
				page: 1,
				total: 0,
				value: 1,
				title: '货品入库',
				isMask: 0,
				productName: '',
				company:'',
				storageQuantity: '',
				reason: '',
				productPrice:'',
				inventory: '',
				btnContent: '添加',
				isShow: 1,
				showData: null,
				options: [{
					value: 1,
					label: '华北仓库'
				}, {
					value: 2,
					label: '华南仓库'
				}],

			}
		},
		created() {
			this.storeroomAllData();
			this.fetchData();
		},
		methods: {
			fetchData() {
				this.listLoading = true;
				let data = {
					pageNo: this.page,
					pageSize: 10,
					roomId:this.value,
				}
				getList(data).then(response => {
					this.listLoading = false;
					if (response.code == 0) {
						this.tableData = response.data.list || [];
						this.total = response.data.total;
					} else {
						Message({
							message: response.message || 'Error',
							type: 'error',
							duration: 5 * 1000
						})
					}
				})
			},
			storeroomAllData() {
				this.listLoading = true;
				let data = {}
				storeroomAll(data).then(response => {
					this.listLoading = false;
					if (response.code == 0) {
						this.options = response.data || [];
					} else {
						Message({
							message: response.message || 'Error',
							type: 'error',
							duration: 5 * 1000
						})
					}
				})
			},
			goodsAddData() {
				this.listLoading = true;
				let data = {
					"id": 0,
					"name": this.productName,
					"price": this.productPrice,
					"status": 0,
					"stockStatus": 0,
					"storeroomId": this.value,
					"unit": this.company
				}
				goodsAdd(data).then(response => {
					this.listLoading = false;
					if (response.code == 0) {
						Message({
							message: '库存增加成功' || 'Error',
							type: 'success',
							duration: 5 * 1000
						});
						this.fetchData();
						this.isMask = 0;
					} else {
						Message({
							message: response.message || 'Error',
							type: 'error',
							duration: 5 * 1000
						})
					}
				})
			},
			goodsUpdateData() {
				this.listLoading = true;
				let data = {
					"id": this.showData.id,
					"name": this.productName,
					"price": this.productPrice,
					"status": 0,
					"stockStatus":this.value,
					"storeroomId": 0,
					"unit": this.company
				}
				goodsUpdate(data).then(response => {
					this.listLoading = false;
					if (response.code == 0) {
                         Message({
                         	message: '货品信息修改成功' || 'Error',
                         	type: 'success',
                         	duration: 5 * 1000
                         });
                         this.fetchData();
                         this.isMask = 0;
					} else {
						Message({
							message: response.message || 'Error',
							type: 'error',
							duration: 5 * 1000
						})
					}
				})
			},
			goodsStockUpdateData() {
				this.listLoading = true;
				let data=null;
				if(this.isShow==1){
					data = {
						"id":this.showData.id,
						"orderId":0,
						"remark":'',
						"stock":this.storageQuantity,
						 type:1,
					}
				}else if(this.isShow==3){
					data = {
						"id":this.showData.id,
						"orderId":0,
						"remark": this.reason,
						"stock": this.inventory,
						type:2,
					}
				}
				goodsStockUpdate(data).then(response => {
					this.listLoading = false;
					if (response.code == 0) {
                           Message({
                           	message: '库存修改成功' || 'Error',
                           	type: 'success',
                           	duration: 5 * 1000
                           });
                           this.fetchData();
                           this.isMask = 0;
					} else {
						Message({
							message: response.message || 'Error',
							type: 'error',
							duration: 5 * 1000
						})
					}
				})
			},
			goodsStatusUpdateData(val) {
				this.listLoading = true;
				let stockStatus=val.stockStatus ? 0:1;
				let data = {
					"id": val.id,
					"name": "",
					"price": 0,
					"status": 0,
					"stockStatus":stockStatus,
					"storeroomId": 0,
					"unit": ""
				}
				goodsStatusUpdate(data).then(response => {
					this.listLoading = false;
					if (response.code == 0) {
                          Message({
                          	message: '库存修改成功' || 'Error',
                          	type: 'success',
                          	duration: 5 * 1000
                          });
                          this.fetchData();
					} else {
						Message({
							message: response.message || 'Error',
							type: 'error',
							duration: 5 * 1000
						})
					}
				})
			},
			handleChange() {
				this.fetchData();
			},
			handleCurrentChange(val){
				this.page=val;
				this.fetchData();
			},
			handleMask(index, data) {
				this.company='';
				this.productName='';
				this.storageQuantity='';
				this.inventory='';
				this.reason='';
				this.productPrice='';
				if (index == 0) {
					this.isMask = 0;
				} else if (index == 1) {
					this.isMask = 1;
					this.btnContent = '修改';
					this.title = '货品入库';
					this.isShow = 1;
					this.showData = data;
				} else if (index == 2) {
					this.isMask = 1;
					this.isShow = 2;
					this.btnContent = '添加';
					this.title = '增加、修改货品';
				} else if (index == 3) {
					this.isMask = 1;
					this.btnContent = '修改';
					this.title = '库存修改';
					this.isShow = 3;
					this.showData = data;
				} else if (index == 4) {
					this.isMask = 1;
					this.isShow = 4;
					this.btnContent = '修改';
					this.showData = data;
					this.title = '增加、修改货品';
					this.productName=data.name;
					this.productPrice=data.price;
					this.company=data.unit;
				}
			},
			handleSucess(val) {
				this.openTip(val);
			},
			handleAdd() {
				if (this.isShow == 2 && this.SubmitTips()) {
					this.goodsAddData();
				} else if (this.isShow == 4 && this.SubmitTips()) {
					this.goodsUpdateData();
				} else if ((this.isShow == 3 || this.isShow == 1) && this.SubmitTips1()) {
					this.goodsStockUpdateData();
				}
			},
			SubmitTips() {
				if (!this.productName) {
					Message({
						message: '请填写货品名字',
						type: 'error',
						duration: 2 * 1000
					});
					return
				};
				if (!this.company) {
					Message({
						message: '请填写单位',
						type: 'error',
						duration: 2 * 1000
					})
					return
				};
				if (!this.productPrice) {
					Message({
						message: '请填写商品价格',
						type: 'error',
						duration: 2 * 1000
					})
					return
				};
				return true;
			},
			SubmitTips1() {
				if (!this.reason && this.isShow == 3) {
					Message({
						message: '请填写原因',
						type: 'error',
						duration: 2 * 1000
					});
					return
				};
				if (!this.inventory && this.isShow == 3) {
					Message({
						message: '请填写库存删减数量',
						type: 'error',
						duration: 2 * 1000
					})
					return
				};
				if (!this.storageQuantity && this.isShow ==1) {
					Message({
						message: '请填入库数量',
						type: 'error',
						duration: 2 * 1000
					});
					return
				};
				return true;
			},
			//方案退单
			openTip(id) {
				this.$confirm('是否要修改出库状态', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					console.log('999')
					this.goodsStatusUpdateData(id);
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},
		}

	}
</script>
<style lang="scss">
	* {
		margin: 0;
		padding: 0
	}

	.app-goodsstock {
		padding-left: 50px;

		.titleBtn {
			width: 97%;
			height: 100px;

			.btn {
				float: right;
				margin-left: 30px;
				margin-top: 30px;
			}
		}

		.titleContent {
			height: 50px;
			background-color: rgba(153, 153, 153, 1);
			margin-bottom: 20px;
			padding-left: 50px;

			.title {
				display: inline-block;
				line-height: 50px;
				color: #fff;
				margin-right: 10px;
			}

			.select {
				height: 40px;
				width: 200px;
				margin: 5px 0;
			}
		}
        .tableContent{
			.color{
				color:red;
			}
		}
		.mask {
			position: fixed;
			width: 100%;
			height: 100%;
			top: 0;
			left: 0;
			z-index: 2000;
			background-color: rgba(0, 0, 0, .5);

			.maskContent {
				position: absolute;
				width: 700px;
				height: 600px;
				top: 50%;
				left: 50%;
				margin-top: -300px;
				margin-left: -350px;
				background: #fff;
				padding: 20px;

				.el-icon-close {
					position: absolute;
					right: 10px;
					top: 5px;
					font-size: 30px;
					cursor: pointer;
				}

				.maskMain {
					border: 1px solid #cecece;
					position: relative;
					margin-top: 60px;
					height: 460px;
					width: 100%;
					z-index: 10;
					padding-top: 20px;

					.maskTitle {
						position: absolute;
						width: 150px;
						border: 1px solid #cecece;
						border-bottom: none;
						top: -49px;
						height: 50px;
						line-height: 50px;
						left: -1px;
						z-index: 20;
						text-align: center;
						font-size: 16px;
						background-color: #FFFFFF;
					}

					.mainContent {
						width: 70%;
						height: 50px;
						line-height: 50px;
						margin: 10px auto;

						.mainTtile {
							display: inline-block;
							width: 100px;
							text-align: right;
							margin-right: 20px;
						}

						.mainName {
							display: inline-block;
							width: 100px;
							text-align: center;
						}

						.input {
							width: 260px;
						}
					}

					.bottombtn {
						width: 50%;
						height: 50px;
						margin: 50px auto;

						.btn {
							width: 100px;
							margin-right: 50px;
						}
					}
				}
			}
		}
		.bottom{
			margin-top:20px;
			width:100%;
			.page{
				margin-right:20px;
			}
		}
	}
</style>
