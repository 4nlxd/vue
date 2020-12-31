<template>
	<div class="app-ordergoods">
		<div class='title'>
			<div class='titleLeft'>
				<el-row>
					<el-col :span="10" :offset='12'>
						<div class='titlecontent'>
							<span>货品名称</span>
							<el-input v-model="userId" placeholder="请输入内容" class='titleInput'></el-input>
						</div>
					</el-col>
				</el-row>
			</div>
			<el-button type="primary" class='search' @click='handleSerch'>查询</el-button>
			<el-button type="danger" class='clear' @click='handleClear'>清空</el-button>
		</div>
		<div class='contentMain'>
			<el-table :data="tableData" border style="width:75%;float:left;">
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
			<div class='mainprice'>
				<div class='mainTitle'>
					订货清单
				</div>
				<ul class='mainList'>
					<li>
						<span class='mainBt'>1.</span>
						<span>
							<strong>猪肉</strong><br>
							<i>500斤&nbsp;￥1000.00</i>
						</span>
						<i class="el-icon-close"></i>
					</li>
				</ul>
				<div class='mianBottom'>
					<p class='bottomprice'>合计金额:&nbsp;<strong>￥5000.00</strong></p>
					<el-button type="primary" class='btn'>下单</el-button>
					<el-button type="danger">清空</el-button>
				</div>
			</div>

		</div>
		<div class='mask' v-if='isMask'>
			<div class="maskContent">
				<i class="el-icon-close"></i>
				<div class='maskMain'>
					<h2 class='maskTitle'>订购货品</h2>
					<div class='mainContent'>
						<span class='mainTtile'>货品:</span>
						<span class='mainName'>猪肉</span>
					</div>
					<div class='mainContent'>
						<span class='mainTtile'>库存:</span>
						<span class='mainName'>300</span>
					</div>
					<div class='mainContent'>
						<span class='mainTtile'>单位:</span>
						<span class='mainName'>公斤</span>
					</div>
					<div class='mainContent'>
						<span class='mainTtile'>订购数量:</span>
						<el-input class='input' v-model="storageQuantity" placeholder="请输入内容"></el-input>
					</div>
					<div class='bottombtn'>
						<el-button type="primary" class='btn'>添加</el-button>
						<el-button type="primary" class='btn' @click='handleMask(0)'>取消</el-button>
					</div>
				</div>
			</div>
		</div>
		<div class='mask' v-if='isMask1'>
			<div class="maskContent">
				<i class="el-icon-close"></i>
				<div class='maskMain'>
					<h2 class='maskTitle'>确认下单</h2>
					<div class='orderdetaile'>
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
						<el-button type="primary" class='btn'>确认下单</el-button>
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
				isMask:0,
				isMask1:0,
				page: 1,
				total: 0,
				userId: '',
				ticketId: '',
				orderId: '',
				awardState: -1,
				printState: -1,
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

	.app-ordergoods {
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

		.contentMain {
			width: 97%;
			height: 550px;

			.mainprice {
				float: left;
				margin-left: 5%;
				width: 20%;
				height: 500px;

				border: 1px solid #cecece;

				.mainTitle {
					height: 50px;
					line-height: 50px;
					border-bottom: 1px solid #cecece;
					text-align: center;
				}

				.mainList {
					padding: 10px 30px;
					overflow-y: auto;
					height: 330px;

					li {
						height: 80px;
						position: relative;
						list-style: none;
						border-bottom: 1px solid #cecece;

						.mainBt {
							display: inline-block;
							width: 40px;
						}

						strong {
							display: inline-block;
							width: 60px;
							line-height: 40px;
						}

						i {
							font-style: normal;
							display: inline-block;
							width: 200px;
							margin-left: 42px;
						}

						.el-icon-close {
							position: absolute;
							right: 10px;
							top: 2px;
							color: red;
							width: 10px;
							height: 10px;
							cursor: pointer;
							font-size: 14px;
							font-weight: bold;
						}
					}
				}

				.mianBottom {
					.bottomprice{
						line-height: 50px;
						padding-left:10px;
					}
					padding-left: 65px;

					.btn {
						margin-right: 30px;
					}
				}

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
                    .orderdetaile{
                    	.mainContent1{
                    		width: 100%;
                    		height:200px;
							margin:20px auto;
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
                    	.orderMain{
                    		text-align: center;
                    		width:350px;
                    		height:200px;
                    		li{
                    			height:50px;
								list-style: none;
                    		}
                    	}
                    	.totalPrice{
                    		 width:80%;
                    		 text-align: right;
                    		 margin-top:40px;
                    		 span{
                    			 display: inline-block;
                    			 padding: 0 10px;
                    		 }
                    	}
                    	
                    }
					.bottombtn1{
                    		width:30%;
							margin: 0 auto;
							margin-top:30px;
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
		.bottom {
			margin-top: 20px;
			width: 100%;

			.page {
				margin-right: 20px;
			}
		}
	}
</style>
