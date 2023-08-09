## Installation

Install `clt` if not already installed.

```bash
npm install -g myclt
# OR
yarn global add myclt
```

Link the remember command to myclt, either by cloning the repo locally or link remotely:

### Locally

- `cd` to the directory where you want to clone the repo.
- Run `clt /link market` to link the command to myclt.

Run `clt /list` to see the added list of commands.

### Remotely

```bash
clt /link/git https://github.com/trapcodeio/myclt-demo-command market
```

Run `clt /list` to see the added list of commands.

To update the files of this command, run:

```bash
clt /link/git/update https://github.com/trapcodeio/myclt-demo-command
```
