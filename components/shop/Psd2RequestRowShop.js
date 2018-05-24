
import React, { Component } from 'react';
import { Table } from 'semantic-ui-react';


class Psd2RequestRowShop extends Component {
    render() {
        const { Cell, Row } = Table;
        const { id, request } = this.props;
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