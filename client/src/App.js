import React, {Component} from 'react';
import './App.css';
import {Button, Form, FormGroup, Label, Input} from 'reactstrap';
import logo from './img/poa-icon.png';
import spinner from './img/spinner.gif';
import {Card, CardHeader, CardBody} from 'reactstrap';

import TestDescription from "./components/TestDescription";
import MissingRoundList from "./components/missing-rounds/MissingRoundList";
import MissingTxsList from "./components/txs-sending/MissingTxsList";
import RewardList from "./components/reward-check/RewardList";
import TransferRewardList from "./components/transfer-reward/TransferRewardList";
import TxsPublicRpcList from "./components/txs-public-rpc/TxsPublicRpcList";
import ReorgsList from "./components/reorgs/ReorgsList";

class App extends Component {
    state = {
        network: "Sokol",
        lastSeconds: 7200,
        passed: "All",
        test: 0,
        isLocalTime: false,

        missingRoundsDescription: "Check if any validator nodes are missing rounds",
        missingRoundsRuns: [],

        missingTxsCheckDescription: "Check that all validator nodes are able to mine non-empty blocks",
        missingTxsRuns: [],

        rewardDescription: "Check validator rewards",
        rewardRuns: [],

        transferRewardDescription: "Check reward transfer from the mining key to payout key",
        transferRewardRuns: [],

        txsPublicRpcDescription: "Periodically send txs via public rpc endpoint",
        txsPublicRpcRuns: [],

        reorgsDescription: "Check for reorgs",
        reorgs: [],

        txsInfuraDescription: "Periodically send txs via Infura endpoint",
        txsInfuraRuns: [],

        loading: false,
    };

    async handleSubmit(event) {
        console.log('handleSubmit');
        event.preventDefault();
        // todo FormData is not compatible with edge
        const data = new FormData(event.target);
        let network = data.get('network');
        let lastSeconds = data.get('lastSeconds');
        let passed = data.get("passed");
        let test = data.get("test");
        let isLocalTime = !!data.get("timeCheckbox");
        console.log('network: ' + network + ", lastSeconds: " + lastSeconds + ", passed: " + passed + ", test: " + test + ", isLocalTime: " + isLocalTime.toString());
        const newState = Object.assign({}, this.state, {
            network: network,
            lastSeconds: lastSeconds,
            passed: passed,
            test: test,
            isLocalTime: isLocalTime,
            loading: true,
        });
        await this.setState(newState);
        await this.getResults();
    }

    async getResults() {
        const response = await fetch("/" + this.state.network + "/api/" + this.state.passed + "?lastseconds=" + this.state.lastSeconds + "&test=" + this.state.test);
        const data = await response.json();
        console.log("data: " + JSON.stringify(data));
        let convertResults = r => {
            r.key = r.id;
            if (this.state.isLocalTime) {
                r.time = new Date(r.time).toLocaleString();
            }
            return r;
        };
        const newMissingRoundsRuns = data.missingRoundCheck.runs.map(convertResults);
        const newMissingTxsRuns = data.missingTxsCheck.runs.map(convertResults);
        const newRewardRuns = data.miningRewardCheck.runs.map(convertResults);
        const newTransferRewardRuns = data.rewardTransferCheck.runs.map(convertResults);
        const newTxsPublicRpcRuns = data.txsViaPublicRpcCheck.runs.map(convertResults);
        const newReorgs = data.reorgsCheck.reorgs.map(convertResults);
        const newTxsInfuraRuns = data.txsViaInfuraCheck.runs.map(convertResults);
        const newState = Object.assign({}, this.state, {
            missingRoundsRuns: newMissingRoundsRuns.reverse(),
            missingTxsRuns: newMissingTxsRuns.reverse(),
            rewardRuns: newRewardRuns.reverse(),
            transferRewardRuns: newTransferRewardRuns.reverse(),
            txsPublicRpcRuns: newTxsPublicRpcRuns.reverse(),
            reorgs: newReorgs.reverse(),
            txsInfuraRuns: newTxsInfuraRuns.reverse(),
            loading: false,
        });
        console.log("newState: " + JSON.stringify(newState));
        this.setState(newState);
    }

    componentDidMount() {
        console.log('componentDidMount');
        this.getResults();
    }

    getSearchForm() {
        return <div className="form-card">
            <Card outline>
                <CardHeader className="form-header"><strong>Search parameters:</strong></CardHeader>
                <CardBody>
                    <Form onSubmit={(e) => this.handleSubmit(e)} inline>
                        <FormGroup className="formElement inline-element" tag="fieldset">
                            <FormGroup className="formElement inline-element" check>
                                <Label check>
                                    <Input type="radio" name="network" value="Sokol"
                                           defaultChecked={this.state.network === "Sokol"}/>{' '}
                                    Sokol
                                </Label>
                            </FormGroup>
                            <FormGroup className="formElement inline-element" check>
                                <Label check>
                                    <Input type="radio" name="network" value="Core"
                                           defaultChecked={this.state.network === "Core"}/>{' '}
                                    Core
                                </Label>
                            </FormGroup>
                        </FormGroup>
                        <FormGroup className="formElement">
                            <Label for="exampleText" className="formElement">Last seconds</Label>
                            <Input type="number" name="lastSeconds" id="exampleText"
                                   defaultValue={this.state.lastSeconds}/>
                        </FormGroup>

                        <FormGroup className="formElement inline-element" tag="fieldset">
                            <FormGroup className="formElement inline-element" check>
                                <Label check>
                                    <Input type="radio" name="passed" value="all"
                                           defaultChecked={this.state.passed === "All"}/>{' '}
                                    All
                                </Label>
                            </FormGroup>
                            <FormGroup className="formElement inline-element" check>
                                <Label check>
                                    <Input type="radio" name="passed" value="failed"
                                           defaultChecked={this.state.passed === "Failed"}/>{' '}
                                    Failed
                                </Label>
                            </FormGroup>
                        </FormGroup>

                        <FormGroup className="formElement">
                            <Label for="tests" className="formElement">Tests</Label>
                            <Input type="select" name="test" id="tests">
                                <option value={0}>All</option>
                                <option value={1}>Missing rounds</option>
                                <option value={2}>Sending txs</option>
                                <option value={3}>Reward check</option>
                                <option value={4}>Sending txs via public rpc</option>
                                <option value={5}>Reorgs</option>
                                <option value={6}>Reward transfer</option>
                                <option value={7}>Sending txs via Infura</option>
                            </Input>
                        </FormGroup>

                        <FormGroup check className="formElement">
                            <Label check>
                                <Input type="checkbox" className="formElement" name="timeCheckbox"
                                       defaultChecked={this.state.isLocalTime}/>{' '}
                                Local time
                            </Label>
                        </FormGroup>

                        <Button className="search-button">Search</Button>
                    </Form>
                </CardBody>
            </Card>
        </div>
    }

    getTestToShow() {
        let testElements = [
            <div className="table"><TestDescription description={this.state.missingRoundsDescription}/>
                <MissingRoundList missingRoundsRuns={this.state.missingRoundsRuns}/>
                <br/>

                <TestDescription description={this.state.missingTxsCheckDescription}/>
                <MissingTxsList missingTxsRuns={this.state.missingTxsRuns}/>
                <br/>

                <TestDescription description={this.state.rewardDescription}/>
                <RewardList rewardRuns={this.state.rewardRuns}/>
                <br/>
                <TestDescription description={this.state.txsPublicRpcDescription}/>
                <TxsPublicRpcList txsPublicRpcRuns={this.state.txsPublicRpcRuns}/>
                <br/>

                <TestDescription description={this.state.reorgsDescription}/>
                <ReorgsList reorgs={this.state.reorgs}/>

                <TestDescription description={this.state.transferRewardDescription}/>
                <TransferRewardList transferRewardRuns={this.state.transferRewardRuns}/>
                <br/>

                <TestDescription description={this.state.txsInfuraDescription}/>
                <TxsPublicRpcList txsPublicRpcRuns={this.state.txsInfuraRuns}/>
                <br/>

            </div>,
            <div className="table">
                <TestDescription description={this.state.missingRoundsDescription}/>
                <MissingRoundList missingRoundsRuns={this.state.missingRoundsRuns}/>
                <br/>
            </div>,

            <div className="table"><TestDescription description={this.state.missingTxsCheckDescription}/>
                <MissingTxsList missingTxsRuns={this.state.missingTxsRuns}/>
                <br/>
            </div>,
            <div className="table"><TestDescription description={this.state.rewardDescription}/>
                <RewardList rewardRuns={this.state.rewardRuns}/>
            </div>,
            <div className="table"><TestDescription description={this.state.txsInfuraDescription}/>
                <TxsPublicRpcList txsPublicRpcRuns={this.state.txsPublicRpcRuns}/>
            </div>,
            <div className="table"><TestDescription description={this.state.reorgsDescription}/>
                <ReorgsList reorgs={this.state.reorgs}/>
            </div>,
            <div className="table"><TestDescription description={this.state.transferRewardDescription}/>
                <TransferRewardList transferRewardRuns={this.state.transferRewardRuns}/>
            </div>,
            <div className="table"><TestDescription description={this.state.txsInfuraDescription}/>
                <TxsPublicRpcList txsPublicRpcRuns={this.state.txsInfuraRuns}/>
            </div>
        ];
        return testElements[this.state.test];
    }

    render() {
        console.log('In Render, this.state.test: ' + this.state.test);
        let testToShow = this.getTestToShow();
        let searchForm = this.getSearchForm();
        return (
            <div>
                <header className="App-header">
                    <div className="logo">
                        <img src={logo} className="App-logo" alt="logo"/>
                        <div className="logo-element"><h3> Test results </h3></div>
                    </div>
                </header>
                <div className="App">
                    {searchForm}
                    {this.state.loading && <img src={spinner} alt="spinner"/>}
                    {testToShow}
                </div>
            </div>
        );
    }
}

export default App;
