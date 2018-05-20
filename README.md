# poa-network-test

Tests for network health checks.
<br>
<ul>
<li>config.toml file can be used for settings changing (network, test accounts, some test data)</li>
<li>core-contracts.js and sokol-contracts.js - abi and address of needed contract (for each network)</li>
<li>blocks.js - data for testing </li>
</ul>
<p>
For running it's need to enable JSONRPC when connecting to POA Network on Parity<br>
<code>parity --chain c:\path\to\spec.json --reserved-peers c:\path\to\bootnodes.txt --jsonrpc-apis all</code>
</p>
