import { stdin as input, stdout as output } from "node:process";

export function readHiddenPassword(label) {
  return new Promise((resolve, reject) => {
    if (!input.isTTY || !input.setRawMode) {
      reject(new Error("Ce script doit être exécuté dans un terminal interactif."));
      return;
    }

    let password = "";
    const restore = () => {
      input.setRawMode(false);
      input.pause();
      input.removeListener("data", onData);
    };
    const onData = (chunk) => {
      const key = chunk.toString();
      if (key === "\u0003") { restore(); reject(new Error("Saisie annulée.")); return; }
      if (key === "\r" || key === "\n") { output.write("\n"); restore(); resolve(password); return; }
      if (key === "\u007f" || key === "\b") {
        if (password.length) { password = password.slice(0, -1); output.write("\b \b"); }
        return;
      }
      if (key >= " ") { password += key; output.write("*"); }
    };

    output.write(label);
    input.setRawMode(true);
    input.resume();
    input.on("data", onData);
  });
}
