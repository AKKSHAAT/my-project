import Axios from 'axios';

const axios = Axios.create({
    baseURL: 'http://192.168.227.17:6969/',
    timeout: 50000,
    
});

export default axios;