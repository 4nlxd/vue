<template>
	<div class="app-order">
		<div class='titleBtn'>
			<el-button type="success" class='btn' @click='handleHref()'>进货</el-button>
		</div>
		<div class='title'>
			<div class='titleLeft'>
				<el-row>
					<el-col :span="8" :offset='8'>
						<div class='titlecontent'>
							<span>状态</span>
							<el-select v-model="printState" placeholder="全部" class='titleInput'>
								<el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value">
								</el-option>
							</el-select>
						</div>
					</el-col>
					<el-col :span="8">
						<div class='titlecontent'>
							<span>订单ID</span>
							<el-input v-model="userId" placeholder="请输入内容" class='titleInput'></el-input>
						</div>
					</el-col>
				</el-row>
			</div>
			<el-button type="primary" class='search' @click='handleSerch'>查询</el-button>
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
						<span v-if='scope.row.orderStatus!=2'>
							{{scope.row.orderStatus==1?'待发货':''}}
							{{scope.row.orderStatus==3?'已取消':''}}
							{{scope.row.orderStatus==4?'已完成':''}}
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
						<el-button @click='handleMask(1,scope.row)' type="text" size="small">查看</el-button>
					</template>
				</el-table-column>
				<el-table-column label="修改货品">
					<template slot-scope="scope">
						<el-button v-if='scope.row.orderStatus==2' @click='handleMask(2,scope.row)' type="text" size="small">确认到货</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<div class='bottom'>
			<el-pagination class='page' @current-change="handleCurrentChange" background layout="prev, pager, next" :total='total'>
			</el-pagination>
		</div>
		<div class='mask' v-if='isMask'>
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
					<div class='bottombtn'>
						<el-button type="primary" class='btn' @click='handleMask(0)'>取消</el-button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {
		orderList,
		orderOrganAll,
		orderDetail,
		orderInConfirml,
	} from '@/api/shop'
	import {
		storeroomAll,
	} from '@/api/stock'
	import {
		parseTime,
	} from '@/utils/index'
	import {
		getUser
	} from '@/utils/auth'
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
				tableData: null,
				listLoading: true,
				page: 1,
				total: 0,
				isMask: 0,
				changeTitle: 1,
				userId: '',
				orderId: '',
				printState:0,
				organId:1,
				showData: {},
				detailData: {},
				originInfo: {},
				originInfoData: {},
				options1: [],
				storeroomData: [],
				options2: [{
					value:0,
					label: '全部'
				}, {
					value: 1,
					label: '待发货'
				}, {
					value: 2,
					label: '已发货'
				}, {
					value: 3,
					label: '已取消'
				}, {
					value: 4,
					label: '已完成'
				}],
			}
		},
		created() {
			// this.organId=getUser().organs[0].id || 1;
			this.organId=1;
			this.orderOrganAllData();
			this.storeroomAllData();
			this.fetchData();
		},
		methods: {
			fetchData() {
				this.listLoading = true;
				let objList = {
					orderNo: this.orderId,
					orderState: this.printState,
					organId:this.organId,
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
			orderDetailData() {
				this.listLoading = true;
				let objList = {
					orderNo: this.showData.orderNo
				};
				orderDetail(objList).then(response => {
					this.listLoading = false;
					if (response.code == 0) {
						this.detailData = response.data;
						this.originInfo = JSON.parse(response.data.originInfo);
						this.originInfoData = response.data;
					} else {
						Message({
							message: response.message || 'Error',
							type: 'error',
							duration: 5 * 1000
						})
					}
				})
			},
			orderInConfirmlData() {
				this.listLoading = true;
				let objList = {
					orderNo: this.showData.orderNo
				};
				orderInConfirml(objList).then(response => {
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
			timeData(time) {
				return parseTime(time, '{y}-{m}-{d} {h}:{i}:{s}');
			},
			handleMask(index, data) {
				if (index == 0) {
					this.isMask = 0;
				} else if (index == 1) {
					this.isMask = 1;
					this.showData = data;
					this.orderDetailData();
				} else if (index == 2) {
					this.showData = data;
					this.openTip();
				}
			},
			handleHref() {
				this.$router.push({
					path: 'ordergoods',
					name: '订货清单',
					meta: {
						title: '订货清单'
					},
				})
			},
			handleChange(index) {
				this.changeTitle = index;
				if (index == 1) {
					this.originInfoData = this.detailData;
				} else {
					this.originInfoData = this.originInfo;
				}
			},
			handleSerch() {
				this.fetchData();
			},
			handleCurrentChange(val) {
				this.page = val;
				this.fetchData();
			},
			//确认到货
			openTip(id) {
				this.$confirm('是否要确认到货', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.orderInConfirmlData();
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

	.app-order {
		padding-left: 50px;

		.titleBtn {
			width: 97%;
			height: 50px;
			margin-bottom: 50px;

			.btn {
				float: right;
				margin-left: 30px;
				margin-top: 30px;
			}
		}

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
				width: 85%;
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
							height: 100px;
							width: 100%;
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

						.totalPrice {
							width: 80%;
							text-align: right;
							margin-top: 20px;

							span {
								display: inline-block;
								padding: 0 10px;
							}
						}

					}


					.bottombtn {
						width: 30%;
						height: 50px;
						margin: 30px auto;

						.btn {
							width: 100px;
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
