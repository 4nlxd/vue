<template>
  <div class="app-flowofgoods">
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
					<span>货品</span>
					<el-select v-model="goods" placeholder="全部" class='titleInput'>
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
		<el-col :span="12" :offset="12">
			<div class='titlecontent'>
				<span>操作类型</span>
				<el-select v-model="operationType" placeholder="全部" class='titleInput'>
					<el-option
					  v-for="item in options1"
					  :key="item.value"
					  :label="item.label"
					  :value="item.value">
					</el-option>
				</el-select>
			</div>
		</el-col>
		</el-row>
	   </div>
		<el-button type="primary" class='search' @click='handleSerch'>查询</el-button>
		<el-button type="danger" class='clear' @click='handleClear'>清空</el-button>
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
			  prop="typeName"
			  label="充值类型"
			  >
			</el-table-column>
		    <el-table-column
		      label="充值金额"
		      >
			   <template slot-scope="scope">
				    <span>￥{{scope.row.amount}}</span>
			   </template>
		    </el-table-column>
		   <el-table-column
		     prop="memo"
		     label="充值商品"
		     >
		   </el-table-column>
		   <el-table-column
		     prop="mobile"
		     label="手机号"
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
import { rechargequery } from '@/api/nested'
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
		goods:0,
		operationType:0,
		creatPage:'',
		options: [{
		          value: 0,
		          label: '全部'
		        }, {
		          value:1,
		          label: '猪肉'
		        }, {
		          value: 2,
		          label: '羊肉'
		        }],
		options1: [{
		          value: 0,
		          label: '全部'
		        }, {
		          value:1,
		          label: '出库'
		        }, {
		          value: 2,
		          label: '入库'
		        },{
		          value: 3,
		          label: '后台'
		        }],
    }
  },
  created() {
		const end = new Date()
		const start = new Date().setTime(new Date(new Date().getFullYear(), new Date().getMonth(), 1))
		this.datatime=[start,end]
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
		 type:this.goods,
		 pn:this.page
	  };
      rechargequery(objList).then(response => {
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
			if(item.type==9){
				item.typeName='跟单充值'
			}else{
				item.typeName='平台充值'
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
	.app-flowofgoods{
		padding-left:50px;
		 .stateColor1{
				color:#409EFF;
			}
		.stateColor2{
		    color:red;
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
		.bottom{
			margin-top:20px;
			width:100%;
			.page{
				margin-right:20px;
			}
		}
	}
</style>
