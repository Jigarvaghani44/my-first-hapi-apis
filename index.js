"use strict";
const hapi = require('@hapi/hapi');
const HapiSwagger = require('hapi-swagger');
require('./databageconfig/databageConfig')
const myFirstPlugin = require('./myplugin');
const Bcrypt = require('bcrypt');
const port =3000
const path = require('path');
const inert = require('@hapi/inert');
const { request } = require('http');
const { log } = require('handlebars');
const Vender = require('./databage/veder')
const Boom = require("@hapi/boom")
const Pack = require('./package.json');
const users = {
    john: {
        username: 'john',
        password: "john@123", // Use bcrypt to hash
        name: 'John Doe',
        id: 'user-id-123'
    }
};

// console.log(users["john"]);

// const validate= async(request,username,password)=>{
//     const user = users[username];
//     console.log(user.password);
//     console.log(password);
//     console.log(typeof user.password);  console.log(typeof password);
    
    
//     if (!user) {
//         return { credentials: null, isValid: false };
//     }
//     const isValid = (password === user,password);
//     return { isValid, credentials: { id: user.id, name: user.name } };
   
// }

const init = async () => {
    const server = hapi.server({
        port:port,
        host:"localhost",
        routes:{
            files:{
                relativeTo:path.join(__dirname,"./static")
            }
        }})
        const swaggerOptions = {
            info: {
                title: 'API Documentation',
                version: Pack.version,
                description: 'This is a sample Hapi.js API with Swagger documentation'
            },
            grouping: 'tags', // Group routes by tags
            tags: [
                {
                    name: 'users',
                    description: 'API related to user operations'
                }
            ]
        };
    // const myplugin = {
    //     name: "myfirstplugin",
    //     version:"1.0.0",
    //     register :async function(server,option){
    //         server.route({
    //             method :"GET",
    //             path:"/test",
    //             handler : function(req,h){
    //                 return "hello worlds"
    //             }
    //         });
    //         // await someAsyncMethods();
    //     }
    // }
    // await server.register(require('hapi-geo-locate'))

    

    await server.register([{
        plugin: require('hapi-geo-locate'),
        options: {
            enabledByDefault : true
        }
    },{
        plugin:myFirstPlugin ,
        options: {
            name: 'Bob'
        }
    },
    {
        plugin:inert
    },{
        plugin:require('@hapi/vision')
    },{
        plugin:require('@hapi/basic')
    },{
        plugin:require('@hapi/cookie')
    },{
        plugin:HapiSwagger,
        options: swaggerOptions
    }
])
server.views({
    engines:{
        hbs : require('handlebars')
    },
    path:path.join(__dirname,"./views"),
    layout:'default',
    partialsPath:path.join(__dirname,"./partials")
});
// server.auth.strategy('first','basic',{validate});
// server.auth.default('first')

server.auth.strategy('first','cookie',{
    cookie:{
        name:'firstcookie',
        password:'john@123john@123john@123john@123john@123',
        isSecure:false

    },
    redirectTo:"/login",
    validate:async (request,firstcookie)=>{
        const user = users.john;
        console.log(user);
        
        if (!user) {
                return { credentials: null, isValid: false };
                }
        const isValid = (firstcookie.password === user.password);
        console.log(firstcookie.password);
        
        return { isValid, credentials: { id: user.id, name: user.name } };
    }
})
server.auth.default('first')
server.route({
    method:"GET",
    path:"/",
    handler: async (request,h) =>{
        // console.log("hell");
        // return Vender.find();
       return h.view('home')
    // use client location
    // handler: {
    //     file:"home.html"
    // file:(request)=>{
    //     console.log(request.params.name);
    //     const way =path.join(__dirname,"./static",request.params.name);
    //     console.log(way);
        
    //     return way;
    // }
    },
    options: {
       
        description: 'Get user by ID',
        notes: 'Returns user details by user ID',
        tags: ['api', 'users'], // Tags for grouping in Swagger UI
        validate: {
            params: {
                id: {
                    type: 'string',
                    description: 'the ID of the user'
                }
            }
        },
        response: {
            schema: {
                id: 'string',
                name: 'string'
            },
            status: {
                200: { description: 'User found' },
                404: { description: 'User not found' }
            }
        }
    }
   
});  
 
    server.route({
        method:"GET",
        path:"/location",
        
        handler: (request,h) =>{
            const location = request.location
            if(location){
                return location
            }else{
                return "<h1>your location is not enabled</h1>"
            }
        // use client location
 
        
        }
    });
    server.route({
        method:"GET",
        path:"/user", 
        handler: (req,h) =>{
            const name = req.auth.credentials.id;
            console.log(name);
            
            return `hello world ${name} `
        }
    });
    server.route({
        method:"GET",
        path:"/login",
        options:{
            auth:{
                mode:'try'
            }
        },
        handler: (req,h) =>{
           
            return h.view('login.hbs')
        }
    });
    // server.route({
    //     method:"GET",
    //     path:"/logout",
    //     handler:(request,h)=>{
    //         return Boom.unauthorized("you are logout");
    //     }
    // });
    server.route({
        method:'GET',
        path:'/logout',
        handler:async(request,h)=>{
           request.cookieAuth.clear();
            
            return "successfully logout";
        }
    })
    server.route({
        method:'POST',
        path:"/",
       
        handler:async (request,h)=>{
            // const name = request.auth.credentials.name;
            // console.log(name);

            
            // return `hii ${name} you are login `;
            // if(request.payload.name==='Saranshshandlya' &&request.payload.password==='App@1234'){
            //     return h.view('login',{name:request.payload.name})
            // }else{
            //     return h.view('404_err')
            // }
            // console.log(request.payload);
        // try {
        //     await Vender.insertMany(request.payload)
        //     console.log("success fully inserted");
        //     h.response(request.payload)
            
        // } catch (error) {
        //     console.log(error);
        //     h.response(error)
        // }
        const { username, password } = request.payload;
        const user = users['john']
        console.log(user.password);
        console.log(password);
        
        
        if (!user || !(user.password===password)) {
                return  h.redirect('/login');
                }
       
        request.cookieAuth.set({password: user.password});

        return h.redirect('/'); 
        },
        options:{
            auth:{
                mode:'try'
            }
        }
    });
    server.route({
        method:'POST',
        path:"/register",
        handler:async (request,h)=>{
          try{
         await Vender.insertMany(request.payload)
            console.log("success fully inserted");
           return  h.response(request.payload)
            
        } catch (error) {
            console.log(error);
            return h.response(error)
        }
             
        }
        
        
    });
    server.route({
        path: '/resource/{ttl?}',
        method: 'GET',
        handler: (request, h) => {
            // const response = h.response({ message: 'hello' });
            // // console.log(response.t);
            
            // if (request.params.ttl) {
            //     response.ttl(request.params.ttl);
            //     // console.log(response.ttl);
                
            // }
            return h.response({ message: 'hello' })
            .header('Last-Modified', lastModified.toUTCString());
        
        },
        options: {
          cache:{
            expiresIn: 30 * 1000,
            privacy:'private'
          }
        }
    });
    
    server.route({
        method:'PATCH',
        path:"/up/{id}",
        handler:async (request,h)=>{
          console.log('enter not');
          
            try{
                console.log('enter');
                
            const _id =request.params.id;
            console.log(_id);
            
         const result = await Vender.findByIdAndUpdate(_id,request.payload,{new:true})
            console.log("success fully inserted");
           return  h.response(result)
            
        } catch (error) {
            console.log(error);
            return h.response(error)
        }
             
        }
    }
);

server.route({
    method:'delete',
    path:"/up/{id}",
    handler:async (request,h)=>{
    //   console.log('enter not');
      
        try{
            // console.log('enter');
            
        const _id =request.params.id;
        console.log(_id);
        
     const result = await Vender.findByIdAndDelete(_id)
        console.log("success fully delelted");
       return  h.response(result)
        
    } catch (error) {
        console.log(error);
        return h.response(error)
    }
         
    }
}
);
  
    await server.start();
    console.log("server start on port ",port);
}
process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});
init();