import { action, computed, makeObservable, observable, runInAction } from 'mobx';

export class CounterFlag {
    @observable private counter = 0;

    constructor() {
        makeObservable(this);
    }

    /**
     * Activates the flag while executing the provided function.
     * @param fn The function to execute while the flag is active.
     */
    @action public async using(fn: () => Promise<void>): Promise<void> {
        using _ = this.increment();
        await fn();
    }

    /**
     * Increments the counter and returns a disposable object that decreases the counter when disposed.
     * @returns A disposable object that decreases the counter when disposed.
     */
    @action public increment(): Disposable {
        this.counter++;
        return {
            [Symbol.dispose]: () => runInAction(() => this.counter--),
        };
    }

    @computed public get isActive(): boolean {
        return this.counter > 0;
    }
}
