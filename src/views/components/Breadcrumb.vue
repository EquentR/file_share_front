<template>
  <el-breadcrumb separator=">" class="bread">
<!--    <el-breadcrumb-item>根目录</el-breadcrumb-item>-->
    <el-breadcrumb-item v-for="item in this.$store.state.filePath.filePath" @click.native="backPath(item)" :key="item.id">{{item.name}}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
import {mapMutations} from 'vuex'
import chfs from "@/api/chfs_opreation";
export default {

  name: "Breadcrumb",
  data(){
    return{

    }
  },
  methods:{
    ...mapMutations('filePath',{dropPath:'DROPPATH'}),
    backPath(item){
      let step = this.$store.state.filePath.filePath.length - (this.$store.state.filePath.filePath.indexOf(item)+1)
      this.dropPath(step)
      chfs.getFileList()
    }
  }
}
</script>

<style>
.el-breadcrumb__item:last-child .el-breadcrumb__inner{
  cursor: pointer !important;
}
.el-breadcrumb__inner{
  cursor: pointer !important;
  color: #417CD9 !important;
}
</style>
