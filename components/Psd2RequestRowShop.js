
import React, { Component } from 'react';
import { Table, Button } from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import fidelityPoints from "../ethereum/fido";
import * as firebase from "firebase";



class Psd2RequestRowShop extends Component {
    render() {
        const { Cell, Row } = Table;
        const { id, request, approversCount } = this.props;

        return (
            <Row negative={!request.completed} positive={request.completed}>
                <Cell>{id}</Cell>
                <Cell>{request.tokenAmount} FID</Cell>
                <Cell>{request.method}</Cell>
                <Cell>{request.shop}</Cell>
                <Cell>{request.note}</Cell>
            </Row>
        );
    }
}

export default Psd2RequestRowShop;