import Cookies from 'js-cookie'

const TokenKey = 'userCofig'

export function getToken() {
	let token='';
	if(window.sessionStorage.getItem(TokenKey)){
		 token=JSON.parse(window.sessionStorage.getItem(TokenKey)).token;
	}
	
  return token;
}
export function getUser() {
  return JSON.parse(window.sessionStorage.getItem(TokenKey));
}
export function setToken(token) {
	let user=JSON.stringify(token);
  return  window.sessionStorage.setItem(TokenKey, user)
}

export function removeToken() {
  return window.sessionStorage.removeItem(TokenKey)
}
