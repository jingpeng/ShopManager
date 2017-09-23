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

  static deviceDelete(token, deviceId) {
    let formData = new FormData();
    formData.append("deviceId", deviceId)
    return BaseRequest.post(ApiConstant.BASE_URL + '/device/delete', {'token': token}, formData)
  }

  static deviceGetDetailsByMac(mac) {
    var params = {
      "mac": mac
    }
    var esc = encodeURIComponent;
    var query = Object.keys(params).map(k => esc(k) + '=' + esc(params[k])).join('&');
    return BaseRequest.get(ApiConstant.BASE_URL + '/device/getDeviceDetailsByMac?' + query, {})
  }

  static deviceUpdate(token, deviceId, place) {
    let formData = new FormData();
    formData.append("deviceId", deviceId)
    formData.append("place", place)
    return BaseRequest.post(ApiConstant.BASE_URL + '/device/update', {'token': token}, formData)
  }

  static playAdvGetList(userId, numberPerPage, currentPage) {
    var params = {
      "userId": userId,
      "numberPerPage": numberPerPage,
      "currentPage": currentPage
    }
    var esc = encodeURIComponent;
    var query = Object.keys(params).map(k => esc(k) + '=' + esc(params[k])).join('&');
    return BaseRequest.get(ApiConstant.BASE_URL + '/playAdv/getPlayAdvList?' + query, {})
  }

  static playAdvGetListFromAdmin(userId, numberPerPage, currentPage) {
    var params = {
      "userId": userId,
      "numberPerPage": numberPerPage,
      "currentPage": currentPage
    }
    var esc = encodeURIComponent;
    var query = Object.keys(params).map(k => esc(k) + '=' + esc(params[k])).join('&');
    return BaseRequest.get(ApiConstant.BASE_URL + '/playAdv/getPlayAdvListFromAdmin?' + query, {})
  }

  static advOrderAdd(mac, playAdvId, num) {
    let formData = new FormData();
    formData.append("mac", mac)
    formData.append("playAdvId", playAdvId)
    formData.append("num", num)
    return BaseRequest.post(ApiConstant.BASE_URL + '/advOrder/add', {}, formData)
  }

  static gameGetList(numberPerPage, currentPage) {
    var params = {
      "numberPerPage": numberPerPage,
      "currentPage": currentPage
    }
    var esc = encodeURIComponent;
    var query = Object.keys(params).map(k => esc(k) + '=' + esc(params[k])).join('&');
    return BaseRequest.get(ApiConstant.BASE_URL + '/game/getGameList?' + query, {})
  }

  static envGetDetailsByMac(mac) {
    var params = {
      "mac": mac
    }
    var esc = encodeURIComponent;
    var query = Object.keys(params).map(k => esc(k) + '=' + esc(params[k])).join('&');
    return BaseRequest.get(ApiConstant.BASE_URL + '/env/getEnvDetailsByMac?' + query, {})
  }

  static advOrderAdd(mac, playAdvId, num) {
    let formData = new FormData();
    formData.append("mac", mac)
    formData.append("playAdvId", playAdvId)
    formData.append("num", num)
    return BaseRequest.post(ApiConstant.BASE_URL + '/advOrder/add', {}, formData)
  }

  static recordAddPlay(mac, playAdvIds) {
    return BaseRequest.post(ApiConstant.BASE_URL + '/record/addPlayRecord?mac=' + mac, {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }, JSON.stringify(playAdvIds))
  }

  static recordAddOperate(mac, operateRecords) {
    return BaseRequest.post(ApiConstant.BASE_URL + '/record/addOperateRecord?mac=' + mac, {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }, JSON.stringify(operateRecords))
  }

  static recordAddOperate(mac, operateRecords) {
    return BaseRequest.post(ApiConstant.BASE_URL + '/record/addOperateRecord?mac=' + mac, {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }, JSON.stringify(operateRecords))
  }

  static newAdvGetList(userId, numberPerPage, currentPage) {
    var params = {
      "userId": userId,
      "numberPerPage": numberPerPage,
      "currentPage": currentPage
    }
    var esc = encodeURIComponent;
    var query = Object.keys(params).map(k => esc(k) + '=' + esc(params[k])).join('&');
    return BaseRequest.get(ApiConstant.BASE_URL + '/newAdv/getNewAdvList?' + query, {})
  }
}
