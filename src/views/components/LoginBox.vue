<template>
  <div id="box">
    <p class="title">登录</p>
    <input class="user-input" id="u" type="text" placeholder="用户名">
    <input class="user-input" id="p" type="password" placeholder="密码">
    <button @click="submit()" class="submit">登录</button><br>
    <div class="unsub">
      <router-link class="unsubmit" to="/index">不登录，直接查看文件</router-link>
    </div>
  </div>
</template>

<script>
import AllFileIcon from "@/views/components/icon/AllFileIcon";
export default {
  name: "LoginBox",
  components:{AllFileIcon},
  methods:{
    submit(){
      this.$router.push({
        path:'/index',
      })
    }
  }
}
</script>

<style scoped>
  #box{
    margin-left: 800px;
    width: 500px;
    height: 600px;
    background: #FFFFFF 0% 0% no-repeat padding-box;
    border-radius: 30px;
    opacity: 0.6;
  }
  .title{
    padding-left: 9%;
    padding-top: 11%;
    margin-bottom: 0;
    text-align: left;
    font: normal normal bold 50px/72px Source Han Sans SC;
    letter-spacing: 0px;
    color: #7CE6FB;
    opacity: 1;
  }
  .user-input{
    width: 420px;
    height: 70px;
    background: #eaeaea;
    box-shadow: 0px 0px 3px #00000029;
    border-radius: 15px;
    border: 0px;
    outline-style: none;
    opacity: 1;
    font-size: 30px;
    color: #565656;
    padding: 25px;
    transition-duration: 0.2s;
  }
  .user-input:focus{
    border-color: #66afe9;
    outline: 0;
    /*-webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.075),0 0 8px rgba(60, 171, 255, 0.6);*/
    box-shadow: inset 0 1px 1px rgba(0,0,0,.075),0 0 8px rgb(0, 145, 255)
  }
  #u,#p{
    margin-top: 50px;
    margin-left: 40px;
  }
  .submit{
    margin-top: 50px;
    margin-left: 40px;
    width: 420px;
    height: 70px;
    background: #6DE4FC 0% 0% no-repeat padding-box;
    box-shadow: 0px 0px 3px #00000029;
    border-radius: 15px;
    opacity: 1;
    font: normal normal normal 30px/44px Source Han Sans SC;
    letter-spacing: 0px;
    color: #FFFFFF;
    border: 0px;
    outline-style: none;
    transition-duration: 0.2s;
  }
  .submit:hover{
    background: #9cebff 0% 0% no-repeat padding-box;
  }
  .submit:active{
    background: #67bfd6 0% 0% no-repeat padding-box;
  }
  .unsub{
    margin-top: 20px;
    margin-left: 160px;
  }
  .unsubmit{
    text-align: center;
    text-decoration: underline;
    font: normal normal normal 18px/26px Source Han Sans SC;
    letter-spacing: 0px;
    color: #000000;
    opacity: 0.5;
  }
</style>
