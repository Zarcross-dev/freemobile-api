const axios = require('axios');

class FreeMobile {
  constructor(credentials) {
    this.user = credentials.user;
    this.pass = credentials.pass;
  }

  send(message) {
    const formattedMessage = encodeURIComponent(message);
    const url = `https://smsapi.free-mobile.fr/sendmsg?user=${this.user}&pass=${this.pass}&msg=${formattedMessage}`;

    return axios.get(url)
      .then(response => response.data)
      .catch(error => {
        throw new Error(`Failed to send SMS: ${error.message}`);
      });
  }
}

module.exports = FreeMobile;