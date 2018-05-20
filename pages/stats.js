import React, { Component } from 'react';
import { Statistic, Card, Header, Container } from 'semantic-ui-react';
import Layout from '../components/Layout';
import { Link, Router } from '../routes';
import fidelityPoints from '../ethereum/fido';


class Statistics extends Component {
    static async getInitialProps(props) {
        const summary = await fidelityPoints.methods.getSummary().call();
        const address = await fidelityPoints.options.address;
        return {
            address: address,
            _totalSupply: summary[0],
            sellPrice: summary[1],
            buyPrice: summary[2],
            owner: summary[3],
            symbol: summary[4],
            name: summary[5],
            decimals: summary[6],
            rate: summary[7]
        };
    }

    render () {
        const {
            owner,
            symbol,
            name,
            decimals,
            rate,
            _totalSupply,
            buyPrice,
            sellPrice,
            address
        } = this.props;

        return(
            <Layout>
                <Header as='h1'>General informations</Header>
                <br/>
                <Card.Group centered>
                    <Card fluid color='red' header={name} meta="Contract owner address"/>
                    <Card fluid color='red' header={symbol} meta="Contract owner address"/>
                    <Card fluid color='red' header={owner} meta="Contract owner address"/>
                    <Card fluid color='red' header={address} meta="Contract address"/>
                    <Card fluid color='red' header={`${_totalSupply} token units`} meta="Total supply"/>
                    <Card fluid color='red' header={rate} meta="Rate"/>
                </Card.Group>
                <br />
            </Layout>
        );
    }
}

export default Statistics;