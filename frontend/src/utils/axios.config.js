import axios from 'axios'


const axiosInstance = axios.create({
    baseUrl: "",
    headers:{
        'Content-type': 'application/json',
    },
    withCredentials:true,
});

//request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if(token){
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

//response interceptor
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if(error.response && error.response.status === 401){
            //handle token expiry
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;