<template>
  <div class="player">
    <van-nav-bar
      title="统计"
      left-text="返回"
      left-arrow
      @click-left="$router.back(-1)"
    >
    <div slot="right" @click="searchShow=!searchShow" style="color:#1989fa;font-size:20px;" v-if="active==1">搜索</div>
    </van-nav-bar>
    <!-- 列表 -->
    <van-tabs v-model="active">
      <van-tab title="每日统计">
        <div class="memberlist">
          <div class="thead">
            <div class="date">时间</div>
            <div class="num">场次</div>
            <div class="last">消耗房卡</div>
          </div>
          <div class="item" v-for="(item,index) in list" :key='index' >
            <div class="date">{{item.day}}</div>
            <div class="num">{{item.roundNum}}</div>
            <div class="last">{{item.fangka}}</div>
          </div>
        </div>
      </van-tab>
      <van-tab title="玩家统计">
        <div class="commoninfo">
          <div class="item">
            <div class="name">参与人次 : {{commonData.userNum}}</div>
            <div class="idnum">场次 : {{commonData.roundNum}}</div>
          </div>
          <div class="item">
            <div class="number">消耗房卡 : {{commonData.fangkaCost}}</div>
            <div>大赢家 : {{commonData.winerCost}}</div>
          </div>
        </div>
        <van-field
          style="border-top:1px solid #333;background:#868686;color:#fff;"
          :value="formdata.start_date+'至'+formdata.end_date"
          label="起始时间"
          @focus='searchShow=!searchShow'
          >
          <van-button slot="button" size="small" type="primary" @click='searchShow=!searchShow'>搜索</van-button>
        </van-field>
        <div class="memberlist">
          <div class="thead">
            <div class="date">ID</div>
            <div class="num"> 昵称</div>
            <div class="last">大赢家</div>
            <div class="last" v-if="type=='integral'">分数</div>
            <div class="last">场次</div>
            <div class="last">操作</div>
          </div>
          <div class="item" v-for="(item,index) in list" :key='index' >
            <div class="date">{{item.uid}}</div>
            <div class="num">{{item.nickname}}</div>
            <div class="last">{{item.winerNum}}</div>
            <div class="last" v-if="type=='integral'">{{item.score}}</div>
            <div class="last">{{item.roundNum}}</div>
            <div><van-button size="mini" type="info" @click="checkmember(item.uid)">查看</van-button></div>
          </div>
        </div>
      </van-tab>
    </van-tabs>

    <div class="searchShow" v-show='searchShow'>
      <van-search
        v-model="formdata.uid"
        placeholder="请输入用户ID"
        shape="round"
        @search="onSearch"
      >
      </van-search>
      <van-search
        v-model="formdata.start_date"
        placeholder="请输入开始时间"
        shape="round"
        readonly
        @focus="popupshow=true"
      >
      </van-search>
      <van-search
        v-model="formdata.end_date"
        placeholder="请输入截止时间"
        shape="round"
        readonly
        @focus="popupshow2=true"
      >
      </van-search>
      <div class='btn'>
        <van-button class="btn-search" size='small' type="primary" @click="onSearch">搜索</van-button>
        <van-button class="btn-search" size='small' type="danger" @click="clearSearch">清空</van-button>
        </div>
    </div>
     <!-- 筛选时间 -->
    <van-popup v-model="popupshow" position="bottom" >
      <van-datetime-picker
        v-model='start_date'
        type="date"
        :min-date='minDate'
        :max-date="currentDate"
        @confirm='confirm'
        @cancel='cancel'
      />
    </van-popup>
    <van-popup v-model="popupshow2" position="bottom" >
      <van-datetime-picker
        v-model='end_date'
        type="date"
        :min-date='minDate'
        :max-date="currentDate"
        @confirm='confirm2'
        @cancel='cancel2'
      />
    </van-popup>
  </div>
</template>
<script>
export default {
  name:'menus',
  data(){
    return {
      type:'',
      commonData:{},
      popupshow:false,
      popupshow2:false,
      searchShow:false,
      active:0,
      clubInfo:{},
      clubid:0,
      list:[],
      currentDate: new Date(),
      start_date: '',
      end_date: new Date(),
      minDate: null,
      formdata:{
        uid:'',
        start_date:'',
        end_date:''
      }
    }
  },
  watch:{
    active:function(val){
      if(val==0){
        this.getlist();
      }else{
        this.getlist2();
      }
    },
  },
  created(){
    var type=this.$route.query.type;
    this.type=type;
    this.start_date=new Date(new Date().setDate((new Date()).getDate() - 7));
    const info=JSON.parse(this.$Cookies.get('funing'));
    this.clubInfo=info;
    if(type=='integral'){
      this.clubid=this.clubInfo.integral_club_id;
    }else{
      this.clubid=this.clubInfo.normal_club_id;
    }
    this.initDate();
    this.getlist();
    this.getCommon();
  },
  methods:{
    getCommon(){
      var data={club_id:this.clubid,from:'web'};
      this.postAxiosimg('user/common',data)
        .then(res=>{
          if(res.errno==0){
            this.commonData=res.data;
          }
      })
    },
    checkmember(uid){
      this.$router.push({path:'/standings',query:{uid:uid,type:this.type}})
    },
    initDate(){
      var mindate ='2018-01-01'
      this.minDate=new Date(Date.parse(mindate.replace(/-/g, "/")));
      var date=new Date(Date.parse(this.getDate(-7).replace(/-/g, "/")));
      this.formdata.start_date=this.YymmddFormat(date);
      var end_date=this.YymmddFormat();
      this.formdata.end_date=end_date;
    },
    onSearch(){
      this.getlist2();
      this.searchShow=false;
    },
    clearSearch(){
      this.initDate();
      this.getlist2();
      this.searchShow=false;
    },
    confirm(value){
      let date=this.YymmddFormat(value);
      this.formdata.start_date=date
      this.popupshow=false;
    },
    cancel(){
      this.popupshow=false;
    },
    confirm2(value){
      let date=this.YymmddFormat(value);
      this.formdata.end_date=date
      this.popupshow2=false;
    },
    cancel2(){
      this.popupshow2=false;
    },
    getDate(index){
      var date = new Date(); //当前日期
      var newDate = new Date();
      newDate.setDate(date.getDate() + index);//官方文档上虽然说setDate参数是1-31,其实是可以设置负数的
      var time = newDate.getFullYear()+"-"+(newDate.getMonth()+1)+"-"+newDate.getDate();
      return time;
    },
    getlist(){
      this.$toast.loading({
        duration:0,
        forbidClick: true, // 禁用背景点击
        loadingType: 'spinner',
        message: '加载中...'
      })
      var data={club_id:this.clubid,from:'web'}
      this.postAxiosimg('day',data)
        .then(res=>{
          this.$toast.clear();
          if(res.errno==0){
            this.list=res.data;
            this.total=res.totalInegral

          }
      })
    },
    getlist2(){
      this.$toast.loading({
        duration:0,
        forbidClick: true, // 禁用背景点击
        loadingType: 'spinner',
        message: '加载中...'
      })
      var data={club_id:this.clubid,from:'web',start_date:this.formdata.start_date,end_date:this.formdata.end_date,uid:this.formdata.uid};
      this.postAxiosimg('user/search',data)
        .then(res=>{
          this.$toast.clear();
          if(res.errno==0){
            this.list=res.data;
          }
      })
    },
    YymmddFormat(newDate) {
      if(newDate){
        var data=new Date(newDate);
      }else{
        var data=new Date();
      }
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
.player{
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
  .commoninfo{
    padding: 0 20px;
    .item{
      display: flex;
      justify-content: space-between;
      line-height: 2;
      div {
        flex: 1;
      }
      
    }
  }
  .memberlist{
    .item{
      line-height: 2;
      div {
        flex: 1;
      }
      .num{
        flex: 1;
        font-size: 12px;
      }
    }
  }
}
    
</style>