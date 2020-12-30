<template>
  <div class="app-recharge">
	 <div class='title'>
		<div class='titleLeft'>
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
		</div>
		<el-button type="primary" class='search' @click='handleSerch'>查询</el-button>
	 </div>
	 <div class='title2'>
		 <ul>
			 <li>
				 <span class='name'>合计充值</span>
				 <span class='number'>￥{{totalAmount}}</span>
			 </li>
			 <li>
			 	 <span class='name' >合计奖金提现</span>
			 	 <span class='number'>￥{{-platformAmount}}</span>
			 </li>
			 <li>
			 	<span class='name'>合计中奖奖金</span>
                <span class='number'>￥{{lotteryFollowAmount}}</span>
			 </li>
		 </ul>
	 </div>
	 <div>
		 <el-table
		    :data="tableData"
		    border
		    style="width: 97%">
		    <el-table-column
		      prop="dataTime"
		      label="日期"
		     >
		    </el-table-column>
		    <el-table-column
		      prop="balance"
		      label="总余额"
		    >
		    </el-table-column>
			<el-table-column
			  prop="withdrawAmount"
			  label="用户提现"
			>
			<template slot-scope="scope">
					 <span>￥{{-scope.row.withdrawAmount}}</span>
			</template>
			</el-table-column>
		    <el-table-column
		      prop="awardAmount"
		      label="中奖金额"
		    >
				<template slot-scope="scope">
						 <span>￥{{scope.row.awardAmount}}</span>
				</template>
		    </el-table-column>
			<el-table-column
			  prop="refundAmount"
			  label="跟单未出退款"
			>
			</el-table-column>
			<el-table-column
			  prop="totalAmount"
			  label="跟单金额不符退款"
			>
			</el-table-column>
		    <el-table-column
		      prop="noTicketAmount"
		      label="未出票退款"
		    >
			  <template slot-scope="scope">
			  		 <span>￥{{scope.row.noTicketAmount}}</span>
			  </template>
		    </el-table-column>
		    <el-table-column
		      label="操作"
		    >
		      <template slot-scope="scope">
		        <el-button @click="handleSucess(scope.row)" type="text" size="small">点击查询</el-button>
		      </template>
		    </el-table-column>
		  </el-table>
	 </div>
   <!-- <div class='bottom'>
		<el-pagination class='page'
		 @current-change="handleCurrentChange"
		  background
		  layout="prev, pager, next"
		  :total='total'>
		</el-pagination>
	</div> -->
  </div>
</template>

<script>
import { balance } from '@/api/nested'
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
		datatime: [],
		page:1,
		total:0,
		totalAmount:0,//合计充值
		platformAmount:0,//合计奖金提现
		lotteryFollowAmount:0,//合计中奖奖金
		
    }
  },
  created() {
	const end = new Date()
	const start = new Date().setTime(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
	this.datatime=[start,end]
	this.fetchData();
  },
  methods: {
    fetchData() { 
      this.listLoading = true;
	  let startDate=parseTime(this.datatime[0],'{y}-{m}-{d}');
	  let endDate=parseTime(this.datatime[1],'{y}-{m}-{d}');
       balance({startDate:startDate,endDate:endDate}).then(response => {
		this.listLoading = false;
		if (response.code== 0) {
			 this.totalAmount=0;
			 this.platformAmount=0;
			 this.lotteryFollowAmount=0;
		     this.tableData=this.dataList(response.data);
		  
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
		  let platformAmount=this.platformAmount;
		  let totalAmount=this.totalAmount;
		  let lotteryFollowAmount=this.lotteryFollowAmount;
		  let listArry=[];
		  
	      for(let key in list){ 
			 list[key].dataTime=key;
			 list[key].totalAmount=list[key].balance+list[key].balance;
			 listArry.push(list[key]);
			 platformAmount=platformAmount+list[key].withdrawAmount;
			 lotteryFollowAmount=lotteryFollowAmount+list[key].awardAmount;
		  }
		 
		  this.totalAmount=totalAmount;
		  this.platformAmount=platformAmount;
		  this.lotteryFollowAmount=lotteryFollowAmount.toFixed(2);
		  return listArry;
	},
	handleSerch(){
		this.fetchData();
	},
   handleSucess(val){
   	this.$router.push({
   		      path:'balancequery/',
   	          name: '余额查询',
   			  meta: { title: '余额查询' },
   	          params: {
   	            dataTime: val.dataTime
   	          }
   	        })	
   },
	
  }
  
}
</script>
<style lang="scss">
	*{margin:0;padding:0}
	.app-recharge{
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
		// .bottom{
		// 	margin-top:20px;
		// 	width:100%;
		// 	.page{
		// 		margin-right:20px;
		// 	}
		// }
	}
</style>
