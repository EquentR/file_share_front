//文件列表数据相关配置
export default {
  namespaced:true,
  actions:{

  },
  mutations:{
    REFRESH(state,value) {
      state.tableData = value
    },
    ADDDATA(state,value) {
      let oldTable = state.tableData.files.slice()
      for(let i = 0 ; i < value.length ; i++){
        oldTable.push(value[i])
      }
      state.tableData.files = oldTable
    }
  },
  state:{
    tableData:{
      virtualRoot: 0,
      currentMask: "RWD",
      files: []
    },
  },
  getters:{

  }
}
