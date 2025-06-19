import { io, Socket } from "socket.io-client";

class HLBackendV1 {
    private static instances: { [key: string]: HLBackendV1 } = {};
    private socket: Socket;

    private constructor(namespace: string) {
        const defaultUrl = process.env.WEBSOCKET_URL;

        this.socket = io(`${defaultUrl}${namespace}`, {
            transports: ["websocket","pooling"],
        });
    }

    public static getInstance(namespace: string): HLBackendV1 {
        if (!HLBackendV1.instances[namespace]) {
            HLBackendV1.instances[namespace] = new HLBackendV1(namespace);
        }
        return HLBackendV1.instances[namespace];
    }

    public getSocket(): Socket {
        return this.socket;
    }
}

export default HLBackendV1;



