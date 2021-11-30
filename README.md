# yomo-js

YoMo browser sdk

## Installation

```bash
npm install yomo-js
```

## Usage

```js
import { YoMoClient } from 'yomo-js';

// Create an instance.
const yomoclient = new YoMoClient('ws://localhost:3000', {
    reconnectInterval: 5000, // The reconnection interval value.
    reconnectAttempts: 3, // The reconnection attempts value.
});

// function that handle events given from the server
yomoclient.on('online', data => {
    console.log('online:', data);
});

// returns connection status observable
const connectionState = yomoclient.connectionStatus();

// subscribe to connection status.
connectionState.subscribe((isConnected: boolean) => {
    if (isConnected) {
        // function for sending data to the server
        yomoclient.emit('online', {
            id: 'ID',
            x: 10,
            y: 10,
        });
    }
});
```

## LICENSE

[MIT](LICENSE)
