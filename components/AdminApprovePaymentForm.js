import React, { Component } from "react";
import * as firebase from "firebase";
import { Button, Checkbox, Icon, Table } from "semantic-ui-react";
import fidelityPoints from "../ethereum/fido";
import web3 from "../ethereum/web3";
import EthereumRequestRow from "./EthereumRequestRow";
import Psd2RequestRow from "./Psd2RequestRow";

class AdminApprovePaymentForm extends Component {

  state = {
    requestList: [],
    snapshot: [],
    shopMap: [],
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

  // promise
  async loadData() {
    console.log("This happens 3th - inside load data");
    var self = this;
    console.log("This happens 4th - before promise");
    // saved by key
    var paymentRef = firebase.app().database().ref("pending_payments_psd2");

    console.log("paymentRef", paymentRef);
    var promise = new Promise((resolve, reject) => {
      paymentRef.once("value").then(function(snapshot) {
        resolve(snapshot);
      });
    });
    return promise;
  }

  // Getting data when component is mounting
  async componentDidMount() {
    console.log("This happens 2nd - componentDidMount() start");
    var self = this;

    this.loadData()
      .then(async (snapshot) => {
        console.log("snapshot:",snapshot);
        console.log("This happens 7th - nel then, snapshot");

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

  renderRows() {
    console.log("ethereumRequests RENDERRR:", this.state.ethereumRequests);
    return this.state.ethereumRequests.map((request, index) => {
        console.log("request: ", request);
        return <EthereumRequestRow
            key={index}
            id={index}
            request={request}
        />
    })
  }

  renderRowsPsd2() {
    return this.state.psd2Requests.map((request, index) => {
        console.log("request: ", request);
        return <Psd2RequestRow
            key={index}
            id={request.key}
            request={request.val()}
        />
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
              <Table.HeaderCell />
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
              <Table.HeaderCell colSpan="4" />
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
              <Table.HeaderCell />
              <Table.HeaderCell>Shop Name</Table.HeaderCell>
              <Table.HeaderCell>Amount</Table.HeaderCell>
              <Table.HeaderCell>Method</Table.HeaderCell>
              <Table.HeaderCell>Address</Table.HeaderCell>
              <Table.HeaderCell>Note</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
          {this.renderRows()}
          {this.renderRowsPsd2()}
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
export default AdminApprovePaymentForm;
