import React, { Component } from "react";
import * as firebase from "firebase";
import { Button, Checkbox, Icon, Table } from "semantic-ui-react";
import fidelityPoints from "../../ethereum/fido";
import web3 from "../../ethereum/web3";
import OrderRequestRow from "./OrderRequestRow";

class ShopShipOrderForm extends Component {
    state = {
        requestList: [],
        loadingRenderFirst: true,
        errorMessage: "",
        buyingRequestCount: "",
        buyingRequests: [],
        loading: false
    };

    // Getting data when component is mounting
    async componentDidMount() {
        var self = this;
        const buyingRequestCount = await fidelityPoints.methods.getUserRequestsBuyCount().call();
        console.log("buyingRequestCount:", buyingRequestCount);
        // inside I have the list of all different indexes of campaign, try it in terminal
        const buyingRequests = await Promise.all(
            Array(parseInt(buyingRequestCount))
            .fill()
            .map((element, index) => {
                return fidelityPoints.methods.buyingRequests(index).call();
            })
        );
        console.log("buyingRequests:", buyingRequests);
        self.setState({ buyingRequestCount, buyingRequests, loadingRenderFirst: false });
    }

    renderRows() {
        // Get the id of the shop logged in.
        var shopId = firebase.auth().currentUser.uid;
        console.log("shopId: ", shopId);
        console.log("state buyingRequests:", this.state.buyingRequests);
        // Get all the buying request from all the users.
        return this.state.buyingRequests.map((request, index) => {
            console.log("request: ", request);
            // Show only the request to the current shop logged in.
            if(request.shopId == shopId){
                return <OrderRequestRow
                    key={index}
                    id={index}
                    request={request}
                />
            }
        });
    }

    render() {
        var listItems;
        var items;
        const { id, request, approversCount } = this.props;
        if (this.state.loadingRenderFirst == true) {
            return (
                <Table celled compact definition size="small">
                <Table.Header fullWidth>
                    <Table.Row key={"header"}>
                        <Table.HeaderCell />
                        <Table.HeaderCell>User First Name</Table.HeaderCell>
                        <Table.HeaderCell>User Address</Table.HeaderCell>
                        <Table.HeaderCell>Value</Table.HeaderCell>
                        <Table.HeaderCell>Product</Table.HeaderCell>
                        <Table.HeaderCell>Shipped</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body />
                <Table.Footer fullWidth>
                    <Table.Row>
                        <Table.HeaderCell />
                        <Table.HeaderCell colSpan="4" />
                    </Table.Row>
                </Table.Footer>
                </Table>
            );
        }
        if (this.state.loadingRenderFirst == false) {
            return (
                <Table celled compact definition size="small">
                <Table.Header fullWidth>
                    <Table.Row key={"header"}>
                        <Table.HeaderCell />
                        <Table.HeaderCell>User First Name</Table.HeaderCell>
                        <Table.HeaderCell>Shipping Address</Table.HeaderCell>
                        <Table.HeaderCell>User Address</Table.HeaderCell>
                        <Table.HeaderCell>Value</Table.HeaderCell>
                        <Table.HeaderCell>Product</Table.HeaderCell>
                        <Table.HeaderCell>Shipped</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {this.renderRows()}
                </Table.Body>
                <Table.Footer fullWidth>
                    <Table.Row>
                        <Table.HeaderCell />
                        <Table.HeaderCell />
                        <Table.HeaderCell />
                        <Table.HeaderCell colSpan="4" />
                    </Table.Row>
                </Table.Footer>
                </Table>
            );
        }
    }
}
export default ShopShipOrderForm;
