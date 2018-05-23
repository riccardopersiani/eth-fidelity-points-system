import React, { Component } from "react";
import * as firebase from "firebase";
import { Table } from "semantic-ui-react";
import fidelityPoints from "../../ethereum/fido";
import EthereumRequestRow from "./EthereumRequestRow";
import Psd2RequestRow from "./Psd2RequestRow";

class AdminApprovePaymentForm extends Component {

  state = {
    loadingRenderFirst: true,
    errorMessage: "",
    ethereumRequests: [],
    psd2Requests: [],
    loading: false
  };

  // Getting psd2 payments.
  async loadData() {
    var paymentRef = firebase.app().database().ref("pending_payments_psd2");
    var promise = new Promise((resolve, reject) => {
      paymentRef.once("value").then(function(snapshot) {
        resolve(snapshot);
      });
    });
    return promise;
  }

  // Getting psd2 and eth request list when component is mounting.
  async componentDidMount() {
    var self = this;
    // Get Psd2 request list from the db.
    this.loadData()
      .then(async (snapshot) => {
        var promise = new Promise((resolve, reject) => {
          snapshot.forEach(item => { self.state.psd2Requests.push(item); });
          resolve();
        })
        // Get Ethereum request List from the contract.
        const ethereumRequestCount = await fidelityPoints.methods.getRequestsCount().call();
        const ethereumRequests = await Promise.all(
            Array(parseInt(ethereumRequestCount))
            .fill().map((element, index) => {
                return fidelityPoints.methods.ethereumPaymentRequests(index).call();
            })
        );
        self.setState({ ethereumRequests, loadingRenderFirst: false });
        return promise;
      }).catch(err => {
        console.log("This happens 7th - nel catch, err", err);
      });
  }

  // Rendering Ethereum payment request asked by every shop.
  renderRows() {
    return this.state.ethereumRequests.map((request, index) => {
        return <EthereumRequestRow
            key={index}
            id={index}
            request={request}
        />
    })
  }

  // Rendering Psd2 payment request asked by every shop
  renderRowsPsd2() {
    return this.state.psd2Requests.map((request, index) => {
        return <Psd2RequestRow
            key={index}
            id={request.key}
            request={request.val()}
        />
    })
  }

  render() {
    if (this.state.loadingRenderFirst == true) {
      return (
        <Table celled compact definition size="small">
          <Table.Header fullWidth>
            <Table.Row key={"header"}>
              <Table.HeaderCell />
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
              <Table.HeaderCell />
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
              <Table.HeaderCell />
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
              <Table.HeaderCell colSpan="5" />
            </Table.Row>
          </Table.Footer>
        </Table>
      );
    }
  }
}
export default AdminApprovePaymentForm;