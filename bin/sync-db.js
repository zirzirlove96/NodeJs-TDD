const models = require('../models.js');


module.exports = () => {
    const option = process.env.NODE_ENV === 'test' ? true: false;
    //테스트일 경우는 데이터를 다 버리기 위해 true를 사용
    //만약 npm start일 경우는 false
    return models.sequelize.sync(option);
}