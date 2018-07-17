const express = require('express');
const bodyParser = require('body-parser');
const Blockchain = require('../blockchain');
const P2pServer = require('./p2p-server');

const HTTP_PORT = process.env.HTTP_PORT || 80;

const app = express();
const bc = new Blockchain();
const p2pServer = new P2pServer(bc);

app.use(bodyParser.json());

//api 1: list blocks in chain
app.get('/blocks', (req,res)=>{
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.json(bc.chain);
});

//api 2: mine blocks
app.post('/mine', (req,res)=>{
    console.log(req.body);
    const block = bc.addBlock(req.body.data);
    console.log(`New block added : ${block.toString()}`);
    
    p2pServer.syncChains();
    
    res.redirect('/blocks');
});

app.listen(HTTP_PORT,  () => console.log(`Listening on port ${HTTP_PORT}`));
p2pServer.listen();