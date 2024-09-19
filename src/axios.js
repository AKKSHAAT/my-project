import Axios from 'axios';

const axios = Axios.create({
    baseURL: 'http://localhost:6969/',
    timeout: 50000,
    
});

export default axios;