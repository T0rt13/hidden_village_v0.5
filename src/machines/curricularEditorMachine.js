import { createMachine, assign } from "xstate";

export const CurricularContentEditorMachine = createMachine({
  id: "curricularContentEditor",
  initial: "idle", // no actions are performed
  context: { // holds the state data
    gameName: "",
    selectedConjectures: [],
    pin: "",
    confirmationMessage: "",
  },
  states: { // Define the states and transitions
    idle: { 
      on: {
        CREATE: "naming", 
      },
    },
    naming: { 
      on: {
        SET_NAME: { 
          actions: assign({ // Assign the new name to the context
            gameName: (_, event) => event.name,
          }),
        },
        NEXT: "selectingConjectures", 
      },
    },
    selectingConjectures: { 
      on: {
        ADD_CONJECTURE: { 
          actions: assign({ 
            selectedConjectures: (context, event) => [...context.selectedConjectures, event.conjecture],
          }),
        },
        REMOVE_CONJECTURE: {
          actions: assign({ 
            selectedConjectures: (context, event) => context.selectedConjectures.filter(conjecture => conjecture !== event.conjecture),
          }),
        },
        NEXT: "settingPin", 
      },
    },
    settingPin: { 
      on: {
        SET_PIN: { 
          actions: assign({ 
            pin: (_, event) => event.pin,
          }),
        },
        SUBMIT: "confirming", 
      },
    },
    confirming: { 
      entry: assign({ //  generate a confirmation message
        confirmationMessage: (context) => `Your PIN is ${context.pin}. Game "${context.gameName}" with ${context.selectedConjectures.length} conjectures is ready.`,
      }),
      on: {
        CONFIRM: "completed", 
        EDIT: "naming", 
      },
    },
    completed: { 
      type: "final", 
      data: { //  final data to output
        message: (context) => context.confirmationMessage,
      },
    },
  },
  on: {
    CANCEL: { 
      target: "idle", 
      actions: assign({
        gameName: "",
        selectedConjectures: [],
        pin: "",
        confirmationMessage: "",
      }),
    },
  },
});