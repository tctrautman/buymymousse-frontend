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

let totalItems = (cart) => {
    return cart.reduce((tally, cartItem) => {
        return tally + cartItem.quantity;
    }, 0);
}

class TakeMyMoney extends React.Component {
    onToken = (res) => {
        console.log('onToken called');
        console.log(res);
    }

    render() {
        return (
            <User>
                {({ data: { me } }) => (
                    <StripeCheckout
                        amount={calcTotalPrice(me.cart)}
                        name="Buy My Mousse"
                        description={`Order of ${totalItems(me.cart)} items!`}
                        image={me.cart[0].item && me.cart[0].item.image}
                        stripeKey="pk_test_LOwc3raMYylx4UpwzVqi6K0900awfKWiE1"
                        currency="USD"
                        email={me.email}
                        token={res => this.onToken(res)}
                    >
                        <p>{this.props.children}</p>
                    </StripeCheckout>
                )}
            </User>
        );
    }
}

export default TakeMyMoney;
