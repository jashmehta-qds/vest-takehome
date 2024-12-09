import BrotliPromise from 'brotli-dec-wasm';

export class WebSocketService {
  private ws: WebSocket | null = null;
  private pingInterval: number | null = null;
  private readonly PING_INTERVAL = 30000;
  private subscriptions: Set<string> = new Set();
  private decoder = new TextDecoder();

  public onKlineUpdate?: (data: [number, string, string, string, string]) => void;
  public onConnectionChange: ((status: boolean) => void) | null = null;
  private connected: boolean = false;

  constructor(private readonly isProduction: boolean = false) {}

  private getWSEndpoint(): string {
    const baseUrl = this.isProduction
      ? 'wss://wsprod.vest.exchange'
      : 'wss://devws.vest.exchange';
    return `${baseUrl}/ws-api?version=1.0&xwebsocketserver=restserver1`;
  }

  private async decompressMessage(data: Blob): Promise<string> {
    try {
      const arrayBuffer = await data.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const brotli = await BrotliPromise;
      // Check if the message is Brotli compressed
      // Brotli-compressed data typically starts with 0xCE
      if (uint8Array[0] === 0xCE) {
        const decompressed = brotli.decompress(uint8Array);
        return this.decoder.decode(decompressed);
      }
      return this.decoder.decode(uint8Array);
    } catch (error) {
      console.error('Error decompressing message:', error);
      throw error;
    }
  }

  public connect(): void {
    if (this.ws?.readyState === WebSocket.OPEN) return;

    this.ws = new WebSocket(this.getWSEndpoint());
    this.ws.binaryType = 'blob';

    this.ws.onopen = () => {
      console.log('WebSocket Connected');
      this.connected = true;
      this.onConnectionChange?.(true);
      this.startPing();
    };

    this.ws.onmessage = async (event) => {
      try {
        const decompressedData = await this.decompressMessage(event.data);
        const data = JSON.parse(decompressedData);
        this.handleMessage(data);
      } catch (error) {
        console.error('Error processing message:', error);
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    this.ws.onclose = () => {
      console.log('WebSocket Disconnected');
      this.connected = false;
      this.onConnectionChange?.(false);
      this.cleanup();
    };
  }

  private startPing(): void {
    this.pingInterval = window.setInterval(() => {
      this.sendMessage({
        method: 'PING',
        params: [],
        id: Date.now()
      });
    }, this.PING_INTERVAL);
  }

  private cleanup(): void {
    if (this.pingInterval) {
      window.clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
    this.subscriptions.clear();
  }

  public disconnect(): void {
    if (this.ws) {
      this.cleanup();
      this.ws.close();
      this.ws = null;
    }
  }

  private sendMessage(message: any): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  public subscribeToKlines(symbol: string, interval: string): void {
    console.log("subscribeToKlines", symbol, interval);
    const channel = `${symbol}@kline_${interval}`;
    if (this.subscriptions.has(channel)) return;
    console.log("channel", channel);

    if (this.ws?.readyState === WebSocket.OPEN) {
      this.sendSubscription(channel);
    } else {
      this.ws?.addEventListener('open', () => {
        this.sendSubscription(channel);
      }, { once: true });
    }
  }

  private sendSubscription(channel: string): void {
    this.sendMessage({
      method: "SUBSCRIBE",
      params: [channel],
      id: Date.now(),
    });
    this.subscriptions.add(channel);
  }

  private handleMessage(message: any): void {
    if (message.data === 'PONG') {
      return;
    }

    if (message.channel?.includes('@kline_')) {
      this.handleKlineUpdate(message.data);
    }
  }

  private handleKlineUpdate(data: [number, string, string, string, string]): void {
    if (this.onKlineUpdate) {
      this.onKlineUpdate(data);
    }
  }

  public isConnected(): boolean {
    return this.connected;
  }
}
