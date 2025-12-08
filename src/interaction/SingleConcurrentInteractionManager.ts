import { action, makeObservable, observable } from "mobx";
import { InteractionManager } from "./InteractionManager";
import { InteractionRequest } from "./InteractionRequest";

export class SingleConcurrentInteractionManager implements InteractionManager {
    @observable interactionRequest: InteractionRequest | null = { title: '', content: '' };
    private resolveFunc?: ((interactionResponse: string | void) => void);

    constructor() {
        makeObservable(this);
        this.interactionRequest = null;
    }

    @action requestInteraction(interactionRequest: InteractionRequest): Promise<string | void> {
        return new Promise<string | void>((resolve) => {
            this.interactionRequest = interactionRequest;
            this.resolveFunc = resolve;
        });
    }

    @action respond(interactionResponse?: string) {
        this.interactionRequest = null;
        this.resolveFunc!(interactionResponse);
        this.resolveFunc = undefined;
    }
}
