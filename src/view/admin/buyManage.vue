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
        <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
          >
          <div class="memberlist">
            <div class="thead">
              <div class="date">时间</div>
              <div class="memberinfo">用户</div>
              <div class="memo">详情</div>
              <div class="handle">操作</div>
            </div>
            <div class="item" v-for="(item,index) in list" :key='index' >
              <div class="date">{{item.created.slice(5, 16)}}</div>
              <div class="memberinfo">
                <div>{{item.agent_name}}</div>
                <div>ID:{{item.agent_id}}</div>
              </div>
              <div class="memo" >{{item.cash}}购买{{item.fangka}}房卡</div>
              <div class="handle">
                <van-button size='small' type='info' v-if='!item.admin' @click="kickout(item.agent_name,item._id)" style="margin-right:5px;">拒绝</van-button>
                <van-button size='small' type='danger' @click='checkmember(item.agent_name,item._id)'>通过</van-button>
              </div>
            </div>
          </div>
        </van-list>
      </van-tab>
      <van-tab title="已处理">
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
          >
          <div class="memberlist">
            <div class="thead">
              <div class="date">时间</div>
              <div class="memberinfo">用户</div>
              <div class="memo">详情</div>
              <div class="status">状态</div>
            </div>
            <div class="item" v-for="(item,index) in list" :key='index' >
              <div class="date">{{item.created.slice(5, 16)}}</div>
              <div class="memberinfo">
                <div>{{item.agent_name}}</div>
                <div>ID : {{item.agent_id}}</div>
              </div>
              <div class="memo" >{{item.cash}}购买{{item.fangka}}房卡</div>
              <div class="status" :class="{color:item.status=='REFUSE'}">
                {{item.status=='REFUSE'?'拒绝':'通过'}}
              </div>
            </div>
          </div>
        </van-list>
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
    checkmember(name,id){
      var _this=this;
      this.$dialog.confirm({
        title: '确认充值',
        message: "通过 <span style='color:red'>"+ name +"</span> 充值请求 ？"
      }).then(() => {
        var data={
          method: 'fangka.purchase.req.handle',
          _id: id,
          status: 'AGREE',
        }
        this.postAxios(data).then(res=>{
          if(res.errno==0){
            this.$toast({
              duration:2000,
              message:'操作成功',
              onClose:function(){
                _this.getlist();
              }
            });
          }
        })
      }).catch(() => {
        console.log("123")
      });
    },
    kickout(name,id){
      var _this=this;
      this.$dialog.confirm({
        title: '拒绝充值',
        message: "拒绝 <span style='color:red'>"+ name +"</span> 充值请求 ？"
      }).then(() => {
        var data={
          method: 'fangka.purchase.req.handle',
          _id: id,
          status: 'REFUSE',
        }
        this.postAxios(data).then(res=>{
          if(res.errno==0){
            this.$toast({
              duration:2000,
              message:'操作成功',
              onClose:function(){
                _this.getlist();
              }
            });
          }
        })
      }).catch(() => {
        console.log("123")
      });
    },
    getlist(){
      var _this=this;
      this.list=[];
      this.page=0;
      this.finished=false;
      var status='VERIFY'
      if(this.active==0){
        status='VERIFY'
      }else{
        status=''
      }
      var data={
          method: 'fangka.purchase.reqs',
          status:status,
        }
      this.postAxios(data).then(res=>{
        if(res.errno==0){
          this.total=res.reqs.length;
          this.records=res.reqs;
          this.onLoad();
        }
      })
    },
    onLoad(){
      var _this=this;
      setTimeout(() => {
        var page=this.page;
        var total=this.total;
        var num=total-page*20>=20?20:total%20;
        var n=num+page*20;
        if(total-page*20<=0){
           _this.loading = false;
          // 数据全部加载完成
          
          if ( _this.total==_this.list.length ) {
            _this.finished = true;
          }
          return false;
        }
        for(let i=page*20;i<=n-1;i++){
          _this.list.push(_this.records[i]);
        }
        _this.page++;
        _this.loading = false;
        // 数据全部加载完成
        
        if ( _this.total==_this.list.length ) {
          _this.finished = true;
        }
      }, 1000);
    },
  }
}
</script>
<style lang="less" scoped>
  .manage{
    .memberlist{
      width: 100%;
      overflow: hidden;
      .thead{
        display: flex;
        justify-content: space-between;
        text-align: center;
        font-size: 18px;
        background-color: #868686;
        line-height: 1.8;
        padding: 0 5px;
        .date,.memberinfo{
          width:20%;
        }
        .memo,.handle{
          flex: 1;
        }
      }
      .item{
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding:5px;
        font-size: 12px;
        .color{
          color: red;
        }
        .memberinfo{
          overflow: hidden;
        }
        .memo{
          color: #0000ff;
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