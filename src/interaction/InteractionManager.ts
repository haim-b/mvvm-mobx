import { InteractionRequest } from './InteractionRequest';

export interface InteractionManager {
    requestInteraction(interactionRequest: InteractionRequest): Promise<string | void>;
}

export const InteractionManager = Symbol('InteractionManager');
