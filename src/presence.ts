import { interval, Observable, Subject, Subscription } from 'rxjs';
import { distinctUntilChanged, filter, map, takeWhile } from 'rxjs/operators';
import { WebSocketSubject } from 'rxjs/webSocket';
import {
    getProtocol,
    isWSProtocol,
    updateQueryStringParameter,
    loadWasm,
} from './helper';
import { WebSocketMessage, PresenceOption } from './type';

export default class Presence extends Subject<WebSocketMessage> {
    public host: string;

    private socket$: WebSocketSubject<WebSocketMessage> | undefined;
    private socketSubscription: Subscription | undefined;

    // Reconnection stream
    private reconnectionObservable: Observable<number> | undefined;
    private reconnectionSubscription: Subscription | undefined;
    private reconnectInterval: number;
    private reconnectAttempts: number;

    private connectionStatus$: Subject<boolean>;

    private wasmLoaded: boolean;

    private heartTimer: Subscription | undefined;

    constructor(host: string, option?: PresenceOption) {
        if (!isWSProtocol(getProtocol(host))) {
            throw new Error(
                `${host} -> The URL's scheme must be either 'ws' or 'wss'`
            );
        }

        super();

        this.host =
            option?.auth?.type === 'publickey'
                ? updateQueryStringParameter(
                      host,
                      'public_key',
                      option.auth.publicKey
                  )
                : host;

        this.reconnectInterval = option?.reconnectInterval
            ? option.reconnectInterval
            : 5000;

        this.reconnectAttempts = option?.reconnectAttempts
            ? option.reconnectAttempts
            : 3;

        this.connectionStatus$ = new Subject<boolean>();
        this.connectionStatus$.subscribe({
            next: isConnected => {
                if (
                    !this.reconnectionObservable &&
                    typeof isConnected === 'boolean' &&
                    !isConnected
                ) {
                    this._reconnect();
                }
            },
        });

        this.wasmLoaded = false;

        this._connect();

        this.heartTimer = interval(30000).subscribe(_ => {
            if (this.socket$) {
                this.socket$.next({ event: 'HEARTBEAT', data: 1 });
            }
        });
    }

    /**
     * Function to handle response for given event from server
     *
     * @param event name of the event
     * @param cb is the function executed when the events 'connected' and 'closed' occur
     *
     * @private
     */
    on<T>(event: string, cb: (data: T) => void): void {
        if (event === 'connected' || event === 'closed') {
            this.connectionStatus$
                .pipe(
                    distinctUntilChanged(),
                    filter(isConnected => {
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
                next: (message: WebSocketMessage): void => cb(message.data),
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
            map(_ => _.data)
        );
    }

    /**
     * Function for sending data to the server
     *
     * @param event name of the event
     * @param data
     */
    send<T>(event: string, data: T) {
        if (this.socket$) {
            this.socket$.next({ event, data });
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
     * Close subscriptions, clean up
     */
    close(): void {
        if (this.heartTimer) {
            this.heartTimer.unsubscribe();
            this.heartTimer = undefined;
        }
        this.reconnectAttempts = 0;
        this._clearReconnection();
        this._clearSocket();
        this.connectionStatus$.next(false);
    }

    /**
     * Connect to YoMo
     *
     * @private
     */
    private async _connect() {
        if (!this.wasmLoaded) {
            try {
                await loadWasm('https://d1lxb757x1h2rw.cloudfront.net/y3.wasm');
                this.wasmLoaded = true;
            } catch (error) {
                throw error;
            }
        }

        const tag = 0x11;

        const serializer = (data: any) => {
            return (window as any).encode(tag, data).buffer;
        };

        const deserializer = (event: MessageEvent) => {
            const uint8buf = new Uint8Array(event.data);
            return (window as any).decode(tag, uint8buf);
        };

        this.socket$ = new WebSocketSubject({
            url: this.host,
            serializer,
            deserializer,
            binaryType: 'arraybuffer',
            openObserver: {
                next: () => {
                    this.connectionStatus$.next(true);
                },
            },
            closeObserver: {
                next: () => {
                    this._clearSocket();
                    this.connectionStatus$.next(false);
                },
            },
        });

        this.socketSubscription = this.socket$.subscribe({
            next: msg => {
                this.next(msg);
            },
            error: () => {
                if (!this.socket$) {
                    this._clearReconnection();
                    this._reconnect();
                }
            },
        });
    }

    /**
     * Reconnect
     *
     * @private
     */
    private _reconnect(): void {
        this.reconnectionObservable = interval(this.reconnectInterval).pipe(
            takeWhile(
                (_, index) => index < this.reconnectAttempts && !this.socket$
            )
        );

        this.reconnectionSubscription = this.reconnectionObservable.subscribe({
            next: () => this._connect(),
            error: () => undefined,
            complete: () => {
                this._clearReconnection();
                if (!this.socket$) {
                    this.complete();
                    this.connectionStatus$.complete();
                }
            },
        });
    }

    /**
     * Clear socket
     *
     * @private
     */
    private _clearSocket(): void {
        this.socket$?.complete();
        this.socketSubscription && this.socketSubscription.unsubscribe();
        this.socket$ = undefined;
    }

    /**
     * Clear reconnect
     *
     * @private
     */
    private _clearReconnection(): void {
        this.reconnectionSubscription &&
            this.reconnectionSubscription.unsubscribe();
        this.reconnectionObservable = undefined;
    }
}
