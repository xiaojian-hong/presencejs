import { enableFetchMocks } from 'jest-fetch-mock';
import { readFileSync } from 'fs';
import { YoMoClient } from '../src';

const uuidv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        let r = (Math.random() * 16) | 0,
            v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};

type MessageContent = {
    id: string;
    x: number;
    y: number;
    name?: string;
    avatar?: string;
};

describe('YoMoClient', () => {
    const ID = uuidv4();

    beforeAll(async () => {
        enableFetchMocks();
        const file = readFileSync(process.cwd() + '/wasm/y3.wasm');
        (fetch as any).mockResponse(async (request: any) => {
            if (request.url.endsWith('y3.wasm')) {
                return {
                    status: 200,
                    body: file,
                };
            } else {
                return {
                    status: 404,
                    body: 'Not Found',
                };
            }
        });
    });

    it('Testing yomoclient.connectionStatus, yomoClient.emit and yomoClient.on', async () => {
        const socketURL = 'wss://ws-dev.yomo.run';
        const yomoclient = new YoMoClient<MessageContent>(
            `${socketURL}?clientId=${ID}`,
            {
                reconnectInterval: 5000,
                reconnectAttempts: 3,
            }
        );

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
        const yomoclient = new YoMoClient<MessageContent>(
            `${socketURL}?clientId=${ID}`,
            {
                reconnectInterval: 5000,
                reconnectAttempts: 3,
            }
        );

        let isConnected = true;

        yomoclient.connectionStatus().subscribe((_isConnected: boolean) => {
            isConnected = _isConnected;
        });

        await new Promise(resolve => {
            setTimeout(resolve, 1000);
        });

        expect(isConnected).toBe(false);
    });
});
