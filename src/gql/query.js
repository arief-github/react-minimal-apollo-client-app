const GET_ORGANIZATION = `
    {
        organization(login: "the-road-to-learn-react") {
            name
            url
        }
    }

`

const GET_ISSUES_FROM_REPOSITORY = `
      query ($organization: String!, $repository: String!, $cursor: String) {
    organization(login: $organization) {
      name
      url
      repository(name: $repository) {
        name
        url
        issues(first: 5, after: $cursor, states: [OPEN]) {
          edges {
            node {
              id
              title
              url
              reactions(last: 3) {
                edges {
                  node {
                    id
                    content
                  }
                }
              }
            }
          }
          totalCount
          pageInfo {
            endCursor
            hasNextPage
          }
        }
      }
    }
  }
`

export { GET_ORGANIZATION, GET_ISSUES_FROM_REPOSITORY };