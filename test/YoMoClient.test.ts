import fetch from 'node-fetch';
import { YoMoClient } from '../src';

// @ts-ignore
globalThis.fetch = fetch;

describe('YoMoClient', () => {
    const ID = 'TestID';

    it('Testing yomoclient.connectionStatus, yomoClient.emit and yomoClient.on', async () => {
        const socketURL = 'wss://ws-dev.yomo.run';
        const yomoclient = new YoMoClient(`${socketURL}`, {
            reconnectInterval: 5000,
            reconnectAttempts: 3,
        });

        let isConnected = false;
        let onlineData: any;

        yomoclient.on('connected', () => {
            isConnected = true

            const verse = yomoclient.getVerse('001');

            verse.fromServer('online').subscribe(data => {
                onlineData = data;
            });
    
            verse.publish('online', {
                id: ID,
                x: 10,
                y: 30,
            });
        });
        
        await new Promise(resolve => {
            setTimeout(resolve, 2000);
        });

        expect(isConnected).toBe(true);

        expect(onlineData).toEqual({
            id: ID,
            x: 10,
            y: 30,
        });
    });
});
