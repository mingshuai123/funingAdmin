const infoName = 'funing'
import axios from 'axios'
import Cookies from 'js-cookie'
import request from './request'

export function getToken() {
    // let info = (Cookies.get(infoName) == 'null' || Cookies.get(infoName) == null || !Cookies.get(infoName) || Cookies.get(infoName)==undefined) ? { token: '' } : JSON.parse(Cookies.get(infoName));
    let info =Cookies.get(infoName);
    if(info){
      info=JSON.parse(info);
      return info.token
    }
}
export function getInfo() {
    let info = (Cookies.get(infoName) == 'null' || Cookies.get(infoName) == null || !Cookies.get(infoName)) ? { token: '' } : JSON.parse(Cookies.get(infoName));
    return info
}
export function setToken(token) {
    // return sessionStorage.setutem(infoName, token)
    return Cookies.set(infoName, token)
}
export function removeToken() {
  return Cookies.remove('funing')
}
export function login(data) {
    return request({
      url: 'http://106.75.174.231:1112/backend/',
      method: 'post',
      data
    })
  }

export const postJsonRequest = (url, params) => {
    return axios({
      method: 'post',
      url: url,
      data: params,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  export const loignAjax=(param,callback)=>{
    let xmlhttp = null;
    if (window.XMLHttpRequest) {// code for Firefox, Opera, IE7, etc.
      xmlhttp = new XMLHttpRequest();
    } else if (window.ActiveXObject) {// code for IE6, IE5
      xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    //编写回调函数
    xmlhttp.onreadystatechange = function() {
      /* 	alert(xmlhttp.readyState); */
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        return callback(xmlhttp.responseText)
      }
      /* alert(123); */
    }
    //open设置请求方式和请求路径
    xmlhttp.open("post", "http://106.75.101.90:1288/user/login");//一个servlet，后面还可以写是否同步
    //设置请求头
    xmlhttp.setRequestHeader("content-type", "application/json")
    //send 发送
    xmlhttp.send(param);
  }