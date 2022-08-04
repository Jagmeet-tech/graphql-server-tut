const {ApolloServer , gql} = require("apollo-server");

const typeDefs = gql `

    type Query{
        hello : String!,
        randomNumber : Int!,
        queryUsers : [User]!
    }

    type User{
        firstName : String,
        lastName : String,
        email : String
    }

    type Mutation{
        addUser(firstName : String!,lastName : String!,email : String!) : User!,
        deleteUser(email : String!) : User,
        updateUser(email : String!,newEmail : String!) : String!,
    }
`;

let users = [
    {
      firstName: "Jagmeet",
      lastName: "Singh",
      email: "GraphQL@isCool.com"
    },
  ];


const resolvers = {
    Query : {
        hello : () => "Hello World",
        randomNumber : () => Math.round(Math.random() *10) ,
        queryUsers : () => users,
    },

    Mutation : {
        addUser : (parent,args)=>{
            console.log("Parent : ",parent);
            console.log("Args  : ",args);
            users.push(args);
            return args;
        },

        deleteUser : (parent,args) => {
            let obj = {message : "unable to delete"};
            users = users.filter( (val) => {
                if(val.email === args.email)
                    obj = val;
                return val.email !== args.email;
            }) 
            return obj;
        },
        
        updateUser : (parent,{email,newEmail}) => {
            for(let i =0;i<users.length;i++){  //forEach() loop never breaks even you write return or break keyword.
                if(users[i].email === email){
                    users[i].email = newEmail;
                    return "user email updated sucessfully..."
                }
            }
            return "user email not updated..." ;
        }
    }
};

const server = new ApolloServer({
    typeDefs,
    resolvers
});

server.listen({port:8080}).then(({url}) => console.log(`GraphQL server running at ${url}`))

