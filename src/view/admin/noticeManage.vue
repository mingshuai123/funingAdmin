<template>
  <div class="noticePage">
    <van-nav-bar
      title="玩家充卡"
      left-text="返回"
      left-arrow
      @click-left="$router.back(-1)"
    />
    <!-- 列表 -->
    <van-cell-group class="notice">
      <van-field
        v-model="notice"
        type="textarea"
        placeholder="请输入留言"
        rows="1"
        autosize
      />
    </van-cell-group>
    <div class="btnbox">
      <van-button class="btn" type="primary" @click="saveNotice">保存</van-button>
    </div>
  </div>
</template>
<script>
export default {
  name:'menus',
  data(){
    return {
      notice:'',
    }
  },
  created(){
    this.getlist();
  },
  methods:{
    saveNotice(){
      var data={method:'system.notice.modify',text:this.notice}
      this.postAxios(data).then(res=>{
        this.$toast.clear();
        if(res.errno==0){
          this.$toast("保存成功")
        }
      })
    },
    getlist(){
      this.$toast.loading({
        duration:0,
        forbidClick: true, // 禁用背景点击
        loadingType: 'spinner',
        message: '加载中...'
      })
      var data={method:'check.system.notice'}
      this.postAxios(data).then(res=>{
        this.$toast.clear();
        if(res.errno==0){
          this.notice=res.content; 
        }
      })
    },
  }
}
</script>
<style lang="less" scoped>
  .noticePage{
    height: 100%;
    background-color: #e5e5e5;
    position: relative;
    .notice{
      margin:20px auto;
    }
    .btnbox{
      position: absolute;
      bottom:20px;
      left: 0;
      right: 0;
      width: 50%;
      margin: 0 auto;
      .btn{
        width: 100%;
      }
    }
  }
</style>