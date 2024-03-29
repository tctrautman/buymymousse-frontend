import { mount } from 'enzyme';
import wait from 'waait';
import toJSON from 'enzyme-to-json';
import Router from 'next/router';
import Pagination, { PAGINATION_QUERY } from '../components/Pagination';
import { MockedProvider } from 'react-apollo/test-utils';

Router.router = {
    push() {},
    prefetch() {}
};

function makeMocksFor(length) {
    return [
        {
            request: {
                query: PAGINATION_QUERY
            },
            result: {
                data: {
                    itemsConnection: {
                        __typename: 'aggregate',
                        aggregate: {
                            __typename: 'count',
                            count: length
                        }
                    }
                }
            }
        }
    ]
};

describe('<Pagination />', () => {

    it('Displays a loading message', () => {
        const wrapper = mount(
            <MockedProvider mocks={makeMocksFor(1)}>
                <Pagination page={1} />
            </MockedProvider>
        );

        expect(wrapper.text()).toContain('Loading...');
    });

    it('Renders pagination for 18 items', async () => {
        const wrapper = mount(
            <MockedProvider mocks={makeMocksFor(18)}>
                <Pagination page={1} />
            </MockedProvider>
        );

        await wait();
        wrapper.update();
        
        expect(wrapper.find('.totalPages').text()).toEqual('5');
        const pagination = wrapper.find('div[data-test="pagination"]');
        expect(toJSON(pagination)).toMatchSnapshot();
    });

    it('diables prev button on first page', async () => {
        const wrapper = mount(
            <MockedProvider mocks={makeMocksFor(18)}>
                <Pagination page={1} />
            </MockedProvider>
        );

        await wait();
        wrapper.update();
        
        expect(wrapper.find('a.prev').prop('aria-disabled')).toEqual(true)
        expect(wrapper.find('a.next').prop('aria-disabled')).toEqual(false)
    });

    it('diables next button on last page', async () => {
        const wrapper = mount(
            <MockedProvider mocks={makeMocksFor(18)}>
                <Pagination page={5} />
            </MockedProvider>
        );

        await wait();
        wrapper.update();
        
        expect(wrapper.find('a.prev').prop('aria-disabled')).toEqual(false)
        expect(wrapper.find('a.next').prop('aria-disabled')).toEqual(true)
    });

    it('enables all buttons on middle page', async () => {
        const wrapper = mount(
            <MockedProvider mocks={makeMocksFor(18)}>
                <Pagination page={3} />
            </MockedProvider>
        );

        await wait();
        wrapper.update();
        
        expect(wrapper.find('a.prev').prop('aria-disabled')).toEqual(false)
        expect(wrapper.find('a.next').prop('aria-disabled')).toEqual(false)
    });
});
