import React, { Component } from "react";
import * as firebase from "firebase";
import { Button, Checkbox, Icon, Table } from "semantic-ui-react";
import fidelityPoints from "../ethereum/fido";
import web3 from "../ethereum/web3";
import EthereumRequestRowShop from "./EthereumRequestRowShop";
import Psd2RequestRowShop from "./Psd2RequestRowShop";

class ShopRequestStatusTable extends Component {
    state = {
        requestList: [],
        snapshot: [],
        loadingRenderFirst: true,
        paymentMethod: "",
        paymentAmount: "",
        errorMessage: "",
        sending: "",
        ethereumRequestCount: "",
        ethereumRequests: [],
        psd2Requests: [],
        loading: false
    };

    // Loading data from the database
    async loadData() {
        // Refer to the database psd2 payments table
        var paymentRef = firebase.app().database().ref("pending_payments_psd2");
        // Get the snapshot of pending_payments_psd2
        var promise = new Promise((resolve, reject) => {
            paymentRef.once("value").then(function(snapshot) {
                resolve(snapshot);
            });
        });
        return promise;
    }

    // Getting data when component is mounting
    async componentDidMount() {
        var self = this;
        this.loadData()
        .then(async (snapshot) => {
            console.log("snapshot:", snapshot);
            var promise = new Promise((resolve, reject) => {
                console.log("Nella promise");
                // Shop id
                snapshot.forEach(item => {
                    self.state.psd2Requests.push(item);
                });
                resolve();
            });
            console.log("psd2Requests: ", self.state.psd2Requests);
            const ethereumRequestCount = await fidelityPoints.methods.getRequestsCount().call();
            console.log("ethereumRequestCount:", ethereumRequestCount);
            // inside I have the list of all different indexes of campaign, try it in terminal
            const ethereumRequests = await Promise.all(
                Array(parseInt(ethereumRequestCount))
                .fill()
                .map((element, index) => {
                    return fidelityPoints.methods.ethereumPaymentRequests(index).call();
                })
            );
            console.log("ethereumRequests:", ethereumRequests);
            self.setState({ ethereumRequestCount, ethereumRequests, snapshot, loadingRenderFirst: false });
            return promise;
        })
        .catch(err => {
            console.log("This happens 7th - nel catch, err", err);
        });
    }

    renderRowsEthereumShop() {
        console.log("ethereumRequests render:", this.state.ethereumRequests);
        var shopId = firebase.auth().currentUser.uid;
        console.log("shopId: ", shopId);
        return this.state.ethereumRequests.map((request, index) => {
            console.log("request.shop: ", request.shop);
            console.log("shopId: ", request);
            if(request.shopId == shopId){
                return <EthereumRequestRowShop
                    key={index}
                    id={index}
                    request={request}
                />
            }
        })
    }

    renderRowsPsd2Shop() {
        // cercare current user qui
        var shopId = firebase.auth().currentUser.uid;
        console.log("shopId: ", shopId);
        return this.state.psd2Requests.map((request, index) => {
            console.log("request shop: ", request.val().shop);
            if(request.val().shop == shopId){
                console.log("request: ", request);
                return <Psd2RequestRowShop
                    key={index}
                    id={request.key}
                    request={request.val()}
                />
            }
        })
    }

    render() {
        var listItems;
        var items;
        const { id, request, approversCount } = this.props;
        if (this.state.loadingRenderFirst == true) {
        console.log("This happens 1st - first render()");
        return (
            <Table celled compact definition size="small">
            <Table.Header fullWidth>
                <Table.Row key={"header"}>
                    <Table.HeaderCell>Shop Name</Table.HeaderCell>
                    <Table.HeaderCell>Amount</Table.HeaderCell>
                    <Table.HeaderCell>Method</Table.HeaderCell>
                    <Table.HeaderCell>Address</Table.HeaderCell>
                    <Table.HeaderCell>Note</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body />
            <Table.Footer fullWidth>
                <Table.Row>
                    <Table.HeaderCell />
                    <Table.HeaderCell colSpan="5" />
                </Table.Row>
            </Table.Footer>
            </Table>
        );
        }
        if (this.state.loadingRenderFirst == false) {
        console.log("This happens 8th - changing load value");
        return (
            <Table celled compact definition size="small">
            <Table.Header fullWidth>
                <Table.Row key={"header"}>
                    <Table.HeaderCell>Shop Name</Table.HeaderCell>
                    <Table.HeaderCell>Amount</Table.HeaderCell>
                    <Table.HeaderCell>Method</Table.HeaderCell>
                    <Table.HeaderCell>Address</Table.HeaderCell>
                    <Table.HeaderCell>Note</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {this.renderRowsEthereumShop()}
                {this.renderRowsPsd2Shop()}
            </Table.Body>
            <Table.Footer fullWidth>
                <Table.Row>
                    <Table.HeaderCell />
                    <Table.HeaderCell />
                    <Table.HeaderCell />
                    <Table.HeaderCell />
                    <Table.HeaderCell />
                </Table.Row>
            </Table.Footer>
            </Table>
        );
        }
    }
}
export default ShopRequestStatusTable;
