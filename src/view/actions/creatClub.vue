<template>
  <div class="player">
    <van-nav-bar
      title="创建新圈"
      left-text="返回"
      left-arrow
      @click-left="$router.back(-1)"
      >
    </van-nav-bar>
    <!-- 列表 -->
    <van-field label="俱乐部名称" v-model="formdata.name" placeholder="请输入俱乐部名称" />
    <van-radio-group v-model="formdata.club_type">
      <van-cell title="选择俱乐部类型" >
        <!-- 使用 title 插槽来自定义标题 -->
        <template slot="default">
          <van-radio-group v-model="formdata.club_type" style="display:flex;justify-content: space-between;">
            <van-radio name="2" clickable @click="formdata.club_type = '2'">朋友圈</van-radio>
            <van-radio name="3" clickable @click="formdata.club_type = '3'">积分圈</van-radio>
          </van-radio-group>
        </template>
      </van-cell>
    </van-radio-group>
    <div class="btn"> <van-button type="info" @click="handleCreate">创建</van-button></div>
  </div>
</template>
<script>
export default {
  name:'menus',
  data(){
    return {
      clubInfo:{},
      formdata:{
        name:'',
        club_type:'',
      }
    }
  },
  created(){
    this.formdata.club_type=String(this.$route.query.type) ;
    const info=JSON.parse(this.$Cookies.get('funing'));
    this.clubInfo=info;
    this.$toast('您还没有加入朋友圈，请创建~');
  },
  methods:{
    handleCreate(){
      var _this=this;
      if(this.formdata.name==''){
        this.$toast("请填写俱乐部名称");
        return false;
      }
      var data={ method: "new.club", club_name: this.formdata.name, club_type: this.formdata.club_type==2?'NORMAL_CLUB':'INTEGRAL_CLUB' }
      this.postAxioshall(data).then(res=>{
        if(res.errno==0){
          this.$toast({
            message:"创建成功",
            duration:2000,
            onClose:function(){
              _this.$router.push({path:'/friends'});
            }
          });
        }
      })
    },
  }
}
</script>
<style lang="less" scoped>
  .btn{
    position: fixed;
    bottom: 50px;
    left: 0 ;
    right: 0 ;
    width: 50%;
    margin: 0 auto;
    line-height:3;
    button{
      width: 100%;
    }
  }
</style>