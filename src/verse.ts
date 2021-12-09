import { Observable, fromEvent as rxFromEvent, Subscription } from 'rxjs';
import { FromEventTarget } from 'rxjs/internal/observable/fromEvent';
import { filter, map } from 'rxjs/operators';
import { WebSocketSubject } from 'rxjs/webSocket';
import { WebSocketMessage } from './type';

export default class Verse {
    public verseId: string;
    private socket$: WebSocketSubject<WebSocketMessage> | undefined;

    constructor(
        verseId: string,
        socket$: WebSocketSubject<WebSocketMessage> | undefined
    ) {
        this.verseId = verseId;
        this.socket$ = socket$;
    }

    /**
     * handle events given from the server
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
                    message.verseId === this.verseId &&
                    message.event &&
                    message.event === event &&
                    message.data
                );
            }),
            map(_ => _.data)
        );
    }

    /**
     * converting events to observable sequences
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
     * binding event sources to the server
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
     * function for sending data to the server
     *
     * @param event name of the event
     * @param data request data
     */
    publish<T>(event: string, data: T) {
        if (this.socket$) {
            this.socket$.next({ event, data, verseId: this.verseId });
        }
    }
}
