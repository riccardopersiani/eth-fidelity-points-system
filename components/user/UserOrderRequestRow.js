import React, { Component } from 'react';
import { Table, Button } from 'semantic-ui-react';
import web3 from '../../ethereum/web3';
import fidelityPoints from "../../ethereum/fido";

class UserOrderRequestRow extends Component {
    render() {
        const { Cell, Row } = Table;
        const { id, request } = this.props;
        console.log("request:", request);
        return (
            <Row negative={!request.shipped} positive={request.shipped}>
                <Cell>{request.product}</Cell>
                <Cell>{request.shopName}</Cell>
                <Cell>{request.shop}</Cell>
                <Cell>{request.value} FID</Cell>
                <Cell>{request.shipped.toString()}</Cell>
            </Row>
        );
    }
}

export default UserOrderRequestRow;