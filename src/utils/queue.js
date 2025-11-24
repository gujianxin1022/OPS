/**
 * 一个简单的异步队列
 */
export class Queue {
    constructor() {
        this.queue = [];
        this.running = false;
    }

    enqueue(asyncFunction) {
        this.queue.push(asyncFunction);
        if (!this.running) {
            this.run();
        }
    }

    async run() {
        this.running = true;
        while (this.queue.length > 0) {
            const asyncFunction = this.queue.shift();
            await asyncFunction();
        }
        this.running = false;
    }
}
