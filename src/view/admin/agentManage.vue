<template>
  <div class="recharge">
    <van-nav-bar
      title="玩家充卡"
      left-text="返回"
      left-arrow
      @click-left="$router.back(-1)"
    />
    <!-- 列表 -->
    <div class="memberlist">
      <div class="thead">
        <div class="name">昵称</div>
        <div class="id">ID</div>
        <div class="num">剩余房卡</div>
        <div class="date">创建时间</div>
      </div>
      <div class="item" v-for="(item,index) in memberList" :key='index' @click='checkmember(item)'>
        <div class="name">{{item.agent_name}}</div>
        <div class="id">{{item.agent_id}}</div>
        <div class="num" >{{item.fangka}}</div>
        <div class="date">{{item.created}}</div>
      </div>
    </div>
    <div class="nodata">没有更多了</div>
  </div>
</template>
<script>
export default {
  name:'menus',
  data(){
    return {
      info:{},
      memberList:[],
    }
  },
  created(){
    const info=this.$Cookies.get('funing');
    this.info=JSON.parse(info);
    this.getlist();
    
  },
  methods:{
    checkmember(item){
      this.$router.push({path:'/agentDetail',query:item})
    },
    getlist(){
      this.$toast.loading({
        duration:0,
        forbidClick: true, // 禁用背景点击
        loadingType: 'spinner',
        message: '加载中...'
      })
      var data={method:'agent.list'}
      this.postAxios(data).then(res=>{
        this.$toast.clear();
        if(res.errno==0){
          this.memberList=res.agents; 
        }
      })
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
        .name{
          width: 30%;
        }
        .date{
          width: 30%;
          text-align: center;
        }
      }
      .item{
        padding:5px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        line-height: 1.6;
        .name{
          width: 35%;
        }
        .num{
          flex: 1;
          text-align: center;
          color: blue;
        }
        .color{
          color: red;
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
    .page{
      margin-top: 20px;
      display: flex;
      justify-content: space-around;
      align-items: center;
    }
  }
</style>