import req from '../https.js';

// 
export const apiGoogleLogin = () => req('get', 'authentication/google')

export const getUserInfo = (body) => req('post', 'authentication/getUserInfo', body);