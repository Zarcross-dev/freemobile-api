# FreeMobile Plugin

FreeMobile Plugin is a Node.js module to simplify interaction with the FreeMobile API for sending SMS messages.

## Installation

Install the module using npm:

```bash
npm install freemobile-plugin
```

## Usage
### DISCLAMER : You need a subscription to [FreeMobile](mobile.free.fr) to use this API.
```js
const FreeMobile = require('freemobile-plugin');

// Replace 'YOUR_USER' and 'YOUR_PASS' with your FreeMobile credentials
const credentials = { user: 'YOUR_USER', pass: 'YOUR_PASS' };
const freeMobile = new FreeMobile(credentials);

// Send an SMS
freeMobile.sendSMS('Hello World!')
  .then(response => console.log('SMS sent:', response))
  .catch(error => console.error('Error:', error.message));
```

## API codes
API codes are not more than HTTP codes.
- 200 : Success - SMS sent
- 400 : One or multiple parameters are missing or incorrect
- 402 : Too many request. Try again later
- 403 : Acces denied, make sure the option is enabled on your FreeMobile account or check your credentials.
- 500 : Server internal error. Try again later.

## Explanations

The FreeMobile Node.js Plugin provides a simple API with the following methods:

### `new FreeMobile(credentials)`

Creates a new instance of the FreeMobile class with the specified credentials.

- **Parameters:**
  - `credentials` (Object): An object containing the following properties:
    - `user` (String): Your FreeMobile account username.
    - `pass` (String): Your FreeMobile API key.

### `FreeMobile.sendSMS(message)`

Sends an SMS message through the FreeMobile API.

- **Parameters:**
  - `message` (String): The text of the SMS message to be sent.

- **Returns:**
  - A Promise that resolves with the API response.

## Contributing

Feel free to open issues or submit pull requests. Contributions are welcome! (In the limits of the FreeMobile API.)

## License

This project is licensed under Apache 2.0 License - see the [LICENSE](https://github.com/Zarcross-dev/freemobile-api/blob/main/LICENSE) file for details.