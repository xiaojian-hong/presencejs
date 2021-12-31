# Presencejs

`presencejs` is a JavaScript library that allows you to build real-time web applications quickly, the server is built atop of [YoMo](https://github.com/yomorun/yomo), which provide secure, low-latency, and high-performance geo-distributed services.

## Quickstart Guide

### 1. Add `presencejs` to your web app

Using npm

```
$ npm i --save @yomo/presencejs
```

Using yarn

```
$ yarn add @yomo/presencejs
```

Using pnpm

```
$ pmpm i @yomo/presencejs
```

For CDN, you can use [skypack](https://www.skypack.dev): [https://cdn.skypack.dev/@yomo/presencejs](https://cdn.skypack.dev/@yomo/presencejs)

```html
<script type="module">
    import { yomo } from 'https://cdn.skypack.dev/@yomo/presencejs';
</script>
```

### 2. Connect to presence server

The client need to authenticate with YoMo to establish a realtime connection. The following code sample uses a demo YoMo's server(`wss://ws-dev.yomo.run`) and public Key to authenticate and print the message `Connected to YoMo!` when you’ve successfully connected.

```js
import { Presence } from '@yomo/presencejs';

// create an instance.
const yomo = new Presence('wss://ws-dev.yomo.run');

yomo.on('connected', () => {
    console.log('Connected to server: ', yomo.host);
});
```

### 3. Subscribe to messages from the server

```js
yomo.on('connected', () => {
    // Get a room instance
    const room = yomo.getRoom('001');

    // Handle events from the server and subscribe to data frames
    room.fromServer('online').subscribe((data) => {
        console.log('online:', data);
    });

    room.fromServer('mousemove').subscribe((data) => {
        console.log('mousemove:', data);
    });
});
```

### 4. Sending messages to the server

```js
import { map, throttleTime } from 'rxjs/operators';

yomo.on('connected', () => {
    const room = yomo.getRoom('001');

    // Push data frames immediately.
    room.publish('online', {
        id: 'ID',
        x: 10,
        y: 10,
    });

    // Converting browser events into observable sequences.
    const mousemove$ = room
        .fromEvent(document, 'mousemove')
        // You can use RxJS Operators.
        .pipe(
            throttleTime(200),
            map((event) => {
                return {
                    id: 'ID',
                    x: event.clientX,
                    y: event.clientY,
                };
            })
        );

    // Bind the event source to YoMo's service,
    // which will automatically push the data frame.
    room.bindServer(mousemove$, 'mousemove');
});
```

### 5. Close a connection

A connection to YoMo can be closed once it is no longer needed.

```js
yomo.close();
yomo.on('closed', () => {
    console.log('Closed the connection');
});
```

## API

### Presence instance

| Methods of instance | Description                                                     | Type                                                                      |
| ------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------- |
| on                  | Subscribe to the connection and disconnection status            | <code>on(event: 'connected' &#124; 'closed', cb: () => void): void</code> |
| close               | A connection to YoMo can be closed once it is no longer needed. | `close(): void`                                                           |
| getRoom             | Get a room.                                                     | `getRoom(id: string): Room`                                               |

### Room

| Methods of instance | Description                                                                            | Type                                                                     |
| ------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| fromServer          | Handle event from the server.                                                          | `fromServer<T>(event: string): Observable<T>`                            |
| bindServer          | Bind the event source to YoMo's service, which will automatically push the data frame. | `bindServer<T>(source: Observable<T>, event: string): Subscription`      |
| fromEvent           | Converting browser events into observable sequences. Same as RxJS.                     | `fromEvent<T>(target: FromEventTarget<T>, event: string): Observable<T>` |
| publish             | Push data frames immediately.                                                          | `publish<T>(event: string, data: T)`                                     |

## Examples

[CursorChat](https://github.com/yomorun/yomo-react-cursor-chat)

## LICENSE

<a href="/LICENSE" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-blue.svg" />
</a>
