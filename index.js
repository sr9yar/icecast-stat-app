'use strict';

const Hapi=require('hapi');
const Monitor = require('icecast-monitor');

require('dotenv').config();


const monitor = new Monitor({
  host: process.env.ICECAST_HOST,
  port: process.env.ICECAST_PORT,
  user: process.env.ICECAST_USER,
  password: process.env.ICECAST_PASSWORD
});


const server=Hapi.server({
    host: process.env.HOST || 'localhost',
    port: process.env.PORT || '8000'
});

// Main route
server.route({
    method:'GET',
    path:'/',
    handler: (request,h) => {



        return `PORT ${process.env.PORT}`;
    }
});


// Some route
server.route({
    method:'GET',
    path:'/hello',
    handler:(request,h) => {

        return 'hello';
    }
});





// getServerInfo  route
server.route({
    method:'GET',
    path:'/getServerInfo',
    handler: async (request,h) => {

        return await new Promise((resolve, reject) =>{
            monitor.getServerInfo(function(err, server) {
                if (err) reject( err );
                resolve( server );
            });
        });

    }
});



// getListeners  route
server.route({
    method:'GET',
    path:'/getListeners',
    handler: async (request,h) => {

        return await new Promise((resolve, reject) =>{
            monitor.getListeners(function(err, listeners) {
                if (err) reject( err );
                resolve( listeners );
              });

        });

    }
});










// listclients  route
server.route({
    method:'GET',
    path:'/listclients',
    handler: async (request,h) => {

        const url = '/admin/listclients';
        // const url = '/admin/stats';
        
        return await new Promise((resolve, reject) =>{
            // Collect sources without storing them in a memory
            monitor.createStatsXmlStream( url,  (err, xmlStream) => {
                if (err) reject( err );
                
                const xmlParser = new Monitor.XmlStreamParser();
                
                const arr = []
                xmlParser.on('error', (err) => {
                    console.log('error', err); 
                    reject( err );
                });
                
                xmlParser.on('source', (source) => {
                    // Do work with received source
                    console.log('source', source);
                    arr.push( source );
                });
            
                // Finish event is being piped from xmlStream
                xmlParser.on('finish', () => {
                    console.log('all sources are processed');
                    resolve( arr );
                });
            
                xmlStream.pipe( xmlParser );
            });

        });


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
