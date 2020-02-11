import React, { Component } from 'react';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import ErrorMessage from './ErrorMessage';
import Table from './styles/Table';
import SickButton from './styles/SickButton';

const possiblePermissions = [
  'ADMIN',
  'USER',
  'ITEMCREATE',
  'ITEMUPDATE',
  'ITEMDELETE',
  'PERMISSIONUPDATE',
];

const UPDATE_PERMISSIONS_MUTATION = gql`
  mutation UPDATE_PERMISSIONS_MUTATION($permissions: [Permission], $userId: ID!) {
    updatePermissions(permissions: $permissions, userId: $userId) {
      id
      permissions
      name
      email
    }
  }

`;

const ALL_USERS_QUERY = gql`
  query ALL_USERS_QUERY {
    users {
      id
      name
      email
      permissions
    }
  }
`;

const Permissions = (props) => (
  <Query query={ALL_USERS_QUERY} >
  {({ data, loading, error })=> (
      <div>
        <ErrorMessage error={error} />
        <div>
          <h2>Manage Permissions</h2>
          <Table>
            <thead>
              <tr>
               <th>Name</th>
               <th>Email</th>
               {possiblePermissions.map(p => {
                  return <th key={p}>{p}</th>
               })}
               <th>{' '}</th>
              </tr>
            </thead>
            <tbody>
              {data.users.map(user => [
                <UserPermissions key={user.id} user={user} />
              ])}
            </tbody>
          </Table>
        </div>
      </div>
    )
  }
  </Query>
);

class UserPermissions extends Component {
  static propTypes = {
    user: PropTypes.shape({
      name: PropTypes.string,
      email: PropTypes.string,
      id: PropTypes.string,
      permissions: PropTypes.array,
    }).isRequired
  }

  state = {
    permissions: this.props.user.permissions,
  }

  handlePermissionChange = (e) => {
    const checkbox = e.target;
    // get copy of curr permissions
    let updatedPermissions = [...this.state.permissions];
    // remove permission if unchecked, add if checked
    if(checkbox.checked){
      updatedPermissions.push(checkbox.value);
    } else {
      updatedPermissions = updatedPermissions.filter(p => p !== checkbox.value);
    }
    this.setState({ permissions: updatedPermissions});
  }

  render() {
    const user = this.props.user;
    return (
      <Mutation
        mutation={UPDATE_PERMISSIONS_MUTATION}
        variables={{permissions: this.state.permissions, userId: user.id}}
        >
        {(updatePermissions, {loading, error})=> {
         return (
           <tr>
             <td>{user.name}</td>
             <td>{user.email}</td>
             {possiblePermissions.map(p => {
               return (
                 <td key={p}>
                   <label htmlFor={`${user.id}-permission-${p}`}>
                   <input
                   id={`${user.id}-permission-${p}`}
                   type="checkbox"
                   checked={this.state.permissions.includes(p)}
                   value={p}
                   onChange={this.handlePermissionChange}/>
                   </label>
                 </td>
               );
             })}
             <td>
             <SickButton
               type="button"
               disabled={loading}
               onClick={updatePermissions}
               >
               Updat{loading? 'ing' : 'e'}
               </SickButton>
             </td>
           </tr>
         );
      }}
    </Mutation>
    );
  }
};


export default Permissions;
