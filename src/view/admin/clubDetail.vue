<template>
  <div class="player">
    <van-nav-bar
      title="朋友圈详情"
      left-text="返回"
      left-arrow
      @click-left="$router.back(-1)"
    >
    </van-nav-bar>
    <div class="info2">
      <div class="memberinfo">
        <div class="name">昵称 : {{info.name}}</div>
        <div class="idnum">ID : {{info.club_id}}</div>
      </div>
      <div class="num">
        <div class="number">{{info.fangka}}</div>
        <div>当前房卡</div>
      </div>
    </div>
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
      info:{},
      clubid:0,
      popupshow:false,
      value:'',
      page:1,
      memberList:[],
    }
  },
  created(){
    this.clubid=this.$route.query.clubid;
    this.getInfo();
    this.getlist();
  },
  methods:{
    
    getInfo(){
      this.postAxios({method: 'check.club',club_id: this.clubid}).then(res=>{
        this.info=res;
      })
    },
    getlist(){
      var data={
        method: 'fangka.record',
        uid: this.clubid,
        page: this.page,
        u_type: 'CLUB',
        r_type: ''
      }
      this.postAxios(data).then(res=>{
        if(res.records.length>0){
          this.memberList=res.records;
        }else{
          this.page-=1;
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
  .player{
    .info2{
      display: flex;
      justify-content: space-between;
      align-content: center;
      padding: 10px;
      margin-bottom: 10px;
      background-color: #e5e5e5;
      text-align: center;
      .memberinfo{
        font-size: 20px;
      }
      .num{
        .number{
          color: darkblue;
          font-size: 28px;
        }
      }
    }
    .group{
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      width: 100%;
      .item{
        background-color: #868686;
        margin: 10px;
        width: 28%;
        height: 60px;
        line-height: 60px;
        text-align: center;
        border-radius: 5px;

      }
      .item:active{
        transform: scale(0.8,0.8);
      }
    }
  }
  
</style>