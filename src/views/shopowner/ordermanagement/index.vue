<template>
	<div class="app-order">
		<div class='titleBtn'>
			<el-button type="success" class='btn' >增加货品</el-button>
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
				page: 1,
				total: 0,
				userId: '',
				ticketId: '',
				orderId: '',
				awardState: -1,
				printState: -1,
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

	.app-order{
		padding-left: 50px;
         .titleBtn{
         	width:97%;
         	height:50px;
			margin-bottom:50px;
         	.btn{
         		float:right;
         		margin-left:30px;
         		margin-top:30px;
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
				margin-top:30px;
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

		.bottom {
			margin-top: 20px;
			width: 100%;

			.page {
				margin-right: 20px;
			}
		}
	}
</style>
