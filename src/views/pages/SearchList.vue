<template>
  <div class="file-list">
    <div class="control-button">
      <el-button size="medium" type="" id="backPath" plain round @click="backView">返回目录视图</el-button>
      <el-input placeholder="请输入搜索内容" class="searchClass" v-model="searchInput" size="medium">
        <div slot="prepend">
          <div class="centerClass">
            <el-select v-model="select" placeholder="请选择" style="width: 150px">
              <el-option label="搜索整个服务器" value="2"></el-option>
            </el-select>
          </div>
          <div class="centerClass">
            <div class="line"></div>
          </div>
        </div>
        <el-button slot="append" icon="el-icon-search" @click="searchAll"></el-button>
      </el-input>
    </div><br/>
    <!--    表格部分-->
    <div class="table-area">
      <el-table
          :data="this.$store.state.tableData.tableData.files"
          style="width: 100%"
          :height="tableHeight">
        <el-table-column
            fixed
            prop="name"
            label="名称"
            sortable
            width="auto">
          <!--匹配图标-->
          <template slot-scope="scope">
            <img v-show="getFileIcon(scope.row.name,scope.row.dir) === 'image'"
                 class="img-icon"
                 src="https://equent-bucket.oss-cn-guangzhou.aliyuncs.com/file-share-icon/file-icon/ImgFile%402x.png" alt=""/>
            <img v-show="getFileIcon(scope.row.name,scope.row.dir) === 'video'"
                 class="img-icon"
                 src="https://equent-bucket.oss-cn-guangzhou.aliyuncs.com/file-share-icon/file-icon/VideoFile%402x.png" alt=""/>
            <img v-show="getFileIcon(scope.row.name,scope.row.dir) === 'audio'"
                 class="img-icon"
                 src="https://equent-bucket.oss-cn-guangzhou.aliyuncs.com/file-share-icon/file-icon/AudioFile%402x.png" alt=""/>
            <img v-show="getFileIcon(scope.row.name,scope.row.dir) === 'zip'"
                 class="img-icon"
                 src="https://equent-bucket.oss-cn-guangzhou.aliyuncs.com/file-share-icon/file-icon/ZipFile%402x.png" alt=""/>
            <img v-show="getFileIcon(scope.row.name,scope.row.dir) === 'folder'"
                 class="img-icon"
                 src="https://equent-bucket.oss-cn-guangzhou.aliyuncs.com/file-share-icon/file-icon/Folder%402x.png" alt=""/>
            <img v-show="getFileIcon(scope.row.name,scope.row.dir) === 'word'"
                 class="img-icon"
                 src="https://equent-bucket.oss-cn-guangzhou.aliyuncs.com/file-share-icon/file-icon/WordFile%402x.png" alt=""/>
            <img v-show="getFileIcon(scope.row.name,scope.row.dir) === 'pdf'"
                 class="img-icon"
                 src="https://equent-bucket.oss-cn-guangzhou.aliyuncs.com/file-share-icon/file-icon/PdfFile%402x.png" alt=""/>
            <img v-show="getFileIcon(scope.row.name,scope.row.dir) === 'ppt'"
                 class="img-icon"
                 src="https://equent-bucket.oss-cn-guangzhou.aliyuncs.com/file-share-icon/file-icon/PptFile%402x.png" alt=""/>
            <img v-show="getFileIcon(scope.row.name,scope.row.dir) === 'txt'"
                 class="img-icon"
                 src="https://equent-bucket.oss-cn-guangzhou.aliyuncs.com/file-share-icon/file-icon/TxtFile%402x.png" alt=""/>
            <img v-show="getFileIcon(scope.row.name,scope.row.dir) === 'excel'"
                 class="img-icon"
                 src="https://equent-bucket.oss-cn-guangzhou.aliyuncs.com/file-share-icon/file-icon/ExcelFile%402x.png" alt=""/>
            <img v-show="getFileIcon(scope.row.name,scope.row.dir) === 'unknown'"
                 class="img-icon"
                 src="https://equent-bucket.oss-cn-guangzhou.aliyuncs.com/file-share-icon/file-icon/Unknown%402x.png" alt=""/>
            <p class="file-name" @click="enterFile(scope.row.dir)">{{scope.row.name | ellipsis}}</p>
          </template>
        </el-table-column>
        <el-table-column
            prop="size"
            label="大小"
            sortable
            width="170">
          <template slot-scope="scope">
            <p class="file-size" v-show="!scope.row.dir">{{scope.row.size | formatBytes}}</p>
          </template>
        </el-table-column>
        <el-table-column
            prop="modified"
            label="修改日期"
            sortable
            width="270">
        </el-table-column>
        <el-table-column
            prop="operation"
            label="操作"
            width="auto">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-download" circle plain
                       @click="download(scope.row.dir,scope.row.path)"></el-button>
            <el-button type="success" icon="el-icon-link" circle plain
                       @click="shareFile(scope.row.path)" v-show="!scope.row.dir"></el-button>
            <el-button type="warning" icon="el-icon-edit-outline" circle plain
                       v-show="scope.row.mask.includes('W')" @click="renameFile(scope.row.path,scope.row.name)"></el-button>
            <el-button type="danger" icon="el-icon-delete" circle plain
                       v-show="scope.row.mask.includes('D')" @click="deleteFile(scope.row.path)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--    二维码对话框-->
    <el-dialog title="二维码分享"
               :visible.sync="qrcodeVisible"
               class="qr_dialog"
               width="360px"
               :close-on-click-modal="false">
      <div id="qrcode"></div>
      <button class="copy-link" v-clipboard:copy="shareLink"
              v-clipboard:success="onCopy" v-clipboard:error="onError">复制链接</button>
    </el-dialog>
    <!--    版权页 -->
    <div>
    </div>
  </div>
</template>

<script>
import search from "@/api/search_operation";
import sc from "@/api/server_config";
import QRCode from "qrcodejs2";
import {Notification} from "element-ui";
import store from "@/store";
import chfs from "@/api/chfs_opreation";

export default {
  name: "SearchList",
  data(){
    return {
      select: '2',
      shareLink: '',
      searchInput: '',
      qrcodeVisible: false,
      newTextVisible: false,
      qrstat: false, //首次打开二维码标志，首次打开前为false
      tableHeight: document.documentElement.clientHeight - 187 //table高度
    }
  },
  props:['searchString','fileType'],
  methods:{
    //获取文件图标方法
    getFileIcon(fileName,type){

      if(type){
        return 'folder'
      }else{
        fileName = fileName.toString()
        return this.getFileLast(fileName)
      }
    },
    getFileLast(fileName){
      let indexArr = fileName.split('.')
      let index = indexArr[indexArr.length-1]
      return this.getFileType(index)
    },
    getFileType(index){
      let image = ['jpg','jpe','png','ico','psd','gif','bmp','tif','tiff','jpeg','dng','cr2']
      let video = ['avi','mp4','mov','asf','rm','qt','ram','m4v','rmvb','flv','mpg','mkv','mp2']
      let audio = ['aac','mp3','m4a','wav','ape','wma','ogg','flac']
      let zip = ['rar','zip','7z','cab','jar','lz','tar','gz','xz','zipx','001','uue','arj']
      let word = ['docx','doc','rtf']
      let ppt = ['pptx','ppt']
      let excel = ['xlsx','xls']
      if(image.indexOf(index.toLowerCase()) !== -1) {return 'image'}
      else if(video.indexOf(index.toLowerCase()) !== -1) {return 'video'}
      else if(audio.indexOf(index.toLowerCase()) !== -1) {return 'audio'}
      else if(zip.indexOf(index.toLowerCase()) !== -1) {return 'zip'}
      else if(word.indexOf(index.toLowerCase()) !== -1){return 'word'}
      else if(ppt.indexOf(index.toLowerCase()) !== -1){return 'ppt'}
      else if(excel.indexOf(index.toLowerCase()) !== -1){return 'excel'}
      else if(index.toLowerCase() === 'pdf'){return 'pdf'}
      else if(index.toLowerCase() === 'txt'){return 'txt'}
      else return 'unknown'
    },
    //禁止进入文件夹
    enterFile(dir){
      if(dir === true){
        this.$message.error('暂不支持搜索状态下进入文件夹')
      }else{
        console.log('不是文件夹，不能进入')
      }
    },
    //搜索文件
    searchAll(){
      this.$router.push({
        name:'search_file',
        query:{searchString:this.searchInput}
      })
      this.$store.state.tableData.tableData = {}
      search.searchAllFileList(this.searchInput)
    },
    //下载
    download(dir,path){
      if(dir === false){
        this.downloadFile(path)
      }else{
        this.downloadDir(path)
      }
    },
    //下载文件
    downloadFile(path){
      this.$notify.success({
        title: '来自服务器的消息',
        message: `服务器已响应，正在准备文件……
      若文件过大则需要等待一段时间，请勿重复请求下载！`,
        showClose: true,
        duration: 10000,
        offset: 60
      })
      let url = '/chfs/shared' + path
      let a = document.createElement('a');
      a.href = url
      a.download = path.split('/')[path.split('/').length - 1];
      a.click()
    },
    //下载文件夹
    downloadDir(path){
      this.$notify.success({
        title: '来自服务器的消息',
        message: `服务器已响应，正在准备文件……`,
        showClose: true,
        duration: 10000,
        offset: 60
      })
      let url = '/chfs/downloaddir' + path
      let a = document.createElement('a');
      a.href = url
      a.download = path.split('/')[path.split('/').length - 1];
      a.click()
    },
    //重命名文件
    renameFile(path,name){
      this.$prompt('请输入新名字', '重命名', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue:name,
        closeOnClickModal:false
      }).then(({ value }) => {
        search.renameFile(path,value)
        //刷新目录
        setTimeout(()=>{
          search.searchAllFileList(this.searchInput)
        },500)
      }).catch(() => {});
    },
    //删除文件
    deleteFile(path){
      this.$confirm('确定删除这个文件吗？', '待确认', {
        distinguishCancelAndClose: true,
        confirmButtonText: '删除',
        cancelButtonText: '放弃',
        type: "warning",
        center: true
      }).then(() => {
        search.deleteFile(path)
        //刷新目录
        setTimeout(()=>{
          search.searchAllFileList(this.searchInput)
        },500)
      }).catch(action => {});
    },
    //二维码分享
    shareFile(path){
      this.shareLink = sc.shareServer + '/chfs/shared' + path
      this.qrcodeVisible=true
      //判断是否为首次打开
      if(this.qrstat){
        document.getElementById('qrcode').innerHTML = ''
      }
      this.qrstat = true
      this.$nextTick (function () {
        this.qrcode();
      })
    },
    qrcode(){
      let qrcode = new QRCode('qrcode', {
        width: 256,
        height: 256,        // 高度
        text:  this.shareLink,   // 二维码内容
        colorDark: '#7d6fa7',
        colorLight: '#fff'
      })
    },
    // 复制成功时的回调函数
    onCopy(e) {
      this.$message.success("内容已复制到剪切板！")
    },
    // 复制失败时的回调函数
    onError(e) {
      this.$message.error("抱歉，复制失败！")
    },
    //返回目录视图
    backView(){
      this.$router.push({
        name: 'Index',
      })
    }
  },
  filters: {
    //文件名过长字符串切割方案
    ellipsis(value) {
      if (!value) return '';
      if (value.length > 38) {
        return value.slice(0, 38) + '……' + value.split('.')[value.split('.').length - 1]
      }
      return value
    },
    //文件大小转换
    formatBytes(a, b=2) {
      if (0 == a) return "0 B";
      var c = 1024, d = b || 2, e = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"], f = Math.floor(Math.log(a) / Math.log(c));
      return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f];
    }
  },
  mounted() {
    this.$store.state.tableData.tableData = {
      currentMask: "R",
      files: [],
      virtualRoot: 0
    }
    if(this.searchString !== undefined){
      this.searchInput = this.searchString
      search.searchAllFileList(this.searchInput)
    }else{
      search.getFileTypeList(this.fileType)
    }
    //获取屏幕高度，并动态调整table高度
    window.onresize = () => {
      this.tableHeight = document.documentElement.clientHeight - 187
    }
  },
  watch:{
    $route(to,from){
      if(this.searchString === undefined){
        this.$store.state.tableData.tableData = {
          currentMask: "R",
          files: [],
          virtualRoot: 0
        }
        search.getFileTypeList(this.fileType)
      }
    }
  }

}
</script>

<style scoped>
.el-input{
  float: right;
  width: 37%;
  background-color: #fff;
}
.control-button{
  margin-top: 1%;
}
.img-icon{
  width: 45px;
  height: 45px;
}
img{
  float: left;
}
.file-name{
  float: left;
  margin-left: 10px;
  margin-top: 11px;
  cursor: pointer;
}
.file-size{
  float: left;
  /*margin-left: 10px;*/
  margin-top: 11px;
}
.copy-link{
  margin-top: 16px;
  width: 320px;
  height: 50px;
  background: #8f82b5 0% 0% no-repeat padding-box;
  box-shadow: 0px 0px 3px #00000029;
  border-radius: 15px;
  opacity: 1;
  font: normal normal normal 18px Source Han Sans SC;
  letter-spacing: 0px;
  color: #FFFFFF;
  border: 0px;
  outline-style: none;
  transition-duration: 0.2s;
}
.copy-link:hover{
  background: #a89bcf 0% 0% no-repeat padding-box;
}
.copy-link:active{
  background: #7d6fa4 0% 0% no-repeat padding-box;
}
</style>

<style>
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
/* 搜索框样式 */
.searchClass{
  border: 1px solid #c5c5c5;
  border-radius: 20px;
  background: #f4f4f4;
}
.searchClass .el-input-group__prepend {
  border: none;
  background-color: transparent;
  padding: 0 10px 0 30px;
}
.searchClass .el-input-group__append {
  border: none;
  background-color: transparent;
}
.searchClass .el-input__inner {
  height: 36px;
  line-height: 36px;
  border: none;
  background-color: transparent;
}
.searchClass .el-icon-search{
  font-size: 16px;
}
.searchClass .centerClass {
  height: 100%;
  line-height: 100%;
  display: inline-block;
  vertical-align: middle;
  text-align: right;
}
.searchClass .line {
  width: 1px;
  height: 26px;
  background-color: #c5c5c5;
  margin-left: 14px;
}
.searchClass:hover{
  border: 1px solid #D5E3E8;
  background: #fff;
}
.searchClass:hover .line {
  background-color: #D5E3E8;
}
.searchClass:hover .el-icon-search{
  color: #409eff;
  font-size: 16px;
}

#qrcode{
  border-radius: 16px;
  border: 2px solid #7d6fa7;
  padding-top: 30px;
  padding-bottom: 30px;
}
#qrcode > img{
  width: 256px;
  margin: auto;
  /*margin-left: 30px;*/
}
.el-dialog{
  border-radius: 20px !important;
}
.el-dialog__body{
  padding-top: 20px !important;
  padding-bottom: 20px !important;
}
</style>
