import { InteractionResponse } from "./InteractionResponse";

/** Contains predefined common responses and their ID. */
export class CommonInteractionResponses {
    static get ok() { return { id: 'ok', action: new InteractionResponse('ok', 'OK') }; }
    static get cancel() { return { id: 'cancel', action: new InteractionResponse('cancel', 'Cancel') }; }
    static get close() { return { id: 'close', action: new InteractionResponse('close', 'Close') }; }
    static get yes() { return { id: 'yes', action: new InteractionResponse('yes', 'Yes') }; }
    static get no() { return { id: 'no', action: new InteractionResponse('no', 'No') }; }
}
