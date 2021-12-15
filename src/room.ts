import { Observable, Subscription, fromEvent as rxFromEvent } from 'rxjs';
import { FromEventTarget } from 'rxjs/internal/observable/fromEvent';
import { filter, map } from 'rxjs/operators';
import { WebSocketSubject } from 'rxjs/webSocket';
import { WebSocketMessage } from './type';

export default class Room {
    public id: string;
    private socket$: WebSocketSubject<WebSocketMessage> | undefined;

    constructor(
        id: string,
        socket$: WebSocketSubject<WebSocketMessage> | undefined
    ) {
        this.id = id;
        this.socket$ = socket$;
    }

    /**
     *  Handle event from the server.
     *
     * @param event name of the event
     *
     * @return {Observable<T>}
     */
    fromServer<T>(event: string): Observable<T> {
        if (!this.socket$) {
            return new Observable<never>();
        }

        return this.socket$.pipe(
            filter((message: any): boolean => {
                return (
                    message.roomId === this.id &&
                    message.event &&
                    message.event === event &&
                    message.data
                );
            }),
            map(_ => _.data)
        );
    }

    /**
     * Converting browser events into observable sequences.
     *
     * @param target point to the DOM object that triggered the event
     * @param event name of the event
     *
     * @return {Observable<T>}
     */
    fromEvent<T>(target: FromEventTarget<T>, event: string): Observable<T> {
        return rxFromEvent<T>(target, event);
    }

    /**
     * Bind the event source to YoMo's service, which will automatically push the data frame.
     *
     * @param source event sources
     * @param event name of the event
     *
     * @return {Subscription}
     */
    bindServer<T>(source: Observable<T>, event: string): Subscription {
        return source.subscribe(data => {
            this.publish(event, data);
        });
    }

    /**
     * Push data frames immediately.
     *
     * @param event name of the event
     * @param data request data
     */
    publish<T>(event: string, data: T) {
        if (this.socket$) {
            this.socket$.next({ event, data, roomId: this.id });
        }
    }
}
