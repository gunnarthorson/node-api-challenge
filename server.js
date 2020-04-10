const express = require('express');
const helmet = require("helmet");
const projectRouter= require("./routers/projectRouter")
const actionRouter= require("./routers/actionRouter");

const server =  express();
server.use(helmet());
server.use(express.json());

server.use("/api/projects", projectRouter)
server.use('/api/actions', actionRouter)

server.get('/', (req, res)=>{
    res.send('Server Is Running');
})

module.exports = server; 