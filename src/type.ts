export type WebSocketMessage = {
    verseId: string;
    event: string;
    data: string | object;
};

export interface YoMoClientOption {
    // The reconnection interval value.
    reconnectInterval?: number;
    // The reconnection attempts value.
    reconnectAttempts?: number;
}
