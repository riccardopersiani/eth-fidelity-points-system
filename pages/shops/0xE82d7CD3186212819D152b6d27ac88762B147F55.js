import React, { Component } from 'react';
import { Button, Image, Header, Card } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import fidelityPoints from '../../ethereum/fido';
import { Link } from '../../routes';
import BuyProductForm from '../../components/BuyProductForm';

class ProductIndex extends Component {
    static async getInitialProps(props) {
        const summary = await fidelityPoints.methods.getSummary().call();
        return {
            owner: summary[1],
        };
    }

    state = {
        receiver: this.props.owner
    }

    render() {
        return(
            <Layout>
                <Header as='h1'>Operator Shop page</Header>
                <br/>
                <p>Here you can select your favorite shop.</p>
                <br/>
                <Card.Group>
                    <Card>
                        <Card.Content>
                            <Image floated='right' size='mini' src='/assets/images/avatar/large/steve.jpg'/>
                            <Card.Header>
                                Smartpthone
                            </Card.Header>
                            <Card.Meta>
                                Last model
                            </Card.Meta>
                            <Card.Description>
                                1000 FIDO
                            </Card.Description>
                        </Card.Content>
                        <Card.Content extra>
                            <BuyProductForm shopName="Main Shop" product="smartphone1" receiver={this.state.receiver} tokens="1000"/>
                        </Card.Content>
                    </Card>

                    <Card>
                        <Card.Content>
                            <Image floated='right' size='mini' src='/assets/images/avatar/large/steve.jpg' />
                            <Card.Header>
                                Smartpthone
                            </Card.Header>
                            <Card.Meta>
                                Version 1
                            </Card.Meta>
                            <Card.Description>
                                1000 FIDO
                            </Card.Description>
                        </Card.Content>
                        <Card.Content extra>
                            <BuyProductForm shopName="Main Shop" product="smartphone2" receiver={this.state.receiver} tokens="1000"/>
                        </Card.Content>
                    </Card>

                    <Card>
                        <Card.Content>
                            <Image floated='right' size='mini' src='/assets/images/avatar/large/steve.jpg' />
                            <Card.Header>
                                Tablet
                            </Card.Header>
                            <Card.Meta>
                                Version 2
                            </Card.Meta>
                            <Card.Description>
                                2000 FIDO
                            </Card.Description>
                        </Card.Content>
                        <Card.Content extra>
                            <BuyProductForm shopName="Main Shop" product="tablet1" receiver={this.state.receiver} tokens="2000"/>
                        </Card.Content>
                    </Card>

                    <Card>
                        <Card.Content>
                            <Image floated='right' size='mini' src='/assets/images/avatar/large/steve.jpg' />
                            <Card.Header>
                                Personal Computer
                            </Card.Header>
                            <Card.Meta>
                                Last model
                            </Card.Meta>
                            <Card.Description>
                                5000 FIDO
                            </Card.Description>
                        </Card.Content>
                        <Card.Content extra>
                            <BuyProductForm shopName="Main Shop" product="pc1" receiver={this.state.receiver} tokens="5000"/>
                        </Card.Content>
                    </Card>

                    <Card>
                        <Card.Content>
                            <Image floated='right' size='mini' src='/assets/images/avatar/large/steve.jpg' />
                            <Card.Header>
                                EBook Reader
                            </Card.Header>
                            <Card.Meta>
                                Last model
                            </Card.Meta>
                            <Card.Description>
                                500 FIDO
                            </Card.Description>
                        </Card.Content>
                        <Card.Content extra>
                            <BuyProductForm shopName="Main Shop" product="ebookReader1" receiver={this.state.receiver} tokens="500"/>
                        </Card.Content>
                    </Card>

                    <Card>
                        <Card.Content>
                            <Image floated='right' size='mini' src='/assets/images/avatar/large/steve.jpg' />
                            <Card.Header>
                                Headphones
                            </Card.Header>
                            <Card.Meta>
                                Last model
                            </Card.Meta>
                            <Card.Description>
                                200 FIDO
                            </Card.Description>
                        </Card.Content>
                        <Card.Content extra>
                            <BuyProductForm shopName="Main Shop" product="headphones1" receiver={this.state.receiver} tokens="200"/>
                        </Card.Content>
                    </Card>

                </Card.Group>
                <br/>
            </Layout>
        );
    }
}

export default ProductIndex;