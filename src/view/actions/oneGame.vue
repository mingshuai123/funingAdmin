<template>
  <div class="player">
    <van-nav-bar
      title="玩家充卡"
      left-text="返回"
      left-arrow
      @click-left="$router.back(-1)"
      >
      <div slot='right' v-if="active==1">
        <span @click='searchShow=!searchShow'>搜索</span>
      </div>
    </van-nav-bar>
    <!-- 列表 -->
    <div class="matchList">
      <div class="item" v-for="(item,index) in list" :key="index">
        <div class="info">
          <div class="memo">
            <div class="roomid">{{item.room_info.room_text}} {{item.room_info.option.round}}局</div>
            <div class="type">{{item.room_info.option_text}}</div>
          </div>
          <div class="date">对战时间 : {{item.room_info.time}}</div>
        </div>
        <div class="memberList">
          <div class="thead">
            <span class="name">昵称</span>
            <span>玩家ID</span>
            <span class="score">得分</span>
          </div>
          <div class="item" v-for="(xx,index2) in item.roles" :key="index2">
              <span class="name">{{xx.name}} <van-tag round type="warning" v-if='index2==0'>房主</van-tag></span>
              <span>{{xx.uid}}</span>
              <span class="score">{{xx.total_score}} <van-tag type="danger" v-if='xx.uid==item.room_info.owner_uid'>大赢家</van-tag></span>
          </div>
        </div>
      </div>
    </div>

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
        @focus="popupshow=true"
      >
      </van-search>
      <van-search
        v-model="formdata.end_date"
        placeholder="请输入截止时间"
        shape="round"
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
      popupshow:false,
      popupshow2:false,
      searchShow:false,
      active:0,
      clubInfo:{},
      list:[],
      currentDate: new Date(),
      start_date: '',
      end_date: new Date(),
      minDate: null,
      page:1,
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
    this.formdata.uid=this.$route.query.uid
    this.start_date=new Date(new Date().setDate((new Date()).getDate() - 7));
    const info=JSON.parse(this.$Cookies.get('funing'));
    this.clubInfo=info;
    this.initDate();
    this.getlist();
  },
  methods:{
    checkmember(uid){
      this.$router.push({path:'/standings',query:{uid:uid}})
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
      var data={club_id:this.clubInfo.integral_club_id,from:'web',start_date:this.formdata.start_date,end_date:this.formdata.end_date,uid:this.formdata.uid,page:this.page};
      this.postAxiosimg('standings',data)
        .then(res=>{
          this.$toast.clear();
          if(res.errno==0){
            this.list=res.histories;
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