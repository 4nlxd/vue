<template>
	<div class="app-flowofgoods">
		<div class='title'>
			<div class='titleLeft'>
				<el-row>
					<el-col :span="12">
						<div class='titlecontent'>
							<span>日期</span>
							<el-date-picker class='endState1' v-model="datatime" type="daterange" range-separator="至" start-placeholder="开始日期"
							 end-placeholder="结束日期">
							</el-date-picker>
						</div>
					</el-col>
					<el-col :span="12">
						<div class='titlecontent'>
							<span>货品</span>
							<el-select v-model="goods" placeholder="全部" class='titleInput' filterable >
								<el-option v-for="item in optionsShow" :key="item.id" :label="item.name" :value="item.id" >
								</el-option>
							</el-select>
						</div>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<div class='titlecontent'>
							<span>仓库</span>
							<el-select class='titleInput1' v-model="roomId" placeholder="请选择" @change="handleChange()">
								<el-option v-for="item in options2" :key="item.id" :label="item.name" :value="item.id">
								</el-option>
							</el-select>
						</div>
					</el-col>
					<el-col :span="12">
						<div class='titlecontent'>
							<span>操作类型</span>
							<el-select v-model="operationType" placeholder="全部" class='titleInput'>
								<el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value">
								</el-option>
							</el-select>
						</div>
					</el-col>

				</el-row>
			</div>
			<el-button type="primary" class='search' @click='handleSerch'>查询</el-button>
			<el-button type="danger" class='clear' @click='handleClear'>清空</el-button>
		</div>
		<div>
			<el-table :data="tableData" border style="width:97%">
				<el-table-column prop="created" label="操作">
					<template slot-scope="scope">
						<span>
						{{scope.row.type==1?'入库':''}}
						{{scope.row.type==2?'后台修改':''}}
						{{scope.row.type==3?'出库':''}}
						{{scope.row.type==4?'下单冻结':''}}
						{{scope.row.type==5?'取消解冻':''}}
						{{scope.row.type==6?'修改订单':''}}
						</span>
					</template>
				</el-table-column>
				<el-table-column prop="remark" label="说明">
				</el-table-column>
				<el-table-column prop="goodsName" label="货品">
				</el-table-column>
				<el-table-column label="数量">
					<template slot-scope="scope">
						<span v-if='scope.row.stock<0' class='color'>{{scope.row.stock}}</span>
						<span v-if='scope.row.stock>=0'>{{scope.row.stock}}</span>
					</template>
				</el-table-column>
				<el-table-column prop="unit" label="单位">
				</el-table-column>
				<el-table-column prop="mobile" label="时间">
					<template slot-scope="scope">
						<span>{{timeData(scope.row.createdDate)}}</span>
					</template>
				</el-table-column>
                <el-table-column  label="订单">
                	<template slot-scope="scope">
                		<el-button @click='handleSucess(scope.row)' type="text" size="small">查看订单</el-button>
                	</template>
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
	import {
		goodsStockhistoryList,
		goodsAllList,
		storeroomAll,
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
				tableData: null,
				listLoading: true,
				datatime: [],
				page: 1,
				total: 0,
				goods: 0,
				operationType: 0,
				creatPage: '',
				options2: [],
				roomId: 1,
				optionsShow: [],
				options1: [{
					value: 0,
					label: '全部'
				}, {
					value: 1,
					label: '出库'
				}, {
					value: 2,
					label: '后台修改'
				}, {
					value: 3,
					label: '入库'
				},{
					value: 4,
					label: '下单冻结'
				}, {
					value: 5,
					label: '取消解冻'
				}, {
					value: 6,
					label: '修改订单'
				}],
			}
		},
		created() {
			const end = new Date()
			const start = new Date().setTime(new Date(new Date().getFullYear(), new Date().getMonth(), 1))
			this.datatime = [start, end];
			this.storeroomAllData();
			this.fetchData();
		},
		methods: {
			fetchData() {
				this.listLoading = true;
				let startDate = parseTime(this.datatime[0], '{y}-{m}-{d} {h}:{i}:{s}');
				let endDate = parseTime(this.datatime[1], '{y}-{m}-{d} {h}:{i}:{s}');
				let uid = this.userId == '' ? 0 : this.userId
				let objList = {
					startDate: startDate,
					endDate: endDate,
					goodsId: this.goods,
					storeroomId:this.roomId,
					type:this.operationType,
					pageSize: 10,
					pageNo: this.page
				};
				goodsStockhistoryList(objList).then(response => {
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
			goodsAllListData() {
				this.listLoading = true;
				let data = {
					roomId: this.roomId,
				}
				goodsAllList(data).then(response => {
					this.listLoading = false;
					if (response.code == 0) {
						let arry = [{
							name: '全部',
							id: 0,
						}]
						this.optionsAll = arry.concat(response.data);
						this.optionsShow = arry.concat(response.data);
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
						this.options2 = response.data || [];
						this.goodsAllListData();
					} else {
						Message({
							message: response.message || 'Error',
							type: 'error',
							duration: 5 * 1000
						})
					}
				})
			},
			handleSerch() {
				this.fetchData();
			},
			handleChange(){
				this.storeroomAllData();
			},
			timeData(time) {
				return parseTime(time, '{y}-{m}-{d} {h}:{i}:{s}');
			},
			handleClear() {
				this.roomId =1;
				this.operationType = 0;
				this.goods = 0;
				const end = new Date();
				const start = new Date().setTime(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
				this.datatime = [start, end];
			},
			handleCurrentChange(val) {
				this.page = val;
				this.fetchData();
			},
			handleSucess(val) {
				this.$router.push({
					path: 'ordermanagement/',
					name: '订单管理',
					meta: {
						title: '订单管理'
					},
					// params: {
					// 	dataTime: val.created
					// }
				})
			},
		}

	}
</script>
<style lang="scss">
	* {
		margin: 0;
		padding: 0
	}

	.app-flowofgoods {
		padding-left: 50px;

		.stateColor1 {
			color: #409EFF;
		}

		.stateColor2 {
			color: red;
		}
         .color{
			 color:red;
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
				float: left;
			}

			.titlecontent {
				float: right;
				margin-right: 30px;
				margin-bottom: 10px;
				height: 50px;

				.titleInput {
					width: 260px;
					margin-left: 20px;
				}

				.titleInput1 {
					width: 350px;
					margin-left: 20px;
				}

				.endState1 {
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
