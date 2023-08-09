import { defineCommands } from "myclt/functions/helpers";
import { Q } from "semantic-inquirer";
import * as fs from "node:fs";
import * as path from "node:path";
import {
  emptyLine,
  error,
  errorAndExit,
  info,
  infoAndExit,
} from "myclt/functions/loggers";

export default defineCommands({
  update: {
    async default({ args, store, self, exec }) {
      // check if installed
      if (!store.has("installed")) {
        error(`Market command not installed on this machine yet.`);
        return infoAndExit(`run "clt market/update" to install it.`);
      }

      // Actions we allow
      const actions = ["all", "client", "server"];

      // if action is not provided as argument then ask for it.
      const action =
        args[0] ?? (await Q.selectOne("Select which repo to update:", actions));

      // validate action, just incase it came from the argument
      if (!actions.includes(action))
        return errorAndExit(
          `Action must either: [${actions.join(", ")}], "${action}" received!`
        );

      if (action === "client") {
        // run client related commands
        const clientFolder = store.get("clientFolder");
        info(`Updating Client Folder => ${clientFolder}...`);

        // run the command
        exec("git pull origin mango && yarn && yarn run build-dev", {
          cwd: clientFolder,
        });
      } else if (action === "server") {
        // run client related commands
        const serverFolder = store.get("serverFolder");
        info(`Updating Server Folder => ${serverFolder}...`);

        // run the command
        exec(
          "git pull origin main && npx xjs dbc:migrate && yarn && yarn run build && pm2 restart all",
          { cwd: serverFolder }
        );
      } else if (action === "all") {
        // run both by calling self
        self("update", ["client"]);
        self("update", ["server"]);
      }
    },
  },

  /**
   * Install the market command
   * This action sets up the data needed for the command to work
   * Then saves them in clt persisted store
   */
  async install({ args, store }) {
    // if our first argument is `overwrite` then we are overwriting the data
    const shouldOverwrite = args[0] === "overwrite";
    const isInstalled = store.has("installed");

    if (isInstalled && !shouldOverwrite) {
      return info("Market command is already installed!");
    }

    // if not installed then we are installing it
    // ask for client and server folder paths
    const clientFolder = await askForFolder("Enter the client folder path: ");
    const serverFolder = await askForFolder("Enter the server folder path: ");

    // save the data in clt persisted store
    store.set("clientFolder", clientFolder);
    store.set("serverFolder", serverFolder);
    // set installed to true
    store.set("installed", true);

    // commit the changes to clt persisted store
    store.commitChanges();

    info("Market command installed!");
  },
});

/**
 * Recursively ask for a folder path until it exists
 * @returns
 */
async function askForFolder(q: string) {
  let folder = await Q.ask(q);
  folder = folder.trim();

  if (!folder) {
    error(`Folder path is required!`);
    emptyLine();

    // ask again
    return askForFolder(q);
  }

  // resolve the path
  folder = path.resolve(folder);

  if (!fs.existsSync(folder)) {
    error(`Folder "${folder}" does not exist!`);
    emptyLine();

    // ask again
    return askForFolder(q);
  }

  return folder;
}
