<template>
  <div class="file-list">
    <div class="control-button">
      <el-button size="medium" type="primary" id="upload-file" plain round @click="selectFile"
                 v-show="this.$store.state.tableData.tableData.currentMask.includes('W')">上传文件</el-button>
      <el-button size="medium" type="danger" id="upload-folder" plain round @click="selectDir"
                 v-show="this.$store.state.tableData.tableData.currentMask.includes('W')">上传目录</el-button>
      <el-button size="medium" type="warning" id="new-folder" plain round @click="newDir"
                 v-show="this.$store.state.tableData.tableData.currentMask.includes('W')">新建目录</el-button>
      <el-button size="medium" type="success" id="new-text" plain round @click="newTextVisible = true"
                 v-show="this.$store.state.tableData.tableData.currentMask.includes('W')">新建文本</el-button>
      <el-button size="medium" type="" id="backPath" plain round @click="backView"
                 v-show="searchStatus">返回目录视图</el-button>
      <el-input placeholder="请输入搜索内容" class="searchClass" v-model="searchInput" size="medium">
        <div slot="prepend">
          <div class="centerClass">
            <el-select v-model="select" placeholder="请选择" style="width: 150px">
              <el-option label="搜索当前页面" value="1"></el-option>
              <el-option label="搜索整个服务器" value="2"></el-option>
            </el-select>
          </div>
          <div class="centerClass">
            <div class="line"></div>
          </div>
        </div>
        <el-button slot="append" icon="el-icon-search" @click="searchFiles"></el-button>
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
              <p class="file-name" @click="enterFile(scope.row.name,scope.row.dir)">{{scope.row.name | ellipsis}}</p>
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
                         @click="downloadFile(scope.row.dir,scope.row.name)"></el-button>
              <el-button type="success" icon="el-icon-link" circle plain
                         @click="shareFile(scope.row.name)" v-show="!scope.row.dir"></el-button>
              <el-button type="warning" icon="el-icon-edit-outline" circle plain
                         v-show="scope.row.mask.includes('W')" @click="renameFile(scope.row.name)"></el-button>
              <el-button type="danger" icon="el-icon-delete" circle plain
                         v-show="scope.row.mask.includes('D')" @click="deleteFile(scope.row.name)"></el-button>
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
<!--    新建文本对话框-->
    <el-dialog title="新建文本"
               :visible.sync="newTextVisible"
               class="text-dialog"
               width="540px"
               :close-on-click-modal="false">
      <p>请输入标题：</p>
      <input type="text" class="text-title" id="text-title" autocomplete="off"></input><br/>
      <p style="padding-top: 15px">请输入内容：</p>
      <textarea class="text-content" id="text-content"></textarea>
      <button class="submit-text" @click="newText">提交</button>
    </el-dialog>
<!--    上传进度条-->
    <el-dialog title="上传文件"
               :visible.sync="uploadProcessVisible"
               class="text-dialog"
               width="800px"
               :close-on-click-modal="false">
      <div v-for="item in process">
        <p>{{item.name}}</p>
        <el-progress :text-inside="true"
                     :stroke-width="26"
                     :percentage="item.p"
                     color="#409cf6"
                     :key="item.id"></el-progress>
      </div>
    </el-dialog>
<!--    版权页 -->
    <div>
    </div>
<!--    隐藏标签-->
    <!--    选择文件上传-->
    <input type="file" ref="file" @change="uploadFile" style="display: none;" id="file" multiple="multiple"></input>
    <!--    选择文件夹上传-->
    <input type="file" ref="dir" @change="uploadDir" style="display: none;" id="dir" webkitdirectory directory></input>
  </div>
</template>

<script>
import {mapMutations,mapState} from 'vuex'
import chfs from '@/api/chfs_opreation'
import QRCode from "qrcodejs2"
import sc from "@/api/server_config";
import store from "@/store";
import axios from "axios";
import {nanoid} from "nanoid";
export default {
  name: "FileList",
  data(){
    return {
      select: '1',
      searchInput: '',
      shareLink: '',
      qrcodeVisible: false,
      newTextVisible: false,
      uploadProcessVisible: false,
      searchStatus: false,
      process: [],
      qrstat: false, //首次打开二维码标志，首次打开前为false
      tableHeight: document.documentElement.clientHeight - 187 //table高度
    }
  },
  components: {QRCode},
  methods:{
    //获取文件图标方法
    getFileIcon(fileName,type){
      fileName = fileName.toString()
      if(type){
        return 'folder'
      }else{
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
    //进入目录
    enterFile(fileName,dir){
      if(dir === true){
        this.addPath(fileName)
        chfs.getFileList()
      }else {
        console.log('不是文件夹，不能进入')
      }
    },
    //新建目录
    newDir(){
      this.$prompt('请输入新建文件夹名称', '新建文件夹', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue:'新建文件夹',
        closeOnClickModal:false
      }).then(({ value }) => {
        chfs.newDir(value)
        //刷新目录
        setTimeout(()=>{
          chfs.getFileList()
        },500)
      }).catch(() => {});
    },
    //新建文本
    newText(){
      let title = document.getElementById('text-title').value + '.txt'
      let content = document.getElementById('text-content').value
      chfs.newText(title,content)
      this.$nextTick( () => {
        chfs.getFileList()
      })
      this.newTextVisible = false
    },
    //下载文件
    downloadFile(dir,name){
      if(dir === true){
        chfs.downloadDir(name)
      }else{
        chfs.downloadFile(name)
      }
    },
    //删除文件
    deleteFile(name){
      this.$confirm('确定删除这个文件吗？', '待确认', {
        distinguishCancelAndClose: true,
        confirmButtonText: '删除',
        cancelButtonText: '放弃',
        type: "warning",
        center: true
      }).then(() => {
        chfs.deleteFile(name)
        //刷新目录
        setTimeout(()=>{
          chfs.getFileList()
        },500)
      }).catch(action => {});
    },
    //重命名文件
    renameFile(name){
      this.$prompt('请输入新名字', '重命名', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue:name,
        closeOnClickModal:false
      }).then(({ value }) => {
        chfs.renameFile(name,value)
        //刷新目录
        setTimeout(()=>{
          chfs.getFileList()
        },500)
      }).catch(() => {});
    },
    //二维码分享
    shareFile(name){
      this.shareLink = sc.shareServer + '/chfs/shared' + this.$store.state.filePath.filePath[this.$store.state.filePath.filePath.length - 1].path + '/' + name
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
    //调出文件选择框
    selectFile(){
      this.$refs.file.click()
    },
    selectDir(){
      this.$confirm('注意！此方式不支持多层文件夹！且容易导致上传文件丢失！请保证文件夹内无子文件夹，且文件数量较少。是否继续？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$refs.dir.click()
      }).catch(() => {
        this.$message.info('用户取消操作！')
      });
    },
    //上传文件,支持多个，由于涉及较多变量操作，未设置外置API
    async uploadFiles(fileObj){
      // let fileObj = document.getElementById('file').files
      for(let i=0 ; i < fileObj.length ; i++) {
        let name = fileObj[i].name
        await chfs.isFileExist(name).then(
          async response => {
            //成功返回值 201
            await this.$message.error('文件已存在！请重命名后再上传');
          },
          async error => {
            //失败返回值较多，需要条件判断
            let code = error.response.status
            if(code === 404){
              let path = store.state.filePath.filePath[store.state.filePath.filePath.length - 1].path
              let formData = new FormData()
              this.process.push({id:nanoid(),name:name,p:0})
              formData.append('file', fileObj[i])
              formData.append('folder', path)
              await axios({
                method: 'POST',
                url: '/chfs/upload',
                data: formData,
                /*            headers: {
                              'Authorization': `Bearer ${token}`
                            },*/
                headers:{ "Content-Type": "multipart/form-data" },
                //原生获取上传进度的事件
                onUploadProgress: progressEvent => {
                  this.uploadProcessVisible = true
                  let process = (progressEvent.loaded / progressEvent.total * 100 | 0)
                  this.process[i].p = process
                }
              }).then(
                response => {
                  this.$message.success('文件上传成功！')
                  chfs.getFileList()
                },
                error => {
                  this.$message.error('文件上传失败！')
                }
              )
            }
            else if(code === 401){ /*登录失败提示*/ this.$message.error('无效身份标识或登录失效')}
            else if(code === 403){ /*权限不足提示*/ this.$message.error('无访问权限，请登录后再试')}
            else{ /*通用提示*/this.$message.error('发生未知错误，请稍候再试')}
          }
        )
      }
      this.uploadProcessVisible = false
      this.process = []
    },
    //上传文件
    uploadFile(){
      let fileObj = document.getElementById('file').files
      this.uploadFiles(fileObj)
    },
    //上传文件夹
    async uploadDir(){
      let fileObj = document.getElementById('dir').files
      let tmp = document.getElementById('dir').files[0].webkitRelativePath
      let dirName = tmp.split('/')[0]
      console.log(dirName)
      await chfs.newDir(dirName)
      this.enterFile(dirName,true)
      await this.uploadFiles(fileObj)
    },

    //搜索文件判断
    searchFiles(){
      if(this.select === '1'){
        this.searchCurrent()
      }else{
        this.searchAll()
      }
    },
    //搜索当前页
    searchCurrent(){
      let tableData2 = this.tableData()
      let tableDataSearch = {
        virtualRoot: 0,
        currentMask: "RD",
        files: []
      }
      for(let i=0 ; i < tableData2.files.length ; i++){
        if(tableData2.files[i].name.indexOf(this.searchInput)>=0){
          tableDataSearch.files.push(tableData2.files[i])
        }
      }
      console.log(tableDataSearch)
      this.searchStatus = true
      this.$store.state.tableData.tableData = tableDataSearch
    },
    //搜索全部文件
    searchAll(){
      this.$router.push({
        name:'search_file',
        query:{searchString:this.searchInput}
      })
    },
    //搜索后返回目录
    backView(){
      this.searchStatus = false
      chfs.getFileList()
    },
    //vuex自带方法，路径添加
    ...mapMutations('filePath',{addPath:"ADDPATH"}),
    ...mapState('filePath',['filePath']),
    ...mapState('tableData',['tableData']),
  },
  //过滤器
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
    //加载组件后自动获取文件列表
    chfs.getFileList()
    //获取屏幕高度，并动态调整table高度
    window.onresize = () => {
      this.tableHeight = document.documentElement.clientHeight - 187
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
#upload-file,#upload-folder,#new-folder,#new-text{
  color: #586364;
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
.text-title{
  width: 500px;
  height: 35px;
  font-size: 18px;
  padding-left: 10px;
  padding-right: 10px;
  border-radius: 8px;
  border: #9d9d9d solid 2px;
  color: #1f1f1f;
}
.text-content{
  width: 500px;
  height: 400px;
  font-size: 18px;
  padding-left: 10px;
  padding-right: 10px;
  border-radius: 8px;
  border: #9d9d9d solid 2px;
  resize:none;
  color: #1f1f1f;
}
.submit-text{
  margin-top: 16px;
  width: 500px;
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
.submit-text:hover{
  background: #a89bcf 0% 0% no-repeat padding-box;
}
.submit-text:active{
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
