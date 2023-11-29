import axios from 'axios';
import req from '../https.js';

// get audio's transcription
export const apiGetTranscription = (body, params) => {
    if (process.env.VUE_APP_MODE === 'demonstration') {
        return axios.get('/demo/68sec.json')
    } else {
        return req('post', 'transcription/getTranscription', body, params)
    }
}