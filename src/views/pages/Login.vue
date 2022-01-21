<template>
  <div id="root">
    <div id="main">
      <div class="title">
        <p class="title-s">Equent的</p>
        <p class="title-l">文件共享台</p>
      </div>
      <LoginBox/>
    </div>
  </div>
</template>

<script>
import LoginBox from "@/views/components/LoginBox";
export default {
  name: "Login",
  components: {LoginBox}
}
</script>

<style scoped>
#root{
  position: fixed;
  width: 100%;
  height: 100%;
  background-size: cover;
  background: transparent linear-gradient(295deg, #E2DCF9 0%, #ABEDFA 100%) no-repeat center 0;
  opacity: 1;
}
#main{
  width: 1300px;
  margin: 8% auto;
}
.title{
  margin-top: 10%;
  float: left;
}
.title-l{
  color: #ffffff;
  text-align: left;
  font: normal normal bold 110px Source Han Sans SC;
  letter-spacing: 0px;
  color: #FFFFFF;
  opacity: 0.5;
}
.title-s{
  color: #FFFFFF;
  text-align: left;
  font: normal normal bold 52px Source Han Sans SC;
  letter-spacing: 0px;
  color: #FFFFFF;
  opacity: 0.5;
}

</style>
