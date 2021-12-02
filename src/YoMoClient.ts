import { interval, Observable, Subject, Subscription } from 'rxjs';
import { distinctUntilChanged, filter, takeWhile } from 'rxjs/operators';
import { WebSocketSubject } from 'rxjs/webSocket';
import Go from './WasmExec';

type WebSocketMessage = {
    event: string;
    data: string | object;
};

interface YoMoClientOption {
    // The reconnection interval value.
    reconnectInterval?: number;
    // The reconnection attempts value.
    reconnectAttempts?: number;
}

export default class YoMoClient<T> extends Subject<T> {
    private socket$: WebSocketSubject<WebSocketMessage> | undefined;
    private socketSubscription: Subscription | undefined;

    // Reconnection stream
    private reconnectionObservable: Observable<number> | undefined;
    private reconnectionSubscription: Subscription | undefined;
    private reconnectInterval: number;
    private readonly reconnectAttempts: number;

    private connectionStatus$: Subject<boolean>;

    private wasmLoaded: boolean;

    constructor(url: string, option: YoMoClientOption) {
        if (!isWSProtocol(getProtocol(url))) {
            throw new Error(
                `${url} -> The URL's scheme must be either 'ws' or 'wss'`
            );
        }

        super();

        this.reconnectInterval = option.reconnectInterval || 5000;
        this.reconnectAttempts = option.reconnectAttempts || 5;
        this.connectionStatus$ = new Subject<boolean>();
        this.connectionStatus$.subscribe({
            next: isConnected => {
                if (
                    !this.reconnectionObservable &&
                    typeof isConnected === 'boolean' &&
                    !isConnected
                ) {
                    this.reconnect(url, option);
                }
            },
        });

        this.wasmLoaded = false;

        this.connect(url, option);
    }

    /**
     * return connection status observable
     *
     * @return {Observable<boolean>}
     */
    connectionStatus(): Observable<boolean> {
        return this.connectionStatus$.pipe(distinctUntilChanged());
    }

    /**
     * function that handle events given from the server
     *
     * @param event name of the event
     * @param cb is the function executed if event matches the response from the server
     */
    on(event: string | 'close', cb: (data?: any) => void): void {
        this.pipe(
            filter((message: any): boolean => {
                return (
                    message.event &&
                    message.event !== 'close' &&
                    message.event === event &&
                    message.data
                );
            })
        ).subscribe({
            next: (message: WebSocketMessage): void => cb(message.data),
            error: () => undefined,
            complete: (): void => {
                event === 'close' && cb();
            },
        });
    }

    /**
     * function for sending data to the server
     *
     * @param event name of the event
     * @param data request data
     */
    emit(event: string, data: object | string): void {
        this.socket$ && this.socket$.next({ event, data });
    }

    /**
     * Close subscriptions, clean up.
     */
    close(): void {
        this.clearSocket();
    }

    /**
     * connect.
     *
     * @param url - the url of the socket server to connect to
     * @param {YoMoClientOption} option - connect-related configuration
     *
     * @private
     */
    private async connect(url: string, option: YoMoClientOption) {
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
            url,
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
            next: (msg: any) => {
                this.next(msg);
            },
            error: () => {
                if (!this.socket$) {
                    this.clearReconnection();
                    this.reconnect(url, option);
                }
            },
        });
    }

    /**
     * reconnect.
     *
     * @param url - the url of the socket server to connect to
     * @param {YoMoClientOption} option - reconnection-related configuration
     *
     * @private
     */
    private reconnect(url: string, option: YoMoClientOption): void {
        this.reconnectionObservable = interval(this.reconnectInterval).pipe(
            takeWhile(
                (_, index) => index < this.reconnectAttempts && !this.socket$
            )
        );

        this.reconnectionSubscription = this.reconnectionObservable.subscribe({
            next: () => this.connect(url, option),
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
     * clear socket.
     *
     * @private
     */
    private clearSocket(): void {
        this.socketSubscription && this.socketSubscription.unsubscribe();
        this.socket$ = undefined;
    }

    /**
     * clear reconnect.
     *
     * @private
     */
    private clearReconnection(): void {
        this.reconnectionSubscription &&
            this.reconnectionSubscription.unsubscribe();
        this.reconnectionObservable = undefined;
    }
}

/**
 * check if the URL scheme is 'ws' or 'wss'
 *
 * @param protocol - URL's scheme
 */
function isWSProtocol(protocol: string): boolean {
    return protocol === 'ws' || protocol === 'wss';
}

/**
 * get URL's scheme
 *
 * @param url - the url of the socket server to connect to
 */
function getProtocol(url: string) {
    if (!url) {
        return '';
    }

    return url.split(':')[0];
}

/**
 * @param {RequestInfo} path wasm file path
 */
async function loadWasm(path: RequestInfo): Promise<void> {
    // This is a polyfill for FireFox and Safari
    if (!WebAssembly.instantiateStreaming) {
        WebAssembly.instantiateStreaming = async (resp, importObject) => {
            const source = await (await resp).arrayBuffer();
            return await WebAssembly.instantiate(source, importObject);
        };
    }

    const go = new Go();

    go.importObject.env['syscall/js.finalizeRef'] = () => {};

    try {
        const result = await WebAssembly.instantiateStreaming(
            fetch(path),
            go.importObject
        );

        go.run(result.instance);
    } catch (error) {
        return Promise.reject(error);
    }
}
