<template>
  <div class="manage">
    <van-nav-bar
      title="房卡购买审批"
      left-text="返回"
      left-arrow
      @click-left="$router.back(-1)"
    />
    <van-tabs v-model="active">
      <van-tab title="未处理">
        <!-- 列表 -->
        <div class="memberlist">
          <div class="thead">
            <div class="avatar">头像</div>
            <div class="name">昵称</div>
            <div class="memo">联系方式</div>
            <div class="handle">操作</div>
          </div>
          <div class="item" v-for="(item,index) in list" :key='index' >
            <div class="avatar"><img :src="item.icon" alt="" :onerror='defaultImg'></div>
            <div class="name"><div>{{item.nickname}}</div><div class="id">ID : {{item.uid}}</div></div>
            <div class="memo" >{{item.info}}</div>
            <div class="handle">
              <van-button size='mini' @click="checkmember(item.uid)" type="info">查阅</van-button>
            </div>
          </div>
        </div>
      </van-tab>
      <van-tab title="已处理">
        <div class="memberlist">
          <div class="thead">
            <div class="avatar">头像</div>
            <div class="name">昵称</div>
            <div class="memo">联系方式</div>
            <div class="handle">状态</div>
          </div>
          <div class="item" v-for="(item,index) in list" :key='index' >
            <div class="avatar"><img :src="item.icon" alt="" :onerror='defaultImg'></div>
            <div class="name"><div>{{item.nickname}}</div><div class="id">ID : {{item.uid}}</div></div>
            <div class="memo" >{{item.info}}</div>
            <div class="status">已查阅</div>
          </div>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>
<script>
export default {
  name:'clubManage',
  data(){
    return {
      finished:false,
      loading:false,
      clubInfo:{},
      active:0,
      list:[],
      records:[],
      total:0,
      page:1,
    }
  },
  watch:{
    active:function(val){
        this.getlist();
    },
  },
  created(){
    const info=JSON.parse(this.$Cookies.get('funing'));
    this.clubInfo=info;
    this.getlist();
  },
  methods:{
    checkmember(id){
      var data={
          method: 'agent.req.handle',
          uid:id,
        }
      this.postAxios(data).then(res=>{
        if(res.errno==0){
          this.getlist();
        }
      })
    },
    getlist(){
      var _this=this;
      var status='UNHANDLE'
      if(this.active==0){
        status='UNHANDLE'
      }else{
        status='HANDLED'
      }
      var data={
          method: 'agent.reqs',
          status:status,
        }
      this.postAxios(data).then(res=>{
        if(res.errno==0){
          this.list=res.reqs;
        }
      })
    },
   
  }
}
</script>
<style lang="less" scoped>
  .manage{
    .memberlist{
      .thead{
        display: flex;
        justify-content: space-between;
        text-align: center;
        font-size: 18px;
        background-color: #868686;
        line-height: 1.8;
        padding: 0 5px;
        .avatar,.name{
          width:20%;
        }
        .memo{
          flex: 1;
        }
      }
      .item{
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding:5px;
        .avatar{
          width: 20%;
          display: flex;
          justify-content: center;
          align-items: center;
          img{
            width: 50px;
            height: 50px;

          }
        }
        .name{
          .id{
            font-size: 12px;
          }
        }
        .memo{
          color: #868686;
          padding: 0 5px;
          flex: 1;
        }
        .status{
          color: #ff0000;
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