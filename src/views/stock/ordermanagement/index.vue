<template>
	<div class="app-ordermanagement">
		<div class='title'>
			<div class='titleLeft'>
				<el-row>
					<el-col :span="8">
						<div class='titlecontent'>
							<span>店面</span>
							<el-select v-model="shopState" placeholder="全部" class='titleInput'>
								<el-option v-for="item in options1" :key="item.id" :label="item.name" :value="item.id">
								</el-option>
							</el-select>
						</div>
					</el-col>
					<el-col :span="8">
						<div class='titlecontent'>
							<span>状态</span>
							<el-select v-model="orderState" placeholder="全部" class='titleInput'>
								<el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value">
								</el-option>
							</el-select>
						</div>
					</el-col>
					<el-col :span="8">
						<div class='titlecontent'>
							<span>订单ID</span>
							<el-input v-model="orderId" placeholder="请输入内容" class='titleInput'></el-input>
						</div>
					</el-col>
				</el-row>
			</div>
			<el-button type="primary" class='search' @click='handleSerch'>查询</el-button>
			<el-button type="danger" class='clear' @click='handleClear'>清空</el-button>
		</div>
		<div>
			<el-table :data="tableData" border style="width:97%">
				<el-table-column prop="orderNo" label="订单编号">
				</el-table-column>
				<el-table-column prop="payPrice" label="店面">
					<template slot-scope="scope">

						<span>{{orderOrganId(scope.row.organId)}}</span>
					</template>
				</el-table-column>
				<el-table-column label="发货仓库">
					<template slot-scope="scope">
						<span>{{storeroomId(scope.row.storeroomId)}}</span>
					</template>
				</el-table-column>
				<el-table-column label="状态">
					<template slot-scope="scope">
						<span v-if='scope.row.orderStatus==2'>已发货</span>
						<span v-if='scope.row.status!=2'>
							{{scope.row.orderStatus==1?'待发货':''}}
							{{scope.row.orderStatus==4?'已取消':''}}
							{{scope.row.orderStatus==3?'已完成':''}}
						</span>
					</template>
				</el-table-column>
				<el-table-column label="订单时间">
					<template slot-scope="scope">
						<span v-if='scope.row.createdDate'>{{timeData(scope.row.createdDate)}}</span>
						<span v-if='!scope.row.createdDate'>--</span>
					</template>
					
				</el-table-column>
				<el-table-column label="完成时间">
					<template slot-scope="scope">
						<span v-if='scope.row.createdDate'>{{timeData(scope.row.completeDate)}}</span>
						<span v-if='!scope.row.createdDate'>--</span>
					</template>
				</el-table-column>
				<el-table-column prop="lpsOrderNo" label="货品详情">
					<template slot-scope="scope">
						<el-button @click='handleMask(1,scope.row)' type="text" size="small">查看详情</el-button>
					</template>
				</el-table-column>
				<el-table-column label="修改货品">
					<template slot-scope="scope">
						<el-button v-if='scope.row.orderStatus==1'  @click='handleMask(2,scope.row)' type="text" size="small">出库</el-button>
						<el-button  v-if='scope.row.orderStatus==1' @click='handleMask(3,scope.row)' type="text" size="small">取消</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<div class='mask' v-if='isMask'>
			<div class="maskContent">
				<i class="el-icon-close" @click='handleMask(0)'></i>
				<div class='maskMain'>
					<h2 class='maskTitle'>出库</h2>
					<div class='mainContent'>
						<span class='mainTtile'>订单号:</span>
						<span class='mainName'>{{detailData.orderNo}}</span>
					</div>
					<div class='mainContent'>
						<span class='mainTtile'>店面:</span>
						<span class='mainName'>{{orderOrganId(detailData.organId)}}</span>
					</div>
					<div class='mainContent1'>
						<span class='mainTtile'>货品:</span>
						<ul class='orderMain'>
							<li v-for='(item,key) in detailData.goodsList'>
								<span class='orderTitle'>{{key+1}}.</span>
								<span>{{item.goodsName}}(00{{key+1}})</span>
								<span>{{item.quantity}}{{item.unit}}</span>
							</li>
						</ul>
					</div>
					<!-- <div class='mainContent'>
						<span class='mainTtile'>发货仓库:</span>
						<el-select v-model="warehouse" placeholder="全部" class='titleInput'>
							<el-option v-for="item in options3" :key="item.id" :label="item.name" :value="item.id">
							</el-option>
						</el-select>
					</div> -->
					<div class='mainContent'>
						<span class='mainTtile'>运送方式:</span>
						<el-select v-model="sendOut" placeholder="全部" class='titleInput'>
							<el-option v-for="item in options4" :key="item.value" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
					</div>
					<div class='bottombtn'>
						<el-button type="primary" class='btn' @click='handleAll(1)'>出库</el-button>
						<el-button type="primary" class='btn' @click='handleAll(2)'>修改订单</el-button>
						<el-button type="primary" class='btn' @click='handleMask(0)'>取消</el-button>
					</div>
				</div>
			</div>
		</div>
		<div class='mask' v-if='isMask1'>
			<div class="maskContent">
				<i class="el-icon-close" @click='handleEidtClose()'></i>
				<div class='maskMain'>
					<h2 class='maskTitle'>修改订单</h2>
					<div class='orderEitde' v-for='(item,key) in goodsListData'>
						<div class='mainContent'>
							<span class='mainTtile'>货品:</span>
							<el-button type="text" size="small" @click='handleDelete(item.goodsId)'>删除</el-button>
						</div>
						<div class='mainContent' style='height:70px;'>
							<span class='mainTtile'>数量:</span>
							<el-input class='titleInput' ref='num' @blur="handleCheck(key)" :id='item.goodsId'v-model="item.quantity" placeholder="请输入货品数量"></el-input>
							<p class='error' v-if='ishowts[key]'>库存不足</p>
						</div>
					</div>
					<div class='bottombtn1'>
						<el-button type="primary" class='btn' @click='handleEidt()'>修改</el-button>
						<el-button type="primary" class='btn' @click='handleEidtClose()'>取消</el-button>
					</div>
				</div>
			</div>
		</div>
		<div class='mask' v-if='isMask2'>
			<div class="maskContent">
				<i class="el-icon-close" @click='handleMask(0)'></i>
				<div class='maskMain'>
					<h2 class='maskTitle2' @click="handleChange(1)" v-bind:class="{activeTitle:changeTitle==1}">货品详情</h2>
					<h2 class='maskTitle1' @click="handleChange(2)" v-bind:class="{activeTitle:changeTitle==2}">货品详情(原始)</h2>
					<div class='orderdetaile'>
						<p class='detaileTitle' v-if='changeTitle==1'>货品已经被修改，您可以查看原始货品详情</p>
						<p class='detaileTitle1' v-if='changeTitle==2'>
							<span>订单号:<strong>{{originInfoData.orderNo}}</strong></span>
							<strong>{{timeData(originInfoData.createdDate)}}</strong>
						</p>
						<div class='mainContent1'>
							<span class='mainTtile'>货品:</span>
							<ul class='orderMain'>
								<li v-for='(item,key) in originInfoData.goodsList'>
									<span class='orderTitle'>{{key+1}}.</span>
									<span>{{item.goodsName}}(00{{key+1}})</span>
									<span>{{item.quantity}}{{item.unit}}</span>
								</li>
							</ul>
						</div>
					</div>
					<div class='bottombtn1'>
						<el-button type="primary" class='btn' @click='handleMask(0)'>取消</el-button>
					</div>
				</div>
			</div>
		</div>
		<div class='bottom'>
			<el-pagination class='page' @current-change="handleCurrentChange" background layout="prev, pager, next" :total='total'>
			</el-pagination>
		</div>
		<div>

		</div>
	</div>
</template>

<script>
	import {
		orderList,
		orderOrganAll,
		orderDetail,
		orderOutConfirml,
		orderUpdate,
		orderOutCancel
	} from '@/api/shop'
	import {
		storeroomAll,
		goodsDetail,
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
				dataTime: '',
				datatime: [],
				page: 1,
				total: 0,
				isMask: 0,
				isMask1: 0,
				isMask2: 0,
				changeTitle: 1,
				orderId: '',
				orderState: 0,
				shopState: 1,
				awardState: -1,
				warehouse: 1,
				sendOut: 0,
				food: 0,
				showData: {},
				storageQuantity: '',
				storeroomData: [],
				options1: [],
				detailData: {},
				ishowts: [],
				originInfo:{},
				originInfoData:{},
				goodsListData:[],
				isUpdate:false,
				options2: [{
					value: 0,
					label: '全部'
				}, {
					value: 1,
					label: '待发货'
				}, {
					value: 2,
					label: '已发货'
				}, {
					value: 3,
					label: '已完成'
				}, {
					value: 4,
					label: '已取消'
				}],
				options3: [],
				options4: [{
					value: 0,
					label: '自送'
				}, {
					value: 1,
					label: '普通快送'
				}],
				options5: [{
					value: 0,
					label: '猪肉'
				}, {
					value: 1,
					label: '牛肉'
				}],
			}
		},
		created() {
			this.orderOrganAllData();
			this.storeroomAllData();
			this.fetchData();
		},
		methods: {
			fetchData() {
				this.listLoading = true;
				let objList = {
					orderNo: this.orderId,
					orderState: this.orderState,
					organId: this.shopState,
					pageNo: this.page,
					pageSize: 10,
				};
				orderList(objList).then(response => {
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
						this.storeroomData = response.data || [];
						this.options3 = response.data || [];
					} else {
						Message({
							message: response.message || 'Error',
							type: 'error',
							duration: 5 * 1000
						})
					}
				})
			},
			orderOrganAllData() {
				this.listLoading = true;
				let objList = {};
				orderOrganAll(objList).then(response => {
					this.listLoading = false;
					if (response.code == 0) {
						this.options1 = response.data;
					} else {
						Message({
							message: response.message || 'Error',
							type: 'error',
							duration: 5 * 1000
						})
					}
				})
			},
			goodsDetailData(data,index) {
				this.listLoading = true;
				this.isUpdate=true;
				goodsDetail(data).then(response => {
					this.listLoading = false;
					this.isUpdate=false;
					if (response.code == 0) {
						if(response.data.stock<parseInt(this.$refs.num[index].value)){
							this.$set(this.ishowts, index, true);
						}else{
							this.$set(this.ishowts, index, false);
						}
					} else {
						Message({
							message: response.message || 'Error',
							type: 'error',
							duration: 5 * 1000
						})
					}
				})
			},
			orderDetailData() {
				this.listLoading = true;
				let objList = {
					orderNo: this.showData.orderNo
				};
				orderDetail(objList).then(response => {
					this.listLoading = false;
					if (response.code == 0) {
						this.detailData = response.data;
						this.goodsListData=response.data.goodsList;
						this.originInfo=JSON.parse(response.data.originInfo);
						this.originInfoData=response.data;
						this.eidtOrder();
					} else {
						Message({
							message: response.message || 'Error',
							type: 'error',
							duration: 5 * 1000
						})
					}
				})
			},
			orderOutConfirmlData() {
				this.listLoading = true;
				let objList = {
					orderNo: this.showData.orderNo,
					delivery: this.sendOut,
				};
				orderOutConfirml(objList).then(response => {
					this.listLoading = false;
					if (response.code == 0) {
						Message({
							message: '出库成功' || 'Error',
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
			orderUpdateData(data) {
				this.listLoading = true;
				orderUpdate(data).then(response => {
					this.listLoading = false;
					if (response.code == 0) {
						Message({
							message: '修改成功' || 'Error',
							type: 'success',
							duration: 5 * 1000
						});
						this.isMask1 = 0;
						this.isMask = 1;
						this.orderDetailData();
					} else {
						Message({
							message: response.message || 'Error',
							type: 'error',
							duration: 5 * 1000
						})
					}
				})
			},
			orderOutCancelData(id) {
				this.listLoading = true;
				let data={orderNo:id}
				orderOutCancel(data).then(response => {
					this.listLoading = false;
					if (response.code == 0) {
						Message({
							message: '订单取消成功' || 'Error',
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
			storeroomId(index) {
				let name = '';
				for (let i = 0; i < this.storeroomData.length; i++) {
					if (this.storeroomData[i].id == index) {
						name = this.storeroomData[i].name;
					}
				}
				return name;
			},
			orderOrganId(index) {
				let name = '';
				for (let i = 0; i < this.options1.length; i++) {
					if (this.options1[i].id == index) {
						name = this.options1[i].name;
					}
				}
				return name;
			},
			eidtOrder() {
				for (let i = 0; i < this.goodsListData.length; i++) {
					let isno = false;
					this.ishowts.push(isno);
				}
			},
			timeData(time) {
				return parseTime(time, '{y}-{m}-{d} {h}:{i}:{s}');
			},
			handleEidt() {
				let dataArry = [];
				let objData = {};
				for (let j = 0; j < this.detailData.goodsList.length; j++) {
					for (let i = 0; i < this.$refs.num.length; i++) {
						let goodId = this.$refs.num[i].$attrs.id;
						if (this.detailData.goodsList[j].goodsId == goodId) {
							let obj = {};
							obj.stock = this.$refs.num[i].value;
							obj.id = goodId;
							obj.remark = '';
							obj.type = 0
							obj.orderId = this.detailData.goodsList[j].orderId;
							dataArry.push(obj);
						}
					}
				}
				objData.goodsList = dataArry;
				objData.delivery = 0;
				objData.orderNo = this.detailData.orderNo;
				objData.organId = this.detailData.organId;
				objData.storeroomId = this.detailData.storeroomId;
				if(this.ishowts.indexOf(true)>-1){
					Message({
						message: '库存不足，请重新填写' || 'Error',
						type: 'error',
						duration: 5 * 1000
					})
				}else if(!this.isUpdate){
					this.orderUpdateData(objData);
				}
			},
			handleDelete(id){
				let data=[];
				for(let i=0;i<this.goodsListData.length;i++){
					if(this.goodsListData[i].goodsId!=id){
						data.push(this.goodsListData[i])
					}
				}
				this.goodsListData=data;
				this.eidtOrder();
			},
			handleCheck(index){
				let data={
					id:this.detailData.goodsList[index].goodsId,
					orderNo:this.detailData.orderNo
				}
				this.goodsDetailData(data,index);
			},
			handleEidtClose() {
				this.isMask1 = 0;
				this.isMask = 1;
				this.orderDetailData();
			},
			handleSerch() {
				this.fetchData();
			},
			handleClear() {
				this.orderState = 0;
				this.orderId = '';
				this.shopState = 1;
			},
			handleChange(index) {
				this.changeTitle = index;
				if(index==1){
					this.originInfoData=this.detailData;
				}else{
					this.originInfoData=this.originInfo;
				}
			},
			handleMask(index, data) {
				if (index == 0) {
					this.isMask = 0;
					this.isMask1 = 0;
					this.isMask2 = 0;
				} else if (index == 1) {
					this.isMask2 = 1;
					this.showData = data;
					this.orderDetailData();
				} else if (index == 2) {
					this.isMask = 1;
					this.showData = data;
					this.orderDetailData();
				}else if(index==3){
					this.openTip(data.orderNo);
				}
			},
			handleAll(index) {
				if (index == 1) {
					this.orderOutConfirmlData();
				} else if (index == 2) {
					this.isMask1 = 1;
				}
			},
			handleCurrentChange(val) {
				this.page = val;
				this.fetchData();
			},
			//取消订单
			openTip(id) {
				this.$confirm('是否要取消订单', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.orderOutCancelData(id);
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

	.app-ordermanagement {
		padding-left: 50px;

		.stateColor1 {
			color: #409EFF;
		}

		.stateColor2 {
			color: red;
		}

		.title {
			height: 130px;
			width: 97%;
			padding: 15px;
			border: 1px solid #cecece;
			margin: 20px 0;

			.titleLeft {
				width: 75%;
				height: 100px;
				margin-top: 30px;
				float: left;
			}

			.titlecontent {
				float: right;
				margin-right: 30px;
				margin-bottom: 10px;
				height: 50px;

				.titleInput {
					width: 200px;
					margin-left: 20px;
				}
			}

			.search {
				width: 100px;
				float: left;
				margin-top: 30px;
			}

			.clear {
				width: 100px;
				float: left;
				margin-top: 30px;
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
					height: 500px;
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
						cursor: pointer;
					}

					.maskTitle2 {
						position: absolute;
						width: 150px;
						border: 1px solid #cecece;
						top: -49px;
						height: 50px;
						line-height: 50px;
						left: -1px;
						z-index: 20;
						text-align: center;
						font-size: 16px;
						background-color: #FFFFFF;
						cursor: pointer;
					}

					.maskTitle1 {
						position: absolute;
						width: 150px;
						border: 1px solid #cecece;
						top: -49px;
						height: 50px;
						line-height: 50px;
						left: 149px;
						z-index: 20;
						text-align: center;
						font-size: 16px;
						background-color: #FFFFFF;
						cursor: pointer;
					}

					.activeTitle {
						border-bottom: none;
					}

					.orderEitde {
						border-bottom: 1px solid #ceccec;
						margin: 5px 10px;

						.error {
							line-height: 20px;
							color: red;
							font-size: 14px;
							text-align: right;
							margin-right: 90px;
						}
					}

					.orderdetaile {

						.detaileTitle {
							line-height: 50px;
							padding-left: 62px;
							color: #7f7f7f;
						}

						.detaileTitle1 {
							line-height: 50px;
							padding-left: 62px;
							margin-bottom: 10px;
							color: #7f7f7f;

							span {
								display: inline-block;
								margin-right: 100px;
							}

							strong {
								color: #000;
								display: inline-block;
								padding: 0 8px;
							}
						}

						.mainContent1 {
							width: 100%;
							height: 200px;
						}

						.orderMain {
							text-align: center;
							width: 350px;
							height: 200px;

							li {
								height: 50px;
							}
						}

						.totalPrice {
							width: 80%;
							text-align: right;
							margin-top: 20px;

							span {
								display: inline-block;
								padding: 0 10px;
							}
						}

						.bottombtn1 {
							width: 30%;
						}
					}

					.mainContent {
						width: 70%;
						height: 50px;
						line-height: 50px;
						margin: 5px auto;

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

						.titleInput {
							width: 260px;
						}
					}

					.mainContent1 {
						height: 100px;
						width: 70%;
						margin: 10px auto;

						.mainTtile {
							float: left;
							width: 100px;
							text-align: right;
							margin-right: 20px;
						}

						.orderMain {
							float: left;
							overflow-y: scroll;
						}

						li {
							list-style: none;
							height: 30px;

							span {
								display: inline-block;
								width: 80px;
								text-align: center;

							}

							.orderTitle {
								width: 30px;
								text-align: left;
							}
						}
					}

					.bottombtn {
						width: 70%;
						height: 50px;
						margin: 30px auto;

						.btn {
							width: 100px;
							margin-left: 30px;
						}
					}

					.bottombtn1 {
						width: 50%;
						height: 50px;
						margin: 30px auto;

						.btn {
							width: 100px;
							margin-left: 30px;
						}
					}
				}
			}
		}

		.bottom {
			margin-top: 20px;
			width: 100%;

			.page {
				margin-right: 20px;
			}
		}
	}
</style>
