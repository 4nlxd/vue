<template>
	<div class="app-documentarydemo">
		<div class='contentOne'>
			<el-button type="success" class='oneBtn'  @click='handlerTicket(1)' v-show='dataDetail.saleState!=-1 && dataDetail.ticketState==0 && !handleTime(dataDetail.expiredTime)'>开始出票</el-button>
			<el-button type="danger" class='oneBtn'   @click='handlerTicket(2)' v-if='dataDetail.saleState!=-1 && !handleTime(dataDetail.expiredTime)'>{{isSuspend}}</el-button>
			<el-button type="primary" class='oneBtn'  @click='handlerTicket(3)' v-if='dataDetail.ticketState==0 && dataDetail.saleState!=-1'>退单</el-button>
		</div>
		<div class='contentTwo'>
			<h3 class='contentTwoTitle'>跟单状态</h3>
			<div class='detaile'>
				<ul>
					<li>
						<span class='stateTitle'>购买状态</span>
						<span class='sureState' v-if='dataDetail.saleState!=-1' :class="{'active': handleTime(dataDetail.expiredTime)}">{{handleTime(dataDetail.expiredTime)?'已截止' :'未截止'}}</span>
						<span class='sureState' v-if='dataDetail.saleState==-1' >已关闭</span>
					</li>
					<li>
						<span class='stateTitle'>暂停状态</span>
						<span class='sureState' v-if='dataDetail.saleState!=0'>正常</span>
					    <span class='sureState active' v-if='dataDetail.saleState==0'>已暂停</span>
					</li>
					<li>
						<span class='stateTitle'>已支付金额</span>
						<span class='sureState active'>￥{{dataDetail.paidAmount}}</span>
					</li>
					<li>
						<span class='stateTitle'>已出票金额</span>
						<span class='sureState' v-if='dataDetail.ticketState==0'>未开始出票 </span>
						<span class='sureState active' v-if='dataDetail.ticketState==1'>￥{{dataDetail.ticketIssuedAmount}}</span>
					</li>
					<li>
						<span class='stateTitle'>中奖状态</span>
						<span class='sureState' v-if='dataDetail.awardAmount==-1'>未中奖</span>
						<span class='sureState' v-if='dataDetail.awardAmount==0'>待开奖</span>
						<span class='sureState active' v-if='dataDetail.awardAmount>0'>已中奖￥{{dataDetail.awardAmount}}</span>
					</li>
					<li style="border-bottom: 1px solid #cecece;">
						<span class='stateTitle' >理论奖金</span>
						<span class='sureState'>￥{{dataDetail.maxBonusAmount}}</span>
					</li>
				</ul>
			</div>
		</div>
		<div class='contentThree'>
			<div class='contentTwoTitle'>
				<h3>跟单信息</h3>
				<el-button class='btnThree' type="success"  v-show='!isModify' @click='handleModify(true)'  v-if='dataDetail.saleState!=-1 && dataDetail.ticketState==0 && !handleTime(dataDetail.expiredTime)'>修改信息</el-button>
			    <el-button class='btnThree' v-if='isModify' type="danger"   @click='handleModify(false)'>取消修改</el-button>
				<el-button class='btnThree' v-if='isModify' type="success"  @click='handleUpate()'>提交修改</el-button>
			</div>
			
			<div class='detaile'>
				<ul>
					<li>
						<span class='stateTitle'>总期数</span>
						<span class='sureState'>#{{dataDetail.period}}</span>
					</li>
					<li>
						<span class='stateTitle'>跟单名称</span>
						<span class='sureState active1' v-if='!isModify'>{{dataDetail.name}}</span>
						<el-input class='modifyState' v-model="name" v-if='isModify' placeholder="请输入内容"></el-input>
					</li>
					<li>
						<span class='stateTitle'>显示截止购买时间</span>
						<span class='sureState active1' v-if='!isModify'>{{dataDetail.expiredTime}}</span>
						<el-date-picker v-model="dataTime" v-if='isModify' class='modifyState' type="datetime" placeholder="选择日期时间" align="right">
						</el-date-picker>
					</li>
					<li>
						<span class='stateTitle'>准确率</span>
						<span class='sureState active1' v-if='!isModify'>{{dataDetail.rating}}%</span>
						<el-input class='modifyState' v-model="accuracy" v-if='isModify' placeholder="请输入内容"></el-input>
					</li>
					<li>
						<span class='stateTitle'>预购金额</span>
						<span class='sureState'>￥{{dataDetail.price}}</span>
					</li>
					<li style="border-bottom: 1px solid #cecece;">
						<span class='stateTitle'>预售方案</span>
						<span class='sureState active1' v-if='!isModify'>{{dataDetail.presale==0 ? '否':'是'}}</span>
						<el-switch class='modifyState' v-model="preSale"  v-if='isModify' active-text="预售" inactive-text="非预售">
						</el-switch>
					</li>
				</ul>
			</div>
		</div>
		<div>
			<div class='contentFour' v-for='(item,key) in program'>
				<div class='contentTwoTitle'>
					<h3>方案{{Number(key)+1}}</h3>
					<el-button class='btnFour' type="success" @click='handleMask(2,item)' v-if='dataDetail.saleState!=-1 && dataDetail.ticketState==0 && !handleTime(dataDetail.expiredTime)'>修改方案</el-button>
					<el-button class='btnFour' type="danger" @click='handleDelete(item)' v-if='dataDetail.saleState!=-1 && dataDetail.ticketState==0 && !handleTime(dataDetail.expiredTime)'>删除方案</el-button>
				</div>
				<div class='detaile'>
					<ul>
						<li>
							<span class='stateTitle'>玩法</span>
							<span class='sureState'>{{item.passwary}}</span>
						</li>
						<li>
							<span class='stateTitle'>金额</span>
							<span class='sureState'>￥{{item.price}}</span>
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
			<div class='addfaBtnFour'>
				<el-button class='addBtnFour' type="success" @click='handleMask(1)' v-if='dataDetail.saleState!=-1 && program.length<5 && dataDetail.ticketState==0 && !handleTime(dataDetail.expiredTime)'>添加方案</el-button>
			</div>
		
	    </div>
		<div class='documentarymask' v-show='isMask'>
			<div class='mask2' v-show='isDetaile'>
			    <div class='mask2Content' >
					<div class='mask2ContentTop'>
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
					<div class='mask2Bottom'>
						<el-button type="success" class='oneBtn1' @click='handleDeleteDetale(1)'>确定方案</el-button>
						<el-button type="danger" class='oneBtn2' @click='handleDeleteDetale(2)'>取消方案</el-button>
					</div>
				</div>
			</div>
			
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
					<el-row class='contentList'>
						<el-col :span="4">
							方案金额：
						</el-col>
						<el-col :span="20">
							<el-input v-model="monney" class='contentInput'  placeholder="请输入预购金额"></el-input>
						</el-col>
					</el-row>
				</div>
				<el-button type="success" class='sureSbmit' @click='sureSubmitData'>确定</el-button>
		   </div>
		</div>
	</div>
</template>

<script>
	import {
		schemeDetail,
		schemeUpdate,
		schemeList,
		matchList,
		schemeHandler,
		schemeHandlerUpdata,
		schemeDel,
		schemePackageIssue,
		schemePackagesalestate,
		schemePackageRefund,
		schemePackageMaxOdds
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
				isModify:false,
				name:'',
				accuracy:90,
				preSale:false,
				dataTime:'2020/12/1 10:00',
				radioVanle:'',
				isMask:0,
				isDetaile:0,
				dataId:'',
				monney:30,
				isSuspend:'暂停购买',
				maxPrice:20,
				matchListData:[],//比赛列表
				passWayList:[],//闯关方式
				dataDetail:{},
				dataList:[],
				editData:[],
				program:[],//方案列表
				editDataShow:{},
				dataShow:{},
			}
		},
		created() {
			this.dataId=this.$route.params.id;
			this.fetchData();
			this.schemeListData();
		},
		methods: {
			//跟单详情接口
			fetchData() {
				this.listLoading = true;
				schemeDetail({pkgId:this.dataId}).then(response => {
					this.listLoading = false;
					if(response.code==0){
					   this.dataDetail=response.data;
					   this.name=response.data.name;
					   this.dataTime=response.data.expiredTime;
					   this.preSale=response.data.presale==0 ? false:true;
					   this.accuracy=response.data.rating;
					   if(response.data.saleState==0 ){
						   this.isSuspend='恢复购买';
					   }else{
						  this.isSuspend='暂停购买';  
					   }
					}
				})
			},
			//修改跟单信息接口
			updateFetchData() {
				this.listLoading = true;
				let endTime = parseTime(this.dataTime, '{y}-{m}-{d} {h}:{i}');
				let presale = this.preSale ? 1 : 0;
				let datalist = {
					'id':this.dataId,
					"expiredTime": endTime,
					"name": this.name,
					"presale": presale,
					"rating": this.accuracy,
				}
				schemeUpdate(datalist).then(response => {
					this.listLoading = false;
	                this.handleModify(false);
					if (response.code == 0) {
			             this.fetchData();
						 Message({
						 	message: '跟单信息修改成功' || 'Error',
						 	type: 'success',
						 	duration: 1 * 1000
						  })
					} else {
						Message({
							message: response.message || 'Error',
							type: 'error',
							duration: 1 * 1000
						})
					}
				})
			},
			//获取方案详情接口
			schemeListData(){
				   schemeList({pkgId:this.dataId}).then(response =>{
					    if(response.code==0){
							this.program=response.data.list || [];
						}else {
							Message({
								message: response.message || 'Error',
								type: 'error',
								duration: 1 * 1000
							})
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
						   if(this.isMask==2){
							   let matchList=this.editDataShow.matchList;
							    for(let i=0;i<selectData.length;i++){
							    	for(let j=0;j<matchList.length;j++){
							    		let wanfaList=matchList[j].wanfaList[0];
							    		for(let k=0;k<wanfaList.values.length;k++){
							    			let arr=selectData[i][matchList[j].matchId];
							    			if(arr){
							    				for(let g=0;g<arr.length;g++){
							    					if(arr[g].name==wanfaList.values[k].name){
							    						arr[g].value=true;
							    					}
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
			//提交方案接口
			schemeHandlerData(data){
				schemeHandler(data).then(response =>{
					  if(response.code==0){
						  this.schemeListData();
						  this.isMask=0;
						  this.isDetaile=0;
						  Message({
						  	message: '方案创建成功' || 'Error',
						  	type: 'success',
						  	duration: 1 * 1000
						   })
					  }else{
						 Message({
						 	message: response.message || 'Error',
						 	type: 'error',
						 	duration: 1 * 1000
						 }) 
					  }
				   })
			},
			//修改方案接口
			schemeHandlerUpdataData(data){
				schemeHandlerUpdata(data).then(response =>{
					  if(response.code==0){
						  this.schemeListData();
						  this.isMask=0;
						  this.isDetaile=0;
						  Message({
						  	message: '方案修改成功' || 'Error',
						  	type: 'success',
						  	duration: 1 * 1000
						   })
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
					this.isDetaile=1;
				}
			},
			handleDeleteDetale(val){
				if(val==2){
					this.isDetaile=0;
				}
				if(val==1){
					if(this.isMask==1){
						this.schemeHandlerData(this.dataShow);
					}
					if(this.isMask==2){
						this.dataShow.schemeId=this.editDataShow.schemeId;
						this.schemeHandlerUpdataData(this.dataShow);
					}
				}
			},
			//删除方案接口
			schemeDelData(data){
				schemeDel(data).then(response =>{
					  if(response.code==0){
						  this.schemeListData();
						  Message({
						  	message: '方案删除成功' || 'Error',
						  	type: 'success',
						  	duration: 2 * 1000
						   })
					  }else{
						 Message({
						 	message: response.message || 'Error',
						 	type: 'error',
						 	duration: 2 * 1000
						 }) 
					  }
				   })
			},
			//退单接口
			schemePackageRefundData(){
				schemePackageRefund({pkgId:this.dataId}).then(response =>{
						  if(response.code==0){
							 this.fetchData();
							  this.isMask=0;
							  Message({
							  	message: '退单成功' || 'Error',
							  	type: 'success',
							  	duration: 2 * 1000
							   })
						  }else{
							 Message({
							 	message: response.message || 'Error',
							 	type: 'error',
							 	duration: 2 * 1000
							 }) 
						  }
					   })
				},
			//出票查询最大奖金数
				schemePackageMaxOddsData(val){
					schemePackageMaxOdds({pkgId:this.dataId}).then(response =>{
							  if(response.code==0){ 
								 this.maxPrice=response.data
								 this.openTip('',val);
							  }else{
								 Message({
								 	message: response.message || 'Error',
								 	type: 'error',
								 	duration: 2 * 1000
								 }) 
							  }
						   })
					},
			//出票与退单操作
			handlerTicket(val){
				let message='';
				if(val==1){
					this.schemePackageMaxOddsData(val);
				}else if(val==2){
				 this.schemePackagesalestateData();
				}else{
					message='是否退单'
					this.openTip(message,val);  
				}
				
			},
			//出票与退单提示框操作
			openTip(message,val){
				let msg=null;
				let showInput=false;
				if(val==1){
					msg='<div class="maxbox"><span>最大理论奖金</span><el-input v-model="maxPrice" placeholder="请输入内容" class="maxPrice"></el-input></div>'
				    showInput=true;
				}else{
					msg=message;
					showInput=false;
				}
			   this.$prompt(msg, '提示', {
				          dangerouslyUseHTMLString:true,
						  showInput:showInput,
						  inputValue:this.maxPrice,
						  inputPlaceholder:'输入最大理论奖金',
						  inputPattern: /\S/,
						  inputValidator:(value)=>{
							  if(value==0){
								  return false;
							  }
						  },
						  inputErrorMessage: '最大理论奖金不能为空或0',
						  confirmButtonText: '确定',
				          cancelButtonText: '取消',
				          type: 'warning'
				        }).then((value) => {
							if(val==1){
								this.schemePackageIssueData(value.value);
							}else if(val==3){
								this.schemePackageRefundData();
							}
				        }).catch(() => {
				          this.$message({
				            type: 'info',
				            message: '已取消删除'
				          });          
				        });
			},
			//出票接口
			schemePackageIssueData(data){
				schemePackageIssue({pkgId:this.dataId,maxOdds:data}).then(response =>{
					  if(response.code==0){
						 this.fetchData();
						  Message({
						  	message: '出票成功' || 'Error',
						  	type: 'success',
						  	duration: 2 * 1000
						   })
					  }else{
						 Message({
						 	message: response.message || 'Error',
						 	type: 'error',
						 	duration: 2 * 1000
						 }) 
					  }
				   })
			},
			//暂停接口
			schemePackagesalestateData(){
				let saleState= this.isSuspend=='暂停购买' ? 0:1;
				schemePackagesalestate({pkgId:this.dataId,saleState:saleState}).then(response =>{
					  if(response.code==0){
						 this.fetchData();
						  Message({
						  	message: this.isSuspend+'成功' || 'Error',
						  	type: 'success',
						  	duration: 2 * 1000
						   })
					  }else{
						 Message({
						 	message: response.message || 'Error',
						 	type: 'error',
						 	duration: 2 * 1000
						 }) 
					  }
				   })
			},
			handleDelete(val){
				let data={
					pkgId:this.dataId,
					schemeId:val.schemeId,
				}
				this.schemeDelData(data);
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
			handleModify(val){
				this.isModify=val;
			},
			handleUpate(){
				if(this.tips()){
					this.updateFetchData();
				}
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
				return true;
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
				if (!this.monney ) {
					Message({
						message: '方案金额不能为空',
						type: 'error',
						duration: 2 * 1000
					})
					return
				}else if(this.monney<2){
					Message({
						message: '方案金额不能小于2元',
						type: 'error',
						duration: 2 * 1000
					})
					return
				}else if(this.monney%2!=0){
					Message({
						message: '方案金额必须为偶数与整数',
						type: 'error',
						duration: 2 * 1000
					})
					return
				};
				return true;
			},
			handleMask(index,val){
				if(index==1 || index==0){
					this.isMask=index;
					this.monney=30;
					this.radioVanle='';
				}else{
					this.isMask=index;
					this.editDataShow=val;
					if(val.passwary=='3串1'){
						this.radioVanle=2;
					}else if(val.passwary=='2串1'){
						this.radioVanle=1;
					}
					this.monney=val.price;
				}
				this.matchData();
			},
			siwtchCheak(index,name,num){
				this.dataList[index].[name][num].value=!this.dataList[index].[name][num].value;
			}
		}
	}
</script>
<style lang="scss">
	* {
		margin: 0;
		padding: 0
	}

	.app-documentarydemo {
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
		.contentThree {
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
				.btnThree{
					float:right;
					margin-right:10px;
					height:40px;
					margin-top:5px;
				}
				
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
					.modifyState{
						width: 60%;
						float: left;
						color:#7F7F7F;
						margin:4px 10px;
						height:40px;
					}
					.active1{
						color:#409EFF;
					}
				}
			}
			.bottomtn{
				height:40px;
				margin-top:20px;
				width:260px;
				margin-left:300px;
				.sucessbtn{
					margin-left:30px;
					height:40px;
					width:100px;
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
		.addfaBtnFour{
			margin-top:50px;
			height:50px;
			width:96%;
			background-color: #666666;
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
			 .mask2{
				position: fixed;
				width: 100%;
				height: 100%;
				left: 0;
				top: 0;
				background: rgba(0, 0, 0, .5);
				z-index: 2001;
				 .mask2Content{
					height: 70%;
					width: 60%;
					position: absolute;
					left: 50%;
					margin-top:9%;
					margin-left: -30%;
					background: #fff;
					.mask2ContentTop{
						width:80%;
						height:55%;
						overflow-y:auto;
						margin:30px auto;
					}
					.mask2Bottom{
						width:100%;
						margin: 0 auto;
						.oneBtn1{
							margin-left:36%;
							margin-right:40px;
						}
					}
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
							float: left;
							color:#7F7F7F;
							padding-left:20px;
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
	}
</style>
