import fetch from 'node-fetch';
import { YoMoClient } from '../src';

type MessageContent = {
    id: string;
    x: number;
    y: number;
    name?: string;
    avatar?: string;
};

// @ts-ignore
globalThis.fetch = fetch;

describe('YoMoClient', () => {
    const ID = 'TestID';

    it('Testing yomoclient.connectionStatus, yomoClient.emit and yomoClient.on', async () => {
        const socketURL = 'wss://ws-dev.yomo.run';
        const yomoclient = new YoMoClient<MessageContent>(`${socketURL}`, {
            reconnectInterval: 5000,
            reconnectAttempts: 3,
        });

        let isConnected = false;
        let onlineData: any;

        yomoclient.connectionStatus().subscribe((_isConnected: boolean) => {
            isConnected = _isConnected;
        });

        await new Promise(resolve => {
            setTimeout(resolve, 1000);
        });

        yomoclient.on('online', data => {
            onlineData = data;
        });

        yomoclient.emit('online', {
            id: ID,
            x: 10,
            y: 30,
        });

        await new Promise(resolve => {
            setTimeout(resolve, 500);
        });

        expect(isConnected).toBe(true);

        expect(onlineData).toEqual({
            id: ID,
            x: 10,
            y: 30,
        });
    });

    it('Testing connection status', async () => {
        const socketURL = 'wss://ws-dev.run';
        const yomoclient = new YoMoClient<MessageContent>(`${socketURL}`, {
            reconnectInterval: 5000,
            reconnectAttempts: 3,
        });

        let isConnected = true;

        yomoclient.connectionStatus().subscribe((_isConnected: boolean) => {
            isConnected = _isConnected;
        });

        await new Promise(resolve => {
            setTimeout(resolve, 1500);
        });

        expect(isConnected).toBe(false);
    });
});
