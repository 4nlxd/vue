<template>
  <div class="app-balancequery">
	 <div class='title'>
	  <div class='titleLeft'>
		<el-row>
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
			<el-col :span="12">
				<div class='titlecontent'>
					<span>充值类型</span>
					<el-select v-model="changeState" placeholder="全部" class='titleInput'>
						<el-option
						  v-for="item in options"
						  :key="item.value"
						  :label="item.label"
						  :value="item.value">
						</el-option>
					</el-select>
				</div>
			</el-col>
		</el-row>
		<el-row>
		<el-col :span="12">
			<div class='titlecontent'>
				<span>用户ID</span>
				<el-input v-model="userId" placeholder="请输入内容" class='titleInput1'></el-input>
			</div>
		</el-col>
		<el-col :span="12">
			<div class='titlecontent'>
				<span>用户手机号</span>
				<el-input v-model="userPhone" placeholder="请输入内容" class='titleInput'></el-input>
			</div>
		</el-col>
		</el-row>
	   </div>
		<el-button type="primary" class='search' @click='handleSerch'>查询</el-button>
		<el-button type="danger" class='clear' @click='handleClear'>清空</el-button>
	 </div>
	 <div class='title2'>
	 		 <ul>
	 			 <li>
	 				 <span class='name'>余额变化合计</span>
	 				<span class='number' v-if='totalAmount>0'>￥{{totalAmount}}</span>
	 				<span class='number active' v-if='totalAmount<0'>-￥{{-totalAmount}}</span>
	 				<span class='number' v-if='totalAmount==0'>￥{{totalAmount}}</span>
	 			 </li>
	 		 </ul>
	 </div>
	 <div>
		 <el-table
		    :data="tableData"
		    border
		    style="width:97%">
		    <el-table-column
		      prop="created"
		      label="出票时间"
		     >
		    </el-table-column>
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
		      label="余额变化"
		    >
			  <template slot-scope="scope">
			  	 <span  class='changeColor1' v-if='scope.row.amount>0'>+￥{{scope.row.amount}}</span>
			  	 <span  class='changeColor2' v-if='scope.row.amount<0'>-￥{{-scope.row.amount}}</span>
			  	 <span    v-if='scope.row.amount==0'>0</span>
			  </template>
		    </el-table-column>
			<el-table-column
			  prop="typeName"
			  label="变化原因"
			  >
			</el-table-column>
		   <el-table-column
		     prop="memo"
		     label="备注"
		   >
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
  </div>
</template>

<script>
import { balancequery } from '@/api/nested'
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
		userId:'',
		userPhone:'',
		changeState:0,
		totalAmount:0,//合计充值
		creatPage:'',
		options: [{
		          value: 0,
		          label: '全部'
		        }, {
		          value:2,
		          label: '提现'
		        }, {
		          value: 11,
		          label: '跟单退款'
		        },{
		          value:7,
		          label: '未出票退款'
		        }]
    }
  },
  created() {
	 
	  if(this.$route.params.dataTime.indexOf('-')>-1){ 
	  	this.datatime=[this.$route.params.dataTime,new Date()]
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
	 let uid=this.userId=='' ? 0:this.userId
	 let objList={
		 startDate:startDate,
		 endDate:endDate,
		 uid:uid,
		 mobile:this.userPhone,
		 type:this.changeState,
		 pn:this.page
	  };
      balancequery(objList).then(response => {
		this.listLoading = false;
		if (response.code== 0) {
		   this.tableData=this.dataList(response.data.page.list);
		   this.total=response.data.page.total;
		   this.totalAmount=response.data.sumAmount
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
			item.created=item.created.join('/');
			if(item.type==2){
				item.typeName='提现'
			}else if(item.type==6){
				item.typeName='中奖'
			}else if(item.type==7){
				item.typeName='出票失败退款'
			}else if(item.type==8){
				item.typeName='余额购买跟单'
			}else if(item.type==9){
				item.typeName='充值购买跟单'
			}else if(item.type==10){
				item.typeName='余额提现失败退款'
			}else if(item.type==11){
				item.typeName='跟单购买失败退款'
			}
		});
		return list;
	},
	handleSerch(){
		  this.fetchData();
	},
	handleClear(){
		 this.userId='';
		 this.userPhone='';
		 this.changeState=0;
		const end = new Date();
		const start = new Date().setTime(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
		this.datatime=[start,end];
	},
	handleCurrentChange(val){
		this.page=val;
		this.fetchData();
	},
	handleSucess(val){
		this.$router.push({
			      path:'reconciliation/',
		          name: '对账统计',
				  meta: { title: '对账统计' },
		          params: {
		            dataTime: val.created
		          }
		        })	
	},
  }
  
}
</script>
<style lang="scss">
	*{margin:0;padding:0}
	.app-balancequery{
		padding-left:50px;
		 .changeColor1{
		 	color:red;
		 }
		 .changeColor2{
		 	color:#409EFF;
		 }
		.title{
			height:130px;
			width:97%;
			padding:15px;
			border:1px solid #cecece;
			margin:20px 0;
           
			.titleLeft{
				width:85%;
				height:100px;
				float:left;
			}
			.titlecontent{
				float:right;
				margin-right:30px;
				margin-bottom:10px;
				height:50px;
				.titleInput{
					width:260px;
					margin-left:20px;
				}
				.titleInput1{
					width:350px;
					margin-left:20px;
				}
				.endState1{
					margin-left:20px;
				}
			}
			.search{
				width:100px;
				float:left;
				margin-top:30px;
			}
			.clear{
				width:100px;
				float:left;
				margin-top:30px;
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
	}
</style>
