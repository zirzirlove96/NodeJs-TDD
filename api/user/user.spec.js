const app = require('../../');
//api/user 밖에 있는 index.js를 사용해야 하므로
//application 경로를 부모 경로로 바꿔준다.
const request = require('supertest');
const should = require('should');
const models = require('../../models');//DB를 싱크


describe('GET /users는, ', ()=> {
    const users = [
        {name:'alice'}, {name:'beck'}, {name:'jiyoung'}
    ];
    before(() => {//비동기
        return models.sequelize.sync({force:true});//sync
    });
    before(()=>{//임시로 데이터베이스에 데이터를 넣어준다.
        return models.User.bulkCreate(users);
    });
    describe('성공시', ()=>{
        it('유저 객체를 담은 배열로 응답한다. ', (done)=> {
            request(app)
                .get('/users')//get메소드를 수행
                .end((err, res) => {
                    res.body.should.be.instanceOf(Array);//should모듈을 사용하여 
                    //배열이라는 것을 검증한다.
                    //console.log(res.body);
                    done();
                });
        });  

        it('최대 limit 갯수 만큼 수행', (done)=>{
            request(app)
                .get('/users?limit=2')//2개만 받겠다.
                .end((err,res)=>{
                    res.body.should.have.lengthOf(2);//길이가 2여야 성공한다.
                    done();
                });
        });
    });

    describe('실패시', ()=>{
        it('limit의 숫자형이 아니면 400을 나타낸다', (done)=>{//비동기로 작동
            request(app)
                .get('/users?limit=two')//숫자가 아니라 문자열로
                .expect(400)
                .end((err,res)=>{//굳이 res를 이용하여 should 검증을 하지 않고
                    //supertest가 가지고 있는 expect()로 상태코드를 검증할 수 있다.
                    done();
                });
        });
    });
});

describe('GET /users/1은 ', ()=>{
    const users = [
        {name:'alice'}, {name:'beck'}, {name:'jiyoung'}
    ];
    before(() => {//비동기
        return models.sequelize.sync({force:true});//sync
    });
    before(()=>{//임시로 데이터베이스에 데이터를 넣어준다.
        return models.User.bulkCreate(users);
    });
    describe('성공시', ()=>{
        it('id가 1인 유저 객체를 반환한다.', (done)=>{
            request(app)
                .get('/users/1')
                .end((err,res)=>{
                    //property값으로 id값이 1인 것을 반환한다.
                    res.body.should.have.property('id', 1);
                    done();
                });
        });
    });
    
    describe('실패시 ', ()=>{
        it('id가 숫자가 아닌 경우 400으로 응답한다.', (done)=>{
            request(app)
                .get('/users/one')//id값이 숫자가 아닌 경우.
                .expect(400)
                .end(done);
        });//첫 번째 테스트 코드

        it('id로 유저를 찾을 수 없을 경우 404로 응답한다.', (done)=>{
            request(app)
                .get('/users/999')//id값이 없는 경우
                .expect(404)
                .end(done);
        });//두 번째 테스트 케이스
    });


});

describe('Delete /users/1은 ', ()=>{
    const users = [
        {name:'alice'}, {name:'beck'}, {name:'jiyoung'}
    ];
    before(() => {//비동기
        return models.sequelize.sync({force:true});//sync
    });
    before(()=>{//임시로 데이터베이스에 데이터를 넣어준다.
        return models.User.bulkCreate(users);
    });
    describe('성공시, ',()=>{
        it('204를 응답한다.', (done)=>{
            request(app)
                .delete('/users/1')//get메소드가 아닌 delete 메소드를 사용하여
                //delete 메소드를 사용하게 된다.
                .expect(204)
                .end(done);
        });
    });

    describe('실패시,', ()=>{
        it('400을 응답한다.', (done)=>{
            request(app)
                .delete('/users/one')
                .expect(400)
                .end(done);
        });
    });
});


describe('POST /users은', ()=>{
    const users = [
        {name:'alice'}, {name:'beck'}, {name:'jiyoung'}
    ];
    before(() => {//비동기
        return models.sequelize.sync({force:true});//sync
    });
    before(()=>{//임시로 데이터베이스에 데이터를 넣어준다.
        return models.User.bulkCreate(users);
    });
    describe('성공시, ', ()=>{
        let body;
        let name = 'daniel';
        before((done)=>{
            request(app)//추가할 데이터를 테스트 케이스에서 
            //공통적으로 수행하기 위해 before 메소드를 사용한다.
                .post('/users')
                .send({name:name})
                .expect(201)
                .end((err, res)=>{
                    body = res.body;//body에 추가할 데이터를 변수에 저장
                    done();
                });
        }); //it() 테스트 케이스가 수행되기 전에 수행되는 것
        
        it('생성된 유저 객체를 반환한다.', ()=>{
            body.should.have.property('id');
        });

        it('입력한 name을 반환한다.', ()=>{
            body.should.have.property('name', 'daniel');

        });
    });

    describe('실패시,', ()=>{
        it('name 파라미터 누락시 400을 반환한다.', (done)=>{
            request(app)
                .post('/users')
                .send({})
                .expect(400)
                .end(done);
        });

        it('name이 중복일 경우 409을 반환한다. ', (done)=>{
            request(app)
                .post('/users')
                .send({name: 'jiyoung'})
                .expect(409)
                .end(done);
        });
    });
});

describe('PUT /users/id', ()=>{
    const users = [
        {name:'alice'}, {name:'beck'}, {name:'jiyoung'}
    ];
    before(() => {//비동기
        return models.sequelize.sync({force:true});//sync
    });
    before(()=>{//임시로 데이터베이스에 데이터를 넣어준다.
        return models.User.bulkCreate(users);
    });
    describe('성공시', ()=>{
        it('변경된 name을 응답한다.', (done)=>{
            const name = 'ss';
            request(app)
                .put('/users/3')//기존에 있는 name 값을 변경
                .send({name})
                .end((err,res)=>{
                    res.body.should.have.property('name', name);
                    done();
                });

        });
    });

    describe('실패시,', ()=>{
        it('정수가 아닌 id일 경우 400을 응답한다.', (done)=>{
            request(app)
                .put('/users/one')
                .expect(400)
                .end(done);
        });

        it('name이 없을 400을 응답한다.', (done)=>{
            request(app)
                .put('/users/1')
                .send({})
                .expect(400)
                .end(done);
        });

        it('없는 유저일 경우 404을 응답한다.', (done)=>{
            request(app)
                .put('/users/999')
                .send({name : 'foo'})
                .expect(404)
                .end(done);
        });

        it('이름이 중복일 경우 409을 응답한다.', (done)=>{
            request(app)
                .put('/users/3')
                .send({name : 'ss'})
                .expect(409)
                .end(done);
        });

        
    });
});