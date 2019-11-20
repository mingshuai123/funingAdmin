<template>
  <div class="player">
    <van-nav-bar
      title="对战详情"
      left-text="返回"
      left-arrow
      @click-left="$router.back(-1)"
      >
    </van-nav-bar>
    <!-- 列表 -->
    <div class="matchList">
        <div class="memberList">
          <div class="thead">
            <span class="name">局数</span>
            <span class="info">详情</span>
            <span class="score">得分</span>
          </div>
          <div class="item" v-for="(item,index) in list " :key="index">
            <div class="rounds">第{{item.round}}局</div>
            <div class="info" >
              <div class="items" v-for="(xx,index2) in item.round_info.userInfo" :key="index2">
                <div class="img">
                  <img :src="xx.icon" :onerror='defaultImg'>
                  <div class="name">{{xx.userName}} <span>(ID : {{xx.userId}})</span></div>
                </div>
                <span class="score" :class="{color:xx.score<0}">{{xx.score}}</span>
            </div>
            </div>
            
          </div>
        </div>
    </div>
  </div>
</template>
<script>
export default {
  name:'menus',
  data(){
    return {
      clubInfo:{},
      list:[],
      formdata:{
        uid:'',
        game_id:'',
        game_type:'',
      }
    }
  },
 
  created(){
    this.formdata.uid=this.$route.query.uid;
    this.formdata.game_type=this.$route.query.type;
    this.formdata.game_id=this.$route.query.gameid;
    const info=JSON.parse(this.$Cookies.get('funing'));
    this.clubInfo=info;
    this.getlist();
  },
  methods:{
    checkmember(uid){
      this.$router.push({path:'/standings',query:{uid:uid}})
    },
    getlist(){
      this.$toast.loading({
        duration:0,
        forbidClick: true, // 禁用背景点击
        loadingType: 'spinner',
        message: '加载中...'
      })
      if(this.formdata.game_type==1){
        var data={method:'game_rounds',uid:this.formdata.uid,game_id:this.formdata.game_id};
      }else{
        var data={method:'sss_game_rounds',game_id:this.formdata.game_id}
      }
       this.postAxioshall(data).then(res=>{
        this.$toast.clear();
        this.list=res.rounds;
      })
    },
  }
}
</script>
<style lang="less" scoped>
  .matchList{
    .memberList{
      .thead{
        display: flex;
        justify-content: space-between;
        background-color: #333;
        color: #fff;
        padding: 5px 15px;
        .name{
          width: 20%;
        }
        .info{
          flex:1;
        }
      }
      .item{
        margin: 5px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border: 1px solid #e5e5e5;
        border-radius: 5%;
        .rounds{
          margin: 5px;
        }
        .info{
          flex: 1;
          .items{
            padding: 5px;
            display: flex;
            .img{
              flex: 1;
              height: 25px;
              margin: 0 5px ;
              display: flex;
              align-items: center;
              img{
                height: 30px;
                width: 30px;
                margin: 5px;
              }
              .name{
                color: #000;
                span{
                  font-size: 12px;
                  color: #868686
                }
              }
            }
            .score{
              color: blue;
            }
            .score.color{
              color: red;
            }
          }
        }
      }
    }
  }
</style>