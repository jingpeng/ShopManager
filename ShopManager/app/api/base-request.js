export default class BaseRequest {

  static get(url, headers) {
  	return fetch(url, {
      method: 'GET',
      headers: headers
    })
  }

  static post(url, headers, body) {
    return fetch(url, {
      method: 'POST',
      headers: headers,
      body: body
    })
  }
}
