import React, { Component } from 'react';
import { Table, Button } from 'semantic-ui-react';
import web3 from '../../ethereum/web3';
import fidelityPoints from "../../ethereum/fido";
import * as firebase from "firebase";


class OrderRequestRow extends Component {
    state = {
        shippingAddress: "",
        firstname: "",
        lastname: "",
        city: "",
        country: "",
        zipcode: "",
    };

    onFinalize = async event => {
        event.preventDefault();
        event.persist();

        const accounts = await web3.eth.getAccounts();
        await fidelityPoints.methods.finalizeUserRequestBuy(this.props.id).send({
            from: accounts[0],
            gas: '2000000'
        });
    };

    componentDidMount() {
        var self = this;
        firebase.auth().onAuthStateChanged(function(user) {
            // User is signed in.
            if (user) {
                // If data are not take, take it
                if (!self.state.userId) {
                    var userId = firebase.auth().currentUser.uid;
                    var ref = firebase.database().ref("users/" + userId);
                    ref.once("value").then(function(snapshot) {
                        var shippingAddress = snapshot.child("address").val();
                        var firstname = snapshot.child("firstname").val();
                        var lastname = snapshot.child("lastname").val();
                        var city = snapshot.child("city").val();
                        var country = snapshot.child("country").val();
                        var zipcode = snapshot.child("zipcode").val();
                        self.setState({
                            shippingAddress,
                            firstname,
                            lastname,
                            city,
                            country,
                            zipcode,
                        });
                    });
                }
            // No user is signed in.
            } else {
                console.log("User not logged.");
            }
        });
    }

    render() {
        const { Cell, Row } = Table;
        const { id, request } = this.props;

        return (
            <Row disabled={request.completed} positive={!request.completed}>
                <Cell>
                    {request.shipped ? null : (
                        <Button color="teal" basic onClick={this.onFinalize} >
                            Ship
                        </Button>
                    )}
                </Cell>
                <Cell>{this.state.firstname}</Cell>
                <Cell>{this.state.shippingAddress}</Cell>
                <Cell>{request.user}</Cell>
                <Cell>{request.value}</Cell>
                <Cell>{request.product} FID</Cell>
                <Cell>{request.shipped}</Cell>
            </Row>
        );
    }
}

export default OrderRequestRow;