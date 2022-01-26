<template>
  <el-container>
    <el-header height="60px">
      <p class="logo_text">文件共享台</p>
      <Breadcrumb v-show="breadVisible"/>
      <img src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" class="avatar" @click="logout" v-show="userName!==undefined">
      <el-button icon="el-icon-user" circle class="avatar" v-show="userName===undefined" @click="login" type="info" plain></el-button>
    </el-header>
    <el-container>
      <el-aside width="250px">
        <el-menu :default-active="$route.path" :router="true">
          <el-menu-item index="/index/all">
            <AllFileIcon class="icon"/><p class="context">所有文件</p>
          </el-menu-item>
          <el-menu-item index="/index/img">
            <ImgFileIcon class="icon"/><p class="context">图片文件</p>
          </el-menu-item>
          <el-menu-item index="/index/doc">
            <DocFileIcon class="icon"/><p class="context">文档文件</p>
          </el-menu-item>
          <el-menu-item index="/index/video">
            <VideoFileIcon class="icon"/><p class="context">视频文件</p>
          </el-menu-item>
          <el-menu-item index="/index/audio">
            <AudioFileIcon class="icon"/><p class="context">音频文件</p>
          </el-menu-item>
          <el-menu-item index="/index/zip">
            <ExatFileIcon class="icon"/><p class="context">压缩文件</p>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import axios from 'axios'
import AllFileIcon from "@/views/components/icon/AllFileIcon";
import ExatFileIcon from "@/views/components/icon/ExatFileIcon";
import VideoFileIcon from "@/views/components/icon/VideoFileIcon";
import AudioFileIcon from "@/views/components/icon/AudioFileIcon";
import ImgFileIcon from "@/views/components/icon/ImgFileIcon";
import DocFileIcon from "@/views/components/icon/DocFileIcon";
import FileList from "@/views/pages/FileList";
import Breadcrumb from "@/views/components/Breadcrumb";
import chfs from "@/api/chfs_opreation";
export default {
  name: "Index",
  components:{
    AllFileIcon,
    ExatFileIcon,
    VideoFileIcon,
    AudioFileIcon,
    ImgFileIcon,
    DocFileIcon,
    FileList,
    Breadcrumb
  },
  data(){
    return{
      dialogVisible: false,
      modeIndex: 'all',
      breadVisible: true,
      userName: chfs.getCookie('user')
    }
  },
  watch:{
    $route(to,from){
      if(to.path === '/index/all'){
        this.breadVisible = true
      }else{
        this.breadVisible = false
      }
    }
  },
  methods:{
    //退出登录
    logout(){
      this.$confirm(`退出${this.userName}的登录状态吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        chfs.logout().then(
          response => {
            this.$message({
              type: 'success',
              message: '退出登录'
            });
          },
          error => {
            this.$message({
              type: 'error',
              message: '登录凭据无效！'
            });
          }
        )
        this.$router.push({
          path: '/login',
        })
        this.userName = null
      }).catch(() => {
      });
    },
    //返回登录界面
    login(){
      this.$confirm(`登录账号吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        this.$router.push({
          path: '/login',
        })
      }).catch(() => {
      });
    },
  },
  mounted() {

  }
}
</script>

<style scoped>
  .logo_text{
    margin-top: 10px;
    margin-left: 35px;
    width: 150px;
    height: 44px;
    text-align: left;
    font: normal normal bold 30px Source Han Sans SC;
    letter-spacing: 0px;
    color: #000000;
    opacity: 0.6;
    float: left;
  }
  .el-header{
    background: #ffffff 0% 0% no-repeat padding-box;
    box-shadow: 0px 3px 10px #0000001A;
    text-align: center;
    line-height: 80px;
    border-bottom: #2b542c;
    z-index: 2;
  }
  .el-container{
    height: 100%;
  }
  .el-aside {
    background: #ffffff 0% 0% no-repeat padding-box;
    box-shadow: 3px 0px 10px #0000001A;
    text-align: center;
    z-index: 1;
  }
  .el-main {
    height: 100%;
  }
  .el-menu-item{
    margin-top: 17px;
    margin-bottom: 17px;
    margin-left: 16px;
    width: 219px;
    height: 80px;
    border-radius: 20px;
    opacity: 0.8;
    font-size: 30px ;
    letter-spacing: 0px;
    color: #526063;
    font: normal normal bold 30px Source Han Sans SC;
  }
  .el-menu-item.is-active{
    color: #526063;
  }
  .icon{
    margin-top: 18px;
    float: left;
  }
  .context{
    padding-top: 16px;
  }
  .avatar{
    height: 40px;
    width: 40px;
    border-radius: 20px;
    margin-top: 10px;
    float: right;
    cursor: pointer
  }
  .bread{
    float: left;
    margin-top: 25px;
    font-size: 15px;
    padding-left: 70px;
  }
  .el-menu{
    border-right: 0px !important;
  }
</style>
