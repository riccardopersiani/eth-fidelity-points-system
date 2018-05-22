import React, { Component } from 'react';
import { Table, Button } from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import fidelityPoints from "../ethereum/fido";


class Psd2RequestRow extends Component {

    onFinalize = async event => {
        event.preventDefault();
        event.persist();
        console.log("Parameter passed in event => EUR ID: ", event.target.value)
        window.location.replace(`http://localhost:8085?pid=${event.target.value}`);
    };

    render() {
        const { Cell, Row } = Table;
        const { id, request, approversCount } = this.props;

        return (
            <Row disabled={request.completed} positive={!request.completed}>
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