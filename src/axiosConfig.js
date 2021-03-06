import axios from "axios";
// import Vue from 'vue'
// import qs from 'qs'
import { Message, Loading } from "element-ui";
// 响应时间
axios.defaults.timeout = 5 * 1000;
// 配置cookie
// axios.defaults.withCredentials = true
// 配置请求头
axios.defaults.headers.post["Content-Type"] = "application/json";
// 静态资源
// Vue.prototype.$static = ''

// 配置接口地址
// axios.defaults.baseURL = "/lottory";
axios.defaults.baseURL = "http://221.181.129.89:20115/lottery";
var loadingInstance;
// POST传参序列化(添加请求拦截器)
axios.interceptors.request.use(
  config => {
    loadingInstance = Loading.service({
      lock: true,
      text: "数据加载中，请稍后...",
      spinner: "el-icon-loading",
      ackground: "rgba(255,255,255,0)"
    });
    return config;
  },
  err => {
    loadingInstance.close();
    Message.error("请求错误");
    return Promise.reject(err);
  }
);
//  返回状态判断(添加响应拦截器)
axios.interceptors.response.use(
  res => {
    if (res.data.status === 200) {
      loadingInstance.close();
    } else {
      loadingInstance.close();
      // Message.error(res.data.msg);
    }
    return res;
  },
  err => {
    loadingInstance.close();
    Message.error("请求失败，请稍后再试");
    return Promise.reject(err);
  }
);
// 发送请求
export function fetchPost(url, params) {
  const postData = JSON.stringify(params);
  return new Promise((resolve, reject) => {
    axios
      .post(url, postData)
      .then(
        res => {
          console.log(res);
          resolve(res);
        },
        err => {
          reject(err);
        }
      )
      .catch(err => {
        reject(err);
      });
  });
}
export function fetchGet(url, params) {
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        params: params
      })
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data);
      });
  });
}
