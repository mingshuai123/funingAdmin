<template>
  <div class="player">
    <van-nav-bar
      title="玩家信息"
      left-text="返回"
      left-arrow
      right-text="充卡"
      @click-right="recharge('czfk')"
      @click-left="$router.back(-1)"
    />
    <div class="member">
      <van-button class="kickout" size='small' type='danger' @click='kickout'>踢出</van-button>
      <van-button class="kickout2" size='small' type='info' @click="recharge('czjf')">积分充值</van-button>
      <van-button class="kickout3" size='small' type='danger' @click="recharge('kcjf')">积分扣除</van-button>
      <img :src="info.icon" alt="" :onerror='defaultImg'>
      <div class="info">
        <div>昵&nbsp;&nbsp;&nbsp;&nbsp;称 : {{info.nickname}}</div>
        <div>用户 ID : {{info.uid}}</div>
        <div>房&nbsp;&nbsp;&nbsp;&nbsp;卡 : {{info.fangka}}</div>
        <div>积&nbsp;&nbsp;&nbsp;&nbsp;分 : {{info.integral}}</div>
      </div>
    </div>
    <div class="btngroup">
      <van-cell-group>
        <van-switch-cell v-model="isAdmin" @change="adminchange" title="是否为管理员" />
      </van-cell-group>
    </div>
    <!-- 列表 -->
    <van-tabs v-model="active">
      <van-tab title="积分纪录">
        <div class="memberlist">
          <div class="thead">
            <div class="date">时间</div>
            <div class="num">房卡</div>
            <div class="last">剩余</div>
            <div class="dis">去向</div>
          </div>
          <div class="item" v-for="(item,index) in memberList" :key='index' >
            <div class="date">{{item.created.slice(2, 16)}}</div>
            <div class="num" :class="{color:item.value<0}">{{item.value}}</div>
            <div class="last">{{item.remainder_value}}</div>
            <div class="dis">{{item.usage}}</div>
          </div>
        </div>
      </van-tab>
      <van-tab title="房卡纪录">
        <div class="memberlist">
          <div class="thead">
            <div class="date">时间</div>
            <div class="num">房卡</div>
            <div class="last">剩余</div>
            <div class="dis">去向</div>
          </div>
          <div class="item" v-for="(item,index) in memberList" :key='index' >
            <div class="date">{{item.created.slice(2, 16)}}</div>
            <div class="num" :class="{color:item.value<0}">{{item.value}}</div>
            <div class="last">{{item.remainder_value}}</div>
            <div class="dis">{{item.usage}}</div>
          </div>
        </div>
      </van-tab>
    </van-tabs>
    
    <van-popup v-model="popupshow" style="width:80%;height:50%;" class="cz">
      <div class="title">{{type=='czfk'?'充值房卡':type=='czjf'?'充值积分':'扣除积分'}}</div>
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
      type:'integral',
      active:0,
      isAdmin:false,
      numshow:false,
      value:'',
      popupshow:false,
      uid:0,
      info:{},
      clubInfo:{},
      memberList:[],
      nextpage:true,
      page:1
    }
  },
  watch:{
    active:function(val){
      if(val==0){
        this.type='integral';
      }else{
       this.type='normal';
      }
      this.getlist();
    },
  },
  created(){
    const clubInfo=JSON.parse(this.$Cookies.get('funing'))
    this.clubInfo=clubInfo;
    var uid=this.$route.query.uid
    this.uid=uid;
    this.getInfo();
    
    this.getlist();
    
  },
  methods:{
    getInfo(){
      this.postAxios({method:'check.club.member',uid:this.uid,club_id: this.clubInfo.integral_club_id}).then(res=>{
      this.info=res;
      this.isAdmin=Boolean(res.admin);
    })
    },
    adminchange(isAdmin){
      this.postAxios({method:'club.member.admin',uid:this.uid,club_id: this.clubInfo.integral_club_id,admin:Number(isAdmin)}).then(res=>{
        if(res.errno==0){
          this.$toast('设置成功');
        }
      })
    },
    kickout(){
      var _this=this;
      this.$dialog.confirm({
        title: '提示',
        message: "确认移除 <span style='color:red'>"+ _this.info.nickname +'</span> ？'
      }).then(() => {
        var data={
          method: 'club.member.kickout',
          club_id:this.clubInfo.normal_club_id ,
          tarid: Number(this.uid),
        }
        this.postAxios(data).then(res=>{
          if(res.errno==0){
            this.$toast({
              duration:2000,
              message:'操作成功!',
              onClose:function(){
                _this.$router.back(-1);
              }
            });
          }else{
            this.$toast.fail(res.msg)
          }
        })
      }).catch(() => {
        _this.value='';
        _this.popupshow=false;
      });
    },
    CZclick(){
      var _this=this;
      var str=_this.type=='kcjf'?'确认扣除':'确认充值';
      var str2=_this.type=='kcjf'?'扣除':'充值';
      var str3=_this.type=='czfk'?'房卡':'积分';
      this.$dialog.confirm({
        title: str,
        message: "确认为 <span style='color:red'>"+ _this.info.nickname +"</span> "+str2+" <span style='color:red'>" + _this.value + '</span> '+str3+'？'
      }).then(() => {
        var data={
          method: 'club.member.fangka.recharge',
          club_id: '',
          uid: this.uid,
          value: this.value
        }
        if(_this.type=='kcjf'){
          data.club_id=this.clubInfo.integral_club_id;
          data.method='club.member.integral.recharge'
          data.value= -data.value;
        }else if(_this.type=='czjf'){
          data.club_id=this.clubInfo.integral_club_id;
          data.method='club.member.integral.recharge'
        }else{
          data.method='club.member.fangka.recharge';
        }
        this.postAxios(data).then(res=>{
          if(res.errno==0){
            this.$toast({
              duration:2000,
              message:str2+'成功',
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
    getlist(){
      this.memberList=[];
      var data={
        method: 'fangka.record',
        uid: this.uid,
        club_id: this.clubInfo.integral_club_id,
        page: this.page,
        u_type: 'USER',
        r_type: ''
      }
      if(this.active==0){
        data.method='user.integral.record'
      }else{
        data.method='fangka.record';
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
    confirm(){
      console.log("confirm"+this.value)
    },
    recharge(type){
      this.type=type;
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
      position: relative;
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
    
    .kickout{
      width: 100px;
      position: absolute;
      top:10px ;
      right: 10px;
    }
    .kickout2{
      width: 100px;
      position: absolute;
      top:50px ;
      right: 10px;
    }
    .kickout3{
      width: 100px;
      position: absolute;
      top:90px ;
      right: 10px;
    }
  }
</style>