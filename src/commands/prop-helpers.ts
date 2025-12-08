import { RelayCommand } from './RelayCommand';

export function bindCommand<T>(command: RelayCommand<T>, parameter: any = null, disabledPropName = 'disabled') {
    if (!command) {
        return null;
    }

    const isDisabled = !command.canExecute(parameter);

    return {
        onClick: () => command.execute(parameter),
        [disabledPropName]: isDisabled,
    };
}
