# poa-network-test

Tests for network health checks.
<br>
<ul>
<li>config.toml file can be used for settings changing (network, test accounts, some test data)</li>
<li>network-test.js contains Mocha tests and helper functions</li>
<li>core-contracts.js and sokol-contracts.js - abi and address of needed contract (for each network)</li>
<li>blocks.js - data for testing helper function</li>
</ul>
<p>
For running tests it's need to enable JSONRPC when connecting to POA Network on Parity<br>
<code>parity --chain c:\path\to\spec.json --reserved-peers c:\path\to\bootnodes.txt --jsonrpc-apis all</code>
</p>
<p>
Run all tests:<br>
<code>npm test</code>
</p>
<p>
For running separate test or group use the --grep option:<br>
<code>npm test -- --grep "Network health check" </code>
</p>
