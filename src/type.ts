export type WebSocketMessage = {
    roomId: string;
    event: string;
    data: any;
};

export interface YoMoClientOption {
    // Authentication
    auth?: {
        // Certification Type
        type: 'publickey' | 'token';
        // The public key in your Allegro Mesh project.
        publicKey: string;
    };
    // The reconnection interval value.
    reconnectInterval?: number;
    // The reconnection attempts value.
    reconnectAttempts?: number;
}
