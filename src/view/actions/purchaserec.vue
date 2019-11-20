<template>
  <div class="recharge">
    <van-nav-bar
      title="玩家充卡"
      left-text="返回"
      left-arrow
      right-text="搜索"
      @click-left="$router.back(-1)"
      @click-right='searchShow=!searchShow'
    />
    <div class="searchShow" v-show='searchShow'>
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
        <div class="date">充卡时间</div>
        <div class="memo">详情</div>
        <div class="state">状态</div>
      </div>
      <div class="item" v-for="(item,index) in records" :key='index'>
        <div class="date">{{item.created}}</div>
        <div class="memo">{{item.cash}}购买{{item.fangka}}房卡</div>
        <div class="num" :class="{color1:item.status=='VERIFY',color2:item.status=='REFUSE'}">{{item.status=='VERIFY'?"等待处理":item.status=='REFUSE'?"充卡失败":"充卡成功"}}</div>
      </div>
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
        start_time:''
      },
      currentDate: new Date(),
      minDate: null,
      info:{},
      records:[],
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
    getlist(){
      this.$toast.loading({
        duration:0,
        forbidClick: true, // 禁用背景点击
        loadingType: 'spinner',
        message: '加载中...'
      })
      var data={method:'agent.fangka.purchase.reqs',start_time:this.formdata.start_time}
      this.postAxios(data).then(res=>{
        this.$toast.clear();
        if(res.records.length>0){
          this.records=res.records; 
        }else{
          this.page==1?'':this.page--;
          this.$toast('没有更多了');
        }
      })
    },
    clearSearch(){
      this.formdata={
        start_time:''
        };
      this.searchShow=false;
      this.getlist();
    },
    onSearch(){
      this.searchShow=false;
      this.getlist();
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
        .memo{
          flex: 1;
          text-align: center;
        }
      }
      .item{
        padding:5px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .memo{
          flex:1;
          text-align: center;
        }
        .num{
          text-align: center;
          color: blue;
        }
        .color1{
          color: #868686;
        }
        .color2{
          color: #ff0000;
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
    
  }
</style>