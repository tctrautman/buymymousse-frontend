import React from 'react';
import StripeCheckout from 'react-stripe-checkout';
import { Mutation } from 'react-apollo';
import Router from 'next/router';
import NProgress from 'nprogress';
import propTypes from 'prop-types';
import gql from 'graphql-tag';
import calcTotalPrice from '../lib/calcTotalPrice';
import Error from './ErrorMessage';
import User, { CURRENT_USER_QUERY } from './User';

const CREATE_ORDER_MUTATION = gql`
    mutation createOrder($token: String!) {
        createOrder(token: $token) {
            id
            charge
            total
            items {
                id
                title
            }
        }
    }
`;

let totalItems = (cart) => {
    return cart.reduce((tally, cartItem) => {
        return tally + cartItem.quantity;
    }, 0);
}

class TakeMyMoney extends React.Component {
    onToken = async (res, createOrder) => {
        NProgress.start();
        const order = await createOrder({
            variables: {
                token: res.id
            }
        }).catch(err => {
            alert(err.message);
        });
        Router.push({
            pathname: '/order',
            query: { id: order.data.createOrder.id }
        })
    };

    render() {
        return (
            <User>
                {({ data: { me }, loading }) => {
                    if (loading) return null;
                    return (
                        <Mutation
                            mutation={CREATE_ORDER_MUTATION}
                            refetchQueries={[{ query: CURRENT_USER_QUERY }]}
                            >
                        {(createOrder, { loading, error }) => (
                            <StripeCheckout
                            amount={calcTotalPrice(me.cart)}
                            name="Buy My Mousse"
                            description={`Order of ${totalItems(me.cart)} items!`}
                            image={me.cart.length && me.cart[0].item && me.cart[0].item.image}
                            stripeKey="pk_test_LOwc3raMYylx4UpwzVqi6K0900awfKWiE1"
                            currency="USD"
                            email={me.email}
                            token={res => this.onToken(res, createOrder)}
                            >
                                <p>{this.props.children}</p>
                            </StripeCheckout>
                        )}
                        </Mutation>
                    )
                }}
            </User>
        );
    }
}

export default TakeMyMoney;
