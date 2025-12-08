# MVVM MobX

This package contains classes and utils for working with MVVM over MobX.
It adheres to the concepts of Prism.

## CounterFlag

A flag that bases it true/false value on an active counter.
It has an internal counter that increases when an operation is starting and decreases when an operation is ending.
When the counter is 0, the flag is marked as inactive (`flag.isActive === false`). When the counter is greater than 0 then the flag is marked as active.

Operations are bounded with the `using` method. When this method starts it means that an operation has started and the counter increases. When this method ends it means that that operation has ended and the counter decreases.
You can call `using` many times simultaneously.

An example on how to use it:

```typescript
const flag = new CounterFlag();

await flag.using(async () => {
    // At this point the counter has been increased and the flag is active.
    
    await runSomeWork(); // Inside runSomeWork you can also call flag.using
});

// At this point the counter has been decreased and the flag is inactive.
```

## RelayCommand

Implements the [Command pattern](https://onewindowsdev.com/2016/06/16/the-command-pattern-and-mvvm/) by relaying the actual work to external functions that are provided in the constructor.
In Prism it was called DelegateCommand. This name was not used here because in JS the term "delegate" is not known.

You pass an execution method in the constructor (and possibly another method to check if an execution is allowed).
The UI should bind to the command (can use the helper `commandProps` function) and act appropriately.
`RelayCommand` works with MobX, so the `canExecute` method is observable is the function that is passed to the constructor is also observable.
Observable functions don't have to be decorated with `@computed` in order to work. See more info: https://mobx.js.org/computeds-with-args.html#1-derivations-dont-_need_-to-be-computed

Using a relay command:

```typescript
const saveProjectCommand = new RelayCommand(this.saveProject, this.canSaveProject);

private function async saveProject() {
    // save project
}

private function canSaveProject() {
    return this.isProjectValid;
}
```

The command can support 1 parameter:

```typescript
const deleteProjectCommand = new DelegateCommand<string>(this.deleteProject, this.canDeleteProject);

private function async deleteProject(projectId: string) {
    // save project
}

private function canDeleteProject(projectId: string) {
    return !this.isReadOnly;
}
```


In the UI you can bind buttons to the commands:

```jsx
<Button {...bindCommand(vm.saveProjectCommand)}>
    Save Project
</Button>

{vm.projects.map(project =>
    observer(
    <div>
        {project.name}
        <Button {...bindCommand(vm.deleteProjectCommand, project.id)}>
            Delete Project
        </Button>
    </div>)
)}
```

What it does in the "Save Project" button is equivalent to:

```jsx
<Button
    onClick={() => vm.saveProjectCommand.execute()}
    disabled={!vm.saveProjectCommand.canExecute()}>

    Save Project
</Button>
```

The command has an indication while it's working (`command.workingFlag.isActive`)

## Interaction

Many times we need to communicate with the user and wait for his response. This is called **interaction**.
Common scenarios:
* The user wants to perform in irreversible action and we want to confirm that he's sure.
* The user wants to perform an action that has implications and we want to confirm.
* Presenting error messages.

Since according to MVVM all the above is done and decided by the business logic, it should reside in the view model.

So how do we interact with the user from the VM through the view, in the middle of a business logic flow?

This is why we have the Interaction Manager. We can create an `InteractionRequest` object and request an interaction from the user:

```typescript
const interactionObject: InteractionRequest = {
            title: 'Confirmation',
            content: 'Are you sure you want to delete?',
            actions: [
                CommonInteractionActions.yes.action
                CommonInteractionActions.no.action
                ]
        };
 
 if (await interactionManager.requestInteraction(interactionObject)) === CommonInteractionActions.yes.id) {
    deleteItem();
 }
```

---
**Note**

In the above example, you can use the shorthand:
```typescript
if (await Interact.withYesNo(interactionManager, 'Confirmation', 'Are you sure you want to delete?')) {
    deleteItem();
 }
```
In many cases you need some action with cancellation (like "Delete" and "Cancel" buttons).
You can use the shorthand:
```typescript
const deleteAction = new InteractionAction('delete', 'Delete');

// Show interaction view with "Delete" and "Cancel" buttons:
if (await Interact.withCustomAndCancel(interactionManager, 'Confirmation', 'Are you sure you want to delete?', deleteAction)) {
    deleteItem();
 }
```

---

The interaction object has title, content, and actions for the user to respond on the request.

We create this object as pass it to the manager.
In the View layer, there should be a component that listens to this manager and when interaction is requested, it should present it to the user, and pass the user's response back to the manager.

The view is responsible to present the interaction in a manner which it finds suitable. It can be a modal, a toast notification and so on.

Once the user chooses the response, the promise of the `requestInteraction` method should be finished.

### Finishing the interaction through code
If you implement the `ReportInteractionOperationFinished` interface, you can finish the interaction through code by calling the interface's `onOperationFinished` function.

This package includes a pre-implemented `SingleConcurrentInteractionManager` interaction manager for handling one interaction request at a time. When using modals, this should fit most of the use cases.

To implement the View side, there's also a `useSingleConcurrentInteractionHandler` hook that take case of most of the logic.

## PaneViewModelBase

Intended for view models that represent a pane in the app that handles data and actions.

When performing long actions (like setting/getting data from the server), you can put your logic inside the runLongWork method:

```typescript
await this.runLongWork(async () => {
    await saveToServer();
});
```

The method will:
1. Set the workingFlag.isActive property to `true` so that UI elements could present an in-progress state.
2. Catch exception (except AcknowledgementRequiredException) and put the message in the `error` property for the UI to bind to.
3. Log the exceptions.

You can use the helper `errorModalProps` function in the UI to automatically bind and handle the `error` property:

```jsx
<ErrorModal
    {...errorModalProps(vm)}
/>
```
