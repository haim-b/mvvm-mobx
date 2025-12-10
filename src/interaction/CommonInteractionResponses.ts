import { InteractionResponse } from "./InteractionResponse";

/** Contains predefined common responses and their ID. */
export class CommonInteractionResponses {
    static readonly ok = { id: 'ok', action: new InteractionResponse('ok', 'OK') };
    static readonly cancel = { id: 'cancel', action: new InteractionResponse('cancel', 'Cancel') };
    static readonly close = { id: 'close', action: new InteractionResponse('close', 'Close') };
    static readonly yes = { id: 'yes', action: new InteractionResponse('yes', 'Yes') };
    static readonly no = { id: 'no', action: new InteractionResponse('no', 'No') };
}
