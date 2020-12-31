<template>
	<div class="app-ordermanagement">
		<div class='title'>
			<div class='titleLeft'>
				<el-row>
					<el-col :span="8">
						<div class='titlecontent'>
							<span>店面</span>
							<el-select v-model="printState" placeholder="全部" class='titleInput'>
								<el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value">
								</el-option>
							</el-select>
						</div>
					</el-col>
					<el-col :span="8">
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
			<el-button type="danger" class='clear' @click='handleClear'>清空</el-button>
		</div>
		<div>
			<el-table :data="tableData" border style="width:97%">
				<el-table-column prop="printDate" label="出票时间">
				</el-table-column>
				<el-table-column prop="ticketId" label="票号" width='300'>
				</el-table-column>
				<el-table-column prop="payPrice" label="票面价格">
				</el-table-column>
				<el-table-column prop="successCnt" label="彩站名称" width='300'>
				</el-table-column>
				<el-table-column prop="payOrderName" label="出票状态">

				</el-table-column>
				<el-table-column label="中奖金额">
					<template slot-scope="scope">
						<span class='stateColor1' v-if="(scope.row.winAmount==0 && scope.row.state==2)">未中奖</span>
						<span class='stateColor2' v-if="(scope.row.winAmount>0)">￥{{scope.row.winAmount}}</span>
						<span v-if="( scope.row.state==1)">未开奖</span>
						<span v-if="( scope.row.state==0)">出票失败</span>
					</template>
				</el-table-column>
				<el-table-column prop="uid" label="用户ID">
				</el-table-column>
				<el-table-column prop="lpsOrderNo" label="订单号" width='300'>
				</el-table-column>
			</el-table>
		</div>
		<div class='mask' v-if='isMask1'>
			<div class="maskContent">
				<i class="el-icon-close"></i>
				<div class='maskMain'>
					<h2 class='maskTitle'>出库</h2>
					<div class='mainContent'>
						<span class='mainTtile'>订单号:</span>
						<span class='mainName'>1</span>
					</div>
					<div class='mainContent'>
						<span class='mainTtile'>金额:</span>
						<span class='mainName'>猪肉</span>
					</div>
					<div class='mainContent'>
						<span class='mainTtile'>店面:</span>
						<span class='mainName'>300</span>
					</div>
					<div class='mainContent1'>
						<span class='mainTtile'>货品:</span>
						<ul class='orderMain'>
							<li>
								<span class='orderTitle'>1.</span>
								<span>猪肉(001)</span>
								<span>500</span>
								<span>500$</span>
							</li>
							<li>
								<span class='orderTitle'>1.</span>
								<span>猪肉(001)</span>
								<span>500</span>
								<span>500$</span>
							</li>
							<li>
								<span class='orderTitle'>1.</span>
								<span>猪肉(001)</span>
								<span>500</span>
								<span>500$</span>
							</li>
						</ul>
					</div>
					<div class='mainContent'>
						<span class='mainTtile'>发货仓库:</span>
						<el-select v-model="warehouse" placeholder="全部" class='titleInput'>
							<el-option v-for="item in options3" :key="item.value" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
					</div>
					<div class='mainContent'>
						<span class='mainTtile'>运送方式:</span>
						<el-select v-model="sendOut" placeholder="全部" class='titleInput'>
							<el-option v-for="item in options4" :key="item.value" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
					</div>
					<div class='bottombtn'>
						<el-button type="primary" class='btn'>出库</el-button>
						<el-button type="primary" class='btn'>修改订单</el-button>
						<el-button type="primary" class='btn'>取消</el-button>
					</div>
				</div>
			</div>
		</div>
		<div class='mask' v-if='isMask1'>
			<div class="maskContent">
				<i class="el-icon-close"></i>
				<div class='maskMain'>
					<h2 class='maskTitle'>修改订单</h2>
					<div class='orderEitde'>
						<div class='mainContent'>
							<span class='mainTtile'>货品:</span>
							<el-button  type="text" size="small">删除</el-button>
						</div>
						<div class='mainContent'>
							<span class='mainTtile'>货品:</span>
							<el-select v-model="sendOut" placeholder="全部" class='titleInput'>
								<el-option v-for="item in options5" :key="item.value" :label="item.label" :value="item.value">
								</el-option>
							</el-select>
						</div>
						<div class='mainContent' style='height:70px;'>
							<span class='mainTtile'>数量:</span>
							<el-input class='titleInput' v-model="storageQuantity" placeholder="请输入内容"></el-input>
							<p class='error'>库存不足</p>
						</div>
					</div>
					<div class='bottombtn1'>
						<el-button type="primary" class='btn'>修改</el-button>
						<el-button type="primary" class='btn'>取消</el-button>
					</div>
				</div>
			</div>
		</div>
		<div class='mask' v-if='isMask2'>
			<div class="maskContent">
				<i class="el-icon-close"></i>
				<div class='maskMain'>
					<h2 class='maskTitle2' @click="handleChange(1)" v-bind:class="{activeTitle:changeTitle==1}">货品详情</h2>
					<h2 class='maskTitle1' @click="handleChange(2)" v-bind:class="{activeTitle:changeTitle==2}">货品详情(原始)</h2>
					<div class='orderdetaile'>
						<p class='detaileTitle'  v-if='changeTitle==1'>货品已经被修改，您可以查看原始货品详情</p>
						<p class='detaileTitle1' v-if='changeTitle==2'>
							<span>订单号:<strong>D000000001</strong></span>
							<strong>2020/11/1 13:00:00</strong>
						</p>
						<div class='mainContent1'>
							<span class='mainTtile'>货品:</span>
							<ul class='orderMain'>
								<li>
									<span class='orderTitle'>1.</span>
									<span>猪肉(001)</span>
									<span>500</span>
									<span style='color:red;'>500$</span>
								</li>
								<li>
									<span class='orderTitle'>1.</span>
									<span>猪肉(001)</span>
									<span>500</span>
									<span>500$</span>
								</li>
								<li>
									<span class='orderTitle'>1.</span>
									<span>猪肉(001)</span>
									<span>500</span>
									<span>500$</span>
								</li>
							</ul>
						</div>
					 <div class='totalPrice'>
						<span>合计:</span>
						<span style='color:red'>￥50000</span>
					 </div>
					</div>
					<div class='bottombtn1'>
						<el-button type="primary" class='btn'>取消</el-button>
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
	// import {
	// 	ticketsOrderDetail
	// } from '@/api/documentary'
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
				tableData: null,
				listLoading: true,
				dataTime: '',
				datatime: [],
				page: 1,
				total: 0,
				isMask:0,
				isMask1:0,
				isMask2:0,
				changeTitle:1,
				userId: '',
				ticketId: '',
				orderId: '',
				awardState: -1,
				printState: -1,
				warehouse:0,
				sendOut:0,
				food:0,
				storageQuantity:'',
				options1: [{
					value: -1,
					label: '全部'
				}, {
					value: 0,
					label: '朝阳店'
				}],
				options2: [{
					value: -1,
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
				options3: [{
					value: 0,
					label: '华北仓库'
				}, {
					value: 1,
					label: '华南仓库'
				}],
				options4: [{
					value:0,
					label: '自送'
				}, {
					value: 1,
					label: '普通快送'
				}],
				options5: [{
					value:0,
					label: '猪肉'
				}, {
					value: 1,
					label: '牛肉'
				}],
			}
		},
		created() {

			const end = new Date()
			this.dataTime = end;
			this.fetchData();
		},
		methods: {
			fetchData() {
				this.listLoading = true;
				let startDate = parseTime(this.dataTime, '{y}-{m}-{d}');
				let uid = this.userId == '' ? 0 : this.userId
				let objList = {
					date: startDate,
					uid: uid,
					ticketId: this.ticketId,
					orderNo: this.orderId,
					awartState: this.awardState,
					printState: this.printState,
					pn: this.page
				};
				ticketsOrderDetail(objList).then(response => {
					this.listLoading = false;
					if (response.code == 0) {
						this.tableData = this.dataList(response.data.list);
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
			dataList(list) {
				list.map(function(item) {
					item.payPrice = '￥' + item.multi * 2;
					if (item.printState == 0) {
						item.payOrderName = '未出票'
					} else if (item.printState == 1) {
						item.payOrderName = '已出票'
					} else {
						item.payOrderName = '';
					}
				});
				return list;
			},
			handleSerch() {
				this.fetchData();
			},
			handleClear() {
				this.userId = '';
				this.ticketId = '';
				this.orderId = '';
				this.awardState = -1;
				this.printState = -1;
				const end = new Date();
				this.dataTime = end;
			},
			handleChange(index){
				this.changeTitle=index;
			},
			handleCurrentChange(val) {
				this.page = val;
				this.fetchData();
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
					.activeTitle{
						border-bottom: none;
					}
                    .orderEitde{
						border-bottom: 1px solid #ceccec;
						margin:5px 10px;
						.error{
							line-height:20px;
							color:red;
							font-size:14px;
							text-align: right;
							margin-right:90px;
						}
					}
					.orderdetaile{
						
						.detaileTitle{
							line-height:50px;
							padding-left:62px;
							color:#7f7f7f;
						}
						.detaileTitle1{
							line-height:50px;
							padding-left:62px;
							margin-bottom:10px;
							color:#7f7f7f;
							span{
								display: inline-block;
								margin-right:100px;
							}
							strong{
								color:#000;
								display: inline-block;
								padding:0 8px;
							}
						}
						.mainContent1{
							width: 100%;
							height:200px;
						}
						.orderMain{
							text-align: center;
							width:350px;
							height:200px;
							li{
								height:50px;
							}
						}
						.totalPrice{
							 width:80%;
							 text-align: right;
							 margin-top:20px;
							 span{
								 display: inline-block;
								 padding: 0 10px;
							 }
						}
						.bottombtn1{
							width:30%;
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
						margin:5px auto;
						.mainTtile {
							float:left;
							width: 100px;
							text-align: right;
							margin-right: 20px;
						}
                        .orderMain{
							float:left;
							overflow-y: scroll;
						}
						li {
							list-style: none;
							height:30px;
							span {
								display: inline-block;
								width: 80px;
								text-align: center;
								
							}
							.orderTitle{
								width:30px;
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
					.bottombtn1{
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
