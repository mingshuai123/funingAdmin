<template>
  <div class="player">
    <van-nav-bar
      title="对战记录"
      left-text="返回"
      left-arrow
      @click-left="$router.back(-1)"
      >
    </van-nav-bar>
    <!-- 列表 -->
    <div class="matchList">
      <div class="items" v-for="(item,index) in list" :key="index">
        <div class="info" v-if="item.game_type==1">
          <div class="memo">
            <div class="roomid">{{item.room_info.room_text}}{{item.room_info.option.round}}局</div>
            <div class="type">{{item.room_info.option_text}}</div>
          </div>
          <div class="date">
            <div>开始时间:{{item.room_info.time}}</div> 
            <div>结束时间:{{item.created}}</div> 
          </div>
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
          <div  v-for="(xx,index2) in item.roles" :key="index2" >
            <div class="item" v-if='item.game_type==1'>
              <span class="name">{{xx.name}} <van-tag round type="warning" v-if='xx.uid==item.room_info.owner_uid'>房主</van-tag></span>
              <span class="id">{{xx.uid}}</span>
              <span class="score" :class="{color:xx.total_score<0}" >{{xx.total_score}} <van-tag type="danger" v-if='index2==item.room_info.winner'>大赢家</van-tag></span>
            </div>
            <div class="item" v-if='item.game_type==2'>
              <span class="name">{{xx.userName}} <van-tag round type="warning" v-if='xx.userId==item.room_info.creator'>房主</van-tag></span>
              <span class="id">{{xx.userId}}</span>
              <span class="score" :class="{color:xx.score<0}" >{{xx.score}} <van-tag type="danger" v-if='index2==item.room_info.winner'>大赢家</van-tag></span>
            </div>
          </div>
        </div>
      </div>
      <div class="nodata" v-if="list.length==0">暂无数据</div>
    </div>
    <div class="page">
      <van-button size="small" @click="prePage">上一页</van-button>
      <span>第{{page}}页</span>
      <van-button size="small" @click="nextPage">下一页</van-button>
    </div>
  </div>
</template>
<script>
export default {
  name:'menus',
  data(){
    return {
      active:0,
      clubInfo:{},
      clubid:0,
      list:[],
      currentDate: new Date(),
      start_date: '',
      end_date: new Date(),
      minDate: null,
      page:1,
      formdata:{
        uid:'',
        start_date:'',
        end_date:'',
        type:'',
      }
    }
  },
  watch:{
    
  },
  created(){
    this.formdata.uid=this.$route.query.uid;
    this.formdata.type=this.$route.query.type;
    const info=JSON.parse(this.$Cookies.get('funing'));
    this.clubInfo=info;
    if(this.formdata.type=='integral'){
      this.clubid=this.clubInfo.integral_club_id;
    }else{
      this.clubid=this.clubInfo.normal_club_id;
    }
    this.initDate();
    this.getlist();
  },
  methods:{
    checkmember2(type,gameid,uid){
      this.$router.push({path:'/gameRound',query:{type:type,gameid:gameid,uid:uid}})
    },
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
    prePage(){
      this.page==1?this.$toast("当前是第一页"):this.page-=1;
    },
    nextPage(){
      document.documentElement.scrollTop=0; document.body.scrollTop=0;
      this.page++;
      this.getlist();
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
      var data={club_id:this.clubid,from:'web',start_date:this.formdata.start_date,end_date:this.formdata.end_date,uid:this.formdata.uid,page:this.page};
      this.postAxiosimg('standings',data)
        .then(res=>{
          this.$toast.clear();
          if(res.errno==0){
            // this.list=res.histories;
            if(res.histories.length>0){
              var list= res.histories;
              for(var i=0;i<list.length;i++){
                var maxIndex=0;
                if(list[i].game_type==1){
                  for(var j=0;j<list[i].roles.length-1;j++){
                    if(list[i].roles[maxIndex].total_score>list[i].roles[j+1].total_score){
                      maxIndex=maxIndex;
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
              this.list=list;
            }else{
              this.page==1?'':this.page--;
              this.$toast('没有更多了');
            }
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
  .matchList{
      .items{
          background-color: #e5e5e5;
          margin: 10px 5px;
          border: 1px solid #333;
          border-radius: 5px;
        .info{
          padding: 5px;
          display:flex;
          justify-content: space-between;
          line-height: 1.6;
          .memo{
            flex: 1;
          }
          .date{
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
          .id{
            text-align: center;
            width: 25%;
          }
          .score{
            text-align: left;
            width: 25%;
          }
        }
        .item{
          padding: 5px;
          display: flex;
          justify-content: space-between;
          .name{
            flex: 1;
          }
          .id{
            font-size: 12px;
            color: #868686;
            text-align: center;
            width: 25%;
          }
          .score{
            width: 25%;
            color: blue;
          }
          .score.color{
            color: red;
          }
        }
        
      }
    }
</style>