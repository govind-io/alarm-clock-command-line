import { Clock } from "./alartmClock.js";
import { allUserInputs, updateAllUserInputs } from "./helper.js";
import { UserInput } from "./userInput.js";

const clock = new Clock();

const initialOptions = {
  1: {
    val: "Add an alarm",
    cb: clock.addAlarm.bind(clock),
    loop: true,
  },
  2: { val: "Remove an alarm", cb: clock.removeAlarm.bind(clock), loop: true },
  3: {
    val: "View all active alarms",
    cb: clock.displayActiveAlarms.bind(clock),
    loop: true,
  },
};

const userInput = new UserInput(initialOptions);
userInput.handleInput();

updateAllUserInputs([...allUserInputs, userInput]);
