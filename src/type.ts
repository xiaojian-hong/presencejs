export type WebSocketMessage = {
    verseId: string;
    event: string;
    data: any;
};

export interface YoMoClientOption {
    // The reconnection interval value.
    reconnectInterval?: number;
    // The reconnection attempts value.
    reconnectAttempts?: number;
}
