import { interval, Observable, Subject, Subscription } from 'rxjs';
import { distinctUntilChanged, filter, map, takeWhile } from 'rxjs/operators';
import { WebSocketSubject } from 'rxjs/webSocket';
import { decoder, encoder, getAuthorizedURL, getProtocol, loadWasm } from './helper';
import { EventMessage, IPresenceOption } from './type';

export default class Presence extends Subject<EventMessage> {
    // Service url
    public host: string;
    // Types of connection services
    public type: 'WebSocket' | 'WebTransport';
    // WebSocketSubject instance
    private _socket$: WebSocketSubject<EventMessage> | undefined;
    // Socket Subscription
    private _socketSubscription: Subscription | undefined;
    // Reconnection stream
    private _reconnectionObservable: Observable<number> | undefined;
    // Reconnection Subscription
    private _reconnectionSubscription: Subscription | undefined;
    // Reconnect interval
    private _reconnectInterval: number;
    // Reconnect attempts
    private _reconnectAttempts: number;
    // Subject for connection status stream
    private _connectionStatus$: Subject<boolean>;
    // WebTransport instance
    private _transport: any;
    // WebTransport datagram writer
    private _transportDatagramWriter: any;
    // WebTransport Subscription
    private _wtSubscription: Subscription | undefined;

    constructor(host: string, option: IPresenceOption) {
        super();
        this.host = host;
        this.type = 'WebSocket';
        this._reconnectInterval = option?.reconnectInterval || 5000;
        this._reconnectAttempts = option?.reconnectAttempts || 3;
        this._connectionStatus$ = new Subject<boolean>();

        const scheme = getProtocol(host);

        if (!(scheme === 'ws' || scheme === 'wss' || scheme === 'https')) {
            throw new Error(
                `${host} -> The URL's scheme must be either 'ws' 、'wss' or 'https'`
            );
        }

        if (scheme === 'https') {
            // @ts-ignore
            if (typeof WebTransport !== 'undefined') {
                this.type = 'WebTransport';
            } else {
                this.host = host.replace(/^https/, 'wss');
            }
        }

        if (this.type === 'WebSocket') {
            this._connectionStatus$.subscribe({
                next: (isConnected) => {
                    if (
                        !this._reconnectionObservable &&
                        typeof isConnected === 'boolean' &&
                        !isConnected
                    ) {
                        this._reconnect();
                    }
                },
            });
        }

        loadWasm().then(() => {
            getAuthorizedURL(this.host, option).then((url) => {
                this.host = url;
                if (this.type === 'WebSocket') {
                    this._wsConnect();
                } else {
                    this._wtConnect();
                }
            });
        })
    }

    /**
     * Function to handle response for given event from server
     *
     * @param event name of the event
     * @param cb is the function executed when the events 'connected' and 'closed' occur
     *
     * @private
     */
    on<T>(event: string, cb: (data: T) => void) {
        if (event === 'connected' || event === 'closed') {
            this._connectionStatus$
                .pipe(
                    distinctUntilChanged(),
                    filter((isConnected) => {
                        return (
                            (isConnected && event === 'connected') ||
                            (!isConnected && event === 'closed')
                        );
                    })
                )
                .subscribe((isConnected: any) => {
                    cb(isConnected);
                });
        } else {
            this.pipe(
                filter((message: any): boolean => {
                    return (
                        message.event && message.event === event && message.data
                    );
                })
            ).subscribe({
                next: (message: EventMessage): void => cb(message.data),
                error: () => undefined,
                complete: (): void => {},
            });
        }
    }

    /**
     * Same as the `on` method, returns an observable response
     *
     * @param event name of the event
     *
     * @return {Observable<T>}
     */
    on$<T>(event: string): Observable<T> {
        return this.pipe(
            filter((message: any): boolean => {
                return message.event && message.event === event && message.data;
            }),
            map((_) => _.data)
        );
    }

    /**
     * Function for sending data to the server
     *
     * @param event name of the event
     * @param data
     */
    send<T>(event: string, data: T) {
        if (this.type === 'WebSocket') {
            this._socket$ && this._socket$.next({ event, data });
        } else {
            this._transportDatagramWriter &&
                this._transportDatagramWriter.write(encoder({ event, data }));
        }
    }

    /**
     * Enter a room
     *
     * @param roomName name of the room
     *
     * @return {Presence}
     */
    toRoom(roomName: string): Presence {
        this.send('TOROOM', roomName);
        return this;
    }

    /**
     * Function for sending data streams to the server
     *
     * @param roomName name of the room
     * @param event name of the event
     *
     * @return (data: any) => void
     */
    ofRoom(roomName: string, event: string) {
        this.toRoom(roomName);
        return (data: any) => {
            this.send(event, data);
        };
    }

    /**
     * Clean up
     */
    close() {
        if (this.type === 'WebSocket') {
            this._reconnectAttempts = 0;
            this._clearReconnection();
            this._clearSocket();
        } else {
            this._clearTransport();
        }

        this._connectionStatus$.next(false);
    }

    /**
     * Use WebSocket to connect to YoMo's services
     *
     * @private
     */
    private _wsConnect() {
        this._socket$ = new WebSocketSubject({
            url: this.host,
            serializer: encoder,
            deserializer: (event: MessageEvent) => decoder(event.data),
            binaryType: 'arraybuffer',
            openObserver: {
                next: () => {
                    this._connectionStatus$.next(true);
                },
            },
            closeObserver: {
                next: () => {
                    this._clearSocket();
                    this._connectionStatus$.next(false);
                },
            },
        });

        this._socketSubscription = this._socket$.subscribe({
            next: (msg) => {
                this.next(msg);
            },
            error: () => {
                if (!this._socket$) {
                    this._clearReconnection();
                    this._reconnect();
                }
            },
        });

        this._socketSubscription.add(this._ping());
        this._socketSubscription.add(this._pong());
    }

    /**
     * Reconnect
     *
     * @private
     */
    private _reconnect(): void {
        this._reconnectionObservable = interval(this._reconnectInterval).pipe(
            takeWhile(
                (_, index) => index < this._reconnectAttempts && !this._socket$
            )
        );

        this._reconnectionSubscription = this._reconnectionObservable.subscribe(
            {
                next: () => this._wsConnect(),
                error: () => undefined,
                complete: () => {
                    this._clearReconnection();
                    if (!this._socket$) {
                        this.complete();
                        this._connectionStatus$.complete();
                    }
                },
            }
        );
    }

    /**
     * Clear socket
     *
     * @private
     */
    private _clearSocket(): void {
        this._socket$?.complete();
        this._socketSubscription && this._socketSubscription.unsubscribe();
        this._socket$ = undefined;
    }

    /**
     * Clear reconnect
     *
     * @private
     */
    private _clearReconnection(): void {
        this._reconnectionSubscription &&
            this._reconnectionSubscription.unsubscribe();
        this._reconnectionObservable = undefined;
    }

    /**
     * Send the current time of the machine every 5 seconds
     *
     * @private
     *
     * @return {Subscription}
     */
    private _ping(): Subscription {
        return interval(5000).subscribe((_) => {
            this.send('ping', { timestamp: Date.now() });
        });
    }

    /**
     * Receive data from "pong“
     *
     * @private
     *
     * @return {Subscription}
     */
    private _pong(): Subscription {
        return this.on$<any>('pong').subscribe((data) => {
            const { timestamp, meshId } = data;
            if (timestamp) {
                // Calculate the latency and broadcast the results
                const rtt = Date.now() - timestamp;
                const latency = rtt / 2;
                this.send('latency', {
                    latency,
                    meshId,
                });
            }
        });
    }

    /**
     * Use WebTransport to connect to YoMo's services
     *
     * @private
     */
    private async _wtConnect() {
        // @ts-ignore
        this._transport = new WebTransport(this.host);

        try {
            this._transportDatagramWriter =
                this._transport.datagrams.writable.getWriter();
            await this._transport.ready;
            this._connectionStatus$.next(true);
        } catch (e) {
            this._clearTransport();
            this.type = 'WebSocket';
            this.host = this.host.replace(/^https/, 'wss');
            this._connectionStatus$.subscribe({
                next: (isConnected) => {
                    if (
                        !this._reconnectionObservable &&
                        typeof isConnected === 'boolean' &&
                        !isConnected
                    ) {
                        this._reconnect();
                    }
                },
            });
            this._wsConnect();
            return;
        }

        this._transport.closed.then(() => {
            this._connectionStatus$.next(false);
        });

        this._wtSubscription = this._ping();
        this._wtSubscription.add(this._pong());

        this._readDatagrams();
    }

    /**
     * Read datagrams
     *
     * @private
     */
    private async _readDatagrams() {
        try {
            const reader = this._transport.datagrams.readable.getReader();
            while (true) {
                const { value, done } = await reader.read();
                if (done) {
                    return;
                }
                this.next(decoder(value));
            }
        } catch (e) {
            throw e;
        }
    }

    /**
     * Clear WebTransport
     *
     * @private
     */
    private _clearTransport(): void {
        if (this._transport) {
            this._transport = undefined;
        }

        if (this._transportDatagramWriter) {
            this._transportDatagramWriter = undefined;
        }

        if (this._wtSubscription) {
            this._wtSubscription.unsubscribe();
            this._wtSubscription = undefined;
        }
    }
}
