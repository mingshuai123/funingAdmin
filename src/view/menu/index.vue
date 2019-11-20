<template>
  <div class="menu">
    <van-nav-bar
      style="background-color:#868686;color:#fff"
    >
    <div slot='left' style="height:46px;">
      <img src="../../assets/logo_s.png" alt="" style="height:45px;">
    </div>
    <div slot='right' style="height:46px;">
      <span @click='logout'>退出</span>
    </div>
    </van-nav-bar>
    <div class="info">
      <div class="memberinfo">
        <div class="name">{{info.agent_name}}</div>
        <div class="idnum">ID:{{info.agent_id==0?'-':info.agent_id}}</div>
      </div>
      <div class="num">
        <div class="number">{{info.fangka}}</div>
        <div>当前房卡</div>
      </div>
    </div>
    <div class="group">
      <div class="item" @click='clickItem(1)'>
        <div class="icon"><img src="../../assets/menu/wjck.png" alt=""></div>
        <div class="name">玩家充卡</div>
      </div>
      <div class="item" @click='clickItem(2)' v-if="agent_id!=0">
        <div class="icon"><img src="../../assets/menu/pyq.png" alt=""></div>
        <div class="name">好友圈</div>
      </div>
      <div class="item" @click='clickItem(3)' v-if="agent_id!=0">
        <div class="icon"><img src="../../assets/menu/jfq.png" alt=""></div>
        <div class="name">积分圈</div>
      </div>
      <div class="item" @click='clickItem(4)' v-if="agent_id!=0">
        <div class="icon"><img src="../../assets/menu/fksp.png" alt=""></div>
        <div class="name">购买房卡</div>
      </div>
      <div class="item" @click='clickItem(5)' v-if="agent_id!=0">
        <div class="icon"><img src="../../assets/menu/gkjl.png" alt=""></div>
        <div class="name">购卡记录</div>
      </div>
      <div class="item" @click='clickItem(6)' v-if="agent_id!=0">
        <div class="icon"><img src="../../assets/menu/bkjl.png" alt=""></div>
        <div class="name">补卡记录</div>
      </div>
      <div class="item" @click='clickItem(7)' v-if="agent_id==0">
        <div class="icon"><img src="../../assets/menu/fksp.png" alt=""></div>
        <div class="name">购卡管理</div>
      </div>
      <div class="item" @click='clickItem(8)' v-if="agent_id==0">
        <div class="icon"><img src="../../assets/menu/dlgl.png" alt=""></div>
        <div class="name">代理管理</div>
      </div>
      <div class="item" @click='clickItem(9)' v-if="agent_id==0">
        <div class="icon"><img src="../../assets/menu/gggl.png" alt=""></div>
        <div class="name">公告管理</div>
      </div>
      <div class="item" @click='clickItem(10)' v-if="agent_id==0">
        <div class="icon"><img src="../../assets/menu/dlsq.png" alt=""></div>
        <div class="name">代理申请</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name:'menus',
  data(){
    return {
      agent_id:0,
      info:{},
    }
  },
  created(){
    const info=JSON.parse(this.$Cookies.get('funing'));
    this.agent_id=info.agent_id;
    this.info=info;
    console.log(this.info)
  },
  methods:{
    async logout(){
      this.$Cookies.remove('funing');
      await this.$router.push({path:'/login'});
    },
    clickItem(num){
      var url='';
      var option={}
      if(num==1){
        url='recharge'
      }
      switch(num){
        case 1:
          url='recharge';
          break;
        case 2:
          url='friends';
          break;
        case 3:
          url='integral';
          break;
        case 4:
          url='purchase';
          break;
        case 5:
          url='purchaserec';
          break;
        case 6:
          url='reissue';
          break;
        case 7:
          url='buyManage';
          break;
        case 8:
          url='agentManage';
          break;
        case 9:
          url='noticeManage';
          break;
        case 10:
          url='applyManage';
          break;
      }
      if((num==2&&this.info.normal_club_id==0)||(num==3&&this.info.integral_club_id==0)){
        url='creatClub'
        option['type']=num;
      }
      this.$router.push({path:'/'+url,query:option})
    },
  }
}
</script>
<style lang="less" scoped>
  .menu{
    .info{
      display: flex;
      justify-content: space-between;
      align-content: center;
      padding: 10px;
      margin-bottom: 10px;
      background-color: #e5e5e5;
      .memberinfo{
        font-size: 20px;
      }
      .num{
      text-align: center;
        .number{
          color: darkblue;
          font-size: 28px;
        }
      }
    }
    .group{
      display: flex;
      flex-wrap: wrap;
      width: 100%;
      padding:0 15px;
      .item{
        margin: 10px;
        width: 25%;
        height: 70px;
        text-align: center;
        border: 1px solid #868686;
        border-radius: 5%;
        .icon{
          margin-top: 5px;
          width: 100%;
          img{
            width: 35px;
            height: 35px;
          }
        }
        .name{
          line-height: 20px;
          color: #333;
        }
      }
      .item:active{
        transform: scale(0.8,0.8);
      }
    }
  }
</style>