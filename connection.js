const Sequelize = require('sequelize');

const sequelizeconnection = new Sequelize('BDMobileUsers','postgres', 'Colombia2019',{
    host: 'bdmobileuserchili.caovc0dmef2z.us-west-2.rds.amazonaws.com',
    dialect:'postgres'
});

var connection = function (){
   return sequelizeconnection.authenticate().then(()=>{
    console.log('conectado exitosamente a base de datos');
}).catch(err=>{
    console.log('Error el generar conexion', err);
})
}

/*Query de actualizacion de GraficoInfoVentas */
 var queryInfoVentas=async function querySum(storenum){
     return new Promise((resolve,reject)=>{
         let query='SELECT SUM (finaltotal) as ventas, contact as sucursal from posdetail where storenum ='+ `'${storenum}'` +'and DATE(timestart)='+ `'${'2019-10-09'}'`+' group by contact';
         console.log('STORENUM QUERY VENTAS:', storenum);
         sequelizeconnection.query(query)
            .then(([results, metadata]) => {
                resolve(results);
              })  
     })
    }


/*Query de actualizacion de GraficoInfoDescuentos */
var queryInfoDescuentos=async function queryDescuentos(storenum){
    return new Promise((resolve,reject)=>{
        let query='select sum(finaltotal*-1) as descuentos, promocion from descuentos where storenum ='+ `'${storenum}'` +'and DATE(timestart)='+ `'${'2019-10-09'}'`+' group by promocion';
        console.log('STORENUM QUERY DESCUENTOS:', storenum);
        sequelizeconnection.query(query)
           .then(([results, metadata]) => {
               resolve(results);
             })  
    })
   }
   
  /*Query de actualizacion de GraficoInfoAnulaciones */ 
   var queryInfoAnulaciones=async function queryAnulaciones(storenum){
    return new Promise((resolve,reject)=>{
        let query='SELECT SUM(price*cantidad) as totalAnulaciones, contact as cliente from posheader_pos where storenum ='+ `'${storenum}'` +' and prodtype=101 and DATE(timestart)='+ `'${'2019-10-09'}'`+' group by contact';
        console.log('STORENUM QUERY ANULACIONES:', storenum);
        sequelizeconnection.query(query)
           .then(([results, metadata]) => {
               resolve(results);
             })  
    })
   }


    /*Query de actualizacion de GraficoInfoAnulaciones */ 
    var queryInfotopProduct=async function querytopProduct(storenum){
        return new Promise((resolve,reject)=>{
            let query='SELECT SUM(cantidad) as top, descript as producto, SUM(price*cantidad) as precio from posheader_pos where prodtype<100 and storenum = '+ `'${storenum}'`+'and DATE(timestart)='+ `'${'2019-10-09'}'`+' group by descript order by top desc limit '+5;
            console.log('STORENUM QUERY TOP PRODUCT:', storenum);
            sequelizeconnection.query(query)
               .then(([results, metadata]) => {
                   resolve(results);
                 })  
        })
       }

module.exports= 
{
    connection:connection, 
    queryInfoVentas:queryInfoVentas,
    queryInfoDescuentos:queryInfoDescuentos,
    queryInfoAnulaciones:queryInfoAnulaciones,
    queryInfotopProduct:queryInfotopProduct
};