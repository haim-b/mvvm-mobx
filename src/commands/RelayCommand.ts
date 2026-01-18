import { action, makeObservable } from 'mobx';
import { CounterFlag } from '../core/CounterFlag';
import { Command } from './Command';

export class RelayCommand<T = void> implements Command<T> {

    readonly workingFlag = new CounterFlag();

    constructor(
        private readonly executeFunc: (parameter: T) => Promise<void> | void,
        private readonly canExecuteFunc?: (parameter: T) => boolean
    ) {
        makeObservable(this);
    }

    canExecute(parameter: T): boolean {
        return this.canExecuteFunc?.(parameter) ?? true;
    }

    @action async execute(parameter: T): Promise<void> {
        await this.workingFlag.using(async () => {
            await this.executeFunc(parameter);
        });
    }
}
