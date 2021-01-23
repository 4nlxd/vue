<template>
	<div class="app-ordergoods">
		<div class='title'>
			<div class='titleLeft'>
				<el-row>
					<el-col :span="10">
						<div class='titlecontent'>
							<span>仓库</span>
							<el-select class='titleInput' v-model="value" placeholder="请选择" @change="handleChange()">
								<el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id">
								</el-option>
							</el-select>
						</div>
					</el-col>
					<el-col :span="10">
						<div class='titlecontent'>
							<span>货品名称</span>
							<el-input v-model="goodsName" placeholder="请输入内容" class='titleInput'></el-input>
						</div>
					</el-col>
				</el-row>
			</div>
			<el-button type="primary" class='search' @click='handleSerch'>查询</el-button>
			<!-- <el-button type="danger" class='clear' @click='handleClear'>清空</el-button> -->
		</div>
		<div class='contentMain'>
			<el-table :data="tableData" border style="width: 75%;float:left;">
				<el-table-column prop="id" label="货品ID">
				</el-table-column>
				<el-table-column prop="name" label="货品">
				</el-table-column>
				<el-table-column label="出货价格">
					<template slot-scope="scope">
						<span>￥{{scope.row.price}}</span>
					</template>
				</el-table-column>
				<el-table-column label="库存量">
					<template slot-scope="scope">
						<span class='color' v-if='scope.row.stock==0'>{{scope.row.stock}}沽清</span>
						<span v-if='scope.row.stock>0'>{{scope.row.stock}}</span>
					</template>
				</el-table-column>
				<el-table-column prop="unit" label="单位">
				</el-table-column>
				<el-table-column label="状态">
					<template slot-scope="scope">
						<span class='color' v-if='scope.row.stockStatus==0'>暂停</span>
						<span v-if='scope.row.stockStatus==1'>正常</span>
					</template>
				</el-table-column>
				<el-table-column label="修改货品">
					<template slot-scope="scope">
						<el-button @click='handleMask(1,scope.row)' v-if='scope.row.stockStatus==1' type="text" size="small">订货</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class='mainprice'>
				<div class='mainTitle'>
					订货清单
				</div>
				<ul class='mainList'>
					<li v-for='(item,key) in totalDate'>
						<span class='mainBt'>{{key+1}}.</span>
						<span>
							<strong>{{item.name}}</strong><br>
							<i>{{item.storageQuantity}}{{item.unit}}&nbsp;</i>
						</span>
						<i class="el-icon-close" @click='handleCelear(key)'></i>
					</li>
				</ul>
				<div class='mianBottom'>
					<el-button type="primary" class='btn' @click='handleAdd(2)'>下单</el-button>
					<el-button type="danger" @click='handleAdd(0)'>清空</el-button>
				</div>
			</div>

		</div>
		<div class='mask' v-if='isMask'>
			<div class="maskContent">
				<i class="el-icon-close" @click='handleMask(0)'></i>
				<div class='maskMain'>
					<h2 class='maskTitle'>订购货品</h2>
					<div class='mainContent'>
						<span class='mainTtile'>货品:</span>
						<span class='mainName'>{{showData.name}}</span>
					</div>
					<div class='mainContent'>
						<span class='mainTtile'>库存:</span>
						<span class='mainName'>{{showData.stock}}</span>
					</div>
					<div class='mainContent'>
						<span class='mainTtile'>单位:</span>
						<span class='mainName'>{{showData.unit}}</span>
					</div>
					<div class='mainContent'>
						<span class='mainTtile'>订购数量:</span>
						<el-input class='input' v-model="storageQuantity" placeholder="请输入内容"></el-input>
					</div>
					<div class='bottombtn'>
						<el-button type="primary" class='btn' @click='handleAdd(1)'>添加</el-button>
						<el-button type="primary" class='btn' @click='handleMask(0)'>取消</el-button>
					</div>
				</div>
			</div>
		</div>
		<div class='mask' v-if='isMask1'>
			<div class="maskContent">
				<i class="el-icon-close" @click='handleMask(0)'></i>
				<div class='maskMain'>
					<h2 class='maskTitle'>确认下单</h2>
					<div class='orderdetaile'>
						<div class='mainContent1'>
							<span class='mainTtile'>货品:</span>
							<ul class='orderMain'>
								<li v-for='(item,key) in totalDate'>
									<span class='orderTitle'>{{key+1}}.</span>
									<span>{{item.name}}(00{{key+1}})</span>
									<span>{{item.storageQuantity}}{{item.unit}}</span>
								</li>
							</ul>
						</div>
					</div>
					<div class='bottombtn1'>
						<el-button type="primary" class='btn' @click='handleOrder()'>确认下单</el-button>
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
		storeroomAll,
		getList,
	} from '@/api/stock'
	import {
		orderAdd,
	} from '@/api/shop'
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
				isMask: 0,
				isMask1: 0,
				page: 1,
				total: 0,
				goodsName: '',
				ticketId: '',
				orderId: '',
				awardState: -1,
				printState: -1,
				storageQuantity: '',
				value: 1,
				options: [],
				showData: {},
				totalDate: [],
				totalPrice: 0,
			}
		},
		created() {
			const end = new Date()
			this.dataTime = end;
			this.storeroomAllData();
			this.fetchData();
		},
		methods: {
			fetchData() {
				this.listLoading = true;
				let data = {
					pageNo: this.page,
					pageSize: 10,
					roomId: this.value,
					name:this.goodsName,
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
			orderAddData(data) {
				this.listLoading = true;
				orderAdd(data).then(response => {
					this.listLoading = false;
					if (response.code == 0) {
						Message({
							message: '下单成功' || 'Error',
							type: 'success',
							duration: 5 * 1000
						});
						this.isMask1=0;
						this.totalDate=[];
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
			handleMask(index, data) {
				if (index == 0) {
					this.isMask = 0;
					this.isMask1=0;
				} else if (index == 1) {
					this.isMask = 1;
					this.storageQuantity = '';
					this.showData = data;
				}
			},
			handleSerch() {
				this.fetchData();
			},
			handleClear() {
				this.goodsName = '';
				this.value=1;
			},
			handleCurrentChange(val) {
				this.page = val;
				this.fetchData();
			},
			handleAdd(index) {
				if(index==0){
					this.totalDate=[];
				}else if (index == 1 && this.SubmitTips()) {
					let num = 0;
					let ishas=0;
					if (this.totalDate.length == 0) {
						if(parseInt(this.storageQuantity)>parseInt(this.showData.stock)){
							Message({
								message: '订货数量超过了库存',
								type: 'error',
								duration: 2 * 1000
							});
							return;
						}
						console.log(this.showData);
						this.showData.value = this.value;
						this.showData.storageQuantity = this.storageQuantity;
						this.showData.singlePrice=this.storageQuantity*this.showData.price;
						this.totalPrice=this.showData.singlePrice;
						this.totalDate.push(this.showData);
						console.log(this.totalDate);
					} else {
						this.totalPrice=0;
						for (let i = 0; i < this.totalDate.length; i++) {
							if (this.totalDate[i].value != this.value) {
								num++
							}
							if (this.totalDate[i].id == this.showData.id) {
								if((parseInt(this.totalDate[i].storageQuantity)+parseInt(this.storageQuantity))>parseInt(this.showData.stock)){
									Message({
										message: '订货数量超过了库存',
										type: 'error',
										duration: 2 * 1000
									});
									return;
								}else{
									this.totalDate[i].storageQuantity=parseInt(this.totalDate[i].storageQuantity)+parseInt(this.storageQuantity);
								    this.totalDate[i].singlePrice=this.totalDate[i].storageQuantity*this.totalDate[i].price;
								    ishas++;
								}
							}
							
							this.totalPrice=parseInt(this.totalPrice)+parseInt(this.totalDate[i].singlePrice);
						}
						if (num > 0) {
							Message({
								message: '订货清单必须为同一仓库',
								type: 'error',
								duration: 2 * 1000
							});
							return;
						} else if(ishas==0){
							this.showData.value = this.value;
							this.showData.storageQuantity = this.storageQuantity;
							this.showData.singlePrice=this.storageQuantity*this.showData.price;
							this.totalPrice=parseInt(this.totalPrice)+parseInt(this.showData.singlePrice);
							this.totalDate.push(this.showData);
						}
					}
					this.isMask = 0;
				}else if(index==2){
					if(this.totalDate.length>0){
						this.isMask1=1;
					}
				}
			},
			handleCelear(index) {
				this.totalDate.splice(index, 1);
			},
			handleOrder() {
				let dataArr = [];
				let data={};
				if (this.totalDate.length > 0) {
					for (let i = 0; i < this.totalDate.length; i++) {
						let dataObj = {
							"id": this.totalDate[i].id,
							"orderId": 0,
							"remark": "",
							"stock":this.totalDate[i].storageQuantity,
							"type": 0
						}
						dataArr.push(dataObj)
					}
				   data.goodsList=dataArr;
				   data.organId=1;
				   data.storeroomId=this.totalDate[0].value;
				  this.orderAddData(data);
				} else {
					Message({
						message: '请订货',
						type: 'error',
						duration: 2 * 1000
					});
				}
			},
			SubmitTips() {
				if (!this.storageQuantity) {
					Message({
						message: '请填写订购数量',
						type: 'error',
						duration: 2 * 1000
					});
					return
				};
				return true;
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

		.contentMain {
			width: 97%;
			height: 550px;

			.color {
				color: red;
			}

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
					.bottomprice {
						line-height: 50px;
						padding-left: 10px;
					}

					padding-left: 22%;

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

					.orderdetaile {
						.mainContent1 {
							width: 100%;
							height: 200px;
							margin: 20px auto;

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

						.orderMain {
							text-align: center;
							width: 350px;
							height: 200px;

							li {
								height: 50px;
								list-style: none;
							}
						}

						.totalPrice {
							width: 80%;
							text-align: right;
							margin-top: 40px;

							span {
								display: inline-block;
								padding: 0 10px;
							}
						}

					}

					.bottombtn1 {
						width: 30%;
						margin: 0 auto;
						margin-top: 30px;
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
