import React, { Component } from "react";
import * as firebase from "firebase";
import { Table, Icon } from "semantic-ui-react";

class ProfileTableShop extends Component {
  state = {
    shopName: '',
    shopAddress: '',
    ownerFirstName: '',
    ownerLastName: '',
    phone: '',
    city: '',
    country: '',
    zipcode: '',
    gender: '',
    username: '',
    email: '',
    ethereum: '',
    bankId: '',
    accountId: '',
    approved: true
  };

  async componentDidMount() {
    var self = this;

    firebase.auth().onAuthStateChanged(function(shop) {
      if (shop) {
        // Getting shop info from the db
        var ref = firebase.database().ref("shops/" + shop.uid);
        ref.once("value").then(function(snapshot) {
          var shopName = snapshot.child("shopName").val();
          var shopAddress = snapshot.child("shopAddress").val();
          var ownerFirstName = snapshot.child("ownerFirstName").val();
          var ownerLastName = snapshot.child("ownerLastName").val();
          var city = snapshot.child("city").val();
          var country = snapshot.child("country").val();
          var zipcode = snapshot.child("zipcode").val();
          var phone = snapshot.child("phone").val();
          var gender = snapshot.child("gender").val();
          var email = snapshot.child("email").val();
          var ethereum = snapshot.child("ethereum").val();
          var username = snapshot.child("username").val();
          var bankId = snapshot.child("bankId").val();
          var accountId = snapshot.child("accountId").val();
          var approved = snapshot.child("approved").val();

          // Saving in state vars the fetched data
          self.setState({
            username,
            ethereum,
            shopName,
            ownerFirstName,
            ownerLastName,
            gender,
            phone,
            country,
            city,
            email,
            zipcode,
            shopAddress,
            bankId,
            accountId,
            approved
          });
        });
      } else {
        console.log("No user is signed in");
      }
    });
  }

  render() {
    return (
      <Table celled striped>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell colSpan="3">Shop Profile Recap</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          <Table.Row>
            <Table.Cell>Username</Table.Cell>
            <Table.Cell>{this.state.username}</Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell collapsing>Shop Name</Table.Cell>
            <Table.Cell>{this.state.shopName}</Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>ownerFirstName</Table.Cell>
            <Table.Cell>{this.state.ownerFirstName}</Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>ownerLastName</Table.Cell>
            <Table.Cell>{this.state.ownerLastName}</Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>Ethereum Account</Table.Cell>
            <Table.Cell>{this.state.ethereum}</Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>Shop Address</Table.Cell>
            <Table.Cell>{this.state.shopAddress}</Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>Phone</Table.Cell>
            <Table.Cell>{this.state.phone}</Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>Email</Table.Cell>
            <Table.Cell>{this.state.email}</Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>City</Table.Cell>
            <Table.Cell>{this.state.city}</Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>Country</Table.Cell>
            <Table.Cell>{this.state.country}</Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>Bank Id</Table.Cell>
            <Table.Cell>{this.state.bankId}</Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>Account Id</Table.Cell>
            <Table.Cell>{this.state.accountId}</Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>Gender</Table.Cell>
            <Table.Cell>{this.state.gender}</Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>Zipcode</Table.Cell>
            <Table.Cell>{this.state.zipcode}</Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>Approved</Table.Cell>
            <Table.Cell>{this.state.approved.toString()}</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );
  }
}
export default ProfileTableShop;
