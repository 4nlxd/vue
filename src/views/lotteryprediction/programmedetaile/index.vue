<template>
	<div class="app-programmedetaile">
		<!-- <div class='contentOne'>
			<el-button type="success" class='oneBtn'  @click='handleMask(1)' v-show='!handleTime(dataDetail.expiredTime)'>修改方案</el-button>
		</div> -->
		<div class='contentTwo'>
			<h3 class='contentTwoTitle'>方案信息</h3>
			<div class='detaile'>
				<ul>
					<li>
						<span class='stateTitle'>预测结果</span>
						<span class='sureState' v-if='dataDetail.awardState==0'>待开奖</span>
						<span class='sureState active' v-if='dataDetail.awardState==1'>中奖</span>
						<span class='sureState' v-if='dataDetail.awardState==2'>未中奖</span>
					</li>
					<li>
						<span class='stateTitle'>查看次数</span>
						<span class='sureState'>--</span>
					   
					</li>
					<li style="border-bottom: 1px solid #cecece;">
						<span class='stateTitle'>购买次数</span>
						<span class='sureState'>--</span>
					</li>
				</ul>
			</div>
			<div class='detaile' style='margin-top:20px;'>
				<ul>
					<li>
						<span class='stateTitle'>方案名称</span>
						<span class='sureState' >{{dataDetail.name}}</span>
					</li>
					<li>
						<span class='stateTitle'>创建时间</span>
						<span class='sureState' >{{dataDetail.created}}</span>
					</li>
					<li>
						<span class='stateTitle'>准确度</span>
						<span class='sureState' >{{dataDetail.rating}}</span>
					</li>
					<li>
						<span class='stateTitle'>来源</span>
						<span class='sureState' >{{dataDetail.source}}</span>
					</li>
					<li>
						<span class='stateTitle'>付费状态</span>
						<span class='sureState' v-if='dataDetail.diamond==0'>免费</span>
						<span class='sureState active' v-if='dataDetail.diamond>0'>付费</span>
					</li>
					<li>
						<span class='stateTitle'>付费价格</span>
						<span class='sureState active' >{{dataDetail.diamond}}钻石</span>
					</li>
					<li>
						<span class='stateTitle'>不中包赔</span>
						<span class='sureState' v-if='dataDetail.payBack==0'>不支持</span>
					    <span class='sureState' v-if='dataDetail.payBack==1'>支持</span>
					</li>
					<li>
						<span class='stateTitle'>方案(推荐)价格</span>
						<span class='sureState active'>￥{{dataDetail.price}}</span>
					</li>
					<li>
						<span class='stateTitle'>显示时间</span>
						<span class='sureState'>{{dataDetail.displayTime}}</span>
					</li>
					<li style="border-bottom: 1px solid #cecece;">
						<span class='stateTitle' >截止时间</span>
						<span class='sureState'>{{dataDetail.expiredTime}}</span>
					</li>
				</ul>
			</div>
		</div>
		<div>
			<div class='contentFour' v-for='(item,key) in program'>
				<div class='contentTwoTitle'>
					<h3>方案</h3>
				</div>
				<div class='detaile'>
					<ul>
						<li>
							<span class='stateTitle'>玩法</span>
							<span class='sureState'>{{item.passwary}}</span>
						</li>
					</ul>
					<ul style="border-bottom: 1px solid #cecece;" >
						<li v-for='(data,key) in item.matchList'>
							<span class='stateTitle'>比赛{{Number(key)+1}}</span>
							<span class='sureState'>
								<strong class='color1'>【{{data.homeName}} VS {{data.guestName}}】</strong>
								<strong class='color2' v-for='data1 in data.wanfaList'>
								<span v-for='data2 in data1.values'>
									{{data2.name=='hwinOdds' ? '胜':''}}
									{{data2.name=='hdrawOdds' ? '平':''}}
									{{data2.name=='hloseOdds' ? '负':''}}
								</span>
								<span v-if='data1.values[data1.values.length-1].value!=0'>| 让({{data1.values[data1.values.length-1].value}})</span>
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
	    </div>
		<div class='documentarymask' v-show='isMask'>
			<div class='documentarymaskcontent'>
				<h3 class='maskTitle'>
					创建跟单方案
				</h3>
				<i class="el-icon-close" @click='handleMask(0)'></i>
				<div class='maskContent'>
					<span class='maskContentTitle'>方案选择</span>
					<div class='competition'>
						<ul>
							<li class='competitionContent' v-for='(item,key) in matchListData'>
								<ul>
									<li >
										<span class='stateTitle'>{{item.matchInfo.startTime}}</span>
										<span class='sureState'>{{item.matchInfo.num}} {{item.matchInfo.homeTeamName}} VS {{item.matchInfo.guestTeamName}} </span>
									</li>
									<li>
										<span class='stateTitle'>玩法：胜平负</span>
										<span class='sureState'>
											<el-button v-for="(data,index) in dataList[key][item.matchInfo.matchId].slice(0,3)" ref="tree2" :type="data.value ? 'primary':'info'"  :dataid="item.matchInfo" 
											:dataname="item.matchInfo.matchId+'/'+data.name+'/'+item.battleInfo[data.name]+'/'+'a'" 
											:matchname="item.matchInfo.homeTeamName+'VS'+item.matchInfo.guestTeamName"
											 v-if='item.battleInfo[data.name]' @click="siwtchCheak(key,item.matchInfo.matchId,index)">
											{{data.name=='hwinOdds'? '胜':data.name=='hdrawOdds'?'平':'负'}}
											({{item.battleInfo[data.name]}})
											</el-button>
										</span>
									</li>
									<li style="border-bottom: 1px solid #cecece;">
										<span class='stateTitle'>玩法：让球({{item.battleInfo.fixedOdds}})</span>
										<span class='sureState'>
										<el-button v-for="(data,index) in dataList[key][item.matchInfo.matchId].slice(3,6)" ref="tree2" :type="data.value ? 'primary':'info'"  :dataid="item.matchInfo"
										:dataname="item.matchInfo.matchId+'/'+data.name+'/'+item.battleInfo[data.name]+'/'+item.battleInfo.fixedOdds" 
										:matchname="item.matchInfo.homeTeamName+'VS'+item.matchInfo.guestTeamName"
										 v-if='item.battleInfo[data.name]' @click="siwtchCheak(key,item.matchInfo.matchId,index+3)">
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
				<el-button type="success" class='sureSbmit' @click='sureSubmitData'>下一步</el-button>
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
</template>

<script>
	import {
		matchList,
	} from '@/api/lotteryprediction'
	import {
		schemeDetail,
		sumitHandler
	} from '@/api/programme'
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
				listLoading: true,
				isMask:0,
				isDetaile:0,
				dataId:'',
				radioVanle:'',
				matchListData:[],//比赛列表
				passWayList:[],//闯关方式
				dataDetail:{},
				dataList:[],
				program:[],//方案列表
				dataShow:{},
				name:'',
				accuracy:90,
				source:'魔力Go',
				payPrice:18,
				customPrice:88,
				// originalPrice:100,
				// freeMembership:0,
				Indemnity:0,//包赔
				averageOptimization:0,
				schemePrice:null,
				displayTime:'',
				endDataTime:'',
				priceArry:[18,28,38,58]
			}
		},
		created() {
			this.dataId=this.$route.params.id;
			this.fetchData();
		},
		methods: {
			//跟单详情接口
			fetchData() {
				this.listLoading = true;
				schemeDetail({pkgId:this.dataId}).then(response => {
					this.listLoading = false;
					if(response.code==0){
					    this.dataDetail=response.data || {};
					    this.program=response.data.schemeList || [];
					    this.name=response.data.name;
					    this.rating=response.data.rating;
						this.source=response.data.source;
						this.payBack=response.data.payBack;
						this.schemePrice=response.data.price;
						this.displayTime=response.data.displayTime;
						this.endDataTime=response.data.expiredTime;
						if(this.priceArry.indexOf(response.data.diamond)>-1){
							this.payPrice=response.data.diamond;
						}else{
							this.payPrice=5;
							this.customPrice=response.data.diamond;
						}
					}
				})
			},
			//获取比赛详情接口
			matchData(){
			   matchList({}).then(response =>{
				   if(response.code==0){
					   this.matchListData=response.data.matchList;
					   this.passWayList=response.data.passWayList;
					   if(response.data.matchList.length){
						   let selectData=[];
						   for(let i=0;i<response.data.matchList.length;i++){
									let  selectObj={};
								    let name=response.data.matchList[i].matchInfo.matchId;
									selectObj[name]=[
										{name:'hwinOdds',value:false},
										{name:'hdrawOdds',value:false},
										{name:'hloseOdds',value:false},
										{name:'gwinOdds',value:false},
										{name:'gdrawOdds',value:false},
										{name:'gloseOdds',value:false},
										];
										selectData.push(selectObj);
							}
							let matchList=this.program[0].matchList;
							console.log(matchList,selectData);
							       for(let i=0;i<selectData.length;i++){
							    	for(let j=0;j<matchList.length;j++){
							    		let wanfaList=matchList[j].wanfaList[0];
							    		for(let k=0;k<wanfaList.values.length;k++){
							    			let arr=selectData[i][matchList[j].matchId];
											console.log(arr)
							    			if(arr){
							    				for(let g=0;g<arr.length;g++){
													console.log(arr[g])
							    					if(arr[g].name==wanfaList.values[k].name){
							    						arr[g].value=true;
							    					}
							    				}
							    			}
							    		}
							    	}
							    }
						  this.dataList=selectData;
				      }
				   }else{
					   Message({
					   	message: response.message || 'Error',
					   	type: 'error',
					   	duration: 1 * 1000
					   })
				   }
			   })
			},
	       //提交方案事件
			sureSubmitData(){
				let Submitobj={};
				let scheme=[];
				let passwayIds=[];
				let treeId=[];
				let num=0;
				let valuse=[];
				let match={};
				let wanfaList=[];
				let wanfaListobj={};
				if(!this.$refs.tree2){
					return;
				};
				for(let i=0;i<this.$refs.tree2.length;i++){
					if(this.$refs.tree2[i].type=='primary'){
						let valuseObj={};  
						let fixed={};
						valuseObj.name=this.$refs.tree2[i].$attrs.dataname.split('/')[1];
						valuseObj.value=this.$refs.tree2[i].$attrs.dataname.split('/')[2];
						if(this.$refs.tree2[i].$attrs.dataname.split('/')[3]!='a'){
							fixed.name='fixedOdds';
							fixed.value=this.$refs.tree2[i].$attrs.dataname.split('/')[3];
						}
						if(treeId.length>0){
							if(treeId.indexOf(this.$refs.tree2[i].$attrs.dataname.split('/')[0])==-1){
								match={};
								wanfaList=[];
								wanfaListobj={};
								valuse=[];
								valuse.push(valuseObj);
								num=0;
								if(Object.keys(fixed).length != 0){
									valuse.unshift(fixed);
									num++;
								}
								wanfaListobj.wanfa='battle';
								wanfaListobj.values=valuse;
								wanfaList.push(wanfaListobj);
								match.wanfaList=wanfaList;
								match.matchId=this.$refs.tree2[i].$attrs.dataid.matchId;
								match.matchName=this.$refs.tree2[i].$attrs.matchname;
								match.leagueid=this.$refs.tree2[i].$attrs.dataid.leagueId;
								match.leaguename=this.$refs.tree2[i].$attrs.dataid.leagueName;
								scheme.push(match);
								treeId.push(this.$refs.tree2[i].$attrs.dataname.split('/')[0]);
							}else {
								valuse.push(valuseObj);
							    if(!num && Object.keys(fixed).length != 0){
									valuse.unshift(fixed);
									num++;
							    }
							 wanfaListobj.values=valuse;
							}
						}else{
							valuse.push(valuseObj);
							if(Object.keys(fixed).length != 0){
								valuse.unshift(fixed);
								num++;
							}
							treeId.push(this.$refs.tree2[i].$attrs.dataname.split('/')[0])
							wanfaListobj.wanfa='battle';
							wanfaListobj.values=valuse;
							wanfaList.push(wanfaListobj);
							match.wanfaList=wanfaList;
							match.matchId=this.$refs.tree2[i].$attrs.dataid.matchId;
							match.matchName=this.$refs.tree2[i].$attrs.matchname;
							match.leagueid=this.$refs.tree2[i].$attrs.dataid.leagueId;
							match.leaguename=this.$refs.tree2[i].$attrs.dataid.leagueName;
							scheme.push(match);
						}
					}
					
				}
				let radioVanle=String(this.radioVanle);
				passwayIds.push(radioVanle);
				Submitobj.passwayIds=passwayIds;
				Submitobj.id=this.dataId;
				Submitobj.scheme=scheme;
				Submitobj.price=this.monney;
				this.dataShow=Submitobj;
				if(this.SubmitTips(this.dataShow)){
					this.sumitHandlerData();
				}
			},
			//提交玩法
			sumitHandlerData(){
				this.listLoading = true
				sumitHandler(
					this.dataShow
				).then(response => {
					this.listLoading = false;
					if (response.code == 0) {
						this.isDetaile = 1;
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
				let dataobj={
					    "id":this.dataId,
					    "name":this.name,
					    "schemeIds":this.dataShow.passwayIds,
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
							message: '方案修改成功',
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
			handleTime(val){
				let time1=new Date().getTime();
				let time2=new Date(val).getTime();
				if(time1<time2){
					return 0
				}else{
					return 1
				}
			},
			handleDetale(val){
				if(val==1){
					this.isMask=1;
					this.isDetaile=0;
				}else if(val==2 && this.SubmitTips2()){
					this.sumitPackageHandlerData();
				}
			},
			handleMask(index){
					this.isMask=index;
					let val=this.program[0];
					if(val.passwary=='3串1'){
						this.radioVanle=2;
					}else if(val.passwary=='2串1'){
						this.radioVanle=1;
					}
				   this.matchData();
			},
			siwtchCheak(index,name,num){
				this.dataList[index].[name][num].value=!this.dataList[index].[name][num].value;
			},
			SubmitTips(data) {
				if (!data.scheme && !data.scheme.length) {
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
	* {
		margin: 0;
		padding: 0
	}

	.app-programmedetaile{
		padding-left: 20px;
        margin-bottom:20px;
		height:100%;
		position: relative;
		.contentOne {
			width: 97%;
			height:80px;
            position: fixed;
			left:50px;
			padding-right:3%;
			background-color: #fff;
			box-shadow: 0 1px 4px rgba(0,21,41,.08);
			z-index:888;
			overflow: hidden;
			.oneBtn {
				float: right;
				width: 100px;
				height: 40px;
				margin: 25px 10px;
			}
		}

		.contentTwo {
			padding-top:90px;
			.contentTwoTitle {
				width:97%;
				line-height: 50px;
				padding-left: 20px;
				background-color: #666666;
				color: #FFFFFF;
			}

			.detaile {
				margin-top: 20px;

				li {
					list-style: none;
					width: 60%;
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
						color:#7F7F7F;
					}

					.sureState {
						width: 70%;
						line-height: 48px;
						height: 48px;
						text-align: center;
						float: left;
						color:#7F7F7F;
					}
					.active{
						color:red;
					}
				}
			}
		}
		.contentFour{
			margin-top: 20px;
			.contentTwoTitle {
				line-height: 50px;
				padding-left: 20px;
				background-color: #666666;
				color: #FFFFFF;
				width:96%;
				height:50px;
				h3{
					width:60%;
					float:left;
				}
				.btnFour{
					float:right;
					margin-right:10px;
					height:40px;
					margin-top:5px;
				}
				
			}
			.detaile {
				margin-top: 20px;
				ul{width:60%;}
				li {
					list-style: none;
					width:100%;
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
						color:#7F7F7F;
					}
					
					.sureState {
						width: 70%;
						line-height: 48px;
						height: 48px;
						text-align: center;
						float: left;
						color:#7F7F7F;
					}
					.color1{
						color:#02A7F0;
					}
					.color2{
						color:#D9001B;
					}
				}
			}
		}
		.addBtnFour{
			width:120px;
			height:40px;
			float: right;
			margin-top:5px;
			margin-right:10px;
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
				.competition{
					height:70%;
					width: 80%;
					margin:0 auto;
					overflow-y: scroll;
					margin-bottom:20px;
					.competitionContent{
						list-style: none;
						width:100%;
						margin-top:15px;
						li{
							list-style: none;
							width:100%;
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
								color:#7F7F7F;
							}
							.sureState {
								width: 70%;
								line-height: 48px;
								height: 48px;
								text-align: center;
								float: left;
								color:#7F7F7F;
							}
							
						}
						
					}
				}
				.contentList{
					width:100%;
					height:50px;
					margin-top:20px;
					.contentInput {
						width: 80%;
					}
				}
		    }
			.sureSbmit{
				width:200px;
				height:40px;
				display: block;
				margin:20px auto;
			}
	    }
		.documentarymask2{
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
