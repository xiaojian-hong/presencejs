# yomo-js

YoMo browser sdk

## Installation and Usage

#### Using npm

```
$ npm i --save yomo-js
```

```js
import { YoMoClient } from 'yomo-js';

// Create an instance.
const yomoclient = new YoMoClient('ws://localhost:3000', {
    reconnectInterval: 5000, // The reconnection interval value.
    reconnectAttempts: 3, // The reconnection attempts value.
});

// A function that handle events given from the server
yomoclient.on('online', data => {
    console.log('online:', data);
});

// Return connection status observable
const connectionState = yomoclient.connectionStatus();

// Subscribe to connection status.
connectionState.subscribe((isConnected: boolean) => {
    if (isConnected) {
        // A function for sending data to the server
        yomoclient.emit('online', {
            id: 'ID',
            x: 10,
            y: 10,
        });
    }
});
```

#### CDN

For CDN, you can use [skypack](https://www.skypack.dev): 
[https://cdn.skypack.dev/yomo-js](https://cdn.skypack.dev/yomo-js)

```html

<script type="module">
    import { YoMoClient } from 'https://cdn.skypack.dev/yomo-js';
</script>
```

## Api

| Property         | Description                                         | Type                                                              |
| ---------------- | --------------------------------------------------- | ----------------------------------------------------------------- |
| connectionStatus | Return connection status observable                 | connectionStatus(): Observable<boolean>;                          |
| on               | A function that handle events given from the server | on(event: string &#124; 'close', cb: (data?: any) => void): void; |
| emit             | A function for sending data to the server           | emit(event: string, data: object &#124; string): void;            |

## LICENSE

<a href="/LICENSE" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-blue.svg" />
</a>
