import req from '../https.js';

// 
export const apiGoogleLogin = () => req('get', 'authentication/google')