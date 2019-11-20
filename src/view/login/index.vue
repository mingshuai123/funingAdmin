<template>
    <div class="login">
      <div class="login-logo"><img src="../../assets/logo.png" alt=""></div>
      <div class="login-title">福宁后台管理</div>
      <div class="login-content">
         <van-cell-group class="borders">
          <van-field v-model="phone" placeholder="请输入手机号" label="手机号" type='text' />
          <van-field v-model="pwd" placeholder="请输入密码" label="密码" type="password" />
          <van-field v-if="type=='reg'" v-model="name" placeholder="请输入昵称" label="昵称" />
        </van-cell-group>
        <div class="btn-login" @click='gologin' v-if="type=='login'">登陆</div>
        <div class="btn-login" @click='register' v-if="type=='reg'">注册</div>
        <div class="type"><span @click="type='login'">登录</span>/<span @click="type='reg'">注册</span></div>
      </div>
    </div>
</template>
<script>
import Cookies from 'js-cookie'
export default {
  name:'Login',
  data(){
    return {
      type:'login',
      phone:'',
      pwd:'',
      name:'',
      redirect:null,
    }
  },
  watch:{
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    },
  },
  methods:{
    gologin(){
      var _this=this;
      let config = {
        headers : {
          'Content-Type':'application/json;charset=UTF-8'
        },
      };
      // var vConsole = new VConsole();
      if(this.phone==''||this.pwd==''){
        this.$toast.fail('请输入用户名和密码');
        return false;
      }
      let param= {method:'agent.login',phone:this.phone,passwd:this.$md5(this.pwd)};
      var url='http://106.75.174.231:1112/backend/';
      var str="?"
      for (var k in param) {
        if (str != "?") {
            str += "&";
        }
        str += k + "=" + param[k];
      }
      let newurl = url + param.method;
      var requestURL = newurl + encodeURI(str);

      var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : ActiveXObject("microsoft.XMLHttp")
      xhr.open("GET",requestURL,true);
      // xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      xhr.send(this.$qs.stringify(param));

      xhr.onreadystatechange = function(){
        if(xhr.readyState == 4 && xhr.status == 200){
          var res = JSON.parse(xhr.response);
          console.log(res)
          if(res.errno != 0){
            _this.$toast(res.msg);
            return false;
          }
          Cookies.set('funing',res)
          _this.$toast({
            duration:1000,
            message:'登陆成功',
            type:'success',
            onClose:function(){
              if(_this.redirect){
                _this.$router.push({path: _this.redirect })
                }else{
                  _this.$router.push({path:'/menus'})
                }
            }
          })
        }
      }

      // this.$axios.post(requestURL,this.$qs.stringify(param),config)
      // .then(res=>{
      //   Cookies.set('funing',JSON.stringify(res))
      //   if(res.errno==0){
      //     this.$toast({
      //       duration:1000,
      //       message:'登陆成功',
      //       type:'success',
      //       onClose:function(){
      //         if(_this.redirect){
      //           _this.$router.push({path:_this.redirect})
      //           }else{
      //             _this.$router.push({path:'/menus'})
      //           }
      //       }
      //     })
      //   }else{
      //     this.$toast({
      //       message:res.message,
      //       type:'fail'
      //     })
      //   }
      // })
    },
    register(){
      var _this=this;
      // var vConsole = new VConsole();
      if(this.phone==''||this.pwd==''){
        this.$toast.fail('请输入手机号和密码');
        return false;
      }
      let param= {method:'agent.reg',phone:this.phone,passwd:this.$md5(this.pwd),name:this.name};
      // 登录
      var url='http://106.75.174.231:1112/backend/';
      var str="?"
      for (var k in param) {
        if (str != "?") {
            str += "&";
        }
        str += k + "=" + param[k];
      }
      let newurl = url + param.method;
      var requestURL = newurl + encodeURI(str);
      this.$axios.post(requestURL,param)
      .then(res=>{
        Cookies.set('funing',JSON.stringify(res))
        if(res.errno==0){
          this.$toast({
            duration:1000,
            message:'注册成功',
            type:'success',
            onClose:function(){
              _this.type='login';
            }
          })
        }else{
          this.$toast({
            message:res.msg,
            type:'text'
          })
        }
      })
    },
    gorouter(){
     setTimeout(() => {
      this.$router.push({path:'/Goodslist'})
     }, 2000);
    }
  }
}
</script>
<style lang="less" scoped>
  .login{
    &-title{
      text-align: center;
      font-weight: bold;
      font-size: 28px;
      margin: 10px;
      line-height: 1;
    }
    &-logo{
      width: 322px;
      height: 118px;
      margin: 10px auto;
    }
    .login-content{
      .inputItem{
        display: flex;
        align-content: center;
        padding: 10px;
        border-bottom: 1px solid rgba(240,240,240,1);
        border-top: 1px solid rgba(240,240,240,1);
        font-size: 14px;
        .name{
          width: 90px;
        }
        input{
          border: none;
          width: 100%;
        }
      }
      .inputItem:nth-child(2){
        border-top: none;
      }
      .type{
        text-align: center;
        line-height: 2;
        font-size: 26px;
        span:hover{
          color: chocolate;
        }
      }
    }
    .btn-login{
      width:30%;
      line-height:2.5;
      text-align: center;
      // border: 1px solid #868686;
      border-radius: 3px;
      background-color: dodgerblue;
      color: #fff; 
      margin:20px auto;
    }
  }
</style>

