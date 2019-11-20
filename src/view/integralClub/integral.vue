<template>
  <div class="player">
    <van-nav-bar
      title="积分圈"
      left-text="返回"
      left-arrow
      @click-left="$router.back(-1)"
      right-text="充卡"
      @click-right='recharge'
    >
    </van-nav-bar>
    <div class="info">
      <div class="memberinfo">
        <div class="name">昵称 : {{info.name}}</div>
        <div class="idnum">ID : {{info.club_id}}</div>
      </div>
      <div class="num">
        <div class="number">{{info.fangka}}</div>
        <div>当前房卡</div>
      </div>
    </div>
    <div class="pageclick">
      <van-button type="primary" size="small" @click="$router.push({path:'/integralManage'})">管理</van-button>
      <van-button type="primary" size="small" @click="$router.push({path:'/settingManage'})">设置</van-button>
      <van-button type="primary" size="small" @click="$router.push({path:'/integralMatch'})">比赛</van-button>
      <van-button type="primary" size="small" @click="$router.push({path:'/statistics',query:{type:'integral'}})">统计</van-button>
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
    
    <van-popup v-model="popupshow" style="width:80%;height:50%;" class="cz">
      <div class="title">充值房卡</div>
      <van-field
        type="number"
        v-model="value"
        placeholder="请输入数量"
        style="width:80%;margin:20px auto;border:1px solid #868686;"
      />
      <div class="desc">该操作无法撤回！<br/>请谨慎操作！</div>
      <div class="btn"><van-button class="confirm-btn" type="primary" @click="CZclick">提交</van-button></div>
    </van-popup>
  </div>
</template>
<script>
export default {
  name:'menus',
  data(){
    return {
      clubInfo:{},
      info:{},
      popupshow:false,
      value:'',
      page:1,
      memberList:[],
    }
  },
  created(){
    const info=JSON.parse(this.$Cookies.get('funing'));
    this.clubInfo=info;
    this.getInfo();
    this.getlist();
  },
  methods:{
    recharge(){
      this.popupshow=true;
    },
    CZclick(){
      var _this=this;
      this.$dialog.confirm({
        title: '确认充值',
        message: "确认为 <span style='color:red'>"+ _this.info.name +"</span> 充值 <span style='color:red'>" + _this.value + '</span> 房卡？'
      }).then(() => {
        var data={
          method: 'club.fangka.recharge',
          club_id: this.clubInfo.integral_club_id,
          value: this.value
        }
        this.postAxios(data).then(res=>{
          if(res.errno==0){
            this.$toast({
              duration:2000,
              message:'充值成功',
              onClose:function(){
                _this.popupshow=false;
                _this.getInfo();
                _this.getlist();
              }
            });
          }
        })
      }).catch(() => {
        _this.value='';
        _this.popupshow=false;
      });
      
    },
    getInfo(){
      this.postAxios({method: 'check.club',club_id: this.clubInfo.integral_club_id}).then(res=>{
        this.info=res;
      })
    },
    getlist(){
      var data={
        method: 'fangka.record',
        uid: this.clubInfo.integral_club_id,
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
    .info{
      display: flex;
      justify-content: space-between;
      align-content: center;
      padding: 10px;
      margin-bottom: 10px;
      background-color: #e5e5e5;
      text-align: center;
      .member{
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
  .pageclick{
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin: 10px;
    button{
      width: 20%;
    }
  }
</style>