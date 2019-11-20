<template>
  <div class="player">
    <van-nav-bar
      title="补卡记录"
      left-text="返回"
      left-arrow
      @click-left="$router.back(-1)"
    />
    <!-- 列表 -->
    <div class="memberlist">
      <div class="thead">
        <div class="date">时间</div>
        <div class="num">房卡</div>
        <div class="last">剩余</div>
        <div class="dis">去向</div>
      </div>
      <div class="item" v-for="(item,index) in memberList" :key='index' >
        <div class="date">{{item.created.slice(2, 16)}}</div>
        <div class="num">{{item.value}}</div>
        <div class="last">{{item.remainder_value}}</div>
        <div class="dis">{{item.usage}}</div>
      </div>
    </div>
    <!-- 分页 -->
    <div class="page">
      <van-button size="small" @click="prePage">上一页</van-button>
      <van-button size="small" @click="nextPage">下一页</van-button>
    </div>
  </div>
</template>
<script>
export default {
  name:'menus',
  data(){
    return {
      loading:false,
      info:{},
      memberList:[],
      nextpage:true,
      page:1
    }
  },
  created(){
    var date='2018-01-01';
    this.minDate=new Date(Date.parse(date.replace(/-/g, "/")));
    const info=this.$Cookies.get('funing');
    this.info=JSON.parse(info);
    console.log(this.info)
    this.getlist();
    
  },
  methods:{
    getlist(){
      this.$toast.loading({
        duration:0,
        forbidClick: true, // 禁用背景点击
        loadingType: 'spinner',
        message: '加载中...'
      })
      var data={method:'fangka.record',uid: this.info.agent_id,page:this.page,u_type: 'AGENT',r_type: 'admin_add'}
      this.postAxios(data).then(res=>{
        this.$toast.clear();
        if(res.records.length>0){
          this.memberList=res.records; 
        }else{
          this.page==1?'':this.page--;
          this.$toast('没有更多了');
        }
      })
    },
    prePage(){
      if(this.page==1){
        this.$toast('当前是第一页');
      }else{
        this.page-=1;
        this.getlist();
      }
    },
    nextPage(){
      this.page+=1;
      this.getlist()
    },
  }
}
</script>
<style lang="less" scoped>
  .recharge{
    .memberlist{
      .thead{
        display: flex;
        justify-content: space-between;
        text-align: center;
        font-size: 18px;
        background-color: #868686;
        padding: 5px;
        .memo{
          flex: 1;
          text-align: center;
        }
      }
      .item{
        padding:5px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .memo{
          flex:1;
          text-align: center;
        }
        .num{
          text-align: center;
          color: blue;
        }
        .color1{
          color: #868686;
        }
        .color2{
          color: #ff0000;
        }
        .date{
          font-size: 12px;
        }
      }
      .item:nth-child(odd){
        background-color: #e5e5e5;
      }
      .item:nth-child(even){
        background-color: #fff;
      }
    }
  }
</style>