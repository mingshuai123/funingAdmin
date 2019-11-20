<template>
  <div class="player">
    <van-nav-bar
      title="大赢家设置"
      left-text="返回"
      left-arrow
      @click-left="$router.back(-1)"
      right-text="保存"
      @click-right='handlesave'
    >
    </van-nav-bar>
    <div class="settings">
      <div class="title">8局模式</div>
      <van-cell  title="2人模式" >
        <template slot="default">
          <van-stepper v-model="info['8-2']" />
        </template>
      </van-cell>
      <van-cell  title="3人模式" >
        <template slot="default">
          <van-stepper v-model="info['8-3']" />
        </template>
      </van-cell>
      <van-cell  title="4人模式" >
        <template slot="default">
          <van-stepper v-model="info['8-4']" />
        </template>
      </van-cell>
      <div class="title">16局模式</div>
      <van-cell  title="2人模式" >
        <template slot="default">
          <van-stepper v-model="info['16-2']" />
        </template>
      </van-cell>
      <van-cell  title="3人模式" >
        <template slot="default">
          <van-stepper v-model="info['16-3']" />
        </template>
      </van-cell>
      <van-cell  title="4人模式" >
        <template slot="default">
          <van-stepper v-model="info['16-4']" />
        </template>
      </van-cell>
    </div>
    
  </div>
</template>
<script>
export default {
  name:'menus',
  data(){
    return {
      clubInfo:{},
      info:{"8-2":0,"8-3":0,"8-4":0,"16-2":0,"16-3":0,"16-4":0},
    }
  },
  created(){
    const info=JSON.parse(this.$Cookies.get('funing'));
    this.clubInfo=info;
    this.getInfo();
  },
  methods:{
    handlesave(){
      var _this=this;
      var data={method: 'club.edit',club_id: this.clubInfo.integral_club_id,attr:JSON.stringify(this.info) }
      this.postAxios(data).then(res=>{
        if(res.errno==0){
          _this.$toast({
            duration:2000,
            message:'保存成功！',
            onClose:function(){
              _this.$router.back(-1);
            }
          })
        }
      })
    },
    getInfo(){
      this.postAxios({method: 'check.club',club_id: this.clubInfo.integral_club_id}).then(res=>{
        this.info=JSON.parse(res.winer_pay);
      })
    },
  }
}
</script>
<style lang="less" scoped>
  .settings{
    padding:5px;
  
  }
  
</style>