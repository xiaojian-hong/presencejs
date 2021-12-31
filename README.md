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
    import { Presence } from 'https://cdn.skypack.dev/@yomo/presencejs';
</script>
```

### 2. Connect to presence server

The client need to authenticate with YoMo to establish a realtime connection. The following code sample uses a demo YoMo's server(`wss://x.yomo.dev/presence`) and public Key to authenticate and print the message `Connected to YoMo!` when you’ve successfully connected.

```js
import { Presence } from '@yomo/presencejs';

interface PresenceOption {
    // Authentication
    auth?: {
        // Certification Type
        type: 'publickey' | 'token';
        // The public key in your Allegro Mesh project.
        publicKey: string;
    };
    // The reconnection interval value.
    reconnectInterval?: number;
    // The reconnection attempts value.
    reconnectAttempts?: number;
}

// create an instance.
// new Presence(host: string, option?: PresenceOption | undefined): Presence
const yomo = new Presence('wss://x.yomo.dev/presence');

yomo.on('connected', () => {
    console.log('Connected to server: ', yomo.host);
});
```

### 3. Subscribe to messages from the server

```js
yomo.on('connected', () => {
    // Enter a room
    yomo.toRoom('001');

    // Function to handle response for given event from server
    yomo.on('online', data => {
        console.log('online:', data);
    });

    // Same as the `on` method, returns an observable response
    yomo.on$('mousemove').subscribe(data => {
        console.log('mousemove:', data);
    });
});
```

### 4. Sending messages to the server

```js
import { fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';

yomo.on('connected', () => {
    // Function for sending data to the server
    yomo.send('online', {
        x: 10,
        y: 10,
    });

    // Converting browser events into observable sequences.
    const mousemove$ = fromEvent(document, 'mousemove').pipe(
        map(event => {
            return {
                x: event.clientX,
                y: event.clientY,
            };
        })
    );

    // Sending data streams to the server
    mousemove$.subscribe(yomo.ofRoom('001', 'movement'));
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

| Methods of instance | Description                                                     | Type                                                |
| ------------------- | --------------------------------------------------------------- | --------------------------------------------------- |
| `on`                | Function to handle response for given event from server         | `on<T>(event: string, cb: (data: T) => void): void` |
| `on$`               | Same as the `on` method, returns an observable response         | `on$<T>(event: string): Observable<T>`              |
| `send`              | Function for sending data to the server                         | `send<T>(event: string, data: T)`                   |
| `toRoom`            | Enter a room                                                    | `toRoom(roomName: string): Presence`                |
| `ofRoom`            | Function for sending data streams to the server                 | `ofRoom(roomName: string, event: string)`           |
| `close`             | A connection to YoMo can be closed once it is no longer needed. | `close(): void`                                     |

## Examples

[CursorChat](https://github.com/osdodo/cursor-chat)

## LICENSE

<a href="/LICENSE" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-blue.svg" />
</a>
