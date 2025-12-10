import { makeObservable, observable } from "mobx";
import { RelayCommand } from "../commands/RelayCommand";

/** Represents an action for the user to respond on an interaction request. */
export class InteractionResponse {
    /** The title of the response. */
    @observable accessor title: string = '';

    constructor(
        /** The ID of the response. */
        readonly id: string,

        /** The title of the response. */
        title: string,

        /** An optional command to invoke as the user responds. */
        readonly command?: RelayCommand<void>,

        /** An optional icon. */
        readonly icon?: string
    ) {
        this.title = title;
        makeObservable(this);
    }
}
