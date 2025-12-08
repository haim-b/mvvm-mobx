export interface ReportInteractionOperationFinished {
    onOperationFinished: ((actionId: string) => void) | null;
}