<template>
  <div class="app-withdrawal">
	 <div class='title'>
		<div class='titleLeft'>
			<el-row>
			  <el-col :span="12">
				<div class='titlecontent'>
					<span>状态</span>
					<el-select v-model="value" placeholder="全部" class='endState'>
						<el-option
						  v-for="item in options1"
						  :key="item.value"
						  :label="item.label"
						  :value="item.value">
						</el-option>
					</el-select>
			    </div>
			  </el-col>
			  <el-col :span="12">
				<div class='titlecontent'>
					<span>日期</span>
					<el-date-picker
						  class='endState1'
						  v-model="datatime"
						  type="daterange"
						  range-separator="至"
						  start-placeholder="开始日期"
						  end-placeholder="结束日期">
				    </el-date-picker>
			    </div>
			  </el-col>
			</el-row>
			
			
		</div>
		<el-button type="primary" class='search' @click='handleSerch'>查询</el-button>
	 </div>
	 <div class='title2'>
		 <ul>
			 <li>
				 <span class='name'>提现笔数/总笔数</span>
				 <span class='number'>{{totalNum}}</span>
			 </li>
			 <li>
			 	 <span class='name' >总申请金额</span>
			 	 <span class='number'>{{totalAmount}}</span>
			 </li>
			 <li>
			 	<span class='name'>总提现金额</span>
                <span class='number'>{{successAmount}}</span>
			 </li>
		 </ul>
	 </div>
	 <div>
		 <el-table
		    :data="tableData"
		    border
		    style="width: 97%">
		    <el-table-column
		      prop="uid"
		      label="用户ID"
		      >
		    </el-table-column>
		    <el-table-column
		      prop="mobile"
		      label="手机号"
		     >
		    </el-table-column>
		    <el-table-column
		      prop="amount"
		      label="提现金额"
		      >
		    </el-table-column>
		    <el-table-column
		      prop="channelName"
		      label="提现方式"
		     >
		    </el-table-column>
		    <el-table-column
		      prop="accountInfo"
		      label="账号"
		     >
		    </el-table-column>
		    <el-table-column
		      prop="created"
		      label="时间"
		      >
		    </el-table-column>
			<el-table-column
			  prop="stateName"
			  label="状态"
			  >
			</el-table-column>
			<el-table-column
			  prop="memo"
			  label="取消提现原因"
			  >
			</el-table-column>
		    <el-table-column
		      label="操作"
			  fixed="right"
		      >
		      <template slot-scope="scope">
		        <el-button v-if='scope.row.state==0' @click="handleSucess(scope.row,1,scope.$index)" type="text" size="small">完成提现</el-button>
		        <el-button v-if='scope.row.state==0' @click="handleDelete(scope.row,2,scope.$index)" type="text" size="small">取消提现</el-button>
		      </template>
		    </el-table-column>
		  </el-table>
	 </div>
    <div class='bottom'>
		<el-pagination class='page'
		 @current-change="handleCurrentChange"
		  background
		  layout="prev, pager, next"
		  :total='total'>
		</el-pagination>
	</div>
	<div class='mask' v-if='isshow'>
		<div  v-bind:class="[isTy==2 ?'maskContent1' : 'maskContent']">
			<h3 class='maskTile' v-if="isTy==1">
				完成提现
			</h3>
			<h3 class='maskTile' v-if="isTy==2">
				取消提现
			</h3>
		   <div class='maskDetail'>
			    <p class='deatail' v-if="isTy==1">确认完成提现吗?</p>
				<p class='deatail' v-if="isTy==2">确认取消提现吗?</p>
			    <p>提现方式:{{singeDate ? singeDate.stateName:'' }}</p>
				<p>提现账号:{{singeDate ? singeDate.accountInfo:'' }}</p>
				<p>提现金额:￥{{singeDate ? singeDate.amount:'' }}</p>
				<p>确认后，该申请将设置为完成。</p>
				<div class='case' v-if="isTy==2">
					<span>请输入原因</span>
					<el-input
					class='caseTextarea'
					  type="textarea"
					  :rows="4"
					  placeholder="请输入内容"
					  v-model="resion">
					</el-input>
				</div>
		   </div>
		   <div class='maskBottom'>
			  <el-button type="primary" class='btn1'  @click="handleConfig()">确认</el-button>
			  <el-button type="danger" class='btn2'   @click="handleCancel()">取消</el-button>
		   </div>
		</div>
	</div>
  </div>
</template>

<script>
import { getList,withdraw } from '@/api/nested'
import { parseTime } from '@/utils/index'
import { MessageBox, Message } from 'element-ui'
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
	   options1: [{
	            value: -1,
	            label: '全部'
	          }, {
	            value: 0,
	            label: '未处理'
	          }, {
	            value: 1,
	            label: '已提现'
	          }, {
	            value: 2,
	            label: '已拒绝'
	          }],
	     value:'',
		datatime: [],
		page:1,
		total:0,
		totalAmount:'0',//总申请金额
		successAmount:'0',//总提现金额
		totalNum:'0/0',//提现笔数/总笔数
		isshow:false,//是否显示弹框
		isTy:'',//1完成提现样式 | 2 未完成提现样式
		index:'',//数据位置
		singeDate:'',//单个数据,
		resion:''
		
    }
  },
  created() {
	const end = new Date()
	const start =new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 7);
	this.datatime=[start,end]
	this.fetchData();
  },
  methods: {
    fetchData() { 
      this.listLoading = true;
	  let state=this.value !=='' ? this.value :-1;
	  let startDate=parseTime(this.datatime[0],'{y}-{m}-{d}');
	  let endDate=parseTime(this.datatime[1],'{y}-{m}-{d}');
      getList({state:state,startDate:startDate,endDate:endDate,pn:this.page}).then(response => {
		this.listLoading = false;
		if (response.code== 0) {
		   this.tableData=this.dataList(response.data.pageInfo.list);
		   this.total=response.data.pageInfo.total;
		   this.totalAmount=response.data.totalAmount;
		   this.successAmount=response.data.successAmount;
		   this.totalNum=response.data.successCnt+'/'+response.data.totalCnt;
		}else{
			 Message({
				message: response.message || 'Error',
				type: 'error',
				duration: 5 * 1000
			  })
		}
      })
    },
	withdraw(){
		   this.listLoading = true;
		   let objData;
		   if(this.isTy==2){
			   objData={
				   memo:this.resion,
				   id:this.singeDate.id,
				   state:this.isTy
				}
		   }else{
			    objData={
					 id:this.singeDate.id,
					 state:this.isTy
			  	} 
		   }
		   withdraw(objData).then(response => {
		   		this.listLoading = false;
		   		if (response.code== 0) {
				  this.fetchData();
		   		  Message({
		   		  	message: '操作成功' || 'Error',
		   		  	type: 'success',
		   		  	duration: 5 * 1000
		   		   })
		   		}else{
		   			 Message({
		   				message: response.message || 'Error',
		   				type: 'error',
		   				duration: 5 * 1000
		   			  })
		   		}
		   })
	},
	dataList(list){
	      list.map(function(item){
					if(item.channelId==3){
						item.channelName='支付宝'
					}else{
						item.channelName='微信';
					}
					if(item.state==1){
						item.stateName='提现成功';
					}else if(item.state==2){
						item.stateName='取消提现';
					}else{
						item.stateName='未处理'
					}
		        });
		return list;
	},
	handleSerch(){
		this.fetchData();
	},
	handleCurrentChange(val){
		this.page=val;
		this.fetchData();
	},
	handleSucess(val,index,num){
			this.isshow=true;
		    this.isTy=index;
			this.index=num;
		    this.singeDate=val;
			this.resion='';
	},
	handleDelete(val,index,num) {
        	this.isshow=true;
            this.isTy=index;
			this.singeDate=val;
			this.index=num;
			this.resion='';
    },
	handleConfig(){
		this.withdraw();
		this.isshow=false;
		this.resion='';
	},
	handleCancel() {
	     this.isshow=false;
	     this.isTy='';
	     this.singeDate='';
		 this.resion='';
	}
  }
  
}
</script>
<style lang="scss">
	*{margin:0;padding:0}
	.app-withdrawal{
		padding-left:50px;
		.title{
			height:80px;
			width:97%;
			padding:15px;
			border:1px solid #cecece;
			margin:20px 0;
			.titleLeft{
				width:90%;
				height:100px;
				float:left;
			}
			.titlecontent{
				float:right;
				margin-right:30px;
			}
			.endState{
				width:150px;
				margin-left:10px;
			}
			.endState1{
				width:400px;
				margin-left:15px;
			}
			.search{
				width:100px;
				float:left;
			}
		}
		.title2{
			width:100%;
			height:80px;
			margin-bottom:20px;
			li{
				list-style: none;
				margin-right:22px;
				height:50px;
				float:left;
				width:31.4%;
				.name{
					display: block;
					 line-height: 50px;
					 width:50%;
					 float:left;
					 text-align: center;
					 background:#409EFF;
					 color:#fff;
				}
				.number{
					display: block;
					line-height: 48px;
					width:50%;
					float:left;
					text-align: center;
					border:1px solid #409EFF;
					color:red;
				}
			}
		}
		.bottom{
			margin-top:20px;
			width:100%;
			.page{
				margin-right:20px;
			}
		}
	   .mask{
		   position:fixed;
		   width:100%;
		   height:100%;
		   left:0;
		   top:0;
		   background:rgba(0,0,0,.5);
		  
		   z-index:2000;
		   .maskContent1{
			   height:540px;
			   width:500px;
			   position:absolute;
			   left:50%;
			   top:50%;
			   margin-left:-250px;
			   margin-top:-270px;
			   background:#fff;
			   border-radius:20px; 
		   }
		   .maskContent{
			   height:440px;
			   width:500px;
			   position:absolute;
			   left:50%;
			   top:50%;
			   margin-left:-250px;
			   margin-top:-220px;
			   background:#fff;
			   border-radius:20px; 
			 }
			   .maskTile{
				   height:80px;
				   line-height:80px;
				   text-align:center;
				   width:500px; 
				   border-bottom:1px solid #000;
				 }
				.maskDetail{
					p{
						line-height:40px;
						text-align:center;
						width:500px;
					}
					.deatail{
						line-height:70px;
					}
					.case{
						height:100px;
						margin-top:20px;
						span{
							float:left;
							width:200px;
							text-align: right;
							margin-right:20px;
							line-height:96px;
							}
						.caseTextarea{
							float:left;
							width:220px;
							height:100px;
						}
						
					}
				}
			}
			  .maskBottom{
				   width:500px;
				   margin-top:40px;
				   .btn1{
					   margin-left:85px;
					   width:150px;
				   }
				   .btn2{
				   		margin-left:30px;
				   		width:150px;
				   }
			  }
		   }
</style>
