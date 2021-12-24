import { interval, Observable, Subject, Subscription } from 'rxjs';
import { distinctUntilChanged, filter, takeWhile } from 'rxjs/operators';
import { WebSocketSubject } from 'rxjs/webSocket';
import {
    getProtocol,
    isWSProtocol,
    updateQueryStringParameter,
    loadWasm,
} from './helper';
import Room from './room';
import { WebSocketMessage, YoMoClientOption } from './type';

export default class YoMoClient extends Subject<WebSocketMessage> {
    private url: string;

    private socket$: WebSocketSubject<WebSocketMessage> | undefined;
    private socketSubscription: Subscription | undefined;

    // Reconnection stream
    private reconnectionObservable: Observable<number> | undefined;
    private reconnectionSubscription: Subscription | undefined;
    private reconnectInterval: number;
    private reconnectAttempts: number;

    private connectionStatus$: Subject<boolean>;

    private roomMap: Map<string, Room>;

    private wasmLoaded: boolean;

    private heartTimer: Subscription | undefined;

    constructor(url: string, option?: YoMoClientOption) {
        if (!isWSProtocol(getProtocol(url))) {
            throw new Error(
                `${url} -> The URL's scheme must be either 'ws' or 'wss'`
            );
        }

        super();

        this.url =
            option?.auth?.type === 'publickey'
                ? updateQueryStringParameter(
                      url,
                      'public_key',
                      option.auth.publicKey
                  )
                : url;

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
                    this.reconnect();
                }
            },
        });

        this.roomMap = new Map<string, Room>();

        this.wasmLoaded = false;

        this.connect();

        this.heartTimer = interval(30000).subscribe(_ => {
            if (this.socket$) {
                this.socket$.next({ event: 'HEARTBEAT', data: 1 });
            }
        });
    }

    /**
     * Get a room
     *
     * @param id room id
     *
     * @return {Room}
     */
    getRoom(id: string): Room {
        const room = this.roomMap.get(id);
        if (room) {
            return room;
        }

        return this.createRoom(id);
    }

    /**
     * Function that handles 'connected' and 'closed' events
     *
     * @param event name of the event
     * @param cb is the function executed when the events 'connected' and 'closed' occur
     *
     * @private
     */
    on(event: 'connected' | 'closed', cb: () => void): void {
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
            .subscribe(() => {
                cb && cb();
            });
    }

    /**
     * Close subscriptions, clean up.
     */
    close(): void {
        if (this.heartTimer) {
            this.heartTimer.unsubscribe();
            this.heartTimer = undefined;
        }
        this.reconnectAttempts = 0;
        this.clearReconnection();
        this.clearSocket();
        this.connectionStatus$.next(false);
    }

    /**
     * Create a room
     *
     * @param id room id
     *
     * @return {Room}
     */
    private createRoom(id: string): Room {
        const room = new Room(id, this.socket$);
        this.roomMap.set(id, room);
        return room;
    }

    /**
     * Connect to YoMo
     *
     * @private
     */
    private async connect() {
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
            url: this.url,
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
                    this.clearSocket();
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
                    this.clearReconnection();
                    this.reconnect();
                }
            },
        });
    }

    /**
     * Reconnect.
     *
     * @private
     */
    private reconnect(): void {
        this.reconnectionObservable = interval(this.reconnectInterval).pipe(
            takeWhile(
                (_, index) => index < this.reconnectAttempts && !this.socket$
            )
        );

        this.reconnectionSubscription = this.reconnectionObservable.subscribe({
            next: () => this.connect(),
            error: () => undefined,
            complete: () => {
                this.clearReconnection();
                if (!this.socket$) {
                    this.complete();
                    this.connectionStatus$.complete();
                }
            },
        });
    }

    /**
     * Clear socket.
     *
     * @private
     */
    private clearSocket(): void {
        this.socket$?.complete();
        this.socketSubscription && this.socketSubscription.unsubscribe();
        this.socket$ = undefined;
    }

    /**
     * Clear reconnect.
     *
     * @private
     */
    private clearReconnection(): void {
        this.reconnectionSubscription &&
            this.reconnectionSubscription.unsubscribe();
        this.reconnectionObservable = undefined;
    }
}
