import React, { Component } from 'react';
import { Table, Button } from 'semantic-ui-react';
import web3 from '../../ethereum/web3';
import fidelityPoints from "../../ethereum/fido";


class Psd2RequestRow extends Component {
    onReject = async event => {
        event.preventDefault();
        event.persist();
        // Firebase write rejected = true in the pending psd2 requests
        firebase.database().ref("pending_payments_psd2/" + event.target.value + "/rejected/").set(true);

    };

    onFinalize = async event => {
        event.preventDefault();
        event.persist();
        console.log("Parameter passed in event => EUR ID: ", event.target.value)
        // Send the pid to express
        window.location.replace(`http://localhost:8085?pid=${event.target.value}`);
    };

    render() {
        const { Cell, Row } = Table;
        const { id, request, approversCount } = this.props;

        return (
            <Row negative={request.rejected} disabled={request.completed & !request.rejected} positive={!request.completed}>
                <Cell>
                    {request.rejected ? null : (
                        <Button color="teal" basic onClick={this.onReject} value={id}>
                            Reject
                        </Button>
                    )}
                </Cell>
                <Cell>
                    {request.completed ? null : (
                        <Button color="teal" basic onClick={this.onFinalize} value={id}>
                            Finalize
                        </Button>
                    )}
                </Cell>
                <Cell>{id}</Cell>
                <Cell>{request.tokenAmount} FID</Cell>
                <Cell>{request.method}</Cell>
                <Cell>{request.shop}</Cell>
                <Cell>{request.note}</Cell>
            </Row>
        );
    }
}

export default Psd2RequestRow;