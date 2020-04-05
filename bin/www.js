const app = require('../index.js');
const syncDB = require('./sync-db.js');

syncDB().then(()=>{
    console.log('Sync Database');
    app.listen(3000, ()=>{
        console.log('Server Start!');
    });
})



module.exports = app;