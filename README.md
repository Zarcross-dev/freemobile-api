# FreeMobile Plugin

![Node.js Badge](https://img.shields.io/badge/Node.js-393?logo=nodedotjs&logoColor=fff&style=flat)
![npm Badge](https://img.shields.io/badge/npm-CB3837?logo=npm&logoColor=fff&style=flat) ![NPM Downloads](https://img.shields.io/npm/d18m/freemobile-api) ![NPM Version](https://img.shields.io/npm/v/freemobile-api)

FreeMobile Plugin is a Node.js module to simplify interaction with the FreeMobile API for sending SMS messages.

## Installation

Install the module using npm:

```bash
npm install freemobile-api@latest
```

## Usage

### DISCLAMER : You need a subscription to [Free Mobile](mobile.free.fr) to use this API.

```js
const FreeMobile = require('freemobile-api');

// Replace 'YOUR_USER' and 'YOUR_PASS' with your FreeMobile credentials
const credentials = { user: 'YOUR_USER', pass: 'YOUR_PASS' };
const freeMobile = new FreeMobile(credentials);

// Send an SMS (Your message can't exceed the default SMS limit of 160 character.)
freeMobile.send('Hello World!')
  .then(response => console.log('SMS sent:', response))
  .catch(error => console.error('Error:', error.message));
```

## Explanations

The FreeMobile Node.js Plugin provides a simple API with the following methods:

### `new FreeMobile(credentials)`

Creates a new instance of the FreeMobile class with the specified credentials.

- **Parameters:**
  - `credentials` (Object): An object containing the following properties:
    - `user` (String): Your FreeMobile account number.
    - `pass` (String): Your FreeMobile API key.

### `FreeMobile.send(message)`

Sends an SMS message through the FreeMobile API.

- **Parameters:**

  - `message` (String): The text of the SMS message to be sent.
- **Returns:**

  - A Promise that resolves with the API response.

## Module features

##### 1 - Send large messages.

The API has a limit of 999 characters. If your message is longer, the plugin breaks it into chunks, each no longer than 999 characters. This helps ensure successful message delivery through the API without exceeding its limits.

##### 2 - Sending emojis.

FreeMobile API doesn't support emoji sending due to the used charset. To avoid any errors they will be automatically replaced by "[]" and a note about this problem will be added at the end of the SMS.

If you want more features, see [contributions](#contributing)

## API codes

API codes are not more than HTTP codes.

- 200 : Success - SMS sent
- 400 : One or multiple parameters are missing or incorrect
- 402 : Too many request. Try again later
- 403 : Acces denied, make sure the option is enabled on your FreeMobile account or check your credentials.
- 500 : Server internal error. Try again later. (You maybe sent a wrong message, try to avoid emojis or special caracters.)

## Contributing

Feel free to open issues or submit pull requests. Contributions are welcome! (In the limits of the FreeMobile API.)

##### [Buy me a coffee](https://paypal.me/zarcrosstv)

## License

This project is licensed under Apache 2.0 License - see the [LICENSE](https://github.com/Zarcross-dev/freemobile-api/blob/main/LICENSE) file for details.
