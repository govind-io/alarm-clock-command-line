import { Alarm } from "./alarm.js";
import { GetUserInputStatic, checkAndConvertTime, weekDays } from "./helper.js";
import { UserInput } from "./userInput.js";

export class Clock {
  constructor() {
    this.alarms = {};
    //display the current time as soon as the clock is created
    console.log(new Date().toLocaleString());
  }

  alarms;

  //explicityl display the current time
  displayCurrentTime() {
    console.log(new Date().toLocaleString());
    console.log(this.alarms);
  }

  async addAlarm() {
    let day;

    while (!Object.keys(weekDays).includes(day)) {
      if (day) {
        console.log("Invalid day selected");
      }

      day = await GetUserInputStatic(
        `Please enter day of the week in short form, for eg "mon" for monday\n`
      );
    }

    let time;

    while (!time) {
      if (time === false) {
        console.log("invalid time, please enter again\n");
      }

      const timeStr = await GetUserInputStatic(
        "Please enter time in hh:mm:ss format\n"
      );

      time = checkAndConvertTime(timeStr);
    }

    const alarm = new Alarm(time, day);

    this.alarms[alarm.id] = alarm;
  }

  async removeAlarm() {
    let id;

    this.displayActiveAlarms();

    while (!this.alarms[id]) {
      if (id) {
        console.log("Please enter appropriate id\n");
      }

      id = await GetUserInputStatic("Please enter the id of alarm to delete\n");
    }

    this.alarms[id].deleteAlarm();
    delete this.alarms[id];
  }

  displayActiveAlarms() {
    const alarmIds = Object.keys(this.alarms);

    if (alarmIds.length === 0) {
      console.log("No alarms active\n");
    }

    alarmIds.forEach((id) => {
      this.alarms[id].display();
    });
  }
}
