### Quickstart Guide

#### 1.Add the YoMo Client Library SDK

Using npm

```
$ npm i --save @yomo/presencejs
```

For CDN, you can use [skypack](https://www.skypack.dev): [https://cdn.skypack.dev/@yomo/presencejs](https://cdn.skypack.dev/@yomo/presencejs)

```html
<script type="module">
    import { YoMoClient } from 'https://cdn.skypack.dev/@yomo/presencejs';
</script>
```

#### 2.Connect to YoMo

```js
import { YoMoClient } from '@yomo/presencejs';

// create an instance.
const yomoclient = new YoMoClient('ws://localhost:3000', {
    reconnectInterval: 5000, // The reconnection interval value.
    reconnectAttempts: 3, // The reconnection attempts value.
});

yomoclient.on('connected', () => {
    console.log('Connected to YoMo');
});
```

#### 3.Subscribe to messages from the server

```js
yomoclient.on('connected', () => {
    // get a room
    const verse = yomoclient.getVerse('001');

    verse.fromServer('online').subscribe(data => {
        console.log('online:', data);
    });

    verse.fromServer('mousemove').subscribe(data => {
        console.log('mousemove:', data);
    });
});
```

#### 4.Sending messages to the server

```js
import { map, throttleTime } from 'rxjs/operators';

yomoclient.on('connected', () => {
    const verse = yomoclient.getVerse('001');

    verse.publish('online', {
        id: 'ID',
        x: 10,
        y: 10,
    });

    const mousemove$ = verse.fromEvent(document, 'mousemove').pipe(
        throttleTime(200),
        map(event => {
            return {
                id: 'ID',
                x: event.clientX,
                y: event.clientY,
            };
        })
    );

    verse.bindServer(mousemove$, 'mousemove');
});
```

#### 5.Close a connection to YoMo

```js
yomoclient.close();
yomoclient.on('closed', () => {
    console.log('Closed the connection to YoMo.');
});
```

## LICENSE

<a href="/LICENSE" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-blue.svg" />
</a>
