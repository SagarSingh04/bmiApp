const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;
const app = require('./app');
const port = process.env.PORT || 3000;

if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);
  
    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }
  
    //Check if work id is died
    cluster.on('exit', (worker, code, signal) => {
      console.log(`worker ${worker.process.pid} died`);
    });
  
  } else {
    // This is Workers can share any TCP connection
    // It will be initialized using express
    console.log(`Worker ${process.pid} started`);

    //Creating the server
    const server = http.createServer(app);
    //Listening on port 3000
    server.listen(port);
  }