const express = require('express');
const app = express();
/*Creamos varios servidores en express que esten atendiendo varias instancias */
const server = require('http').Server(app);
const server1 = require('http').Server(app);
const server2 = require('http').Server(app);

/*Creamos varias instancias de websocket server para inscribirlos a los triggers */
const io = require('socket.io')(server,{path:'/admin'});
const iot = require('socket.io')(server1,{path:'/pruebas'});
const iod = require('socket.io')(server2,{path:'/descuentos'});

var maestro= require('./connection');
//const sequealize = require('./sequelize');
var PGPubsub = require('pg-pubsub');

// var seq = sequealize.sequelizeconnection;
 var pubsubInstance = new PGPubsub('postgres://postgres:Colombia2019@bdmobileuserchili.caovc0dmef2z.us-west-2.rds.amazonaws.com/BDMobileUsers');

 
let connection = maestro.connection();

 pubsubInstance.addChannel('insert_eventpos', function (channelPayload) {
   console.log('EVENTO BASE DE DATOS SUM------------>');
 let query = maestro.queryInfoAnulaciones(channelPayload.storenum).then(result=>{
   console.log('RESULTADO DEL QUERY ANULACIONES', result);
   //io.emit("change");
  io.emit("anulaciones and top product",result,channelPayload.storenum);
 });

 let interno = maestro.queryInfotopProduct(channelPayload.storenum).then(product=>{
  console.log('RESULTADO DEL QUERY TOP PRODUCT', product);
  io.emit(" top product",product,channelPayload.storenum);
})
  //  console.log('PRIMER ENDPOINT DE SUMA DE PRODUCTOS', query)
  // io.emit("change");
  // console.log('Evento base de datos',channelPayload );

});

pubsubInstance.addChannel('insert_posdetail', function (channelPayload) {
  let query = maestro.queryInfoVentas(channelPayload.storenum).then(result=>{
    console.log('RESULTADO DEL QUERY POSDETAIL', result);
    //io.emit("change");
    io.emit("change",result, channelPayload.storenum);
  });

  // iot.emit("cambios");
  // console.log('Evento base de datos',channelPayload );
});


pubsubInstance.addChannel('insert_descuentos', function (channelPayload) {
  let query = maestro.queryInfoDescuentos(channelPayload.storenum).then(result=>{
    console.log('RESULTADO DEL QUERY DESCUENTOS', result);
    //io.emit("change");
    io.emit("descuentos",result, channelPayload.storenum);
  });

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
server2.listen(3131, ()=>{console.log('Servidor Corriendo PORT 3132')});