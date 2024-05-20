import { UserInput } from "./userInput.js";
import readline from "readline";

export const weekDays = {
  mon: 1,
  tue: 2,
  wed: 3,
  thu: 4,
  fri: 5,
  sat: 6,
  sun: 7,
};

export function checkAndConvertTime(timeStr) {
  // Regular expression to match the time format hh:mm:ss
  const pattern = /^\d{2}:\d{2}:\d{2}$/;

  if (pattern.test(timeStr)) {
    const [hours, minutes, seconds] = timeStr
      .split(":")
      .map((item) => parseInt(item));

    // Check if the hours, minutes, and seconds are valid
    if (
      hours >= 0 &&
      hours < 24 &&
      minutes >= 0 &&
      minutes < 60 &&
      seconds >= 0 &&
      seconds < 60
    ) {
      // Create a new Date object with the time parts
      const date = new Date();
      date.setHours(hours);
      date.setMinutes(minutes);
      date.setSeconds(seconds);
      date.setMilliseconds(0);

      return date;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

export let allUserInputs = [];

export const updateAllUserInputs = (newUserInputs) => {
  allUserInputs = newUserInputs;
};

export function GetUserInputStatic(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  updateAllUserInputs([...allUserInputs, rl]);

  return new Promise((resolve, reject) => {
    rl.on("close", () => reject("readline closed"));

    rl.question(question, (answer) => {
      resolve(answer);
      rl.close();
    });
  });
}
