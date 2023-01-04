const GET_ORGANIZATION = `
    {
        organization(login: "the-road-to-learn-react") {
            name
            url
        }
    }

`

const GET_ISSUES_FROM_REPOSITORY = `
    {
        organization(login: "the-road-to-learn-react") {
          name
          url
          repository(name: "the-road-to-learn-react") {
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