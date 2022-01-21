//文件路径相关配置
import {nanoid} from "nanoid";

export default {
  namespaced:true,
  actions:{

  },
  mutations:{
    ADDPATH(state,value){
      state.filePath.push({
        id: nanoid(6),
        name:value,
        path:state.filePath[state.filePath.length-1].path + '/' + value
      })
    },
    DROPPATH(state,value){
      let i
      for(i=0;i<value;i++){
        state.filePath.pop()
      }
    }
  },
  state:{
    filePath: [
      {
        id: 1,
        name: '根目录',
        path: ''
      }
    ]
  },
  getters:{

  }
}
