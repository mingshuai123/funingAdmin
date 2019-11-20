<template>
  <div class="purchase">
    <van-nav-bar
      title="房卡购买"
      left-text="返回"
      left-arrow
      @click-left="$router.back(-1)"
    />
    <div class="items">
      <div class="item" v-for="(item,index) in items" :key="index">
        <van-cell>
          <template slot="title">
              <div>购买{{item.fangka}}张只需{{item.cash}}元</div>
          </template>
          <template slot="default">
            <van-button type="primary" size="mini" @click="purchase(index+1)">购买</van-button>
          </template>
        </van-cell>
      </div>
    </div>
    <div class="memo">
      <div>注：</div>
      <div>&nbsp;&nbsp;&nbsp;&nbsp;申请购买后请联系福宁娱乐官方微信<span>fnyl001</span>,<span>fnyl555</span>进行微信转账，转账后房卡及时到账，谢谢配合。</div>
      <div>&nbsp;&nbsp;&nbsp;&nbsp;更有会员俱乐部房卡消耗大返利，多大多返，房卡消耗满4返1。</div>
    </div>
  </div>
</template>
<script>
export default {
  name:'purchase',
  data(){
    return {
      clubInfo:{},
      items:[],
    }
  },
  created(){
    const info=JSON.parse(this.$Cookies.get('funing'));
    this.clubInfo=info;
    this.getInfo();
  },
  methods:{
    getInfo(){
      this.postAxios({method: 'fangka.purchase.conf'}).then(res=>{
        this.items=res.items;
      })
    },
    purchase(num){
      this.postAxios({method: 'fangka.purchase',dang:num}).then(res=>{
        if(res.errno==0){
          this.$dialog.alert({
            message: '您申请的购卡已提交,请联系官方客服微信确认购卡进度,客服微信:fnyl001、fnyl555；或者在首页购卡记录中查询购卡状态。谢谢支持！'
          }).then(() => {
            // on close
          });
        }
      })
    }
    
  }
}
</script>
<style lang="less" scoped>
  .purchase{
    .memo{
      margin-top: 20px;
      padding: 10px;
      color: #ff0000;
    }
  }
  
</style>