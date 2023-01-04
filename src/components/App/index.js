import React from 'react';
import axios from 'axios';
import 'dotenv';

import { GET_ORGANIZATION, GET_ISSUES_FROM_REPOSITORY } from '../../gql/query';
import Organization from '../Organizations';

const axiosGithubGraphQL = axios.create({
  baseURL: 'https://api.github.com/graphql',
  headers: {
    Authorization: `bearer ${process.env.REACT_APP_GITHUB_PERSONAL_ACCESS_TOKEN}`
  }
});

const getIssuesOfRepositoryQuery = (organization, repository) => `
  {
    organization(login: "${organization}") {
      name
      url
      repository(name: "${repository}") {
        name
        url
        issues(last: 5) {
          edges {
            node {
              id
              title
              url
            }
          }
        }
      }
    }
  }
`;

const getIssuesOfRepository = path => {
  const [organization, repository] = path.split('/');

  return axiosGithubGraphQL.post('', {
    query: getIssuesOfRepositoryQuery(organization, repository)
  })
}

const resolversIssueQuery = queryResult => () => ({
  organization: queryResult.data.data.organization,
  errors: queryResult.data.errors,
})

class App extends React.Component {
  state = {
    path: 'the-road-to-learn-react/the-road-to-learn-react',
    organization: null,
    errors: null
  }

  onChange = e => {
    this.setState({ path: e.target.value })
  }

  onSubmit = e => {
    this.onFetchFromGithub(this.state.path);

    e.preventDefault();
  }

  componentDidMount() {
    // fetch data
    this.onFetchFromGithub(this.state.path);
  }

  onFetchFromGithub = (path) => {
    getIssuesOfRepository(path)
      .then(queryResult => this.setState(
        resolversIssueQuery(queryResult)
      ));
  }

  render() {
    const { path, organization, errors } = this.state;

    return (
      <div>
        <h1>React GraphQL Github Client</h1>

        <form onSubmit={this.onSubmit}>
          <label htmlFor='url'>
            Show open issues for https://github.com/
          </label>
          <input
            id='url'
            type='text'
            value={path}
            onChange={this.onChange}
            style={{width: '300px'}}
          />
          <button type='submit'>Search</button>
        </form>

        <hr/>
        {
          organization ? ( <Organization organization={organization} errors={errors}/> ) : (<p>No Information yet ...</p>)
        }
        
      </div>
    )
  }
}

export default App;