import BaseRequest from './base-request';
import ApiConstant from './api-constant';

export default class APIInterface {

  static userLogin(userName, password) {
    let formData = new FormData();
    formData.append("userName", userName)
    formData.append("password", password)
    return BaseRequest.post(ApiConstant.BASE_URL + '/user/login', {}, formData)
  }
}
