import React, { Component } from "react";
import * as firebase from "firebase";
import { Button, Checkbox, Icon, Table } from "semantic-ui-react";
import fidelityPoints from '../ethereum/fido';
import web3 from '../ethereum/web3';

class ShopRequestTable extends Component {
  state = {
    shopList: [],
    snapshot: [],
    shopMap:[],
    loadingRenderFirst: true,
    shopEthereumAddress: '',
    errorMessage: '',
    sending: '',
    loading: false
  };

  // Take the ethereum address approved and push the value into the shop approved in the blockchain
  onSubmit = async event => {
    event.preventDefault();
    event.persist();

    console.log("Parameter passed in event => Eth addrs: ", event.target.value)
    console.log("Parameter passed in event =>  id: ", event.target.id)
    var shopEthereumAddress = event.target.value;
    var shopId = event.target.id;

    this.setState({ shopEthereumAddress, loading: true });

    console.log("Ether address in state var: ", this.state.shopEthereumAddress);

    try {
      console.log("NEL TRY");
        const accounts = await web3.eth.getAccounts();
        await fidelityPoints.methods.addShop(this.state.shopEthereumAddress)
        .send({
            from: accounts[0],
            gas: '1000000'
        })
        .then(() => {
          // TODO CONTROLLARE CHE IL CURRENT USER SIA ADMIN ALTTRIMETI TUTTI POSSONO CAMBIARE IL DB
          console.log("Shop added");
          // Edit file in firebase and than in table.
              firebase.app().database().ref("shops").child(shopId).update({ approved: true });
        });
        console.log("Ether address in state var: ", this.state.shopEthereumAddress);

      } catch (err) {
        // TODO check if shop is not in the blockchain
        firebase.app().database().ref("shops").child(shopId).update({ approved: false });
        var trimmedString = err.message.substring(0, 90);
        this.setState({ errorMessage: trimmedString });
    }

    this.setState({ loading: false, shopEthereumAddress: ''});
    window.location.reload();
  }

  // promise
  async loadData() {
    console.log("This happens 3th - inside load data");
    var self = this;
    console.log("This happens 4th - before promise");
    var shopsRef = firebase
      .app()
      .database()
      .ref("shops")
      .orderByChild("approved");

    var promise = new Promise((resolve, reject) => {
      // TODO Da approvare (Aggiungere equealTo(false) per prendere false)
      shopsRef.once("value").then(function(snapshot) {
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
      .then((snapshot) => {
        console.log("This happens 7th - nel then, snapshot: ");
        var promise = new Promise((resolve, reject) => {
          console.log("Nella promise");
          // Shop id
          snapshot.forEach((item) => {
            self.state.shopList.push(item);
          });
          resolve();
        });
        self.setState({
          snapshot,
          loadingRenderFirst: false
        });
        return promise;
      })
      .catch((err) => {
        console.log("This happens 7th - nel catch, err", err);
      });
  }

  render() {
    var listItems;
    var items;

    if (this.state.loadingRenderFirst== true) {
      console.log("This happens 1st - first render()");
      return (
        <Table celled compact definition size="small">
          <Table.Header fullWidth>
            <Table.Row key={"header"}>
              <Table.HeaderCell />
              <Table.HeaderCell>Shop Name</Table.HeaderCell>
              <Table.HeaderCell>Email</Table.HeaderCell>
              <Table.HeaderCell>Address</Table.HeaderCell>
              <Table.HeaderCell>Approved</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body/>

          <Table.Footer fullWidth>
            <Table.Row>
              <Table.HeaderCell />
              <Table.HeaderCell colSpan="4">
              </Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
        </Table>);
    }

    if (this.state.loadingRenderFirst == false) {
    console.log("This happens 8th - changing load value");

    return (
      <Table celled compact definition size="small">
        <Table.Header fullWidth>
          <Table.Row key={"header"}>
            <Table.HeaderCell />
            <Table.HeaderCell>Shop Name</Table.HeaderCell>
            <Table.HeaderCell>Email</Table.HeaderCell>
            <Table.HeaderCell>Address</Table.HeaderCell>
            <Table.HeaderCell>Approved</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {this.state.shopList.map((item, index) => {
            console.log("INDEX RENDER", index);
            var shop = item.val();
            console.log("INDEX RENDER shop", shop);
            console.log("INDEX RENDER item", item);
            console.log("INDEX RENDER key", item.key);
            return <Table.Row key={item.key} positive={shop.approved} negative={!shop.approved}>
                <Table.Cell collapsing>
                  <Button loading={this.state.loading} onClick={this.onSubmit} id={item.key} value={shop.ethereum} size="small">Approve</Button>
                </Table.Cell>
                <Table.Cell collapsing>{shop.shopName}</Table.Cell>
                <Table.Cell collapsing>{shop.email}</Table.Cell>
                <Table.Cell collapsing>{shop.shopAddress}</Table.Cell>
                <Table.Cell collapsing>{shop.approved.toString()}</Table.Cell>
                <Table.Cell collapsing>{shop.ethereum}</Table.Cell>
              </Table.Row>;
          })}
        </Table.Body>

        <Table.Footer fullWidth>
          <Table.Row>
            <Table.HeaderCell />
            <Table.HeaderCell colSpan="4">
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table>);
    }
  }
}
export default ShopRequestTable;
