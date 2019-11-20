<template>
  <div class="manage">
    <van-nav-bar
      title="积分圈管理"
      left-text="返回"
      left-arrow
      @click-left="$router.back(-1)"
    >
      <div slot="right" @click="searchShow=!searchShow" style="color:#1989fa;font-size:20px;">搜索</div>
    </van-nav-bar>
    <van-tabs v-model="active">
      <van-tab title="成员管理">
        <!-- 列表 -->
        <div class="memberlist">
          <div class="thead">
            <div class="memberinfo">用户信息</div>
            <div class="date">加入时间</div>
            <div class="handle">操作</div>
          </div>
          <div class="item" v-for="(item,index) in memberList" :key='index' >
            <div class="memberinfo">
              <img :src="item.icon" alt="" :onerror='defaultImg'>
              <div>
                <div>{{item.nickname}}</div>
                <div style="font-size:12px;">ID : {{item.uid}}</div>
              </div>
            </div>
            <div class="date">{{item.created.slice(2, 16)}}</div>
            <div class="handle">
              <van-button size='small' v-if='!item.admin' @click="kickout(item.nickname,item.uid)" type="danger"  style="margin-right:5px;">踢出</van-button>
              <van-button size='small' @click='checkmember(item.uid)' type="info">查看</van-button>
            </div>
          </div>
        </div>
      </van-tab>
      <van-tab title="加入申请">
        <div class="memberlist">
          <div class="thead">
            <div class="memberinfo">用户信息</div>
            <div class="date">加入时间</div>
            <div class="handle">操作</div>
          </div>
          <div class="item" v-for="(item,index) in memberList" :key='index' >
            <div class="memberinfo">
              <img :src="item.icon" alt="" :onerror='defaultImg'>
              <div>
                <div>{{item.nickname}}</div>
                <div style="font-size:12px;">ID : {{item.uid}}</div>
              </div>
            </div>
            <div class="date">{{item.created.slice(2, 16)}}</div>
            <div class="handle">
              <van-button size='small' type="danger" style="margin-right:5px;">踢出</van-button>
              <van-button size='small' type="info">查看</van-button>
            </div>
          </div>
        </div>
        <div class="nodata" v-if='memberList.length==0'>暂无数据</div>
      </van-tab>
      <van-tab title="退出申请">
        <div class="memberlist">
          <div class="thead">
            <div class="memberinfo">用户信息</div>
            <div class="date">加入时间</div>
            <div class="handle">操作</div>
          </div>
          <div class="item" v-for="(item,index) in memberList" :key='index' >
            <div class="memberinfo">
              <img :src="item.icon" alt="" :onerror='defaultImg'>
              <div>
                <div>{{item.nickname}}</div>
                <div style="font-size:12px;">ID : {{item.uid}}</div>
              </div>
            </div>
            <div class="date">{{item.created.slice(2, 16)}}</div>
            <div class="handle">
              <van-button size='small' v-if='!item.admin' @click="handle(item.uid,'AGREE')" type="danger"  style="margin-right:5px;">同意</van-button>
              <van-button size='small' @click="handle(item.uid,'REFUSE')" type="info">拒绝</van-button>
            </div>
          </div>
        </div>
        <div class="nodata" v-if='memberList.length==0'>暂无数据</div>
      </van-tab>
    </van-tabs>

    <div class="searchShow" v-show='searchShow'>
      <van-search
        v-model="searchId"
        placeholder="请输入用户ID"
        shape="round"
        @search="onSearch"
      >
      </van-search>
      <div class='btn'>
        <van-button class="btn-search" size='small' type="primary" @click="onSearch">搜索</van-button>
        <van-button class="btn-search" size='small' type="info" @click="onInvite">邀请</van-button>
        <van-button class="btn-search" size='small' type="danger" @click="clearSearch">清空</van-button>
        </div>
    </div>
  </div>
</template>
<script>
export default {
  name:'clubManage',
  data(){
    return {
      searchShow:false,
      searchId:'',
      clubInfo:{},
      active:0,
      popupshow:false,
      memberList:[],
      nextpage:true,
      page:1,
      value:''
    }
  },
  watch:{
    active:function(val){
      if(val==0){
        this.getlist();
      }else{
       this.getlist2(val);
      }
    },
  },
  created(){
    const info=JSON.parse(this.$Cookies.get('funing'));
    this.clubInfo=info;
    this.getlist();
  },
  methods:{
    onSearch(){
      var data={
          method: 'check.club.member',
          uid:this.searchId,
          club_id: this.clubInfo.integral_club_id,
        }
      this.postAxios(data).then(res=>{
        if(res.errno==0){
          this.$router.push({path:'/playerManage',query:{uid:res.uid}});
        }else{
          this.$toast('未找到')
        }
      })
    },
    onInvite(){
      var _this=this;
      var data={
          method: 'check.uid',
          uid:this.searchId,
        }
      this.postAxios(data).then(res=>{
        if(res.errno==0){
          _this.$dialog.confirm({
            title: '邀请加入朋友圈',
            message: "确认邀请 <span style='color:red'>"+ res.nickname +"("+ res.uid +")</span> 加入朋友圈?"
          }).then(() => {
            var data={
              method: 'club.member.invite',
              club_id:_this.clubInfo.integral_club_id,
              uid: _this.searchId,
              club_type: 'INTEGRAL_CLUB'
            }
            _this.postAxios(data).then(res=>{
              if(res.errno==0){
                _this.$toast({
                  duration:2000,
                  message:'邀请成功',
                  onClose:function(){
                    _this.searchShow=false;
                    _this.searchId='';
                  }
                });
              }else{
                _this.$toast('该玩家已存在')
              }
            })
          }).catch(() => {
            _this.searchShow=false;
            _this.searchId='';
          });
        }else{
          this.$toast('该玩家不存在')
        }
      })
    },
    clearSearch(){
      this.searchId='';
      this.searchShow=false;
    },
    checkmember(id){
      this.$router.push({path:'/playerManage2',query:{uid:id}});
    },
    kickout(nickname,id){
      var _this=this;
      this.$dialog.confirm({
        title: '提示',
        message: "确认移除 <span style='color:red'>"+ nickname +'</span> ？'
      }).then(() => {
        var data={
          method: 'club.member.kickout',
          club_id:this.clubInfo.integral_club_id ,
          tarid: Number(id),
        }
        this.postAxios(data).then(res=>{
          if(res.errno==0){
            this.$toast({
              duration:2000,
              message:'操作成功!',
              onClose:function(){
                location.reload();
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
    handle(id,state){
      var data={
        method: 'club.req.handle',
        club_id:this.clubInfo.integral_club_id ,
        tarid: Number(id),
        status:state,
      }
       this.postAxios(data).then(res=>{
          if(res.errno==0){
            this.$toast({
              duration:2000,
              message:'操作成功!',
              onClose:function(){
                this.getlist2(2)
              }
            });
          }else{
            this.$toast.fail(res.msg)
          }
        })
    },
    getlist(){
      var data={
          method: 'club.member.list',
          club_id: this.clubInfo.integral_club_id,
        }
      this.postAxios(data).then(res=>{
        if(res.errno==0){
          this.memberList=res.members;
        }
      })
    },
    getlist2(num){
      var data={};
      if(num==1){
        data={
          method: 'club.reqs',
          type: 'JOIN',
          club_id: this.clubInfo.integral_club_id,
        }
      }else{
        data={
          method: 'club.reqs',
          type: 'EXIT',
          club_id: this.clubInfo.integral_club_id,
        }
      }
      this.postAxios(data).then(res=>{
        if(res.errno==0){
          this.memberList=res.reqs;
        }
      })
    },
    confirm(){
      console.log("confirm"+this.value)
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
  .manage{
    .searchShow{
      position: absolute;
      top: 40px;
      left: 0;
      right: 0;
      background-color: #fff;
      z-index: 99;
      .btn{
        line-height: 2;
        margin: 10px auto ;
        display: flex;
        justify-content: space-around;
        align-items: center;
        .btn-search{
          width: 30%;
        }
      }
    }
    .memberlist{
      .thead{
        display: flex;
        justify-content: space-between;
        text-align: center;
        font-size: 18px;
        background-color: #868686;
        line-height: 1.8;
        .member{
          width: 40%;
        }
        .handle{
          width:30%;
        }
      }
      .item{
        padding:5px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .memberinfo{
          display: flex;
          align-items: center;
          img{
            width: 30px;
            height: 30px;
            margin: 5px;
          }
        }
        
        .color{
          color: red;
        }
        .date{
          font-size: 12px;
        }
        .handle{
          width: 30%;
          display: flex;
          justify-content: flex-end;
        }
      }
      .item:nth-child(odd){
        background-color: #e5e5e5;
      }
      .item:nth-child(even){
        background-color: #fff;
      }
    }
    .nodata{
      margin: 20px auto;
    }
  }
  
</style>