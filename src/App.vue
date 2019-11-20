<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
import Cookies from 'js-cookie'
export default {
  name:'APP',
  watch:{
    '$route':function(val){
      if(val.name!='Standard'){
        Cookies.set('pathName',this.$route.path);
      }
    }
  }
}
</script>
