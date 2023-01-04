const GET_ORGANIZATION = `
    {
        organization(login: "the-road-to-learn-react") {
            name
            url
        }
    }

`

const GET_ISSUES_FROM_REPOSITORY = `
    query($organization: String!, $repository: String!){
        organization(login: $organization) {
          name
          url
          repository(name: $repository) {
            name
            url
            issues(last: 5){
              edges{
                node{
                  id
                  title
                  url
                }
              }
            }
          }
        }
    }
`

export { GET_ORGANIZATION, GET_ISSUES_FROM_REPOSITORY };