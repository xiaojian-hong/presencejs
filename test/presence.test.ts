import fetch from 'node-fetch';
import { Presence } from '../src';

// @ts-ignore
globalThis.fetch = fetch;

describe('Presence', () => {
    const ID = 'TestID';

    it('Testing', async () => {
        const socketURL = 'wss://x.yomo.dev/presence';
        const yomo = new Presence(`${socketURL}`, {
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

        yomo.on('connected', () => {
            yomo.toRoom('001');

            yomo.on$('online').subscribe(data => {
                onlineData = data;
            });

            yomo.send('online', {
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
