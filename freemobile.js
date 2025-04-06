const axios = require("axios");

class FreeMobile {
  /**
   * The maximum of characters in a chunk.
   */
  maxMessageLength = 999;

  /**
   * @param {{ user: string, pass: string }} credentials 
   */
  constructor(credentials) {
    this.user = credentials.user;
    this.pass = credentials.pass;
  }

  /**
   * Sends an SMS message through the FreeMobile API.
   * @param {string} message - The text of the SMS message to be sent.
   * @returns {Promise<any>} A Promise that resolves with the API response.
   */
  send(message) {
    if(typeof message !== 'string') {
      throw new Error("The message must be a string");
    }
    message = this._sanitizeMessage(message);

    if (message.trim(),length == 0) {
      throw new Error("Cannot send empty SMS")
    }
    // Split the message into chunks of maxMessageLength
    const messageChunks = this._chunkString(message, this.maxMessageLength);

    // Use reduce to chain promises and send each chunk sequentially
    return messageChunks.reduce((promiseChain, chunk) => {
      return promiseChain.then(() => this._sendSingleSMS(chunk));
    }, Promise.resolve());
  }

  /**
   * Function to send a single SMS
   * @param {string} chunk
   */
  _sendSingleSMS(chunk) {
    const url = 'https://smsapi.free-mobile.fr/sendmsg';
    const data = {
      user: this.user,
      pass: this.pass,
      msg: chunk
    };

    return axios.post(url, data)
      .then(response => response.data)
      .catch(error => {
        throw new Error(`Failed to send SMS: ${error.message}`);
      });
  }

  /**
   * Function to split a string into chunks of a specified length
   * @param {string} str
   * @param {number} length
   */
  _chunkString(str, length) {
    const chunks = [];
    for (let i = 0; i < str.length; i += length) {
      chunks.push(str.substring(i, i + length));
    }
    return chunks;
  }
  /**
   * Sanitise the message by removing emojis and special unicode symbols
   * @param {string} message
   * @returns {string}
   */
  _sanitizeMessage(message) {
    const sanitizedMessage = message.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '[]')
    return `${sanitizedMessage}\n\n[] = Emojis are not supported by FreeMobile API. Try to avoid them.`;
  }
}

module.exports = FreeMobile;