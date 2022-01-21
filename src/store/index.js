//该文件用于创建Vuex中最为核心的store
import Vue from 'vue'
//引入Vuex
import Vuex from 'vuex'
import filePath from "./file_path";
import tableData from "@/store/table_data";

Vue.use(Vuex)

export default new Vuex.Store({
    modules:{
        filePath:filePath,
        tableData: tableData
    }
})
