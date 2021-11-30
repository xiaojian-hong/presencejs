import { Observable, Subject } from 'rxjs';
export declare type YoMoClientConnectionStatusObserver = Observable<boolean>;
export interface YoMoClientOption {
    reconnectInterval?: number;
    reconnectAttempts?: number;
}
export default class YoMoClient<T> extends Subject<T> {
    private socket$;
    private socketSubscription;
    private reconnectionObservable;
    private reconnectionSubscription;
    private reconnectInterval;
    private readonly reconnectAttempts;
    private connectionStatus$;
    private wasmLoaded;
    constructor(url: string, option: YoMoClientOption);
    /**
     * return connection status observable
     *
     * @return {YoMoClientConnectionStatusObserver}
     */
    connectionStatus(): YoMoClientConnectionStatusObserver;
    /**
     * function that handle events given from the server
     *
     * @param event name of the event
     * @param cb is the function executed if event matches the response from the server
     */
    on(event: string | 'close', cb: (data?: any) => void): void;
    /**
     * function for sending data to the server
     *
     * @param event name of the event
     * @param data request data
     */
    emit(event: string, data: object | string): void;
    /**
     * Close subscriptions, clean up.
     */
    close(): void;
    /**
     * connect.
     *
     * @param url - the url of the socket server to connect to
     * @param {YoMoClientOption} option - connect-related configuration
     *
     * @private
     */
    private connect;
    /**
     * reconnect.
     *
     * @param url - the url of the socket server to connect to
     * @param {YoMoClientOption} option - reconnection-related configuration
     *
     * @private
     */
    private reconnect;
    /**
     * clear socket.
     *
     * @private
     */
    private clearSocket;
    /**
     * clear reconnect.
     *
     * @private
     */
    private clearReconnection;
}
