# poa-network-monitor

Tests for network health checks and monitoring.
<br>
<ul>
<li><code>network-test</code> folder contains tests and helper script.
Use the command line arguments to detect network name and url.
If no command line arguments received, parameters from the toml file will be used. <br>
<code>unit-test</code> folder contains unit tests for checking missing-round test. <br>
<code>contracts</code> folder contains abi and address of needed contract
</li>
<li><code>common</code> folder contains file with configuration information obtained from toml file and dao
for working with sqlite database.
</li>
<li><code>webapp</code> folder contains web server for retrieving test results
</li>
<li><code>client</code> folder contains React app
</li>
<li><code>scripts</code> folder contains script for new accounts creating and bash scripts for running tests and monitor.
<code>test-runner.sh</code> file contains logic to prevent duplicate test executions using PID files.
 It takes name of the test as argument and executes bash script for running this test.
</li>
<li><code>test-result-monitor.js</code> file checks test results via web server and send alert to slack channel.
Also uses the command line arguments to detect network name and url</li>
<li><code>config-sample.toml</code> is example of file with settings. Needs to be renamed to <code>config.toml</code>
and filled with valid settings (as account and password)  </li>
</ul>
<h2>Setup</h2>

<h3>Run Parity nodes</h3>
1. Install Parity and obtain spec.json and bootnodes.txt files using these instructions: <a href="https://github.com/poanetwork/wiki/wiki/POA-Installation">POA Installation</a>.<br>
2. Clone Github repository:

```sh
git clone https://github.com/poanetwork/poa-network-monitor.git
```
Install dependencies <br>

```sh
cd poa-network-monitor
npm install
```
3.Run parity nodes <br>
For running parity node enable JSONRPC when connecting to POA Network on Parity <code>--jsonrpc-apis all</code><br>
For running two nodes for the each network it's needed to specify different ports for them. <br><br>
Example of running Sokol node on ubuntu:<br>

```sh
nohup parity --chain /path/to/sokol/spec.json --reserved-peers /path/to/sokol/bootnodes.txt --jsonrpc-apis all --port 30300 --jsonrpc-port 8540 --ws-port 8450 --ui-port 8180 --no-ipc > parity-sokol.log 2>&1 &
```

<br>url will be http://localhost:8540<br><br>
For the Core node:<br>

```sh
nohup parity --chain /path/to/core/spec.json --reserved-peers /path/to/core/bootnodes.txt --jsonrpc-apis all --port 30301 --jsonrpc-port 8541 --ws-port 8451 --ui-port 8181 --no-ipc > parity-core.log 2>&1 &
```

<br>url will be http://localhost:8541

<h3>Edit the configuration file</h3>
Rename <code>config-sample.toml</code> to the <code>config.toml</code> (or copy and rename).
Specify <code>slackWebHookUrl</code> and <code>channel</code>.
Webhook can be created as <a href="https://get.slack.help/hc/en-us/articles/115005265063-Incoming-WebHooks-for-Slack">here</a>.
Other settings can be changed too, accounts creation is described below.

<h3>Create test accounts</h3>
For account creating newAccount.js script can be used.
It will create encrypted account using specified password and print it's address.
For the Sokol:

```sh
cd /home/user/poa-network-monitor
node ./scripts/newAccount.js sokol http://localhost:8540 password
```
Core:
```sh
cd /home/user/poa-network-monitor
node ./scripts/newAccount.js core http://localhost:8541 password
```

<h6>For sending txs test (missing-rounds.js)</h6>
1. Create 2 accounts (in each network), add POA to the one of them. For the Sokol network test POA can be added <a href="https://faucet-sokol.herokuapp.com/">here</a> <br>
2. Add created addresses and passwords to the <code>Sending txs test</code> section of the <code>config.toml</code> file. <code>addressFrom..</code> must be address with POA

<h6>For sending txs via public RPC test (txs-public-rpc-test.js)</h6>
 This test can't unlock account as it uses remote node, so it creates raw tx and signs with private key. For getting public and private keys it uses keystore file. <br>
1.Create 2 accounts in each network, add POA to the one of them. <br>
2.Add created addresses and passwords to the <code>Sending txs via public RPC test</code> section of the config.toml file. <br>
3.Add path to the keystore of the account with poa (<code>keyStorePath</code> parameter).
 Keystore file is usually located in the <code>~/.local/share/io.parity.ethereum/keys/</code> folder.

<h3>Setup scripts for running monitor and tests. </h3>
<h6>Tests</h6>
Bash scripts for running tests and monitor are located in the <code>scripts</code> folder. They can be used for adding to cron. <br>
Example script for running separate test: <br>

```sh
#!/bin/sh
cd /home/user/poa-network-monitor; node ./network-test/missing-rounds.js sokol ws://localhost:8450 >> ./logs/missing-rounds-sokol-log 2>&1;
node ./network-test/missing-rounds.js core ws://localhost:8451 >> ./logs/missing-rounds-core-log 2>&1;
```

<h6>Reorgs</h6>
Run reorgs test for the each network:

```sh
cd /home/user/poa-network-monitor;
nohup node ./network-test/reorgs-check.js core ws://localhost:8451  >> ./logs/reorgs_core.log 2>&1 &
```

```sh
cd /home/user/poa-network-monitor;
nohup node ./network-test/reorgs-check.js sokol ws://localhost:8450  >> ./logs/reorgs_sokol.log 2>&1 &
```
Test for reorgs runs continuously so it's not needed to add it on cron.

<h6>Monitor</h6>
When running monitor the time in seconds can be specified for checking last result. <br>
Script for separate run:

```sh
#!/bin/sh <br>
cd /home/user/poa-network-monitor; node ./test-result-monitor.js sokol 1800 >> ./logs/monitor-sokol-log 2>&1;
node ./test-result-monitor.js core 1800 >> ./logs/monitor-core-log 2>&1
```
Scripts for monitor running are located in the <code>scripts</code> folder.

<h3>Add scripts to the crontab </h3>
Run <code>sudo crontab -e -u user</code> <br>
Crontab example with timeout:

```sh
*/10 * * * * cd /home/user/poa-network-monitor; timeout -s 2 8m ./scripts/test-runner.sh missing-rounds-sokol
*/12 * * * * cd /home/user/poa-network-monitor; timeout -s 2 8m ./scripts/test-runner.sh missing-rounds-core
*/16 * * * * cd /home/user/poa-network-monitor; timeout -s 2 8m ./scripts/test-runner.sh mining-reward-sokol
*/18 * * * * cd /home/user/poa-network-monitor; timeout -s 2 8m ./scripts/test-runner.sh mining-reward-core
0,30 * * * * cd /home/user/poa-network-monitor; timeout -s 2 25m ./scripts/test-runner.sh txs-sokol
5,35 * * * * cd /home/user/poa-network-monitor; timeout -s 2 25m ./scripts/test-runner.sh txs-core
*/15 * * * * cd /home/user/poa-network-monitor; timeout -s 2 12m ./scripts/test-runner.sh txs-public-rpc-sokol
*/17 * * * * cd /home/user/poa-network-monitor; timeout -s 2 12m ./scripts/test-runner.sh txs-public-rpc-core
1 * * * * cd /home/natalia/poa-network-monitor; timeout -s 2 8m ./scripts/test-runner.sh reward-transfer-sokol
2 * * * * cd /home/natalia/poa-network-monitor; timeout -s 2 8m ./scripts/test-runner.sh reward-transfer-core
7,37 * * * * cd /home/user/poa-network-monitor; timeout -s 2 15m ./scripts/test-runner.sh monitor-sokol
8,38 * * * * cd /home/user/poa-network-monitor; timeout -s 2 15m ./scripts/test-runner.sh monitor-core

```

<h3>Run web server </h3>

```sh
cd /home/user/poa-network-monitor;
nohup node ./webapp/index.js >> ./logs/web_server.log 2>&1 &
```

<h3>Run UI </h3>

Install dependencies <br>

```sh
cd /home/user/poa-network-monitor/client
npm install
```

Run

```sh
nohup npm start &
```
