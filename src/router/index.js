// 该文件用于创建整个应用的路由器
import VueRouter from "vue-router";
// 引入组件
import Login from "@/views/pages/Login";
import Index from "@/views/pages/Index";
import FileList from "@/views/pages/FileList";

export default new VueRouter({
    routes:[
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/login',
            component: Login
        },
        {
            name: 'Index',
            path: '/index',
            component: Index,
            redirect: '/index/all',
            children:[
                {
                    name: 'all_file',
                    path: 'all',
                    component: FileList
                },
                {
                    name: 'img_file',
                    path: 'img',
                    component: FileList
                },
                {
                    name: 'doc_file',
                    path: 'doc',
                    component: FileList
                },
                {
                    name: 'vid_file',
                    path: 'video',
                    component: FileList
                },
                {
                    name: 'aud_file',
                    path: 'audio',
                    component: FileList
                },
                {
                    name: 'exat_file',
                    path: 'zip',
                    component: FileList
                }
            ]
        }
    ]
})
