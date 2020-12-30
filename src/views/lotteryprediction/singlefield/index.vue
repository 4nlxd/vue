<template>
	<div class="app-singlefield">
		<div class="documentarytitle">
			<el-row>
				<el-col :span="18">
					<ul>
						<li v-bind:class="{active:isStyle==0}" @click="switchTable(0)">本期赛事</li>
						<li v-bind:class="{active:isStyle==1}" @click="switchTable(1)">往期赛事</li>
						<li v-bind:class="{active:isStyle==2}" @click="switchTable(2)">往期统计(90天)</li>
					</ul>
				</el-col>
				<el-col :span="6">
					<el-button type="primary" class='btn' @click='handleMask(1)'>创建在售方案</el-button>
				</el-col>
			</el-row>
		</div>
		<div class='contentTwoTitle' v-if='isStyle!=1'>
			<el-switch class='switch1' v-if='isStyle==0' v-model="preValue1" @change="handleselectData(1)" active-text="显示已预测"
			 inactive-text="隐藏已预测">
			</el-switch>
			<el-button type="primary" class='search' v-if='isStyle==2' @click='handleSerch'>查询</el-button>
			<div class='titlecontent' v-if='isStyle==2'>
				<span>日期范围</span>
				<el-date-picker class='endState1' v-model="datatime" type="daterange" range-separator="至" start-placeholder="开始日期"
				 end-placeholder="结束日期">
				</el-date-picker>
			</div>
		</div>
		<div class='tableContent'>
			<el-table :data="tableData" border style="width: 97%" v-show='isStyle!=2'>
				<el-table-column label="ID" width="100">
					<template slot-scope="scope">
						<span>{{scope.row.num}}</span>
						<br />
						<span class='color1'>{{scope.row.leagueName}}</span>
					</template>
				</el-table-column>
				<el-table-column label="队伍" width="200">
					<template slot-scope="scope">
						<span class='color2'>{{scope.row.homeName}}</span>
						<span class='center1'>VS</span>
						<span class='color2'>{{scope.row.guestName}}</span>
					</template>
				</el-table-column>
				<el-table-column prop="startTime" label="比赛时间" width="200">
				</el-table-column>
				<el-table-column label="预测" width="120">
					<template slot-scope="scope">
						<span class='color2' v-if='scope.row.source'>已预测</span>
						<span v-if='!scope.row.source'>未预测</span>
					</template>
				</el-table-column>
				<el-table-column prop="diamond" label="钻石" width="100">
					<template slot-scope="scope">
						<span v-if='scope.row.diamond>0 && scope.row.source'>{{scope.row.diamond}}</span>
						<span v-if='scope.row.diamond==0 && scope.row.source'>免费</span>
						<span v-if='!scope.row.source'>--</span>
					</template>
				</el-table-column>
				<el-table-column label="付费人数" width="120">
					<template slot-scope="scope">
						<span>--</span>
					</template>
				</el-table-column>

				<el-table-column label="让球" width="120">
					<template slot-scope="scope">
						<span>0</span>
						<br />
						<span class='fixedOdds'>{{scope.row.fixedOdds}}</span>
					</template>
				</el-table-column>

				<el-table-column label="胜/平/负">
					<template slot-scope="scope">
						<el-row>
							<el-col :span="8">
								<el-button type="info" v-if='scope.row.homeWin==0 && scope.row.hwinOdds'>胜({{scope.row.hwinOdds}})</el-button>
								<el-button type="warning" v-if='scope.row.homeWin==1 && scope.row.hwinOdds'>胜({{scope.row.hwinOdds}})</el-button>
							</el-col>
							<el-col :span="8">
								<el-button type="info" v-if='scope.row.homeDraw==0 && scope.row.hdrawOdds '>平({{scope.row.hdrawOdds}})</el-button>
								<el-button type="warning" v-if='scope.row.homeDraw==1 && scope.row.hdrawOdds'>平({{scope.row.hwinOdds}})</el-button>
							</el-col>
							<el-col :span="8">
								<el-button type="info" v-if='scope.row.homeLose==0 && scope.row.hloseOdds '>负({{scope.row.hloseOdds}})</el-button>
								<el-button type="warning" v-if='scope.row.homeLose==1 && scope.row.hwinOdds '>负({{scope.row.hwinOdds}})</el-button>
							</el-col>
						</el-row>
						<el-row style='margin-top:5px'>
							<el-col :span="8">
								<el-button type="info" v-if='scope.row.guestWin==0 && scope.row.gwinOdds'>胜({{scope.row.gwinOdds}})</el-button>
								<el-button type="warning" v-if='scope.row.guestWin==1 && scope.row.hwinOdds'>胜({{scope.row.hwinOdds}})</el-button>
							</el-col>
							<el-col :span="8">
								<el-button type="info" v-if='scope.row.guestDraw==0 && scope.row.gdrawOdds'>平({{scope.row.gdrawOdds}})</el-button>
								<el-button type="warning" v-if='scope.row.guestDraw==1 && scope.row.gdrawOdds'>平({{scope.row.hwinOdds}})</el-button>
							</el-col>
							<el-col :span="8">
								<el-button type="info" v-if='scope.row.guestLose==0 && scope.row.gloseOdds'>负({{scope.row.gloseOdds}})</el-button>
								<el-button type="warning" v-if='scope.row.guestLose==1 && scope.row.gloseOdds'>负({{scope.row.hwinOdds}})</el-button>
							</el-col>
						</el-row>
					</template>
				</el-table-column>
				<el-table-column label="结果" width="120">
					<template slot-scope="scope">
						<span v-if='scope.row.hafuScore'>{{scope.row.hafuScore}}</span>
						<span v-if='!scope.row.hafuScore'>--</span>
						<br />
						<span v-if='scope.row.hafuScore && scope.row.source'>{{handleresult(scope.row)?'正确':handleresult1(scope.row)?'正确':'错误'}}</span>
					</template>
				</el-table-column>
				<el-table-column label="操作" width='200'>
					<template slot-scope="scope">
						<el-button type="text" @click="handleClick(scope.row,1)"  v-if='scope.row.source && !handleTime(scope.row.startTime)'>退单</el-button>
						<!-- <el-button type="text" v-if='scope.row.source && !handleTime(scope.row.startTime)'>修改</el-button> -->
						<el-button @click="handleClick(scope.row,2)" type="text" v-if='scope.row.source && handleTime(scope.row.startTime)'>详情</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-table :data="tableData1" border style="width: 97%" v-show='isStyle==2'>
				<el-table-column label="日期"  prop="dataTime">
				</el-table-column>
				<el-table-column label="总预测场数" >
					<template slot-scope="scope">
						<span class='color2'>{{scope.row.totalCnt}}</span>
					</template>
				</el-table-column>
				<el-table-column  label="总正确场次" >
					<template slot-scope="scope">
						<span class='color3' >{{scope.row.totalRightCnt}}</span>
					</template>
				</el-table-column>
				<el-table-column label="总错误场次" >
					<template slot-scope="scope">
						<span class='color4' >{{scope.row.totalWrongCnt}}</span>
					</template>
				</el-table-column>
			    <el-table-column label="付费正确场次" >
					<template slot-scope="scope">
						<span class='color3' >{{scope.row.feeRightCnt}}</span>
					</template>
			    </el-table-column>
			    <el-table-column label="付费错误场次">
					<template slot-scope="scope">
						<span class='color4'>{{scope.row.feeWrongCnt}}</span>
					</template>
			    </el-table-column>
			    <el-table-column  label="免费正确场次" >
					<template slot-scope="scope">
						<span class='color3' >{{scope.row.freeRightCnt}}</span>
					</template>
			    </el-table-column>
			    <el-table-column label="免费错误场次" >
					<template slot-scope="scope">
						<span class='color4'>{{scope.row.freeWrongCnt}}</span>
					</template>
			    </el-table-column>
				<el-table-column label="付费人数" >
					<template slot-scope="scope">
						<span class='color2' >{{scope.row.feeCnt}}</span>
					</template>
				</el-table-column>
			    <el-table-column label="付费钻石">
			    	<template slot-scope="scope">
			    		<span class='color1'>{{scope.row.amount}}</span>
			    	</template>
			    </el-table-column>
			</el-table>
		</div>
		<div class='documentarymask' v-show='isMask'>
			<div class='documentarymaskcontent'>
				<h3 class='maskTitle'>
					创建跟单方案
				</h3>
				<i class="el-icon-close" @click='handleMask(0)'></i>
				<div class='maskContent'>
					<span class='maskContentTitle'>方案选择</span>
					<el-switch class='switch2' v-model="preValue2" @change="handleselectData(2)" active-text="显示已预测" inactive-text="隐藏已预测">
					</el-switch>
					<div class='competition'>
						<ul>
							<li class='competitionContent' v-for='(item,key) in matchListData'>
								<ul>
									<li>
										<span class='stateTitle'>{{item.matchInfo.startTime}}</span>
										<span class='sureState'>{{item.matchInfo.num}} {{item.matchInfo.homeTeamName}} VS
											{{item.matchInfo.guestTeamName}} </span>
									</li>
									<li>
										<span class='stateTitle'>玩法：胜平负</span>
										<span class='sureState'>
											<el-button v-for="(data,index) in dataList[key][item.matchInfo.matchId].slice(0,3)" ref="tree2" :type="data.value ? 'primary':'info'"
											 :dataid="item.matchInfo" :dataname="item.matchInfo.matchId+'/'+data.name+'/'+item.battleInfo[data.name]+'/'+'a'"
											 :matchname="item.matchInfo.homeTeamName+'VS'+item.matchInfo.guestTeamName" v-if='item.battleInfo[data.name]'
											 @click="siwtchCheak(key,item.matchInfo.matchId,index)">
												{{data.name=='hwinOdds'? '胜':data.name=='hdrawOdds'?'平':'负'}}
												({{item.battleInfo[data.name]}})
											</el-button>
										</span>
									</li>
									<li style="border-bottom: 1px solid #cecece;">
										<span class='stateTitle'>玩法：让球({{item.battleInfo.fixedOdds}})</span>
										<span class='sureState'>
											<el-button v-for="(data,index) in dataList[key][item.matchInfo.matchId].slice(3,6)" ref="tree2" :type="data.value ? 'primary':'info'"
											 :dataid="item.matchInfo" :dataname="item.matchInfo.matchId+'/'+data.name+'/'+item.battleInfo[data.name]+'/'+item.battleInfo.fixedOdds"
											 :matchname="item.matchInfo.homeTeamName+'VS'+item.matchInfo.guestTeamName" v-if='item.battleInfo[data.name]'
											 @click="siwtchCheak(key,item.matchInfo.matchId,index+3)">
												{{data.name=='gwinOdds'? '胜':data.name=='gdrawOdds'?'平':'负'}}
												({{item.battleInfo[data.name]}})
											</el-button>
										</span>
									</li>
								</ul>
							</li>
						</ul>
					</div>
				</div>
				<div class='maskContent2'>
					<span class='maskContentTitle'>预测信息</span>
					<div class='detaile'>
						 <el-row >
							  <el-col :span="8">
								  <span>准确度</span>
								  <el-input v-model="accuracy" placeholder="请输入内容" class='input'></el-input>
							  </el-col>
							  <el-col :span="8">
								  <span>来源</span>
								  <el-input v-model="source" placeholder="请输入内容" class='input'></el-input>
							  </el-col>
							  <el-col :span="8">
								  <span>钻石</span>
								  <el-input v-model="payPrice" placeholder="请输入内容" class='input'></el-input>
							  </el-col>
						</el-row>
						<el-row class='rowContent'>
							  <el-col :span="8">
								  <span>会员免费</span>
								  <el-switch
								    class='switch'
								    v-model="freePay"
								    active-text="是"
								    inactive-text="否">
								  </el-switch>
							  </el-col>
							  <el-col :span="8">
								 <span>不中包赔</span>
								 <el-switch
								   class='switch'
								   v-model="Indemnity"
								   active-text="是"
								   inactive-text="否">
								 </el-switch>
							  </el-col>
						</el-row>
					</div>
				</div>
				<el-button type="success" class='sureSbmit' @click='handleSumitData()'>创建</el-button>
			</div>
		</div>
		<div class='documentarymask2' v-show='isMask1'>
			<div class='documentarymaskcontent'>
				<h3 class='maskTitle'>
					单方案详情
				</h3>
				<i class="el-icon-close" @click='handleMask(2)'></i>
				<div class='maskContent'>
					<span class='maskContentTitle'>方案选择</span>
					<div class='competition'>
						<span class='stateTitle'>单场方案比赛</span>
						<span class='sureState'>
							<span>
								{{this.detaileData.homeWin==1 ? '胜':''}}
								{{this.detaileData.homeDraw==1 ? '平':''}}
								{{this.detaileData.homeLose==1 ? '负':''}}
							</span>
							<span v-if='this.detaileData.guestWin==1 ||this.detaileData.guestDraw||this.detaileData.guestLose'>
								|让({{this.detaileData.fixedOdds}})
							</span>
							<span>
								{{this.detaileData.guestWin==1 ? '胜':''}}
								{{this.detaileData.guestDraw==1 ? '平':''}}
								{{this.detaileData.guestLose==1 ? '负':''}}
							</span>
						</span>
					</div>
				</div>
				<div class='maskContent2'>
					<span class='maskContentTitle'>预测信息</span>
					<div class='detaile'>
						 <el-row >
							  <el-col :span="8">
								  <span>准确度</span>
								  <el-input v-model="accuracy" placeholder="请输入内容" class='input'></el-input>
							  </el-col>
							  <el-col :span="8">
								  <span>来源</span>
								  <el-input v-model="source" placeholder="请输入内容" class='input'></el-input>
							  </el-col>
							  <el-col :span="8">
								  <span>钻石</span>
								  <el-input v-model="payPrice" placeholder="请输入内容" class='input'></el-input>
							  </el-col>
						</el-row>
						<el-row class='rowContent'>
							  <el-col :span="8">
								  <span>会员免费</span>
								  <el-switch
								    class='switch'
								    v-model="freePay"
								    active-text="是"
								    inactive-text="否">
								  </el-switch>
							  </el-col>
							  <el-col :span="8">
								 <span>不中包赔</span>
								 <el-switch
								   class='switch'
								   v-model="Indemnity"
								   active-text="是"
								   inactive-text="否">
								 </el-switch>
							  </el-col>
						</el-row>
					</div>
				</div>
				<div class='maskContent3'>
					<span class='maskContentTitle'>预测状态</span>
					<el-row >
						  <el-col :span="8">
							  <span>准确度</span>
							  <el-input v-model="accuracy" placeholder="请输入内容" class='input'></el-input>
						  </el-col>
						  <el-col :span="8">
							  <span>来源</span>
							  <el-input v-model="source" placeholder="请输入内容" class='input'></el-input>
						  </el-col>
						  <el-col :span="8">
							  <span>钻石</span>
							  <el-input v-model="payPrice" placeholder="请输入内容" class='input'></el-input>
						  </el-col>
					</el-row>
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
		forcecast,
		forcecastAdd,
		forcecastPayback
	} from '@/api/singlefield'
	import {
		matchList,
	} from '@/api/lotteryprediction'
	import { parseTime } from '@/utils/index'
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
				tableData1:[],
				responseDate: [],
				listLoading: true,
				isMask1:0,
				isStyle: 0,
				matchListData: [],
				matchResponseData: [],
				dataList: [],
				preValue1: true,
				preValue2: false,
				Indemnity:false,
				payPrice:180,
				source:'魔力Go',
				accuracy:90,
				freePay:false,
				isMask: 0,
				datatime: [],
				dataSelect: [],
				detaileData:{},
				page: 1,
				total: 0
			}
		},
		created() {
			const end = new Date()
			const start = new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 7);
			this.datatime = [start, end]
			this.fetchData();
		},
		methods: {
			fetchData() {
				this.listLoading = true;
				getList({
					pn: this.page,
					endState:this.isStyle
				}).then(response => {
					this.listLoading = false;
					if (response.code == 0) {
						this.total = response.data.total;
						this.tableData = response.data.list;
						this.responseDate = response.data.list;
					} else {
						Message({
							message: response.message || 'Error',
							type: 'error',
							duration: 5 * 1000
						})
					}
				})
			},
			forcecastData(){
				this.listLoading = true;
				let startDate=parseTime(this.datatime[0],'{y}-{m}-{d}');
				let endDate=parseTime(this.datatime[1],'{y}-{m}-{d}');
				forcecast({
						startDate:startDate,
						endDate:endDate,
					}).then(response => {
						this.listLoading = false;
						this.total=0;
						let data=[];
						if (response.code == 0) {
							for(let key in response.data){
								response.data[key].dataTime=key;
								data.push(response.data[key])
							}
							this.tableData1 = data;
						} else {
							Message({
								message: response.message || 'Error',
								type: 'error',
								duration: 5 * 1000
							})
						}
					})
			},
			handleSumitData(){
				let newarr=[];
				let addData={};
				for(let i=0;i<this.dataList.length;i++){
					 let arrData=[];
					 let objData={};
					for(let j in this.dataList[i]){
						let data=this.dataList[i][j];
						for(let k=0;k<data.length;k++){
							if(data[k].value){
							   arrData.push(1)	
							}else{
							   arrData.push(0);
							}
						}
						if(arrData.indexOf(1)>-1){
							objData.matchId=j;
						    objData.val=arrData;
						}	
					}	
					if( Object.keys(objData).length != 0){
						newarr.push(objData);
					}
				}
				let vipFree=this.freePay ? 1:0;
				let payBack=this.Indemnity ? 1:0;
				addData.data=newarr;
				addData.vipFree=vipFree;
				addData.payBack=payBack;
				if(this.payPrice>0){
					addData.payType=1;
				}else{
					addData.payType=0;
				}
				addData.diamond=this.payPrice;
				addData.price=0;
				addData.source=this.source;
				if(this.SubmitTips(addData)){
					this.forcecastAddData(addData);
				}
			},
			forcecastAddData(data){
				forcecastAdd(data).then(response => {
						if (response.code == 0) {
							Message({
								message: '单场方案创建成功',
								type: 'success',
								duration: 2 * 1000
							});
							this.isMask=0;
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
			forcecastPaybackData(data){
				forcecastPayback({matchId:data}).then(response => {
						if (response.code == 0) {
							Message({
								message: '退单成功',
								type: 'success',
								duration: 2 * 1000
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
			//方案退单
			openTip(id){
			   this.$confirm('是否要退单', '提示', {
				          confirmButtonText: '确定',
				          cancelButtonText: '取消',
				          type: 'warning'
				        }).then(() => {
							this.forcecastPaybackData(id);
				        }).catch(() => {
				          this.$message({
				            type: 'info',
				            message: '已取消删除'
				          });          
				        });
			},
			handleClick(data,index){
				if(index==1){
					this.openTip(data.matchId)
				}else if(index==2){
					this.isMask1=1;
					this.detaileData=data;
				}
			},
			handleCurrentChange(val) {
				this.page = val;
				this.fetchData();
			},
			handleSerch() {
				this.forcecastData();
			},
			handleresult(value) {
				let hafuScore = value.hafuScore.split(':');
				if (parseInt(hafuScore[0]) > parseInt(hafuScore[1]) && value.homeWin == 1) {
					return 1
				} else if (parseInt(hafuScore[0]) == parseInt(hafuScore[1]) && value.homeDraw == 1) {
					return 1
				} else if (parseInt(hafuScore[0]) < parseInt(hafuScore[1]) && value.homeLose == 1) {
					return 1
				} else {
					return 0;
				}
			},
			handleresult1(value) {
				let hafuScore = value.hafuScore.split(':');
				let homeNum = parseInt(hafuScore[0]) + parseInt(value.fixedOdds)
				if (homeNum > parseInt(hafuScore[1]) && value.guestWin == 1) {
					return 1
				} else if (homeNum == parseInt(hafuScore[1]) && value.guestDraw == 1) {
					return 1
				} else if (homeNum < parseInt(hafuScore[1]) && value.guestLose == 1) {
					return 1
				} else {
					return 0;
				}
			},
			handleTime(val) {
				let time1 = new Date().getTime();
				let time2 = new Date(val).getTime();
				if (time1 < time2) {
					return 0
				} else {
					return 1
				}
			},
			switchTable(val) {
				this.isStyle = val;
				this.page = 1;
				this.currentPage = 1;
				if(val!=2){
					this.fetchData();
				}else{
					this.forcecastData();
				}
				
			},
			handleMask(index) {
				if(index==2){
					this.isMask1=0;
				}else{
					this.isMask = index;
				    this.matchData();
				}
				
			},
			handleselectData(index) {
				if (index == 1) {
					if (!this.preValue1) {
						for (let i = 0; i < this.responseDate.length; i++) {
							if (!this.responseDate[i].source) {
								this.dataSelect.push(this.responseDate[i])
							}
						};
						this.tableData = this.dataSelect;
					} else {
						this.tableData = this.responseDate;
					}
				}
				if (index == 2) {
					this.selectData();
				}
			},
			selectData() {
				if (!this.preValue2) {
					let matchselectData = [];
					for (let i = 0; i < this.matchResponseData.length; i++) {
						for (let j = 0; j < this.responseDate.length; j++) {
							if (this.matchResponseData[i].matchInfo.matchId == this.responseDate[j].matchId && !this.responseDate[j].source) {
								matchselectData.push(this.matchResponseData[i])
							}
						}
					}
					this.matchListData = matchselectData;
					let selectData = [];
					for (let i = 0; i < this.matchListData.length; i++) {
						let selectObj = {};
						let name = this.matchListData[i].matchInfo.matchId;
						selectObj[name] = [{
								name: 'hwinOdds',
								value: false
							},
							{
								name: 'hdrawOdds',
								value: false
							},
							{
								name: 'hloseOdds',
								value: false
							},
							{
								name: 'gwinOdds',
								value: false
							},
							{
								name: 'gdrawOdds',
								value: false
							},
							{
								name: 'gloseOdds',
								value: false
							},
						];
						selectData.push(selectObj);
					}
					this.dataList = selectData;
				} else {
					this.matchListData = this.matchResponseData;
					let selectData = [];
					for (let i = 0; i < this.matchListData.length; i++) {
						let selectObj = {};
						let name = this.matchListData[i].matchInfo.matchId;
						selectObj[name] = [{
								name: 'hwinOdds',
								value: false
							},
							{
								name: 'hdrawOdds',
								value: false
							},
							{
								name: 'hloseOdds',
								value: false
							},
							{
								name: 'gwinOdds',
								value: false
							},
							{
								name: 'gdrawOdds',
								value: false
							},
							{
								name: 'gloseOdds',
								value: false
							},
						];
						selectData.push(selectObj);
					}
					this.dataList = selectData;
				}
			},
			//获取比赛详情接口
			matchData() {
				matchList({}).then(response => {
					if (response.code == 0) {
						this.matchResponseData = response.data.matchList;
						if (response.data.matchList.length) {
                            this.selectData();
						}
					} else {
						Message({
							message: response.message || 'Error',
							type: 'error',
							duration: 1 * 1000
						})
					}
				})
			},
			siwtchCheak(index,name,num){
				this.dataList[index].[name][num].value=!this.dataList[index].[name][num].value;
			},
			SubmitTips(data) {
				if (!data.data.length) {
					Message({
						message: '请选择方案',
						type: 'error',
						duration: 2 * 1000
					});
					return
				};
				if (!this.accuracy) {
					Message({
						message: '请填写准确率',
						type: 'error',
						duration: 2 * 1000
					});
					return
				};
				if (!this.source) {
					Message({
						message: '请填写来源',
						type: 'error',
						duration: 2 * 1000
					})
					return
				};
				if (!this.payPrice) {
					Message({
						message: '请填写钻石',
						type: 'error',
						duration: 2 * 1000
					})
					return
				};
				return true;
			},
		}
	}
</script>
<style lang="scss">
	.app-singlefield {
		padding-left: 20px;

		.documentarytitle {
			width: 100%;
			height: 85px;
			margin-bottom: 20px;

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

		.contentTwoTitle {
			width: 97%;
			line-height: 50px;
			padding-left: 20px;
			height: 50px;
			background-color: rgba(153, 153, 153, 1);
			color: #FFFFFF;
			margin-bottom: 20px;

			.switch1 {
				float: right;
				margin-right: 20px;
				margin-top: 15px;

				.is-active {
					color: #fff;
				}
			}

			.titlecontent {
				width: 460px;
				margin-left: 15px;
				float: right;
				margin-right: 20px;

				.endState1 {
					margin-left: 20px;
				}
			}

			.search {
				float: right;
				margin-top: 5px;
				margin-right: 20px;
			}
		}

		.tableContent {
			.color1 {
				color: #f59a23;
			}

			.color2 {
				color: #02a7f0;
			}
            .color3 {
            	color: red;
            }
			.color4 {
				color: #4b7902;
			}
			.center1 {
				padding: 0 5px;
			}

			.fixedOdds {
				display: inline-block;
				margin-top: 20px;
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
				height: 100%;
				width: 60%;
				position: absolute;
				left: 50%;
				top: 20px;
				margin-left: -30%;
				background: #fff;
				overflow-y: auto;

				.maskTitle {
					line-height: 60px;
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
					margin: 70px 5% 20px 5%;
					height: 60%;
					border: 1px solid #cecece;
					position: relative;
					padding: 10px 20px;

					.switch2 {
						position: absolute;
						right: 20px;
						top: -40px;
					}

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
				}
                .maskContent2 {
                	width: 90%;
                	margin: 70px 5% 20px 5%;
                	height:30%;
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
					.detaile{
						padding-top:20px;
						.rowContent{
							margin-top:30px;
						}
						.input{
							width:200px;
							margin-left:20px;
						}
						.switch{
							margin-left:20px;
						}
					}
                }
				.competition {
					height: 100%;
					width: 90%;
					margin: 0 auto;
					overflow-y: scroll;
					margin-bottom: 20px;

					.competitionContent {
						list-style: none;
						width: 100%;
						margin-top: 15px;

						li {
							list-style: none;
							width: 100%;
							height: 50px;
							border: 1px solid #cecece;
							border-bottom: none;

							.stateTitle {
								width: 30%;
								line-height: 48px;
								height: 48px;
								text-align: center;
								float: left;
								background: #cecece;
								color: #7F7F7F;
							}

							.sureState {
								width: 70%;
								line-height: 48px;
								height: 48px;
								text-align: center;
								float: left;
								color: #7F7F7F;
							}

						}

					}
				}

				.contentList {
					width: 100%;
					height: 50px;
					margin-top: 20px;

					.contentInput {
						width: 80%;
					}
				}
			}

			.sureSbmit {
				width: 200px;
				height: 40px;
				display: block;
				margin: 20px auto;
			}
		}
        .documentarymask2 {
        	position: fixed;
        	width: 100%;
        	height: 100%;
        	left: 0;
        	top: 0;
        	background: rgba(0, 0, 0, .5);
        	z-index: 2000;
        
        	.documentarymaskcontent {
        		height: 100%;
        		width: 60%;
        		position: absolute;
        		left: 50%;
        		top: 20px;
        		margin-left: -30%;
        		background: #fff;
        		overflow-y: auto;
        
        		.maskTitle {
        			line-height: 60px;
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
        			margin: 70px 5% 20px 5%;
        			height: 20%;
        			border: 1px solid #cecece;
        			position: relative;
        			padding:30px 20px;
        
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
					.stateTitle {
						width: 30%;
						line-height: 48px;
						height: 48px;
						text-align: center;
						float: left;
						background: #cecece;
						color:#7F7F7F;
					}
					
					.sureState {
						width: 70%;
						line-height: 48px;
						height: 48px;
						padding-left:20px;
						float: left;
						color:red;
						border: 1px solid #cecece;
						font-weight: bold;
					}
        		}
				.maskContent3 {
					width: 90%;
					margin: 70px 5% 20px 5%;
					height: 20%;
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
				}
                .maskContent2 {
                	width: 90%;
                	margin: 70px 5% 20px 5%;
                	height:30%;
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
        			.detaile{
        				padding-top:20px;
        				.rowContent{
        					margin-top:30px;
        				}
        				.input{
        					width:200px;
        					margin-left:20px;
        				}
        				.switch{
        					margin-left:20px;
        				}
        			}
                }
        		.competition {
        			
        
        		}
        	}
        
        	.sureSbmit {
        		width: 200px;
        		height: 40px;
        		display: block;
        		margin: 20px auto;
        	}
        }
		.bottom {
			margin-top: 20px;
			width: 100%;

			.page {
				float: right;
				margin-right: 20px;
			}
		}
	}
</style>
