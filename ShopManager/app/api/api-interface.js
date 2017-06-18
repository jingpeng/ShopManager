import BaseRequest from './base-request';
import ApiConstant from './api-constant';

export default class APIInterface {

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
}
