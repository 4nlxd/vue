<template>
	<div>
		<router-view></router-view>
		<div class="app-documentary" v-if='isShow'>
			<div class="documentarytitle">
				<el-row>
					<el-col :span="18">
						<ul>
							<li v-bind:class="{active:isStyle==0}" @click="switchTable(0)">销售中跟单</li>
							<li v-bind:class="{active:isStyle==1}" @click="switchTable(1)">已截止跟单</li>
						</ul>
					</el-col>
					<el-col :span="6">
						<el-button type="primary" class='btn' @click='maksIsShow(1)'>创建在售方案</el-button>
					</el-col>
				</el-row>
			</div>
			<div class="documentaryContent">
				<el-table :data="tableData" border style="width: 97%" v-show="isStyle==0">
					<el-table-column prop="period" label="期数">
					</el-table-column>
					<el-table-column prop="name" label="方案名称">
					</el-table-column>
					<el-table-column prop="displayTime" label="创建时间">
					</el-table-column>
					<el-table-column prop="expiredTime" label="购买截止时间">
					</el-table-column>
					<el-table-column  label="预售方案">
						<template slot-scope="scope">
							<span class='active1' v-if='scope.row.presale==1'>是</span>
							<span v-if='scope.row.presale==0'>否</span>
						</template>
					</el-table-column>
					<el-table-column label="出票状态">
						<template slot-scope="scope">
							<span class='active1' v-if='scope.row.ticketState==1'>已出票</span>
							<span v-if='scope.row.ticketState==0'>未出票</span>
						</template>
					</el-table-column>
					<el-table-column  label="暂停状态">
						<template slot-scope="scope">
							<span class='active1' v-if='scope.row.saleState==0'>已暂停</span>
							<span v-if='scope.row.saleState==1'>正常</span>
						</template>
					</el-table-column>
					<el-table-column  label="准确率">
						<template slot-scope="scope">
							<span>{{scope.row.rating}}%</span>
						</template>
					</el-table-column>
					<el-table-column  label="已购金额">
						<template slot-scope="scope">
							<span>￥{{scope.row.price}}</span>
						</template>
					</el-table-column>
					<el-table-column label="操作">
						<template slot-scope="scope">
							<el-button @click="route(scope.row.schemePackageId)" type="text" size="small">查看详情</el-button>
						</template>
					</el-table-column>
				</el-table>
				<el-table :data="tableData1" border style="width: 97%" v-show="isStyle==1">
					<el-table-column prop="period" label="期数">
					</el-table-column>
					<el-table-column prop="name" label="方案名称">
					</el-table-column>
					<el-table-column  label="跟单金额">
						<template slot-scope="scope">
							<span>￥{{scope.row.price}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="displayTime" label="创建时间">
					</el-table-column>
					<el-table-column prop="expiredTime" label="购买截止时间">
					</el-table-column>
					<el-table-column  label="中奖状态">
						<template slot-scope="scope">
							<span class='active1' v-if='scope.row.awardState==1'>中奖</span>
							<span v-if='scope.row.awardState==2'>未中奖</span>
							<span v-if='scope.row.awardState==0 && scope.row.saleState!=-1'>待开奖</span>
							<span v-if='scope.row.saleState==-1'>已关闭</span>
						</template>
					</el-table-column>
					<el-table-column  label="中奖金额">
						<template slot-scope="scope">
							<span class='active1' v-if='scope.row.awardAmount>0'>￥{{scope.row.awardAmount}}</span>
							<span v-if='scope.row.awardAmount==0'>--</span>
						</template>
					</el-table-column>
					<el-table-column  label="已购金额">
						<template slot-scope="scope">
							<span>￥{{scope.row.paidAmount}}</span>
						</template>
					</el-table-column>
					<el-table-column label="操作">
						<template slot-scope="scope">
							<el-button @click="route(scope.row.schemePackageId)" type="text" size="small">查看详情</el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<div class='documentarymask' v-show='isMask==1'>
				<div class='documentarymaskcontent'>
					<h3 class='maskTitle'>
						创建跟单方案
					</h3>
					<i class="el-icon-close" @click='maksIsShow(0)'></i>
					<div class='maskContent'>
						<span class='maskContentTitle'>跟单信息</span>
						<el-row class='contentList'>
							<el-col :span="4">
								总期数
							</el-col>
							<el-col :span="20">
							  #{{numberIssue}}
							</el-col>
						</el-row>
						<el-row class='contentList'>
							<el-col :span="4">
								名称
							</el-col>
							<el-col :span="20">
								<el-input v-model="name" class='contentInput' placeholder="请输入名称"></el-input>
							</el-col>
						</el-row>
						<el-row class='contentList'>
							<el-col :span="4">
								截止购买时间
							</el-col>
							<el-col :span="20">
								<el-date-picker v-model="dataTime" class='contentInput' type="datetime" format='yyyy-MM-dd HH:mm' placeholder="选择日期时间" align="right">
								</el-date-picker>
							</el-col>
						</el-row>
						<el-row class='contentList'>
							<el-col :span="4">
								准确率
							</el-col>
							<el-col :span="20">
								<el-input v-model="accuracy" class='contentInput' placeholder="请输入准确率"></el-input>
							</el-col>
						</el-row>
						<el-row class='contentList'>
							<el-col :span="4">
								预购金额
							</el-col>
							<el-col :span="20">
								<el-input v-model="monney" class='contentInput' placeholder="请输入预购金额"></el-input>
							</el-col>
						</el-row>
						<el-row class='contentList'>
							<el-col :span="4">
								预售方案
							</el-col>
							<el-col :span="20">
								<el-switch v-model="preSale" active-text="预售" inactive-text="非预售">
								</el-switch>
							</el-col>
						</el-row>
					</div>
					<el-button type="success" class='successbtn' :disabled="!isClick" @click='handleSucess'>创建方案</el-button>
				</div>
			</div>
			<div class='bottom'>
				<el-pagination class='page' @current-change="handleCurrentChange" background layout="prev, pager, next"  :current-page.sync="currentPage" :total='total'>
				</el-pagination>
			</div>
		</div>
	</div>
</template>

<script>
	import {
		schemePkgList,
		schemeAdd,
		schemePackageperiod
	} from '@/api/lotteryprediction'
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
				list: null,
				listLoading: true,
				isStyle: 0,
				isMask: 0,
				tableData: [],
				tableData1: [],
				name: '',
				total: 0,
				isClick:true,
				numberIssue:0,
				dataTime: '',
				accuracy: 90,
				monney: 120,
				preSale: false,
				type:'success',
				isShow: true,
				page: 1,
				currentPage:1,

			}
		},
		created() {

			let startDate = parseTime(new Date(), '{y}-{m}-{d}');
			this.dataTime = startDate + ' 21:00';
			if (window.location.href.indexOf('documentarydemo') >= 0) {
				this.isShow = false;
			} else {
				this.isShow = true;
			};
			this.fetchData();
		},
		methods: {
			fetchData() {
				this.listLoading = true;
				let datalist = {
					follow: '2',
					pn: this.page,
					isOver: this.isStyle
				};
				schemePkgList(datalist).then(response => {
					this.listLoading = false;
					if(response.code==0){
						if(this.isStyle==0){
							this.tableData=response.data.pkgList;
							this.total=response.data.total;
						}else if(this.isStyle==1){
							this.tableData1=response.data.pkgList;
							this.total=response.data.total;
						}
						
					}
				})
			},
			addFetchData() {
				if(!this.isClick){
					return;
				};
				this.isClick=false;
				const that=this;
				setTimeout(()=>{
					that.isClick=true;
				},2000);
				this.listLoading = true;
				let startTime = parseTime(new Date(), '{y}-{m}-{d} {h}:{i}');
				let endTime = parseTime(this.dataTime, '{y}-{m}-{d} {h}:{i}');
				let presale = this.preSale ? 1 : 0;
				let datalist = {
					"displayTime": startTime,
					"expiredTime": endTime,
					"maxOdds": "",
					"minOdds": "",
					"name": this.name,
					"presale": presale,
					"price": this.monney,
					"rating": this.accuracy,
					"source": "魔力Go"
				}
				schemeAdd(datalist).then(response => {
					this.listLoading = false;
					this.isClick=true;
					if (response.code == 0) {
                          this.route(response.data);
					} else {
						Message({
							message: response.message || 'Error',
							type: 'error',
							duration: 5 * 1000
						})
					}
				})
			},
			schemePackageperiodData(){
				schemePackageperiod({}).then(response => {
					if (response.code == 0) {
					     this.numberIssue=response.data
					} else {
						Message({
							message: response.message || 'Error',
							type: 'error',
							duration: 5 * 1000
						})
					}
				})
			},
			switchTable(val) {
				this.isStyle = val;
				this.page=1;
				this.currentPage=1;
				this.handleCurrentChange(1);
				this.fetchData();
			},
			maksIsShow(val) {
				this.isMask = val;
				this.schemePackageperiodData();
			},
			handleCurrentChange(val) {
				this.page = val;
				this.currentPage=val;
				this.fetchData();
			},
			tips() {
				if (!this.name) {
					Message({
						message: '名称不能为空' || 'Error',
						type: 'error',
						duration: 2 * 1000
					})
					return
				};
				if (!this.accuracy) {
					Message({
						message: '准确率不能为空' || 'Error',
						type: 'error',
						duration: 2 * 1000
					})
					return
				};
				if (!this.dataTime) {
					Message({
						message: '截止购买时间不能为空',
						type: 'error',
						duration: 2 * 1000
					})
					return
				};
				if (!this.monney ) {
					Message({
						message: '预售金额不能为空',
						type: 'error',
						duration: 2 * 1000
					})
					return
				}else if(this.monney<2){
					Message({
						message: '预售金额不能小于2元',
						type: 'error',
						duration: 2 * 1000
					})
					return
				}else if(this.monney%2!=0){
					console.log(this.monney%2);
					Message({
						message: '预售金额必须为偶数与整数',
						type: 'error',
						duration: 2 * 1000
					})
					return
				}else if(!/(^[1-9]\d*$)/.test(this.monney)){
					Message({
						message: '预售金额必须为整数',
						type: 'error',
						duration: 2 * 1000
					})
					return
				};
				return true;
			},
			route(val) {
				this.$router.push({
					path: 'documentarydemo',
					name: '跟单预购方案详情',
					meta: {
						title: '跟单预购方案详情'
					},
					params: {
						id: val,
					}
				})
			},
			handleSucess() {
				if (this.tips()) {
					this.addFetchData();
				}
			}
		}
	}
</script>
<style lang="scss">
	* {
		margin: 0;
		padding: 0
	}

	.app-documentary {
		padding-left: 20px;

		.documentarytitle {
			width: 100%;
			height: 85px;

			li {
				list-style: none;
				width: 200px;
				line-height: 80px;
				float: left;
				margin-left: 10px;
				text-align: center;
				border-bottom: 1px solid #333333;
				cursor: pointer;
			}

			.btn {
				margin-top: 30px;
				margin-left: 50px;
			}

			.active {
				border-bottom: 2px solid #409EFF;
			}
		}

		.documentaryContent {
			margin-top: 20px;
			.active1{
				color:red;
			}
		}

		.documentarymask {
			position: fixed;
			width: 100%;
			height: 100%;
			left: 0;
			top: 0;
			background: rgba(0, 0, 0, .5);
			z-index: 2000;

			.documentarymaskcontent {
				height: 90%;
				width: 60%;
				position: absolute;
				left: 50%;
				top: 20px;
				margin-left: -30%;
				background: #fff;

				.maskTitle {
					line-height:60px;
					padding-left: 20px;
					background-color: #cecece;
				}

				.el-icon-close {
					position: absolute;
					right: 10px;
					top: 10px;
					font-size: 28px;
					cursor: pointer;
				}

				.maskContent {
					width: 90%;
					margin: 6% 5% 2% 5%;
					min-height: 30%;
					height:30%;
					height:auto!important;
					border: 1px solid #cecece;
					position: relative;
					padding: 10px 20px;

					.maskContentTitle {
						position: absolute;
						height: 50px;
						line-height: 50px;
						width: 100px;
						top: -49px;
						border: 1px solid #cecece;
						border-bottom: none;
						left: -1px;
						z-index: 20;
						background-color: #FFFFFF;
						text-align: center;
					}

					.contentList {
						line-height:50px;
						height: 50px;
						margin-bottom: 10px;
                        
						.contentInput {
							width: 80%;
						}
					}
				}

				.successbtn {
					width: 500px;
					line-height: 10%;
					height:10%;
					margin: 20px auto;
					display: block;
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
