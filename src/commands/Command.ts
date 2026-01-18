import { CounterFlag } from "../core";

export interface Command<T = void> {
    canExecute(parameter: T): boolean;
    execute(parameter: T): void;
    workingFlag?: CounterFlag;
}