const path = require('path')
const cors = require('cors')
const express = require('express')
const bodyParser = require('body-parser')
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express')
const { makeExecutableSchema } = require('graphql-tools')
const app = express()
const log = console.log

var port = process.env.PORT || 4000
// CORS on ExpressJS: https://github.com/expressjs/cors
app.use(cors())

// For fontend route
var frontendDir = path.join(path.dirname(path.dirname(__dirname)), 'frontend')
app.use('/home', express.static(path.join(frontendDir, 'build')))
app.get('/home', function(req, res) {
  res.sendFile(path.join(frontendDir, 'build', 'index.html'))
})
app.get('/', function(req, res) {
  res.redirect('/home')
})

// Realm data
var Realm = require('realm')
const BookSchema = {
  name: 'Book',
  properties: {
    title: 'string',
    author: 'string',
    category: 'string?'
  }
}
const realm = new Realm({ schema: [BookSchema] })
realm.write(() => {
  realm.delete(realm.objects('Book'))
  realm.create('Book', {
    title: "Harry Potter and the Sorcerer's stone",
    author: 'J.K. Rowling'
  })
  realm.create('Book', {
    title: 'Jurassic Park',
    author: 'Michael Crichton',
    category: 'History'
  })
})
const books = realm.objects('Book')

// The GraphQL schema in string form
const typeDefs = `
  type Book { 
    title: String, 
    author: String 
  }

  type Query { 
    books: [Book] 
  }
`

// The resolvers
const resolvers = {
  Query: { books: () => books }
}

// Put together a schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})

// The GraphQL endpoint
app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }))

// GraphiQL, a visual editor for queries
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }))
app.listen(port, function() {
  log('Go to http://localhost:%d/graphiql to run queries!', port)
})
