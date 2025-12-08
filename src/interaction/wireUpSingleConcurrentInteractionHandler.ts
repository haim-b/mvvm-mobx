import { CommonInteractionResponses } from './CommonInteractionResponses';
import { InteractionResponse } from './InteractionResponse';
import { SingleConcurrentInteractionManager } from './SingleConcurrentInteractionManager';

const commonActionIds = [
    CommonInteractionResponses.ok.id,
    CommonInteractionResponses.cancel.id,
    CommonInteractionResponses.yes.id,
    CommonInteractionResponses.no.id,
    CommonInteractionResponses.close.id,
];

function containsNonCommonAction(actions?: InteractionResponse[]) {
    if (!actions) {
        return false;
    }

    return actions.some(action => !commonActionIds.includes(action.id));
}

export function wireUpSingleConcurrentInteractionHandler(interactionManager: SingleConcurrentInteractionManager) {
    const { interactionRequest } = interactionManager;

    if (!interactionRequest) {
        return null;
    }

    if (!(typeof interactionRequest.content === 'string') && 'onOperationFinished' in interactionRequest.content) {
        // Register a handler for the onOperationFinished event that will end the interaction:
        interactionRequest.content.onOperationFinished = (actionId: string) => interactionManager.respond(actionId);
    }

    const onModalKeyDown = (e: {key: string, stopPropagation: Function}) => {
        if (!interactionRequest.defaultActionId || !interactionRequest.responses || e.key !== 'Enter') {
            return;
        }

        const defaultAction = interactionRequest.responses.find(a => a.id === interactionRequest.defaultActionId);

        if (defaultAction?.command) {
            if (defaultAction.command.canExecute()) {
                defaultAction.command.execute();
            }
        } else if (defaultAction) {
            interactionManager.respond(interactionRequest.defaultActionId);
        }
        e.stopPropagation();
    };

    const nonCommonActionExists = containsNonCommonAction(interactionRequest.responses);
    const isCancelable = interactionRequest.responses?.some(a => a.id === interactionRequest.cancelActionId);

    return { isCancelable, nonCommonActionExists, onModalKeyDown };
}
