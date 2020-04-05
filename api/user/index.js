const express = require('express');
const router = express.Router();
const ctrl = require('./user.ctrl.js');

router.get('/', ctrl.index);

router.get('/:id', ctrl.show);

router.delete('/:id', ctrl.destroy);

router.post('/', ctrl.create);

router.put('/:id', ctrl.update);//기존에는 application객체를 썼지만 router객체로 바꿔준다.
//게다가 이미 application쪽에서 경로를 /user로 줬으므로 라우터의
//경로를 /로 줘도 된다.

module.exports = router;
