const models = require('../../models');//모델을 가져온다.


const index = function(req,res){
    req.query.limit = req.query.limit || 10;
    const limit = parseInt(req.query.limit,10);
    if(Number.isNaN(limit)){
        return res.status(400).end();
    }
    
    //데이터 조회
    models.User.findAll({
        limit: limit//다른 GET함수 limit개수만큼 수행되는 것이기때문에
        //limit개수를 가져온다.
    })//select * from user where limit=2
        .then(users => {
            res.json(users);
        });


}

const show = function(req,res){//id값을 받아오기 위해
    const id = parseInt(req.params.id, 10);

    if(Number.isNaN(id)){
        return res.status(400).end();//id값이 정수가 아닌 경우 400
    }
    
    models.User.findOne({
        where: {id}
    }).then(user => {
        if(!user) return res.status(404).end();
        return res.json(user);
    });

}

const destroy = function(req,res){
    const id = parseInt(req.params.id, 10);

    if(Number.isNaN(id)){
       return res.status(400).end();
    }

    /*
    const user = users.filter((user) => {
        return user.id !== id
    });//실제 배열에서 삭제하는 부분
    */

    models.User.destroy({
        where: {id}
    }).then(()=>{
        res.status(204).end();
    });//삭제한 후 then함수의 콜백함수가 수행된다.

  
}

const create = function(req, res){
    
    const name = req.body.name;

    if(!name) {
        return res.status(400).end();
    }
   
    models.User.create({name})
    .then(user=>{
        res.status(201).json(user);//성공적으로 데이터가 생성되었을 때.
    })
    .catch(err => {
        //중복을 확인하는 과정에서 error 메시지가 뜰때
        //408 status 를 준다.
        //console.log(err);
        if(err.name === `SequelizeUniqueConstraintError`){
            return res.status(409).end();
        }
    });
 
}

const update = function(req,res) {
    const id = parseInt(req.params.id, 10);
    if(Number.isNaN(id)) {
        return res.status(400).end();
    }
    const name = req.body.name;
    if(!name) return res.status(400).end();
    

    models.User.findOne({
       where: {id}
    }).then(user => {
        if(!user) return res.status(404).end();
        else if(user.name==name) return res.status(409).end();
        //이름이 중복일 경우
        user.name = name;//이름을 수정       
        user.save()
            .then(user =>{    //id에 해당하는 이름에 수정한 이름을 저장
                //if(user.name===name) return res.status(409).end();
                return res.json(user);
            })
            /*.catch(err => {
                if(err.name === 'SequelizeUniqueConstraintError'){
                    return res.status(409).end();
                }//이거 안됨...
            
            });*/
        
    });
}

module.exports = {
    index:index,
    show: show,
    destroy: destroy,
    create: create,
    update: update
};