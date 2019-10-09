const Sequelize = require('sequelize');

const sequelizeconnection = new Sequelize('BDMobileUsers','postgres', 'Colombia2019',{
    host: 'bdmobileuserchili.caovc0dmef2z.us-west-2.rds.amazonaws.com',
    dialect:'postgres'
});

sequelizeconnection.authenticate().then(()=>{
    console.log('conectado exitosamente a base de datos');
}).catch(err=>{
    console.log('Error el generar conexion', err);
})



module.exports.Sequelize= sequelizeconnection;