const express = require('express');
const router = express.Router();

const UserMeta = require('../../models').UserMeta;


router.post('/', async function (req, res, next) {
    UserMeta.create({ metaKey: req.body.metaKey, metaValue:req.body.metaValue, userId:req.body.userId, createdBy:req.body.userId }).then((result) => {
        res.json({ success: true, data: result })
    }).catch(next);
});

router.post('/createUserMetaList', async function (req, res, next) {
    var userMetaList = req.body.metaList;
    var userMetaCount = 0
    userMetaList.forEach((userMeta,userMetaIndex, userMetaArray) =>{
        UserMeta.create({metaKey: userMeta.metaKey, metaValue:userMeta.metaValue, userId:req.body.userId, createdBy:req.body.userId }).then((result) => {

            if (userMetaCount === userMetaArray.length - 1) {
                res.json({ success: true, data: result })
              }
              userMetaCount++
          
        }).catch(next);
    })

});


router.get('/:userId', async function (req, res, next) {
    UserMeta.findAll({where:{userId:req.params.userId}}).then((result) => {
        res.json({ success: true, data: result })
    }).catch(next);
});

router.get('/getValues/:userId', async function (req, res, next) {
    UserMeta.findAll({where:{userId:req.params.userId},order: [['updatedAt', 'DESC']],}).then((result) => {
        res.json({ success: true, data: result })
    }).catch(next);
});

router.put('/', function (req, res, next) {
    UserMeta.update({metaValue:req.body.metaValue},{where:{userId:req.body.userId,userMetaId:req.body.userMetaId }}).then((data)=> {
        res.json({ success: true, data: data });
    }).catch(next);
})


router.post('/userdata', async function (req, res, next) {
    UserMeta.findAll({where:{userId:req.body.userId}}).then((result) => {
        res.json({ success: true, data: result })
    }).catch(next);
});

router.post('/getValue', async function (req, res, next) {
    UserMeta.findOne({ attributes: ['metaValue','userMetaId'],where:{metaKey: req.body.metaKey,userId:req.body.userId}}).then((result) => {
        res.json({ success: true, data: result })
    }).catch(next);
});

router.post('/updateUserMeta', async function (req, res, next) {
    var userMetaList = req.body.metaList;
    var userMetaCount = 0
    userMetaList.forEach((userMeta, userMetaIndex, userMetaArray) => {
        UserMeta.update({ metaKey: userMeta.metaKey, metaValue: userMeta.metaValue}, { where:{userId: req.body.clientId,metaKey: userMeta.metaKey}}).then((result) => {
            if (userMetaCount === userMetaArray.length - 1) {
                res.json({ success: true, data: result })
            }
            userMetaCount++
           
        }).catch(next);
    })

})

module.exports = router;
