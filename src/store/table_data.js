//文件列表数据相关配置
export default {
  namespaced:true,
  actions:{

  },
  mutations:{
    REFRESH(state,value) {
      state.tableData = value
    },
  },
  state:{
    tableData:{
      virtualRoot: 0,
      currentMask: "RWD",
      files: []
    }
  },
  getters:{

  }
}
