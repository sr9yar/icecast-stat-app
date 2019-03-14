'use strict';

const Hapi=require('hapi');
const Monitor = require('icecast-monitor');

const monitor = new Monitor({
  host: 'icecast.dev',
  port: 80,
  user: 'admin',
  password: 'hackme'
});


const server=Hapi.server({
    host:'localhost',
    port:8000
});

// Main route
server.route({
    method:'GET',
    path:'/',
    handler:function(request,h) {
        return 'main';
    }
});


// Some route
server.route({
    method:'GET',
    path:'/hello',
    handler:function(request,h) {

        return 'hello';
    }
});


// Start the server
async function start() {

    try {
        await server.start();
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }

    console.log('Server is running at:', server.info.uri);
};

start();