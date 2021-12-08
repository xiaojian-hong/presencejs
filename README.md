# yomo-js

YoMo browser sdk

### Quickstart Guide

#### 1.Add the YoMo Client Library SDK

Using npm

```
$ npm i --save yomo-js
```

For CDN, you can use [skypack](https://www.skypack.dev):
[https://cdn.skypack.dev/yomo-js](https://cdn.skypack.dev/yomo-js)

```html
<script type="module">
    import { YoMoClient } from 'https://cdn.skypack.dev/yomo-js';
</script>
```

#### 2.Connect to YoMo

```js
import { YoMoClient } from 'yomo-js';

// Create an instance.
const yomoclient = new YoMoClient('ws://localhost:3000', {
    reconnectInterval: 5000, // The reconnection interval value.
    reconnectAttempts: 3, // The reconnection attempts value.
});

yomoclient.connection.on('connected', () => {
    console.log('Connected to YoMo');
});
```

#### 3.Subscribe to messages from the server

```js
yomoclient.connection.on('connected', () => {
    // Enter a room
    const verse = yomoclient.to('001');

    // converting events to observable sequences
    const online$ = verse.fromEvent('online');
    online$.subscribe(data => {
        console.log('online:', data);
    });

    // or use the 'on' function
    yomoclient.on('online', data => {
        console.log('online:', data);
    });
});
```

#### 4.Sending messages to the server

```js
yomoclient.connection.on('connected', () => {
    // Enter a room
    const verse = yomoclient.to('001');

    verse.emit('online', {
        id: 'ID',
        x: 10,
        y: 10,
    });
});
```

#### 5.Close a connection to YoMo

```js
yomoclient.connection.close();
yomoclient.connection.on('closed', () => {
    console.log('Closed the connection to YoMo.');
});
```

## LICENSE

<a href="/LICENSE" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-blue.svg" />
</a>
