import { Query, Mutation } from 'react-apollo';
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

const UPDATE_PERMISSIONS_MUTATION = gql`
    mutation updatePermissions($permissions: [Permission],
        $userId: ID!) {
            updatePermissions(permissions: $permissions, userId: $userId) {
                id
                permissions
                name
                email
            }
        }
`;

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
            <Mutation
                mutation={UPDATE_PERMISSIONS_MUTATION}
                variables={{
                    permissions: this.state.permissions,
                    userId: this.props.user.id
                }}
            >
                {(updatedPermissions, { loading, error }) => (
                    <>
                        {error && <tr><td colspan="8"><Error error={error} /></td></tr>}
                        <tr>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            {possiblePermissions.map(permission => (
                                <td key={`${user.id}-${permission}`}>
                                    <label htmlFor={
                                        `${user.id}-permission-${permission}`}>
                                        <input
                                            type="checkbox"
                                            id={`${user.id}-permission-${permission}`}
                                            checked={this.state.permissions.includes(permission)}
                                            value={permission}
                                            onChange={this.handlePermissionChange}
                                            />
                                    </label>
                                </td>
                            ))}
                            <td>
                                <SickButton
                                    type="button"
                                    disabled={loading}
                                    onClick={updatedPermissions}
                                >Updat{loading ? 'ing' : 'e'}</SickButton>
                            </td>
                        </tr>
                    </>
                )}
            </Mutation>
        )
    }
}

export default Permissions
