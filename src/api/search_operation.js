/**
 * 本文件用于存放搜索、文件分类状态下的数据处理
 * @author:Equent
 */

import store from '../store'
import axios from "axios";
import {Message,Notification,MessageBox} from 'element-ui'

function sortList(data){
  data.files.sort((a,b)=>{
    let a2 = a.dir===false ? 1 : 0
    let b2 = b.dir===false ? 1 : 0
    return a2-b2
  })
  return data
}

export default {
  //搜索文件
  searchAllFileList(searchString){
    axios.get(`/chfs/search?str=${searchString}`).then(
      response => {
        store.state.tableData.tableData = sortList(response.data)
      },
      error => {
        Message.error('搜索失败')
      }
    )
  },
  //删除文件
  deleteFile(path){
    let formData = new FormData()
    formData.append(
      'filepath',
      `${path}`)
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
  renameFile(oldPath,newName) {
    let formData = new FormData()
    //输入旧名字
    formData.append(
      'old',
      `${oldPath}`,
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
  //文件分类相关——搜索指定格式
  async getFileTypeList(fileType){
    for(let i = 0; i < fileType.length; i++){
      await axios.get(`/chfs/search?str=${fileType[i]}`).then(
        response => {
          console.log(response.data.files)
          let tmp = response.data.files
          store.commit('tableData/ADDDATA',tmp)
        },
        error => {
          Message.error('分类获取失败！请重试...')
        }
      )
    }
  }
}
