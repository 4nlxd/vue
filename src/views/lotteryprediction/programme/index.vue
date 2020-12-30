<template>
	<div>
	<router-view></router-view>
	<div class="app-programme" v-show="isShowDeatile">
		<div class='newBtn'>
			<el-button type="primary" class='btn' @click='maksIsShow(1)'>创建在售方案</el-button>
		</div>
		<div class='title'>
			<div class='titleLeft'>
				<el-row>
					<el-col :span="6" :offset='2'>
						<div class='titlecontent'>
							<span>截止状态</span>
							<el-select v-model="value1" placeholder="全部" class='endState'>
								<el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value">
								</el-option>
							</el-select>
						</div>
					</el-col>
					<el-col :span="6" :offset='2'>
						<div class='titlecontent'>
							<span>预测结果</span>
							<el-select v-model="value2" placeholder="全部" class='endState'>
								<el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value">
								</el-option>
							</el-select>
						</div>
					</el-col>
					<el-col :span="6" :offset='2'>
						<div class='titlecontent'>
							<span>截止时间</span>
							<el-select v-model="value3" placeholder="全部" class='endState'>
								<el-option v-for="item in options3" :key="item.value" :label="item.label" :value="item.value">
								</el-option>
							</el-select>
						</div>
					</el-col>
				</el-row>
			</div>
			<el-button type="primary" class='search' @click='maksIsShow(2)'>查询</el-button>
		</div>
		<div class='tableContent'>
			<el-table :data="tableData" border style="width: 97%">
				<el-table-column fixed prop="name" label="方案名称">
				</el-table-column>
				<el-table-column fixed prop="match" label="闯关方式" >
					<template slot-scope="scope">
						<span> {{scope.row.schemeList[0].passwary}}</span>
					</template>
				</el-table-column>
				<el-table-column prop="created" label="创建时间" >
				</el-table-column>
				<el-table-column prop="displayTime" label="显示时间" >
				</el-table-column>
				<el-table-column prop="expiredTime" label="过期时间">
				</el-table-column>
				<el-table-column prop="diamond" label="付费价格" >
				</el-table-column>
				<el-table-column  label="预测结果" >
					<template slot-scope="scope">
						<span v-if='scope.row.awardState==0'>待开奖</span>
						<span v-if='scope.row.awardState==1' class='color1'>中奖</span>
						<span v-if='scope.row.awardState==2' class='color2'>未奖</span>
					</template>
				</el-table-column>
				<el-table-column prop="zip" label="付费人数" >
					<template slot-scope="scope">
					</template>
				</el-table-column>
				<el-table-column label="操作" >
					<template slot-scope="scope">
						<span class='btn color1' @click="handleClick(1,scope.row)" >查看详情</span>
						<span class='btn color2' @click="handleClick(2,scope.row)" v-show='handleTime(scope.row.expiredTime)==0'>立即过期</span>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<div class='bottom'>
			<el-pagination class='page' @current-change="handleCurrentChange" background layout="prev, pager, next" :total='total'>
			</el-pagination>
		</div>
		<div class='documentarymask' v-show='isMask'>
			<div class='documentarymaskcontent'>
				<h3 class='maskTitle'>
					创建预测
				</h3>
				<i class="el-icon-close" @click='handleMask(0)'></i>
				<div class='maskContent'>
					<span class='maskContentTitle'>方案选择</span>
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
											 :dataid="item.matchInfo" :dataname="item.matchInfo.matchId+'/'+data.name+'/'+item.battleInfo[data.name]+'/a'"
											 :matchname="item.matchInfo.homeTeamName+'VS'+item.matchInfo.guestTeamName" v-if='item.battleInfo[data.name]'
											 :matchTime='item.matchInfo.startTime'
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
											 :matchTime='item.matchInfo.startTime'
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
					<el-row class='contentList'>
						<el-col :span="4">
							闯关方式：
						</el-col>
						<el-col :span="20">
							<el-radio-group v-model="radioVanle">
								<el-radio :label="item.id" v-for='item in passWayList'>{{item.name}}</el-radio>
							</el-radio-group>
						</el-col>
					</el-row>
				</div>
				<el-button type="success" class='sureSbmit' @click='handleNext()'>下一步</el-button>
			</div>
		</div>
		<div class='documentarymask2' v-show="isDetaile">
			<div class='documentarymaskcontent'>
				<h3 class='maskTitle'>
					创建预测
				</h3>
				<i class="el-icon-close" @click="handleMask(0)"></i>
				<div class='content1'>
					<span class='maskContentTitle'>已选玩法</span>
					<div class='competition'>
						<ul style="border-bottom: 1px solid #cecece;">
							<li v-for='(item,key) in dataShow.scheme'>
								<span class='stateTitle'>比赛{{Number(key)+1}}</span>
								<span class='sureState'>
									<strong class='color1'>【{{item.matchName}}】</strong>
									<strong class='color2' v-for='data1 in item.wanfaList'>
										<span v-for='data2 in data1.values'>
											{{data2.name=='hwinOdds' ? '胜':''}}
											{{data2.name=='hdrawOdds' ? '平':''}}
											{{data2.name=='hloseOdds' ? '负':''}}
										</span>
										<span v-if='data1.values[0].name=="fixedOdds" && data1.values[0].value!=0'>| 让({{data1.values[0].value}})</span>
										<span v-for='data2 in data1.values'>
											{{data2.name=='gwinOdds' ? '胜':''}}
											{{data2.name=='gdrawOdds' ? '平':''}}
											{{data2.name=='gloseOdds' ? '负':''}}
										</span>
									</strong>
								</span>
							</li>
						</ul>
					</div>
				</div>
				<div class='content2'>
					<span class='maskContentTitle'>基本信息</span>
					<div class='competition'>
						<el-row class='contentList'>
							<el-col :span="4" class='listTitle'>
								名称
							</el-col>
							<el-col :span="20">
								<el-input v-model="name" class='contentInput' placeholder="请输入名称"></el-input>
							</el-col>
						</el-row>
						<el-row class='contentList'>
							<el-col :span="4" class='listTitle'>
								准确度
							</el-col>
							<el-col :span="20">
								<el-input v-model="accuracy" class='contentInput' placeholder="请输入名称"></el-input>
							</el-col>
						</el-row>
						<el-row class='contentList'>
							<el-col :span="4" class='listTitle'>
								来源
							</el-col>
							<el-col :span="20">
								<el-input v-model="source" class='contentInput' placeholder="请输入名称"></el-input>
							</el-col>
						</el-row>
						<!-- <el-row class='contentList'>
							<el-col :span="4" class='listTitle'>
								付费状态
							</el-col>
							<el-col :span="20">
									<el-switch v-model="preSale" active-text="付费" inactive-text="免费">
									</el-switch>
							</el-col>
						</el-row> -->
						<div class='prePontent'>
								<el-row class='contentList'>
									<el-col :span="4" class='listTitle'>
										付费价格(钻石)
									</el-col>
									<el-radio-group v-model="payPrice" :span="20">
										<el-radio :label="18">18</el-radio>
										<el-radio :label="28">28</el-radio>
										<el-radio :label="38">38</el-radio>
										<el-radio :label="58">58</el-radio>
										<el-radio :label="5">自定义</el-radio>
										<el-input v-model="customPrice" v-show='payPrice==5' class='contentInput2' placeholder="请输入付费价格"></el-input>
								   </el-radio-group>
								</el-row>
								<!-- <el-row class='contentList'>
									<el-col :span="4" class='listTitle'>
										原始价格
									</el-col>
									<el-col :span="20">
										<el-input v-model="originalPrice" class='contentInput' placeholder="请输入名称"></el-input>
									</el-col>
								</el-row> -->
								<!-- <el-row class='contentList'>
									<el-col :span="4" class='listTitle'>
										会员免费
									</el-col>
									<el-col :span="20">
											<el-switch v-model="freeMembership" active-text="否" inactive-text="是">
											</el-switch>
									</el-col>
								</el-row> -->
								<el-row class='contentList'>
									<el-col :span="4" class='listTitle'>
										不中包赔
									</el-col>
									<el-col :span="20">
											<el-switch v-model="Indemnity" active-text="是" inactive-text="否">
											</el-switch>
									</el-col>
							</el-row>
						</div>
						<!-- <el-row class='contentList'>
								<el-col :span="4" class='listTitle'>
									平均优化
								</el-col>
								<el-col :span="20">
										<el-switch v-model="averageOptimization" active-text="关" inactive-text="开">
										</el-switch>
								</el-col>
						</el-row> -->
						<el-row class='contentList'>
								<el-col :span="4" class='listTitle'>
									方案价格
								</el-col>
								<el-col :span="20">
									<el-input v-model="schemePrice" class='contentInput' placeholder="该方案推荐买多少RMB价格"></el-input>
								</el-col>
						</el-row>
						<el-row class='contentList'>
							<el-col :span="4" class='listTitle'>
								显示时间
							</el-col>
							<el-col :span="20">
								<el-date-picker v-model="displayTime" class='contentInput' type="datetime" format='yyyy-MM-dd HH:mm' placeholder="选择日期时间" align="right">
								</el-date-picker>
							</el-col>
						</el-row>
						<el-row class='contentList'>
							<el-col :span="4" class='listTitle'>
								截止时间
							</el-col>
							<el-col :span="20">
								<el-date-picker v-model="endDataTime" class='contentInput' type="datetime" format='yyyy-MM-dd HH:mm' placeholder="选择日期时间" align="right">
								</el-date-picker>
							</el-col>
						</el-row>
					</div>
				</div>
				<div class='mask2Bottom'>
					<el-button type="success" class='oneBtn1' @click='handleDetale(1)'>上一步</el-button>
					<el-button type="danger" class='oneBtn2' @click='handleDetale(2)'>确定创建方案</el-button>
				</div>
			</div>
		</div>
	</div>
	</div>
</template>

<script>
	import {
		getList,
		sumitHandler,
		sumitPackageHandler,
		schemeDisable
	} from '@/api/programme'
	import {
		matchList,
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
				tableData: [],
				listLoading: true,
				options1: [{
					value:2,
					label: '全部'
				}, {
					value: 1,
					label: '已截止'
				}, {
					value: 0,
					label: '未截止'
				}],
				options2: [{
					value: 0,
					label: '全部'
				}, {
					value: 1,
					label: '正确'
				}, {
					value: 2,
					label: '错误'
				}, {
					value: 3,
					label: '未知'
				}],
				options3: [],
				value1:2,
				value2: 0,
				value3:0 ,
				page: 1,
				total: 0,
				monney: 20,
				radioVanle: '',
				dataList: [],
				matchListData: [],
				passWayList: [], //闯关方式
				isMask: 0, //创建比弹框
				dataShow: {},
				isDetaile: 0, //下一步详情页的弹框 1显示 0隐藏
				preSale:0,
				name:'',
				dataId:'',
				accuracy:90,
				source:'魔力Go',
				payPrice:18,
				customPrice:88,
				originalPrice:100,
				freeMembership:0,
				Indemnity:0,//包赔
				averageOptimization:0,
				schemePrice:null,
				displayTime:'',
				endDataTime:'',
				isShowDeatile:true,
			}
		},
		created() {
			if (window.location.href.indexOf('programmedetaile') >= 0) {
				this.isShowDeatile = false;
			} else {
				this.isShowDeatile = true;
			};
			let timeArry = [];
			for (let i = 0; i < 6; i++) {
				const start = new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * i);
				let startDate = parseTime(start, '{y}-{m}-{d}');
				let obj = {
					value: startDate,
					label: startDate
				}
				timeArry.push(obj);
			};
			let timeName = parseTime(new Date(), '{y}-{m}-{d}').split('-');
			this.name=timeName[1]+'月'+timeName[2]+'日方案';
			this.options3 = timeArry;
			this.fetchData();
		},
		methods: {
			fetchData() {
				this.listLoading = true;
				let data={
					pn: this.page,
					isOver:this.value1,
					follow:'0'
				}
				getList(data).then(response => {
					this.listLoading = false;
					if (response.code == 0) {
						this.total = response.data.total;
						if(response.data.pkgList){
							this.tableData=response.data.pkgList;
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
			//获取比赛详情接口
			matchData() {
				matchList({}).then(response => {
					if (response.code == 0) {
						this.matchListData = response.data.matchList;
						this.passWayList = response.data.passWayList;
						if (response.data.matchList.length) {
							let selectData = [];
							for (let i = 0; i < response.data.matchList.length; i++) {
								let selectObj = {};
								let name = response.data.matchList[i].matchInfo.matchId;
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
					} else {
						Message({
							message: response.message || 'Error',
							type: 'error',
							duration: 1 * 1000
						})
					}
				})
			},
			handleCurrentChange(val) {
				this.page = val;
				this.fetchData();
			},
			maksIsShow(val) {
				if(val==1){
					this.isMask = 1;
				    this.matchData();
				}else {
					this.fetchData();
				}
				
			},
			handleTime(val){
				let time1=new Date().getTime();
				let time2=new Date(val).getTime();
				if(time1<time2){
					return 0
				}else{
					return 1
				}
			},
			siwtchCheak(index, name, num) {
				this.dataList[index]. [name][num].value = !this.dataList[index]. [name][num].value;
			},
			handleMask(index) {
				this.isMask = 0;
				this.isDetaile = 0;
				this.radioVanle='';
			},
			handleDetale(val){
				if(val==1){
					this.isMask=1;
					this.isDetaile=0;
				}else if(val==2 && this.SubmitTips2()){
					this.sumitPackageHandlerData();
				}
			},
			handleClick(index,val){
				if(index==1){
					this.route(val);
				}else if(index==2){
					this.openTip(val.id);
				}
			},
			//跳转详情页
			route(val) {
				this.$router.push({
					path: 'programmedetaile',
					name: '方案预测详情',
					meta: {
						title: '方案预测详情'
					},
					params: {
						id:val.id,
					}
				})
			},
			//玩法下一步
			handleNext() {
				let Submitobj = {};
				let scheme = [];
				let passwayIds = [];
				let treeId = [];
				let num = 0;
				let valuse = [];
				let match = {};
				let wanfaList = [];
				let wanfaListobj = {};
				for (let i = 0; i < this.$refs.tree2.length; i++) {
					if (this.$refs.tree2[i].type == 'primary') {
						let valuseObj = {};
						let fixed = {};
						valuseObj.name = this.$refs.tree2[i].$attrs.dataname.split('/')[1];
						valuseObj.value = this.$refs.tree2[i].$attrs.dataname.split('/')[2];
						if (this.$refs.tree2[i].$attrs.dataname.split('/')[3] != 'a') {
							fixed.name = 'fixedOdds';
							fixed.value = this.$refs.tree2[i].$attrs.dataname.split('/')[3];
						}
						if (treeId.length > 0) {
							if (treeId.indexOf(this.$refs.tree2[i].$attrs.dataname.split('/')[0]) == -1) {
								match = {};
								wanfaList = [];
								wanfaListobj = {};
								valuse = [];
								valuse.push(valuseObj);
								num = 0;
								if (Object.keys(fixed).length != 0) {
									valuse.unshift(fixed);
									num++;
								}
								wanfaListobj.wanfa = 'battle';
								wanfaListobj.values = valuse;
								wanfaList.push(wanfaListobj);
								match.wanfaList = wanfaList;
								match.matchId = this.$refs.tree2[i].$attrs.dataid.matchId;
								match.matchName = this.$refs.tree2[i].$attrs.matchname;
								match.leagueid = this.$refs.tree2[i].$attrs.dataid.leagueId;
								match.leaguename = this.$refs.tree2[i].$attrs.dataid.leagueName;
								match.matchTime = this.$refs.tree2[i].$attrs.matchTime;
								scheme.push(match);
								treeId.push(this.$refs.tree2[i].$attrs.dataname.split('/')[0]);
							} else {
								valuse.push(valuseObj);
								if (!num && Object.keys(fixed).length != 0) {
									valuse.unshift(fixed);
									num++;
								}
								wanfaListobj.values = valuse;
							}
						} else {
							valuse.push(valuseObj);
							if (Object.keys(fixed).length != 0) {
								valuse.unshift(fixed);
								num++;
							}
							treeId.push(this.$refs.tree2[i].$attrs.dataname.split('/')[0])
							wanfaListobj.wanfa = 'battle';
							wanfaListobj.values = valuse;
							wanfaList.push(wanfaListobj);
							match.wanfaList = wanfaList;
							match.matchId = this.$refs.tree2[i].$attrs.dataid.matchId;
							match.matchName = this.$refs.tree2[i].$attrs.matchname;
							match.matchTime = this.$refs.tree2[i].$attrs.matchTime;
							match.leagueid = this.$refs.tree2[i].$attrs.dataid.leagueId;
							match.leaguename = this.$refs.tree2[i].$attrs.dataid.leagueName;
							scheme.push(match);
						}
					}

				}
				let radioVanle = String(this.radioVanle);
				passwayIds.push(radioVanle);
				Submitobj.passwayIds = passwayIds;
				Submitobj.id ='0';
				Submitobj.scheme = scheme;
				this.dataShow = Submitobj;
				if (this.SubmitTips(this.dataShow)) {
					this.sumitHandlerData();
					// this.isDetaile = 1;
				}
			},
			//提交立即过期
			schemeDisableData(pkgId){
				this.listLoading = true
				schemeDisable({
					pkgId:pkgId
				}).then(response => {
					this.listLoading = false;
					if (response.code == 0) {
						Message({
							message: '方案删除成功',
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
			//提交玩法
			sumitHandlerData(){
				this.listLoading = true
				sumitHandler(
					this.dataShow
				).then(response => {
					this.listLoading = false;
					if (response.code == 0) {
						let time=new Date(this.dataShow.scheme[0].matchTime).getTime() - 3600 * 1000;
						let time1=new Date(this.dataShow.scheme[0].matchTime).getTime() - 900 * 1000;
						this.displayTime=parseTime(time, '{y}-{m}-{d} {h}:{i}');
						this.endDataTime=parseTime(time1, '{y}-{m}-{d} {h}:{i}')
						this.isDetaile = 1;
						this.isMask=0;
						this.dataId=response.data;
					} else {
						Message({
							message: response.message || 'Error',
							type: 'error',
							duration: 5 * 1000
						})
					}
				})
			},
			//确定提交方案
			sumitPackageHandlerData(){
				this.listLoading = true;
				let displayTime=parseTime(this.displayTime,'{y}-{m}-{d} {h}:{i}');
				let endDataTime=parseTime(this.endDataTime,'{y}-{m}-{d} {h}:{i}');
				let payBack=this.Indemnity ? 1:0;
				let diamond='';
				if(this.payPrice==5){
					diamond=this.customPrice;
				}else{
					diamond=this.payPrice;
				}
				let schemeIds=[];
				schemeIds.push(this.dataId);
				let dataobj={
					    "schemeIds":schemeIds,
					    "name":this.name,
					    "displayTime":displayTime,
					    "expiredTime":endDataTime,
					    "price":this.schemePrice,
					    "rating":this.accuracy,
					    "payBack":payBack,
					    "source":"魔力Go",
					    "follow":0,
					    "minOdds":"2.3",
					    "maxOdds":"19.3",
					    "diamond":diamond
				};
				sumitPackageHandler(
					dataobj
				).then(response => {
					this.listLoading = false;
					if (response.code == 0) {
						this.isDetaile = 0;
						this.fetchData();
						Message({
							message: '创建方案成功',
							type: 'success',
							duration: 2 * 1000
						});
					} else {
						Message({
							message: response.message || 'Error',
							type: 'error',
							duration: 5 * 1000
						})
					}
				})
			},
			//方案过期提示框操作
			openTip(id){
			   this.$confirm('是否要删除此方案', '提示', {
				          confirmButtonText: '确定',
				          cancelButtonText: '取消',
				          type: 'warning'
				        }).then(() => {
							this.schemeDisableData(id);
				        }).catch(() => {
				          this.$message({
				            type: 'info',
				            message: '已取消删除'
				          });          
				        });
			},
			SubmitTips(data) {
				if (!data.scheme.length) {
					Message({
						message: '请选择方案' || 'Error',
						type: 'error',
						duration: 2 * 1000
					});
					return
				};
				if (!this.radioVanle) {
					Message({
						message: '请选择玩法' || 'Error',
						type: 'error',
						duration: 2 * 1000
					})
					return
				};
				return true;
			},
			SubmitTips2() {
				if (!this.name) {
					Message({
						message: '请填写方案名称' || 'Error',
						type: 'error',
						duration: 2 * 1000
					});
					return
				};
				if (!this.accuracy) {
					Message({
						message: '请填写准确度' || 'Error',
						type: 'error',
						duration: 2 * 1000
					})
					return
				};
				if (!this.source) {
					Message({
						message: '请填写来源' || 'Error',
						type: 'error',
						duration: 2 * 1000
					})
					return
				};
				if (!this.schemePrice) {
					Message({
						message: '请填写方案价格' || 'Error',
						type: 'error',
						duration: 2 * 1000
					})
					return
				};
				if (this.payPrice==5 && !this.customPrice) {
					Message({
						message: '请填写钻石自定义价格' || 'Error',
						type: 'error',
						duration: 2 * 1000
					})
					return
				};
				if (!this.displayTime) {
					Message({
						message: '请选择显示时间' || 'Error',
						type: 'error',
						duration: 2 * 1000
					})
					return
				};
				if (!this.displayTime) {
					Message({
						message: '请选择截止时间' || 'Error',
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
	.app-programme {
		padding-left: 20px;

		.newBtn {
			height: 50px;
			width: 97%;
			margin-top: 20px;

			.btn {
				float: right;
				margin-right: 30px;
			}
		}

		.title {
			height: 80px;
			width: 97%;
			padding: 15px;
			border: 1px solid #cecece;
			margin: 10px 0;

			.titleLeft {
				width: 90%;
				height: 80px;
				float: left;
			}

			.titlecontent {
				float: right;
				margin-right: 30px;
			}

			.endState {
				width: 200px;
				margin-left: 10px;
			}

			.search {
				width: 100px;
				float: left;
			}
		}
        .tableContent{
			.color1{
				color:red;
			}
			.color2{
				color:#70b603;
			}
			.btn{
				display: inline-block;
				padding:0 5px;
				cursor: pointer;
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
					height: 70%;
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

				.competition {
					height: 70%;
					width: 80%;
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

				.content1 {
					width: 90%;
					height: 30%;
					margin-top:65px;
					padding-left: 2px;
                    border: 1px solid #cecece;
                    position: relative;
					margin-left:20px;
					.maskContentTitle {
						position: absolute;
						height: 50px;
						line-height: 50px;
						width: 100px;
						top: -49px;
						border: 1px solid #cecece;
						border-bottom: none;
						left: -1px;
						z-index: 90;
						background-color: #FFFFFF;
						text-align: center;
					}
					.competition {
						height: 98%;
						width:100%;
						margin: 0 auto;
						overflow-y: scroll;
						margin-top:5px;
					}
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
							float: left;
							color: #7F7F7F;
							padding-left: 30px;
						}

						.color1 {
							color: #02A7F0;
						}

						.color2 {
							color: #D9001B;
						}
					}
				}
				.content2{
				   width: 90%;
				   height: 50%;
				   margin-top:65px;
				   padding-left: 2px;
				   border: 1px solid #cecece;
				   position: relative;
				   margin-left:20px;
				   margin-bottom:40px;
				  
				   .maskContentTitle {
						position: absolute;
						height: 50px;
						line-height: 50px;
						width: 100px;
						top: -49px;
						border: 1px solid #cecece;
						border-bottom: none;
						left: -1px;
						z-index: 90;
						background-color: #FFFFFF;
						text-align: center;
				   }
				   .prePontent{
					   padding-left:20px;
				   }
				   .competition{
					   overflow-y: auto;
					   height:100%;
				   }
				   .contentList {
				   	width: 100%;
				   	height: 50px;
				   	margin-top: 20px;
					line-height:50px; 
					
				     .listTitle{
						 text-align: center;
						 
					 }
					 .contentInput2{
						 display: inline-block;
						 width:150px;
					 }
				   	.contentInput {
				   		width: 80%;
				   	}
				   }
				}
				.mask2Bottom{
					width:100%;
					margin-bottom:100px;
					.oneBtn1{
						margin-left:20%;
						margin-right:40px;
						width:260px;
					}
					.oneBtn2{
						width:260px;
					}
				}
			}
		}
		
	}
</style>
