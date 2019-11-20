<template>
  <div class="match">
    <van-nav-bar
      title="积分圈比赛"
      left-text="返回"
      left-arrow
      @click-left="$router.back(-1)"
      >
      <div slot="right" @click="searchShow=!searchShow" style="color:#1989fa;font-size:20px;">搜索</div>
    </van-nav-bar>
    <div class="matchList">
      <div class="oneitem" v-for="(item,index) in games" :key="index">
        <div class="info" v-if="item.game_type==1">
          <div class="memo">
            <div class="roomid">{{item.room_info.room_text}}{{item.room_info.option.round}}局</div>
            <div class="type">{{item.room_info.option_text}}</div>
          </div>
          <div class="date">
            <div>开始时间:{{item.room_info.time}}</div> 
            <div>结束时间:{{item.created}}</div> 
          </div>
          <!-- <div class="date">对战时间 : {{item.created}}</div> -->
        </div>
        <div class="info" v-if="item.game_type==2">
          <div class="memo">
            <div class="roomid">大菠萝{{item.wanfa==0?'经典场':item.wanfa==1?'循环场':'全一色'}} {{item.room_info.maxGames}}局</div>
            <div class="type">打枪倍数 {{item.room_info.shootMulti}}倍</div>
          </div>
          <div class="date">
            <div>开始时间:{{item.room_info.time}}</div> 
            <div>结束时间:{{item.created}}</div> 
            <!-- <div>对战时间 : {{item.created}}</div>  -->
            <div style="text-align:right">
              <van-button size="small" type="primary" @click="checkmember2(item.game_type,item.game_id,item.roles[0].uid)">查看对局</van-button>
            </div>
          </div>
        </div>
        <div class="memberList">
          <div class="thead">
            <span class="name">昵称</span>
            <span class="id">玩家ID</span>
            <span class="score">得分</span>
          </div>
          <div v-if="item.game_type==1">
            <div  class="item" v-for="(xx,index2) in item.roles" :key="index2">
              <span class="name">{{xx.name}} <van-tag round type="warning" v-if='xx.uid==item.room_info.owner_uid'>房主</van-tag></span>
              <span class="id">{{xx.uid}}</span>
              <span class="score">{{xx.total_score}} <van-tag type="danger" v-if='index2==item.room_info.winner'>大赢家</van-tag></span>
            </div>
          </div>
          <div v-else>
            <div  class="item" v-for="(xx,index2) in item.roles" :key="index2">
              <span class="name">{{xx.userName}} <van-tag round type="warning" v-if='xx.userId==item.room_info.creator'>房主</van-tag></span>
              <span class="id">{{xx.userId}}</span>
              <span class="score">{{xx.score}} <van-tag type="danger" v-if='index2==item.room_info.winner'>大赢家</van-tag></span>
            </div>
          </div>
          
        </div>
      </div>
    </div>
    <!-- 分页 -->
    <div class="page" v-if='games.length>0'>
      <van-button size="small" @click="prePage">上一页</van-button>
      <van-button size="small" @click="nextPage">下一页</van-button>
    </div>
    <div class="nodata" v-else>暂无数据</div>
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
        readonly
        @focus="popupshow=true"
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
  name:'matchManage',
  data(){
    return {
      searchShow:false,
      popupshow:false,
      formdata:{
        start_time:'',
        id:''
      },
      page:1,
      currentDate: new Date(),
      minDate: null,
      info:{},
      games:[],
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
    checkmember2(type,gameid,uid){
      this.$router.push({path:'/gameRound',query:{type:type,gameid:gameid,uid:uid}})
    },
    getlist(){
      this.$toast.loading({
        duration:0,
        forbidClick: true, // 禁用背景点击
        loadingType: 'spinner',
        message: '加载中...'
      })
      var data={method:'club.game.record',page:this.page,uid:this.formdata.id,start_time:this.formdata.start_time,club_id:this.info.integral_club_id}
      this.postAxios(data).then(res=>{
        this.$toast.clear();
        if(res.games.length>0){
          var list= res.games;
          for(var i=0;i<list.length;i++){
            var maxIndex=0;
            if(list[i].game_type==1){
              for(var j=0;j<list[i].roles.length-1;j++){
                if(list[i].roles[maxIndex].total_score>list[i].roles[j+1].total_score){
                  maxIndex=maxIndex
                }else{
                  maxIndex=j+1
                }
              }
            }else{
              for(var j=0;j<list[i].roles.length-1;j++){
                if(list[i].roles[maxIndex].score > list[i].roles[j+1].score){
                  maxIndex=maxIndex
                }else{
                  maxIndex=j+1
                }
              }
            }
            
            list[i].room_info.winner=maxIndex
          }
          this.games=list;
        }else{
          this.page==1?'':this.page--;
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
    clearSearch(){
      this.formdata={
        id:'',
        start_time:''
        };
      this.searchShow=false;
      this.getlist();
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
  .match{
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
    .matchList{
      .oneitem{
          margin: 5px;
          background-color: #e5e5e5;
          border:1px solid #333;
          border-radius: 5%;
        .info{
          padding: 5px;
          display:flex;
          justify-content: space-between;
          color: rgb(0, 128, 255);
          .memo{
            flex: 1;
          }
          .date{
            color: #868686;
            font-size: 12px;
          }
        }
      }
      .memberList{
        .thead{
          display: flex;
          justify-content: space-between;
          background-color: #868686;
          padding: 5px;
          .name{
            flex:1;
          }
          .score,.id{
            width: 25%;
          }
        }
        .item{
          padding: 5px;
          display: flex;
          justify-content: space-between;
        }
        .name{
          flex: 1;
        }
        .id{
          flex: 0.5;
        }
        .score{
          width: 25%;
        }
      }
    }
  }
</style>