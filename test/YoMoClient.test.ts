import fetch from 'node-fetch';
import { YoMoClient } from '../src';

// @ts-ignore
globalThis.fetch = fetch;

describe('YoMoClient', () => {
    const ID = 'TestID';

    it('Testing yomoclient.connectionStatus, yomoClient.emit and yomoClient.on', async () => {
        const socketURL = 'wss://ws-dev.yomo.run';
        const yomoclient = new YoMoClient(`${socketURL}`, {
            auth: {
                // Certification Type.
                // Optional values：'publickey' or 'token'.
                // 'token' is not yet supported.
                type: 'publickey',
                // The public key in your Allegro Mesh project.
                publicKey: '',
            },
        });

        let onlineData: any;

        yomoclient.on('connected', () => {
            const room = yomoclient.getRoom('001');

            room.fromServer('online').subscribe(data => {
                onlineData = data;
            });

            room.publish('online', {
                id: ID,
                x: 10,
                y: 30,
            });
        });

        await new Promise(resolve => {
            setTimeout(resolve, 2000);
        });

        expect(onlineData).toEqual({
            id: ID,
            x: 10,
            y: 30,
        });
    });
});
