import { InteractionResponse } from "./InteractionResponse";

/** Contains predefined common responses and their ID. */
export class CommonInteractionResponses {
    static readonly ok = { id: 'ok', response: new InteractionResponse('ok', 'OK') };
    static readonly cancel = { id: 'cancel', response: new InteractionResponse('cancel', 'Cancel') };
    static readonly close = { id: 'close', response: new InteractionResponse('close', 'Close') };
    static readonly yes = { id: 'yes', response: new InteractionResponse('yes', 'Yes') };
    static readonly no = { id: 'no', response: new InteractionResponse('no', 'No') };
}
