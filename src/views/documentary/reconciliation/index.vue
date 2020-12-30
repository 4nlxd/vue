<template>
  <div class="app-reconciliation">
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
				 <span class='name'>第三方账户变化合计</span>
				 <span class='number' v-if='totalAmount>0'>￥{{totalAmount}}</span>
				 <span class='number active' v-if='totalAmount<0'>-￥{{-totalAmount}}</span>
				 <span class='number' v-if='totalAmount==0'>￥{{totalAmount}}</span>
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
		      prop="changeMoney"
		      label="账户变化"
		      >
			  <template slot-scope="scope">
			  	 <span  class='changeColor1' v-if='scope.row.changeMoney>0'>+￥{{scope.row.changeMoney}}</span>
				 <span  class='changeColor2' v-if='scope.row.changeMoney<0'>-￥{{-scope.row.changeMoney}}</span>
				 <span    v-if='scope.row.changeMoney==0'>0</span>
			  </template>
		    </el-table-column>
		    <el-table-column
		      prop="chargeAmount"
		      label="用户充值"
		      >
			  <template slot-scope="scope">
			  	 <span>￥{{scope.row.chargeAmount}}</span>
			  </template>
		    </el-table-column>
		    <el-table-column
		      prop="ticketAmount"
		      label="出票金额"
		     >
			 <template slot-scope="scope">
			 	 <span>￥{{scope.row.ticketAmount}}</span>
			 </template>
		    </el-table-column>
		    <el-table-column
		      prop="awardAmount"
		      label="奖金金额"
		     >
			 <template slot-scope="scope">
			 	 <span>￥{{scope.row.awardAmount}}</span>
			 </template>
		    </el-table-column>
		  </el-table>
	 </div>
  </div>
</template>

<script>
import { ticketsOrder,accounting } from '@/api/documentary'
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
		totalAmount:0,//用户变化金额
		queryTime:''
		
    }
  },
  created() {
	  if( this.$route.params.dataTime && this.$route.params.dataTime.indexOf('/')>-1){
		let time=this.$route.params.dataTime.split('/').join('-');
		const end = new Date()
		this.datatime=[time,end];
	  }else{
	  	const end = new Date()
	    const start = new Date().setTime(new Date(new Date().getFullYear(), new Date().getMonth(), 1))
	    this.datatime=[start,end]
	  }
	this.fetchData();
  },
  methods: {
    fetchData() { 
      this.listLoading = true;
	  let startDate=parseTime(this.datatime[0],'{y}-{m}-{d}');
	  let endDate=parseTime(this.datatime[1],'{y}-{m}-{d}');
      accounting({startDate:startDate,endDate:endDate}).then(response => {
		this.listLoading = false;
		if (response.code== 0) {
		  if(Object.keys(response.data).length){
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
		  let total=this.totalAmount;
		  let listArry=[];
	      for(let key in list){ 
			  list[key].changeMoney= list[key].awardAmount+list[key].chargeAmount-list[key].ticketAmount;
			  total=parseFloat(total)+list[key].changeMoney;
			  list[key].dataTime=key;
			  listArry.push(list[key]);
		  }
		  this.totalAmount=total.toFixed(2);
		  return listArry;
	},
	handleSerch(){
		this.fetchData();
	},
  }
  
}
</script>
<style lang="scss">
	*{margin:0;padding:0}
	.app-reconciliation{
		padding-left:50px;
		.changeColor1{
			color:red;
		}
		.changeColor2{
			color:#409EFF;
		}
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
				.active{
					color:#409EFF;
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
