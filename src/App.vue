<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
<style>
	*{margin:0;padding:0;}
	.el-header, .el-footer {
	    background-color: #B3C0D1;
	    color: #333;
	    text-align: center;
	    line-height: 60px;
	  }
	.flex_row {
		display: flex;
		display: -webkit-flex;
		flex-direction: row;
		-ms-flex-direction: row;
		-webkit-flex-direction: row;
		align-items: center;
		-webkit-align-items: center;
		justify-content: center;
		-webkit-justify-content: center;
	}
	
	.flex_col {
		display: flex;
		display: -webkit-flex;
		flex-direction: column;
		-ms-flex-direction: column;
		-webkit-flex-direction: column;
		align-items: center;
		-webkit-align-items: center;
		justify-content: center;
		-webkit-justify-content: center;
	}
	
	.justify_start {
		justify-content: flex-start;
		-webkit-justify-content: flex-start;
	}
	
	.justify_end {
		justify-content: flex-end;
		-webkit-justify-content: flex-end;
	}
	
	.justify_around {
		justify-content: space-around;
		-webkit-justify-content: space-around;
	}
	
	.justify_between {
		justify-content: space-between;
		-webkit-justify-content: space-between;
	}
	
	
	.align_start {
		align-items: flex-start;
		-webkit-align-items: flex-start;
	}
	
	.align_end {
		align-items: flex-end;
		-webkit-align-items: flex-end;
	}
</style>