// 封装axios
import axios from 'axios';



const instance = axios.create({
    // baseURL: process.env.BASE_URL,
    baseURL: 'http://localhost:5000/',
    timeout: 10000,
})


// 请求拦截器
instance.interceptors.request.use(
    config => {
        // 在发送请求之前设置请求头
        const token = localStorage.getItem('token');
        // 如果有token就在请求头中携带token
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        // 对请求错误做些什么
        return Promise.reject(error);
    }
)

// 响应拦截器
instance.interceptors.response.use(
    response => {
        // 对响应数据做点什么
        return response.data;
    },
    error => {
        // 对响应错误做点什么
        return Promise.reject(error);
    }
)

export default instance