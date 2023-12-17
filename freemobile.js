const axios = require('axios');

class FreeMobile {
  constructor(credentials) {
    this.user = credentials.user;
    this.pass = credentials.pass;
  }

  send(message) {
    const url = 'https://smsapi.free-mobile.fr/sendmsg';

    const data = {
      user: this.user,
      pass: this.pass,
      msg: message
    };

    return axios.post(url, data)
      .then(response => response.data)
      .catch(error => {
        throw new Error(`Failed to send SMS: ${error.message}`);
      });
  }
}

module.exports = FreeMobile;