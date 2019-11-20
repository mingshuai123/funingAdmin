<template>
  <div class="player">
    <van-nav-bar
      title="玩家信息"
      left-text="返回"
      left-arrow
      right-text="充卡"
      @click-right='recharge'
      @click-left="$router.back(-1)"
    />
    <div class="member">
      <div class="info">
        <div>昵&nbsp;&nbsp;&nbsp;&nbsp;称 : {{info.agent_name}}</div>
        <div>代理 ID : {{info.agent_id}}</div>
        <div>房&nbsp;&nbsp;&nbsp;&nbsp;卡 : {{info.fangka}}</div>
      </div>
    </div>
    <div class="pageclick">
      <van-button type="primary"  v-if='info.normal_club_id!=0' @click="$router.push({path:'/clubDetail',query:{clubid:info.normal_club_id}})">朋友圈</van-button>
      <van-button type="primary" v-if='info.normal_club_id!=0' @click="$router.push({path:'/integalDetail',query:{clubid:info.integral_club_id}})">积分圈</van-button>
    </div>
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
      <div class="nodata">没有更多数据</div>
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
      numshow:false,
      value:null,
      popupshow:false,
      uid:0,
      info:{},
      memberList:[],
      nextpage:true,
      page:1
    }
  },
  created(){
    var uid=this.$route.query
    this.info=uid;
    
    this.getlist();
    
  },
  methods:{
    CZclick(){
      var _this=this;
      if(this.value<=0){
        this.$toast('数量不能为0!');
        this.value=null;
        return false;
      }
      this.$dialog.confirm({
        title: '确认充值',
        message: "确认为 <span style='color:red'>"+ _this.info.agent_name +"</span> 充值 <span style='color:red'>" + _this.value + '</span> 房卡？'
      }).then(() => {
        var data={
          method: 'agent.fangka.recharge',
          agent_id: _this.info.agent_id,
          value: _this.value
        }
        this.postAxios(data).then(res=>{
          if(res.errno==0){
            this.info.fangka=res.fangka;
            this.value=null;
            this.$toast({
              duration:2000,
              message:'充值成功',
              onClose:function(){
                _this.popupshow=false;
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
    getlist(){
      var data={
        method: 'fangka.record',
        uid: this.info.agent_id,
        page: this.page,
        u_type: 'AGENT',
        r_type: ''
      }
      this.postAxios(data).then(res=>{
        if(res.errno==0){
          if(res.records.length>0){
            this.memberList=res.records;
          }else{
            this.page-=1;
            this.$toast('没有更多了');
          }
        }
      })
    },
    confirm(){
      console.log("confirm"+this.value)
    },
    recharge(){
      this.popupshow=true;
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
    .member{
      display: flex;
      background-color: #e5e5e5;
      img{
        width: 60px;
        height: 60px;
        margin: 10px;
      }
      .info{
        padding: 5px;
        line-height: 2;
      }
    }
    .pageclick{
      display: flex;
      justify-content: space-around;
      align-items: center;
      margin: 10px;
    }
    
  }
  
</style>