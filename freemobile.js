const axios = require('axios');
const supportedEmojis = require('./emojis');

/**
 * FreeMobile SMS API wrapper
 *
 * Automatically chunks long messages and sanitizes emojis
 *
 * @example
 * const FreeMobile = require('freemobile-api');
 * const freeMobile = new FreeMobile({ user: '12345678', pass: 'api-key' });
 * await freeMobile.send('Hello, World!');
 */
class FreeMobile {
  /**
   * @type {number} Maximum characters per SMS chunk
   * @default 999
   * @private
   */
  maxMessageLength = 999;

  /**
   * @type {string} Replacement string for unsupported emojis
   * @default '[]'
   * @private
   */
  replacementString = '[]';

  /**
   * @param {Object} credentials - FreeMobile credentials
   * @param {string} credentials.user - Account number (8 digits)
   * @param {string} credentials.pass - API key
   * @throws {FreeMobileError} INVALID_CREDENTIALS - When credentials object is invalid
   * @throws {FreeMobileError} INVALID_USER - When user is not a non-empty string
   * @throws {FreeMobileError} INVALID_PASS - When pass is not a non-empty string
   */
  constructor(credentials) {
    if (!credentials || typeof credentials !== 'object') {
      throw new FreeMobileError('Credentials must be an object', null, 'INVALID_CREDENTIALS');
    }
    if (!credentials.user || typeof credentials.user !== 'string') {
      throw new FreeMobileError('User must be a non-empty string', null, 'INVALID_USER');
    }
    if (!credentials.pass || typeof credentials.pass !== 'string') {
      throw new FreeMobileError('Pass must be a non-empty string', null, 'INVALID_PASS');
    }

    this.user = credentials.user;
    this.pass = credentials.pass;
  }

  /**
   * Sends SMS message, automatically chunks long messages and sanitizes emojis
   *
   * @param {string} message - SMS text to send
   * @returns {Promise<any>} API response (empty string on success)
   * @throws {FreeMobileError} INVALID_MESSAGE_TYPE - Message is not a string
   * @throws {FreeMobileError} EMPTY_MESSAGE - Message is empty or whitespace only
   * @throws {FreeMobileError} BAD_REQUEST - Invalid API parameters (HTTP 400)
   * @throws {FreeMobileError} RATE_LIMITED - Too many requests (HTTP 402)
   * @throws {FreeMobileError} ACCESS_DENIED - Invalid credentials or SMS disabled (HTTP 403)
   * @throws {FreeMobileError} SERVER_ERROR - FreeMobile server error (HTTP 500)
   * @throws {FreeMobileError} NETWORK_ERROR - Network/connection error
   */
  send(message) {
    if (typeof message !== 'string') {
      throw new FreeMobileError("The message must be a string", null, 'INVALID_MESSAGE_TYPE');
    }

    message = this._sanitizeMessage(message);
    if (message.trim().length === 0) {
      throw new FreeMobileError("Cannot send empty SMS", null, 'EMPTY_MESSAGE');
    }

    // Split the message into chunks of maxMessageLength
    const messageChunks = this._chunkString(message, this.maxMessageLength);

    // Use reduce to chain promises and send each chunk sequentially
    return messageChunks.reduce((promiseChain, chunk) => {
      return promiseChain.then(() => this._sendSingleSMS(chunk));
    }, Promise.resolve());
  }

  /**
   * Sends a single SMS chunk to the FreeMobile API
   *
   * @private
   * @param {string} chunk - Message chunk (≤ 999 chars)
   * @returns {Promise<any>} API response (empty string on success)
   * @throws {FreeMobileError} BAD_REQUEST - Invalid parameters (HTTP 400)
   * @throws {FreeMobileError} RATE_LIMITED - Too many requests (HTTP 402)
   * @throws {FreeMobileError} ACCESS_DENIED - Invalid credentials (HTTP 403)
   * @throws {FreeMobileError} SERVER_ERROR - Server error (HTTP 500)
   * @throws {FreeMobileError} NETWORK_ERROR - Network error
   */
  async _sendSingleSMS(chunk) {
    try {
      const response = await axios.get('https://smsapi.free-mobile.fr/sendmsg', {
        params: {
          user: this.user,
          pass: this.pass,
          msg: chunk
        },
        headers: {
          'User-Agent': 'freemobile-api/1.1.0'
        }
      });

      return response.data;
    } catch (error) {
      if (error.response) {
        let errorMessage, errorType;

        switch (error.response.status) {
          case 400:
            errorMessage = 'One or multiple parameters are missing or incorrect';
            errorType = 'BAD_REQUEST';
            break;
          case 402:
            errorMessage = 'Too many requests. Try again later';
            errorType = 'RATE_LIMITED';
            break;
          case 403:
            errorMessage = 'Access denied. Make sure the SMS option is enabled on your FreeMobile account and check your credentials';
            errorType = 'ACCESS_DENIED';
            break;
          case 500:
            errorMessage = 'Server internal error. Try again later';
            errorType = 'SERVER_ERROR';
            break;
          default:
            errorMessage = `HTTP Error ${error.response.status}`;
            errorType = 'HTTP_ERROR';
        }

        throw new FreeMobileError(errorMessage, error.response.status, errorType);
      } else {
        throw new FreeMobileError(`Network error: ${error.message}`, null, 'NETWORK_ERROR');
      }
    }
  }

  /**
   * Splits a string into chunks of specified length
   *
   * @private
   * @param {string} str - String to split
   * @param {number} length - Max chunk length
   * @returns {string[]} Array of chunks
   */
  _chunkString(str, length) {
    const chunks = [];
    for (let i = 0; i < str.length; i += length) {
      chunks.push(str.substring(i, i + length));
    }
    return chunks;
  }

  /**
   * Sanitizes the message by removing unsupported emojis
   *
   * @private
   * @param {string} message - Message to sanitize
   * @returns {string} Sanitized message
   */
  _sanitizeMessage(message) {
    // Check the full emoji sequence, including variation selectors (\u{FE0F}) and keycap modifiers (\u{20E3})
    // If it's an emoji and it's not in the supported list, replace it
    return message.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}][\u{FE0F}\u{20E3}]?/gu, (match) => {
      return supportedEmojis.includes(match) ? match : this.replacementString;
    });
  }
}

/**
 * FreeMobile API error with status code and error type
 *
 * @extends Error
 */
class FreeMobileError extends Error {
  /**
   * @param {string} message - Error message
   * @param {number|null} [code=null] - HTTP status code
   * @param {string} [type] - Error type for programmatic handling
   */
  constructor(message, code, type) {
    super(message);
    this.name = 'FreeMobileError';
    this.code = code;
    this.type = type;
  }
}

module.exports = FreeMobile;
