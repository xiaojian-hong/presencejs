import { Observable, fromEvent as rxFromEvent } from 'rxjs';
import { FromEventTarget } from 'rxjs/internal/observable/fromEvent';
import { filter, map } from 'rxjs/operators';
import { WebSocketSubject } from 'rxjs/webSocket';
import { WebSocketMessage } from './type';

export default class Verse {
    verseId: string;
    private socket$: WebSocketSubject<WebSocketMessage> | undefined;

    constructor(
        verseId: string,
        socket$: WebSocketSubject<WebSocketMessage> | undefined
    ) {
        this.verseId = verseId;
        this.socket$ = socket$;
    }

    /**
     * converting events to observable sequences
     *
     * @param event name of the event
     * @param target point to the DOM object that triggered the event
     *
     * @return {Observable<T>}
     */
    fromEvent<T>(event: string, target?: FromEventTarget<T>): Observable<T> {
        if (target) {
            return rxFromEvent<T>(target, event);
        }

        if (this.socket$) {
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

        return new Observable<never>();
    }

    /**
     * function that handle events given from the server
     *
     * @param event name of the event
     * @param cb is the function executed if event matches the response from the server
     */
    on(event: string, cb: (data?: any) => void): void {
        if (this.socket$) {
            this.socket$
                .pipe(
                    filter((message: any): boolean => {
                        return (
                            message.verseId === this.verseId &&
                            message.event &&
                            message.event === event &&
                            message.data
                        );
                    })
                )
                .subscribe({
                    next: (message: WebSocketMessage): void => cb(message.data),
                    error: () => undefined,
                    complete: (): void => {},
                });
        }
    }

    /**
     * function for sending data to the server
     *
     * @param event name of the event
     * @param data request data
     */
    emit(event: string, data: object | string): void {
        if (this.socket$) {
            this.socket$.next({ event, data, verseId: this.verseId });
        }
    }
}
