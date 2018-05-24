import React, { Component } from 'react';
import { Table, Button } from 'semantic-ui-react';
import web3 from '../../ethereum/web3';
import fidelityPoints from "../../ethereum/fido";

class EthereumRequestRow extends Component {

    onReject = async event => {
        event.preventDefault();
        event.persist();
        // Get accounts.
        const accounts = await web3.eth.getAccounts();
        // Reject the ether request performed by the shop.
        await fidelityPoints.methods.rejectRequestEthereum(this.props.id).send({
            from: accounts[0],
            gas: '4500000'
        });
    };

    onFinalize = async event => {
        event.preventDefault();
        event.persist();
        // Get accounts.
        const accounts = await web3.eth.getAccounts();
        // Transfer ether in the request to the shop.
        await fidelityPoints.methods.finalizeRequestEthereum(this.props.id).send({
            from: accounts[0],
            value: event.target.value
        });
    };

    render() {
        const { Cell, Row } = Table;
        const { id, request } = this.props;
        return (
            <Row disabled={!!request.completed} positive={!!request.completed} negative={!!request.rejected}>
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
                <Cell>{reuqest.shopId}</Cell>
                <Cell>{request.value} FID</Cell>
                <Cell>{request.method}</Cell>
                <Cell>{request.shop}</Cell>
                <Cell>{request.note}</Cell>
            </Row>
        );
    }
}

export default EthereumRequestRow;