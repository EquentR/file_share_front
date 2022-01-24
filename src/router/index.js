// 该文件用于创建整个应用的路由器
import VueRouter from "vue-router";
// 引入组件
import Login from "@/views/pages/Login";
import Index from "@/views/pages/Index";
import FileList from "@/views/pages/FileList";
import SearchList from "@/views/pages/SearchList";

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
                    component: SearchList,
                    props:{
                        fileType: ['.jpg','.jpe','.png','.ico','.psd','.gif','.bmp','.tif','.jpeg','.dng','.cr2']
                    }
                },
                {
                    name: 'doc_file',
                    path: 'doc',
                    component: SearchList,
                    props:{
                        fileType: ['.doc','.rtf','.ppt','.xls','.pdf','.txt']
                    }
                },
                {
                    name: 'vid_file',
                    path: 'video',
                    component: SearchList,
                    props:{
                        fileType: ['.avi','.mp4','.mov','.asf','.rm','.qt','.ram','.m4v','.rmvb','.flv','.mpg','.mkv','.mp2']
                    }
                },
                {
                    name: 'aud_file',
                    path: 'audio',
                    component: SearchList,
                    props: {
                        fileType: ['.aac','.mp3','.m4a','.wav','.ape','.wma','.ogg','.flac']
                    }
                },
                {
                    name: 'exat_file',
                    path: 'zip',
                    component: SearchList,
                    props: {
                        fileType: ['.rar','.zip','.7z','.cab','.jar','.lz','.tar','.gz','.xz','.001','.uue','.arj']
                    }
                },
                {
                    name: 'search_file',
                    path: 'search',
                    component: SearchList,
                    props({query:{searchString}}){
                        return {searchString}
                    }
                }
            ]
        }
    ]
})
