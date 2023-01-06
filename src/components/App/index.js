import React from 'react';
import axios from 'axios';
import 'dotenv';

import { GET_ISSUES_FROM_REPOSITORY } from '../../gql/query';
import { ADD_STAR, REMOVE_STAR } from '../../gql/mutation';

import Organization from '../Organizations';

const axiosGithubGraphQL = axios.create({
  baseURL: 'https://api.github.com/graphql',
  headers: {
    Authorization: `bearer ${process.env.REACT_APP_GITHUB_PERSONAL_ACCESS_TOKEN}`
  }
});

const getIssuesOfRepository = (path, cursor) => {
  const [organization, repository] = path.split('/');

  return axiosGithubGraphQL.post('', {
    query: GET_ISSUES_FROM_REPOSITORY,
    variables: { organization, repository, cursor }
  })
}

const addStarToRepository = repositoryId => {
  return axiosGithubGraphQL.post('', {
    query: ADD_STAR,
    variables: { repositoryId },
  });
};

const removeStarFromRepository = repositoryId => {
  return axiosGithubGraphQL.post('', {
    query: REMOVE_STAR,
    variables: { repositoryId },
  })
}

const resolversIssueQuery = (queryResult, cursor) => (state) => {
  const { data, errors } = queryResult.data;

  if(!cursor) {
    return {
      organization: data.organization,
      errors,
    }
  }

  const { edges: oldIssues } = state.organization.repository.issues;
  const { edges: newIssues } = data.organization.repository.issues;
  const updatedIssues = [...oldIssues, ...newIssues];

  return {
    organization: {
      ...data.organization,
      repository: {
        ...data.organization.repository,
        issues: {
          ...data.organization.repository.issues,
          edges: updatedIssues,
        },
      },
    },
    errors,
  }
}

const resolveAddStarMutation = mutationResult => state => {
  if(!mutationResult) {
    return state;
  }

  const {
    viewerHasStarred,
  } = mutationResult.data.data.addStar.starrable;

  const { totalCount } = state.organization.repository.stargazers;

  return {
    ...state,
    organization: {
      ...state.organization,
      repository: {
        ...state.organization.repository,
        viewerHasStarred,
        stargazers: {
          totalCount: totalCount + 1,
        },
      },
    },
  };
};
const resolveRemoveStarMutation = mutationResult => state => {
  const { viewerHasStarred } = mutationResult.data.data.removeStar.starrable;

  const { totalCount } = state.organization.repository.stargazers;

  return {
    ...state,
    organization: {
      ...state.organization,
      repository: {
        ...state.organization.repository,
        viewerHasStarred,
        stargazers: {
          totalCount: totalCount - 1,
        }
      }
    }
  }
}

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

  onFetchFromGithub = (path, cursor) => {
    getIssuesOfRepository(path, cursor)
      .then(queryResult => this.setState(
        resolversIssueQuery(queryResult, cursor)
      ));
  }

  onFetchMoreIssues = () => {
    const { endCursor } = this.state.organization.repository.issues.pageInfo;

    this.onFetchFromGithub(this.state.path, endCursor);   
  }

  onStarRepository = (repositoryId, viewerHasStarred) => {
    if (viewerHasStarred) {
      removeStarFromRepository(repositoryId).then(mutationResult =>
        this.setState(resolveRemoveStarMutation(mutationResult)),
      );
    } else {
      addStarToRepository(repositoryId).then(mutationResult =>
        this.setState(resolveAddStarMutation(mutationResult)),
      );
    }
  };

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
          organization ? ( <Organization organization={organization} errors={errors} onFetchMoreIssues={this.onFetchMoreIssues} onStarRepository={this.onStarRepository}/> ) : (<p>No Information yet ...</p>)
        }
        
      </div>
    )
  }
}

export default App;