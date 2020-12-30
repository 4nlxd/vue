<template>
  <div class="app-tickets">
	 <div class='title'>
		<div class='titleLeft'>
			
			<h3 class='titleOrder'>出票统计</h3>
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
				 <span class='name'>总计支付</span>
				 <span class='number'>￥{{totalPay}}</span>
			 </li>
			 <li>
			 	 <span class='name' >总计奖金</span>
			 	 <span class='number'>￥{{totalAmount}}</span>
			 </li>
		 </ul>
	 </div>
	 <div >
		 <el-table
		    :data="tableData"
		    border
		    style="width:97%">
		    <el-table-column
		      prop="dataTime"
		      label="日期"
		      >
		    </el-table-column>
		    <el-table-column
		      prop="userPayAmount"
		      label="用户支付"
		      >
			  <template slot-scope="scope">
			  		<span>￥{{scope.row.userPayAmount}}</span>
			  </template>
		    </el-table-column>
		    <el-table-column
		      prop="totalCnt"
		      label="应出票"
		      >
			  <template slot-scope="scope">
			  		<span>{{scope.row.totalCnt}}张</span>
			  </template>
		    </el-table-column>
		    <el-table-column
		      prop="successCnt"
		      label="已出票"
		     >
			 <template slot-scope="scope">
			 		<span>{{scope.row.successCnt}}张</span>
			 </template>
		    </el-table-column>
		    <el-table-column
		      prop="totalAmount"
		      label="应出票总额"
		     >
		    </el-table-column>
		    <el-table-column
		      prop="successAmount"
		      label="已出票总额"
		     >
		    </el-table-column>
			<el-table-column
			  prop="awardAmount"
			  label="中奖金额"
			 >
			</el-table-column>
		    <el-table-column
		      label="详情"
			  fixed='right'
			  width='300'
		      >
		      <template slot-scope="scope">
		        <el-button  @click="handleSucess(scope.row)" type="text" size="small">点击查询</el-button>
		      </template>
		    </el-table-column>
		  </el-table>
	 </div>
  </div>
</template>

<script>
import { ticketsOrder } from '@/api/documentary'
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
	    value:'',
		datatime: [],
		page:1,
		total:0,
		totalAmount:'0',//总奖金
		totalPay:'0',//总支付
		
    }
  },
  created() {
	const end = new Date();
	const start =new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 7);
	this.datatime=[start,end]
	this.fetchData();
  },
  methods: {
    fetchData() { 
      this.listLoading = true;
	  let startDate=parseTime(this.datatime[0],'{y}-{m}-{d}');
	  let endDate=parseTime(this.datatime[1],'{y}-{m}-{d}');
      ticketsOrder({startDate:startDate,endDate:endDate}).then(response => {
		this.listLoading = false;
		if (response.code== 0) {
			if(Object.keys(response.data).length){
				this.totalAmount=0;
				this.totalPay=0;
				this.tableData=this.dataList(response.data);
			}
		   
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
		  let total=this.totalPay;
		  let totalAmount=this.totalAmount;
		  let listArry=[];
		  
	      for(let key in list){ 
			  total=parseFloat(total)+list[key].userPayAmount;
			  totalAmount=parseFloat(totalAmount)+list[key].awardAmount;
			  list[key].dataTime=key;
			  list[key].successAmount='￥'+list[key].successAmount;
			  list[key].totalAmount='￥'+list[key].totalAmount;
			  list[key].awardAmount='￥'+list[key].awardAmount;
			  listArry.push(list[key]);
			 
		  }
		  this.totalPay=total;
		  this.totalAmount=totalAmount.toFixed(2);
		  return listArry;
	},
	handleSerch(){
		this.fetchData();
	},
	handleSucess(val){
		this.$router.push({
			      path:'ticketsDetaile/',
		          name: '出票详情',
				  meta: { title: '出票详情' },
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
	.app-tickets{
		padding-left:50px;
		.title{
			height:80px;
			width:97%;
			padding:15px;
			border:1px solid #cecece;
			margin:10px 0;
			.titleLeft{
				width:90%;
				height:100px;
				float:left;
			}
			.titleOrder{
				width:100px;
				float:left;
				line-height:40px;
				margin-right:30px;
			}
			.titlecontent{
				float:right;
				margin-right:30px;
			}
			.endState1{
				margin-left:20px;
			}
			.search{
				width:100px;
				float:left;
			}
		}
		.title2{
			width:100%;
			height:80px;
			margin-bottom:30px;
			
			li{
				list-style: none;
				margin-right:22px;
				height:50px;
				float:left;
				width:47.8%;
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
	   }
	}
</style>
