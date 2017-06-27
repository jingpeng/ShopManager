import BaseRequest from './base-request';
import ApiConstant from './api-constant';

export default class APIInterface {

  static userRegister(userName, password, type) {
    let formData = new FormData();
    formData.append("userName", userName)
    formData.append("password", password)
    formData.append("type", type)
    return BaseRequest.post(ApiConstant.BASE_URL + '/user/register', {}, formData)
  }

  static userLogin(userName, password) {
    let formData = new FormData();
    formData.append("userName", userName)
    formData.append("password", password)
    return BaseRequest.post(ApiConstant.BASE_URL + '/user/login', {}, formData)
  }

  static deviceAdd(token, place, mac) {
    let formData = new FormData();
    formData.append("place", place)
    formData.append("mac", mac)
    return BaseRequest.post(ApiConstant.BASE_URL + '/device/add', {'token': token}, formData)
  }

  static deviceGetDetailsByMac(mac) {
    var params = {
      "mac": mac
    }
    var esc = encodeURIComponent;
    var query = Object.keys(params).map(k => esc(k) + '=' + esc(params[k])).join('&');
    return BaseRequest.get(ApiConstant.BASE_URL + '/device/getDeviceDetailsByMac?' + query, {})
  }
}
