import { RelayCommand } from './RelayCommand';

export function bindCommand<T>(command: RelayCommand<T>, parameter: any = null, config?: { disabledPropName?: string, loadingPropName?: string }) {
    if (!command) {
        return null;
    }

    const isDisabled = !command.canExecute(parameter);
    const disabledPropName = config?.disabledPropName || 'disabled';
    const loadingPropName = config?.loadingPropName || 'loading';

    return {
        onClick: () => command.execute(parameter),
        [disabledPropName]: isDisabled,
        [loadingPropName]: command.workingFlag.isActive,
    };
}
