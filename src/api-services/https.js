import axios from "axios";
import * as customLocalStorage from "../utils/LocalStorage";

// https://medium.com/%E4%BC%81%E9%B5%9D%E4%B9%9F%E6%87%82%E7%A8%8B%E5%BC%8F%E8%A8%AD%E8%A8%88/vue%E5%B0%88%E6%A1%88%E4%B8%AD%E7%9A%84api%E7%AE%A1%E7%90%86%E5%8F%8A%E5%B0%81%E8%A3%9D-bccb77f82f98
const errodHandle = (status, msg) => {
    switch (status) {
        case 400:
            // TODO
            break;
        case 401:
            // TODO
            break;
        case 403:
            // TODO
            break;
        case 404:
            // TODO

            break;
        default:
            // TODO
            break;
    }
}

const userInfo = customLocalStorage.getItem('user');


const instance = axios.create({
    baseURL: process.env.VUE_APP_API_SERVER_BASE_URL,
    headers: {
        Authorization: userInfo && userInfo.accessToken ? `Bearer ${userInfo.accessToken}` : undefined
    }
});

instance.interceptors.request.use((config) => {
    return config;
}, (error) => {
    return Promise.reject(error);
});

instance.interceptors.response.use((response) => {
    return response;
}, (error) => {
    const { response } = error;
    if (response) {
        errodHandle(response.status, response.data.error);
        return Promise.reject(error);
    } else {
        // TODO
    }
})

export default function (method, url, data = null, params) {
    method = method.toLowerCase();
    if (method == 'post') {
        return instance.post(url, data, params);
    } else if (method == 'get') {
        return instance.get(url, { params: params });
    } else if (method == 'delete') {
        return instance.delete(url, { params: params });
    } else if (method == 'put') {
        return instance.put(url, data)
    } else {
        // TODO
        return false;
    }
}