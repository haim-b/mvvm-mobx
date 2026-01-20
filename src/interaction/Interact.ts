import { InteractionResponse } from "./InteractionResponse";
import { InteractionManager } from "./InteractionManager";
import { Command } from "../commands/Command";
import { ReportInteractionOperationFinished } from "./ReportInteractionOperationFinished";
import { CommonInteractionResponses } from "./CommonInteractionResponses";
import { RelayCommand } from "../commands";

/** A syntactic-sugar util for working with interactions. */
export class Interact {
    /**
     * Interact with the user with default OK and Cancel responses.
     * @param interactionManager In interaction manager to use.
     * @param title The title of the interaction.
     * @param content The content of the interaction.
     * @returns true if @constant CommonInteractionResponses.Ok.id was selected, or false if @constant CommonInteractionResponses.Cancel.id was selected.
     */
    static async withOkCancel(interactionManager: InteractionManager, title: string | any, content: string | any) {
        return await this.withCustomAndCancel(interactionManager, title, content, CommonInteractionResponses.ok.response);
    }

    /**
     * Interact with the user with a default OK action.
     * @param interactionManager In interaction manager to use.
     * @param title The title of the interaction.
     * @param content The content of the interaction.
     * @returns Should always return true.
     */
    static async withOk(interactionManager: InteractionManager, title: string | any, content: string | any) {
        return (await interactionManager.requestInteraction({
            title,
            content,
            responses: [CommonInteractionResponses.ok.response],
            defaultActionId: CommonInteractionResponses.ok.id,
        })) === CommonInteractionResponses.ok.id;
    }

    /**
     * Interact with the user with default OK and Cancel responses, and a command to execute when the OK action is activated.
     * @param interactionManager In interaction manager to use.
     * @param title The title of the interaction.
     * @param content The content of the interaction.
     * @param okCommand The comment to execute when the OK action is selected.
     * @returns true if @constant CommonInteractionResponses.Ok.id was selected, or false if @constant CommonInteractionResponses.Cancel.id was selected.
     */
    static async withOkCommand(interactionManager: InteractionManager, title: string | any, content: ReportInteractionOperationFinished,
        okCommand: Command) {

        return await this.withCustomAndCancel(interactionManager, title, content,
            new InteractionResponse(CommonInteractionResponses.ok.id, CommonInteractionResponses.ok.response.title, okCommand));
    }

    /**
     * Interact with the user with default Yes and No responses.
     * @param interactionManager In interaction manager to use.
     * @param title The title of the interaction.
     * @param content The content of the interaction.
     * @returns true if @constant CommonInteractionResponses.Yes.id was selected, or false if @constant CommonInteractionResponses.No.id was selected.
     */
    static async withYesNo(interactionManager: InteractionManager, title: string | any, content: string | any) {
        return (await interactionManager.requestInteraction({
            title,
            content,
            responses: [CommonInteractionResponses.yes.response, CommonInteractionResponses.no.response],
            defaultActionId: CommonInteractionResponses.yes.id,
            cancelActionId: CommonInteractionResponses.no.id,
        })) === CommonInteractionResponses.yes.id;
    }

    /**
     * Interact with the user with a custom action and Cancel action.
     * @param interactionManager In interaction manager to use.
     * @param title The title of the interaction.
     * @param content The content of the interaction.
     * @param action The custom action that's treated as main action.
     * @returns true if @constant CommonInteractionResponses.Ok.id was selected, or false if @constant CommonInteractionResponses.Cancel.id was selected.
     */
    static async withCustomAndCancel(interactionManager: InteractionManager, title: string | any, content: string | any, action: InteractionResponse) {
        if (action.command && !('onOperationFinished' in content)) {
            throw Error('Missing onOperationFinished property on the content when using command in responses. Do not forget a default assignment to undefined.');
        }

        // Adding the Cancel response as a command will allow up to get a beter UX by disabling it while the custom action is executing.
        // But it can be achieved only if the main action is a command and the content supports reporting operation finished (otherwise we won't know how to manually execute the cancellation response).
        const addCancelAsCommand = action.command && ('onOperationFinished' in content);

        return (await interactionManager.requestInteraction({
            title,
            content,
            responses: [
                action,
                addCancelAsCommand ?
                    new InteractionResponse(CommonInteractionResponses.cancel.id, CommonInteractionResponses.cancel.response.title,
                        // A Cancel action that becomes disabled when the OK command (if exists) is active:
                        new RelayCommand(() => content?.onOperationFinished?.call(CommonInteractionResponses.cancel.id), () => action.command?.workingFlag?.isActive !== true))
                    : CommonInteractionResponses.cancel.response,
            ],
            defaultActionId: action.id,
            cancelActionId: CommonInteractionResponses.cancel.id,
        })) === action.id;
    }

}
