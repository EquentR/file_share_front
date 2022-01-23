/**
 * 本文件用于非搜索状态下的数据处理。搜索状态下的文件请找：search_operation.js
 * 需要注意的是API的请求地址为Nginx的监听地址，并且需要代理请求chfs开头的api地址到chfs服务所在端口
 * @author:Equent
 */

import store from '../store'
import axios from "axios";
import {Message,Notification,MessageBox} from 'element-ui'

//排序文件公共方法，文件夹在前，文件在后
function sortList(data){
  data.files.sort((a,b)=>{
    let a2 = a.dir===false ? 1 : 0
    let b2 = b.dir===false ? 1 : 0
    return a2-b2
  })
  return data
}

export default {
  //获取文件目录
  getFileList(){
    axios.get(`/chfs/files?filepath=${store.state.filePath.filePath[store.state.filePath.filePath.length-1].path}`).then(
      response => {
        store.state.tableData.tableData = sortList(response.data)
      },
      error=>{
        console.log('fail')
      }
    )
  },
  //删除文件
  deleteFile(fileName){
    let formData = new FormData()
    formData.append(
      'filepath',
      `${store.state.filePath.filePath[store.state.filePath.filePath.length - 1].path + '/' + fileName}`)
    axios({
      method: 'DELETE',
      url: '/chfs/rmfiles',
      data: formData,
      headers: { "Content-Type": "multipart/form-data" }
    }).then(
      response => {
        Message.success('文件已成功删除！');
      },
      error => {
        Message.error('文件删除失败！');
      }
    )
  },
  //重命名文件
  renameFile(oldName,newName) {
    let formData = new FormData()
    //输入旧名字
    formData.append(
      'old',
      `${store.state.filePath.filePath[store.state.filePath.filePath.length - 1].path + '/' + oldName}`,
    )
    //输入新名字
    formData.append(
      'new',
      `${newName}`
    )
    axios({
      method: 'POST',
      url: '/chfs/rename',
      data: formData,
      headers: { "Content-Type": "multipart/form-data" }
    }).then(
      response => {
        console.log(response)
        Message.success('文件名修改成功！');
      },
      error =>{
        console.log(error)
        MessageBox.alert('文件名修改失败！请检查是否重名','错误',{type: 'error'}).then()
      }
    )
  },
  //下载文件
  downloadFile(fileName){
    Notification.success({
      title: '来自服务器的消息',
      message: `服务器已响应，正在准备文件……
      若文件过大则需要等待一段时间，请勿重复请求下载！`,
      showClose: true,
      duration: 10000,
      offset: 60
    })
    let url = '/chfs/shared' + store.state.filePath.filePath[store.state.filePath.filePath.length - 1].path + '/' + fileName
    let a = document.createElement('a');
    a.href = url
    a.download = fileName;
    a.click()
  },
  //下载文件夹
  downloadDir(fileName){
    Notification.success({
      title: '来自服务器的消息',
      message: `服务器已响应，正在准备文件……`,
      showClose: true,
      duration: 10000,
      offset: 60
    })
    //下载文件夹不需要blob转换跨域问题，所以直接使用后端url即可
    let url = '/chfs/downloaddir' + store.state.filePath.filePath[store.state.filePath.filePath.length - 1].path + '/' + fileName
    let a = document.createElement('a');
    a.href = url
    a.download = fileName;
    a.click()
  },
  //新建文件夹
  newDir(fileName){
    let formData = new FormData()
    formData.append(
      'filepath',
      `${store.state.filePath.filePath[store.state.filePath.filePath.length - 1].path + '/' + fileName}`)
    axios({
      method: 'POST',
      url: '/chfs/newdir',
      data: formData,
      headers: { "Content-Type": "multipart/form-data" }
    }).then(
      response => {
        Message.success('文件夹创建成功！');
      },
      error => {
        MessageBox.alert('文件夹创建失败！请检查是否重名','错误',{type: 'error'}).then()
      }
    )
  },
  //新建文本
  newText(title,content){
    let formData = new FormData()
    formData.append(
      'title',
      `${title}`)
    formData.append(
      'text',
      `${content}`)
    formData.append(
      'filepath',
      `${store.state.filePath.filePath[store.state.filePath.filePath.length - 1].path}`)
    axios({
      method: 'POST',
      url: '/chfs/newtext',
      data: formData,
      headers: { "Content-Type": "multipart/form-data" }
    }).then(
      response => {
        Message.success('文件创建成功！');
        document.getElementById('text-title').value = ''
        document.getElementById('text-content').value = ''
      },
      error => {
        MessageBox.alert('文件创建失败！请检查是否“重名”或“未填写内容”。内容仍在，请继续打开编辑！','错误',{type: 'error'}).then()
      }
    )
  },
  //判断文件是否存在，该方法返回404为不存在，201为存在
  async isFileExist(fileName){
    return await axios.get(`/chfs/exist?file=${store.state.filePath.filePath[store.state.filePath.filePath.length - 1].path + '/' + fileName}`)
  },
  //上传文件
  uploadFile(fileObj){
    //此方法在FileList组件中
  }
}
