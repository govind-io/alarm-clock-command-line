import readline from "readline";

//options must be an object, where the key must be the id and the value should be an object with an option cb callback function and val string
export class UserInput {
  constructor(options) {
    this.options = options;
  }

  options;

  rl;

  async handleInput() {
    let question = "";

    Object.keys(this.options).map((key) => {
      question += `${key}: ${this.options[key].val}\n`;
    });

    try {
      const answer = await this.GetUserInput(question);

      const selectedOption = this.options[answer];

      if (!selectedOption) {
        console.log("invalid option selected, please try again");
        return this.handleInput();
      }

      await selectedOption.cb(answer);

      if (selectedOption.loop) {
        this.handleInput();
      }

      return answer;
    } catch (error) {
      return "";
    }
  }

  close() {
    this.rl?.close();
  }

  GetUserInput(question) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    this.rl = rl;

    return new Promise((resolve, reject) => {
      rl.on("close", () => reject("readline closed"));

      rl.question(question, (answer) => {
        resolve(answer);
        rl.close();
      });
    });
  }
}
