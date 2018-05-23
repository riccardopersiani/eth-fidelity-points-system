import React, { Component } from 'react';
import { Table, Button } from 'semantic-ui-react';
import web3 from '../../ethereum/web3';
import fidelityPoints from "../../ethereum/fido";

class EthereumRequestRow extends Component {

    onReject = async event => {
        event.preventDefault();
        event.persist();

        console.log("Parameter passed in event => Eth value: ", event.target.value)
        const accounts = await web3.eth.getAccounts();
        await fidelityPoints.methods.rejectRequestEthereum(this.props.id).send({
            from: accounts[0],
            gas: '4500000'
        });
    };

    onFinalize = async event => {
        event.preventDefault();
        event.persist();

        console.log("Parameter passed in event => Eth value: ", event.target.value)
        const accounts = await web3.eth.getAccounts();
        await fidelityPoints.methods.finalizeRequestEthereum(this.props.id).send({
            from: accounts[0],
            value: event.target.value
        });
    };

    render() {
        const { Cell, Row } = Table;
        const { id, request, approversCount } = this.props;

        return (
            <Row disabled={request.completed} positive={!request.completed}>
                <Cell>
                    {request.rejected ? null : (
                        <Button color="red" basic onClick={this.onReject}>
                            Reject
                        </Button>
                    )}
                </Cell>
                <Cell>
                    {request.complete ? null : (
                        <Button color="teal" basic onClick={this.onFinalize} value={request.value}>
                            Finalize
                        </Button>
                    )}
                </Cell>
                <Cell>{id}</Cell>
                <Cell>{request.value} FID</Cell>
                <Cell>{request.method}</Cell>
                <Cell>{request.shop}</Cell>
                <Cell>{request.note}</Cell>
            </Row>
        );
    }
}

export default EthereumRequestRow;