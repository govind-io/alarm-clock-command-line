import { allUserInputs, updateAllUserInputs, weekDays } from "./helper.js";
import { UserInput } from "./userInput.js";
import readline from "readline";
import player from "play-sound";

export class Alarm {
  constructor(scheduledTime, scheduledDay) {
    this.scheduledTime = scheduledTime;
    this.scheduledDay = scheduledDay;
    this.snoozeCount = 0;

    const now = new Date();

    //updating scheduled time to accomadate
    this.scheduledTime.setDate(
      now.getDate() + ((weekDays[this.scheduledDay] + 7 - now.getDay()) % 7)
    );

    this.nextTriggerTime = this.scheduledTime;

    if (this.nextTriggerTime.getTime() < now.getTime()) {
      this.setNextTrigger();
    } else {
      this.timeOut = setTimeout(
        this.ring.bind(this),
        this.nextTriggerTime.getTime() - now.getTime()
      );
    }

    this.id = Math.floor(Math.random() * 10001);

    console.log("Alarm scheduled");

    return this.id;
  }

  snoozeInterval = 5;

  scheduledDay;

  scheduledTime;

  nextTriggerTime;

  snoozeCount;

  timeOut;

  id;

  onEnded;

  alarmSound = "./sound.mp3";

  soundPlayer = player();

  soundProcess = null;

  playSound() {
    this.soundProcess = this.soundPlayer.play(this.alarmSound, (err) => {
      if (err) {
        console.error("Error playing sound:", err);
      } else {
        if (this.soundProcess) {
          this.playSound();
        }
      }
    });
  }

  async stopSound() {
    if (!this.soundProcess) return;

    const oldSoundProcess = this.soundProcess;

    this.soundProcess = null;

    oldSoundProcess.kill();
  }

  setNextTrigger() {
    const now = new Date();

    this.scheduledTime.setDate(now.getDate() + 7);

    this.nextTriggerTime = this.scheduledTime;

    this.timeOut = setTimeout(
      this.ring.bind(this),
      this.nextTriggerTime.getTime() - now.getTime()
    );
  }

  async ring() {
    this.playSound();
    console.log(
      `${this.id} : ${new Date(
        this.scheduledTime
      ).toLocaleString()} - alarm ringing`
    );

    updateAllUserInputs(
      allUserInputs.filter((item) => {
        item.close();

        return !(item instanceof readline.Interface);
      })
    );

    const userInput = new UserInput({
      1: { val: "Snooze alarm", cb: this.snooze.bind(this), loop: false },
      2: { val: "Stop alarm", cb: this.end.bind(this), loop: false },
    });

    await userInput.handleInput();

    allUserInputs[0]?.handleInput();
  }

  snooze() {
    this.stopSound();

    if (this.snoozeCount >= 3) {
      console.log("can not snooze any longer");
      this.ring();
      return;
    }

    setTimeout(this.ring.bind(this), this.snoozeInterval * 60 * 1000);

    this.snoozeCount += 1;

    console.log(
      `Alarm snoozed, will ring again in ${this.snoozeInterval} mins`
    );
  }

  end() {
    this.snoozeCount = 0;
    this.setNextTrigger();
    this.stopSound();
  }

  display() {
    console.log(
      `${this.id}: Alarm scheduled for ${new Date(
        this.scheduledTime
      ).toLocaleString()}`
    );
  }

  deleteAlarm() {
    clearTimeout(this.timeOut);
  }
}
