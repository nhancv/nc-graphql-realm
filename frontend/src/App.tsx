import * as React from 'react'
import { ApolloProvider, Query } from 'react-apollo'
import ApolloClient from 'apollo-boost'
import gql from 'graphql-tag'
import './App.css'
const logo = require('./logo.svg')

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql'
})

// Fetch GraphQL data with a Query component
const ExchangeRates = () => (
  <Query
    query={gql`
      {
        books {
          title
          author
        }
      }
    `}
  >
    {({ loading, error, data }) => {
      if (loading) {
        return <p>Loading...</p>
      }
      if (error) {
        return <p>Error :(</p>
      }

      return data.books.map(({ title, author }) => (
        <div key={title}>
          <p>{`${author}`}</p>
        </div>
      ))
    }}
  </Query>
)

export default class App extends React.Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Welcome to React</h1>
          </header>
          <div className="App-intro">
            <ExchangeRates />
          </div>
        </div>
      </ApolloProvider>
    )
  }
}
