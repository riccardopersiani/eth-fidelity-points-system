import React, { Component } from "react";
import * as firebase from "firebase";
import { Button, Checkbox, Icon, Table } from "semantic-ui-react";
import fidelityPoints from "../../ethereum/fido";
import web3 from "../../ethereum/web3";
import UserOrderRequestRow from "./UserOrderRequestRow";

class UserOrderStatusTable extends Component {

    state = {
        requestList: [],
        loadingRenderFirst: true,
        errorMessage: "",
        buyingRequestCount: "",
        buyingRequests: [],
        loading: false,
        userId: "",
    };

    // Getting data when component is mounting
    async componentDidMount() {
        var self = this;
        firebase.auth().onAuthStateChanged(function(user) {
            // User is signed in.
            if (user) {
                console.log("User detected: ",user);
                // If data are not take, take it
                // TODO maybe remove this check, because of ComponentDidMount()
                if (!self.state.userId) {
                    var userId = '';
                    console.log("UserId set done!");
                    userId = user.uid;
                    self.setState({ userId });
                }
                // No user is signed in.
            } else {
                console.log("User not logged.");
            }
        });
        const buyingRequestCount =  await fidelityPoints.methods.getUserRequestsBuyCount().call();
        console.log("buyingRequestCount:", buyingRequestCount);
        // inside I have the list of all different indexes of campaign, try it in terminal
        const buyingRequests =  await Promise.all(
            Array(parseInt(buyingRequestCount))
            .fill()
            .map((element, index) => {
                return fidelityPoints.methods.buyingRequests(index).call();
            })
        );
        console.log("buyingRequests:", buyingRequests);

        self.setState({ buyingRequestCount, buyingRequests, loadingRenderFirst: false });
    }

    renderRowsUserBuy() {
        var self = this;
        console.log("buyingRequests:", this.state.buyingRequests);
        console.log("userId: ", self.state.userId);
        return this.state.buyingRequests.map((request, index) => {
            if(request.userId == self.state.userId){
                return <UserOrderRequestRow
                    key={index}
                    id={index}
                    request={request}
                />
            }
        })
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
                            <Table.HeaderCell>Product</Table.HeaderCell>
                            <Table.HeaderCell>Shop Name</Table.HeaderCell>
                            <Table.HeaderCell>Shop Address</Table.HeaderCell>
                            <Table.HeaderCell>Value</Table.HeaderCell>
                            <Table.HeaderCell>Shipped</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body />
                    <Table.Footer fullWidth>
                        <Table.Row>
                            <Table.HeaderCell colSpan="5" />
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
                            <Table.HeaderCell>Product</Table.HeaderCell>
                            <Table.HeaderCell>Shop Name</Table.HeaderCell>
                            <Table.HeaderCell>Shop Address</Table.HeaderCell>
                            <Table.HeaderCell>Value</Table.HeaderCell>
                            <Table.HeaderCell>Shipped</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {this.renderRowsUserBuy()}
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
export default UserOrderStatusTable;
