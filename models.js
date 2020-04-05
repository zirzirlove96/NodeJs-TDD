const Sequelize = require('sequelize');//sequelize모듈을 가져온다.
const sequelize = new Sequelize({
    dialect: 'sqlite',//db 툴
    storage: './db.sqlite',//파일형태의 db
    logging: false
});

const User = sequelize.define('User', {
    id : {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement:true
    },
    name: {
        type: Sequelize.STRING,
        unique: true//name의 중복을 체크해 준다.
    }
});//모델을 정의
//User라는 객체에 어떤 데이터 타입과, index가 들어가는지 적어준다.

//모듈로 sequelize모듈과 sequelize, USer객체를 export 해준다.
module.exports = {Sequelize, sequelize, User};