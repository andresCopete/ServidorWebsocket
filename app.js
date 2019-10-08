const express = require('express');
const app = express();
const server = require('http').Server(app);
const server1 = require('http').Server(app);
const io = require('socket.io')(server,{path:'/admin'});
const iot = require('socket.io')(server1,{path:'/pruebas'});

const sequealize = require('./sequelize');
var PGPubsub = require('pg-pubsub');

 var seq =sequealize.sequelizeconnection;
 var pubsubInstance = new PGPubsub('postgres://postgres:Colombia2019@bdmobileuserchili.caovc0dmef2z.us-west-2.rds.amazonaws.com/BDMobileUsers');

 pubsubInstance.addChannel('insert_eventpos', function (channelPayload) {
  io.emit("change");
  console.log('Evento base de datos',channelPayload );
});

pubsubInstance.addChannel('insert_posdetail', function (channelPayload) {
  iot.emit("cambios");
  console.log('Evento base de datos',channelPayload );
});


io.on('connection', function(socket){
console.log('Socket conectado ....');

socket.on('disconnect', ()=>{
    console.log('Socket desconectado...');
    
})

iot.on('connection',function(socket){
  console.log('Conectado segundo servidor');
})


socket.on('reconnect_attempt', () => {
    console.log('Socket reconection...');
  });
});



server.listen(3030, ()=>{console.log('Servidor Corriendo PORT 3030')});
server1.listen(3130, ()=>{console.log('Servidor Corriendo PORT 3130')});