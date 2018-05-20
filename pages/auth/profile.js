import React, { Component } from "react";
import Layout from "../../components/Layout";
import ProfileTable from "../../components/ProfileTable";

class ProfilePage extends Component {
  state = {};

  render() {
    return (
      <Layout>
        <h1>Profile page</h1>
        <br />
        <p>Welcome to your Personal Profile Page.</p>
        <p>Here you can check the informations about you in our database.</p>
        <ProfileTable />
      </Layout>
    );
  }
}

export default ProfilePage;
