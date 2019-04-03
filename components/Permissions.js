import { Query } from 'react-apollo';
import Error from './ErrorMessage';
import gql from 'graphql-tag';
import Table from './styles/Table';
import SickButton from './styles/SickButton';
import propTypes from 'prop-types';

const possiblePermissions = [
    'ADMIN',
    'USER',
    'ITEMCREATE',
    'ITEMUPDATE',
    'ITEMDELETE',
    'PERMISSIONUPDATE'
];

const ALL_USERS_QUERY = gql`
    query {
        users {
            id
            name
            email
            permissions
        }
    }
`;

const Permissions = props => (
    <Query query={ALL_USERS_QUERY}>
        {({data, loading, error}) => (
                <div>
                    <Error error={error} />
                    <div>
                        <h2>Manage Permissions</h2>
                        <Table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    {possiblePermissions.map(permission => 
                                        <th key={`${permission}-header`}>{permission}</th>)}
                                        <th>👇</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.users.map((user) => <UserPermissions user={user} key={user.email}/>)}
                            </tbody>
                        </Table>
                    </div>
                </div>
            )
        }
    </Query>
)

class UserPermissions extends React.Component {
    static propTypes = {
        user: propTypes.shape({
            name: propTypes.string,
            email: propTypes.string,
            id: propTypes.string,
            permissions: propTypes.array
        }).isRequired
    }
    state = {
        permissions: this.props.user.permissions
    }
    handlePermissionChange = e => {
        const checkbox = e.target;
        // Take a copy of the current permissions
        let updatedPermissions = [...this.state.permissions];
        
        if (checkbox.checked) {
            updatedPermissions.push(checkbox.value);
        } else {
            updatedPermissions = updatedPermissions.filter
            (permission => permission !== checkbox.value)
        }
        this.setState({permissions: updatedPermissions})
    }
    render() {
        const user = this.props.user;
        return (
            <tr>
                <td>{user.name}</td>
                <td>{user.email}</td>
                {possiblePermissions.map(permission => (
                    <td key={`${user.id}-${permission}`}>
                        <label htmlFor={
                            `${user.id}-permission-${permission}`}>
                            <input
                                type="checkbox"
                                checked={this.state.permissions.includes(permission)}
                                value={permission}
                                onChange={this.handlePermissionChange}
                            />
                        </label>
                    </td>
                ))}
                <td>
                    <SickButton>Update</SickButton>
                </td>
            </tr>
        )
    }
}

export default Permissions