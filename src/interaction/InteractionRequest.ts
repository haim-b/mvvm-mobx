import { InteractionResponse } from './InteractionResponse';

/** Represents a request object with info on how to interact with the user from the view model. */
export interface InteractionRequest {
    /** The title of the request. Can be a string, or a view model on VM-first approach. */
    title: string | any;

    /** The content of the request. Can be a string, or a view model on VM-first approach. */
    content: string | any;

    /** A list of possible actions for the user to choose from as a response for the interaction request. */
    responses?: InteractionResponse[];

    /** The ID of the action that is considered to be a cancellation of the flow. */
    cancelActionId?: string;

    /** The ID of the action that is the preferred action for the user. In many cases this action can be highlighted and even be activated with the Enter key. */
    defaultActionId?: string;
}
