/**
 * A BroadcastChannel stand-in for tests (src/test/setup.ts removes Node's).
 * Like the real one: a message reaches every OTHER channel of the same name,
 * asynchronously, never its sender.
 */
type Listener = (event: MessageEvent) => void;

const hub = new Map<string, Set<FakeBroadcastChannel>>();

export class FakeBroadcastChannel {
  readonly name: string;
  private listeners = new Set<Listener>();
  onmessage: Listener | null = null;

  constructor(name: string) {
    this.name = name;
    if (!hub.has(name)) hub.set(name, new Set());
    hub.get(name)!.add(this);
  }

  postMessage(data: unknown): void {
    for (const other of hub.get(this.name) ?? []) {
      if (other === this) continue;
      setTimeout(() => other.deliver(data), 0);
    }
  }

  addEventListener(_type: 'message', listener: Listener): void {
    this.listeners.add(listener);
  }

  removeEventListener(_type: 'message', listener: Listener): void {
    this.listeners.delete(listener);
  }

  close(): void {
    hub.get(this.name)?.delete(this);
  }

  private deliver(data: unknown): void {
    const event = { data } as MessageEvent;
    this.onmessage?.(event);
    for (const l of this.listeners) l(event);
  }
}

/** Forget every channel (between tests). */
export function resetFakeBroadcastChannels(): void {
  hub.clear();
}
