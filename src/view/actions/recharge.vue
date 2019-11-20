<template>
  <div class="recharge">
    <van-nav-bar
      title="玩家充卡"
      left-text="返回"
      left-arrow
      @click-left="$router.back(-1)"
    >
      <div slot="right" @click="searchShow=!searchShow" style="color:#1989fa;font-size:20px;">搜索</div>
    </van-nav-bar>
    <div class="searchShow" v-show='searchShow'>
      <van-search
        v-model="formdata.id"
        placeholder="请输入用户ID"
        shape="round"
        @search="onSearch"
      >
      </van-search>
      <van-search
        v-model="formdata.start_time"
        placeholder="请输入时间"
        shape="round"
        @focus="popupshow=true"
      >
      </van-search>
      <div class='btn'>
        <van-button class="btn-search" size='small' type="primary" @click="onSearch">搜索</van-button>
        <van-button class="btn-search" size='small' type="danger" @click="clearSearch">清空</van-button>
        </div>
    </div>
    <!-- 列表 -->
    <div class="memberlist">
      <div class="thead">
        <div class="memberinfo">用户信息</div>
        <div class="num">房卡数</div>
        <div class="date">充卡时间</div>
      </div>
      <div class="item" v-for="(item,index) in memberList" :key='index'  @click='checkmember(item.uid)' >
        <div class="memberinfo">
          <img :src="item.icon" alt="" :onerror='defaultImg'>
          <div class="name">
            <div class="name">{{item.nickname}}</div>
            <div>ID : {{item.uid}}</div>
          </div>
        </div>
        <div class="num" :class="{color:item.value<0}">{{item.value}}</div>
        <div class="date">{{item.created}}</div>
      </div>
    </div>

    <!-- 分页 -->
    <div class="page">
      <van-button size="small" @click="prePage">上一页</van-button>
      <van-button size="small" @click="nextPage">下一页</van-button>
    </div>
    <van-overlay
      :show="searchShow"
      @click="searchShow = false"
    />
    <!-- 筛选时间 -->
    <van-popup v-model="popupshow" position="bottom" >
      <van-datetime-picker
        type="date"
        :min-date='minDate'
        :max-date="currentDate"
        @confirm='confirm'
        @cancel='cancel'
      />
    </van-popup>
    
  </div>
</template>
<script>
export default {
  name:'menus',
  data(){
    return {
      loading:false,
      searchShow:false,
      popupshow:false,
      formdata:{
        id:'',
        start_time:''
      },
      currentDate: new Date(),
      minDate: null,
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
    this.getlist();
    
  },
  methods:{
    checkmember(id){
      this.$router.push({path:'/player',query:{uid:id}})
    },
    getlist(){
      this.$toast.loading({
        duration:0,
        forbidClick: true, // 禁用背景点击
        loadingType: 'spinner',
        message: '加载中...'
      })
      var data={method:'agent.user.charges',page:this.page,uid:this.formdata.id,start_time:this.formdata.start_time}
      this.postAxios(data).then(res=>{
        this.$toast.clear();
        if(res.records.length>0){
          var list=[];
          res.records.forEach(item => {
            if(item.usage=='user_fangka_recharge'){
              list.push(item);
            }
          });
          this.memberList=list; 
        }else{
          this.page==1?'':this.page--;
          this.$toast('没有更多了');
        }
      })
    },
    getlist2(){
      this.postAxios({method:'check.uid',uid:this.formdata.id}).then(res=>{
        if(res.errno==0){
          this.$router.push({path:'/player',query:{uid:res.uid}})
        }else{
          this.$toast('该玩家不存在');
          this.formdata={
            id:'',
            start_time:''
          };
        }
      })
    },
    clearSearch(){
      this.formdata={
        id:'',
        start_time:''
      };
      this.searchShow=false;
      this.getlist();
    },
    onSearch(){
      this.searchShow=false;
      this.getlist2();
    },
    confirm(value){
      let date=this.YymmddFormat(value);
      this.formdata.start_time=date
      this.popupshow=false;
    },
    cancel(){
      this.formdata.start_time='';
      this.popupshow=false;
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
      document.documentElement.scrollTop=0; document.body.scrollTop=0;
      this.page+=1;
      this.getlist()
    },
    YymmddFormat(newDate) {
      let data=new Date(newDate);
      let Month = data.getMonth() + 1;
      Month = Month >= 10 ? Month : '0' + Month;
      let d = data.getDate();
      d = d >= 10 ? d : '0' + d
      // return [[newDate.getFullYear(), Month, d].join('-'), [newDate.getHours(), newDate.getMinutes(), newDate.getSeconds()].join(':')].join(' ');
      return [data.getFullYear(), Month, d].join('-');
    }
  }
}
</script>
<style lang="less" scoped>
  .recharge{
    .searchShow{
      position: fixed;
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
        padding: 5px;
        .memberinfo{
          width:50%;
        }
        .date{
          width:30%;
          text-align: center;
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
          width:50%;
          img{
            width: 30px;
            height: 30px;
            margin: 5px;
          }
          .name{
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
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