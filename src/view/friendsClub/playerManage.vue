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
      <van-button class="kickout" size='mini' type='danger' @click='kickout'>踢出</van-button>
      <img :src="info.icon" alt="" :onerror='defaultImg'>
      <div class="info">
        <div>昵&nbsp;&nbsp;&nbsp;&nbsp;称 : {{info.nickname}}</div>
        <div>用户 ID : {{info.uid}}</div>
        <div>房&nbsp;&nbsp;&nbsp;&nbsp;卡 : {{info.fangka}}</div>
      </div>
    </div>
    <div class="btngroup">
      <van-cell-group>
        <van-switch-cell v-model="isAdmin" @change="adminchange" title="是否为管理员" />
      </van-cell-group>
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
        <div class="num" :class="{color:item.value<0}">{{item.value}}</div>
        <div class="last">{{item.remainder_value}}</div>
        <div class="dis">{{item.usage}}</div>
      </div>
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
    
  },
  created(){
    const clubInfo=JSON.parse(this.$Cookies.get('funing'))
    this.clubInfo=clubInfo;
    var uid=this.$route.query.uid
    this.uid=uid;
    this.postAxios({method:'check.club.member',uid:uid,club_id: clubInfo.normal_club_id}).then(res=>{
      this.info=res;
      this.isAdmin=Boolean(res.admin);
    })
    this.getlist();
    
  },
  methods:{
    adminchange(isAdmin){
      this.postAxios({method:'club.member.admin',uid:this.uid,club_id: this.clubInfo.normal_club_id,admin:Number(isAdmin)}).then(res=>{
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
      this.$dialog.confirm({
        title: '确认充值',
        message: "确认为 <span style='color:red'>"+ _this.info.nickname +"</span> 充值 <span style='color:red'>" + _this.value + '</span> 房卡？'
      }).then(() => {
        var data={
          method: 'club.member.fangka.recharge',
          club_id: '',
          uid: this.uid,
          value: this.value
        }
        this.postAxios(data).then(res=>{
          if(res.errno==0){
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
        uid: this.uid,
        club_id: '',
        page: this.page,
        u_type: 'USER',
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
  
</style>