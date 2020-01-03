const express = require('express');
const router = express.Router();

const OrgMeta = require('../../models').OrgMeta;

router.post('/', async function (req, res, next) {

    OrgMeta.findOne({where: { metaKey: req.body.metaKey,organizationId:req.body.organizationId } }).then((data) => {
        if (data == null) {
            OrgMeta.create({ metaKey: req.body.metaKey, metaValue: req.body.metaValue, userId: req.body.userId, createdBy: req.body.userId,organizationId:req.body.organizationId}).then((result) => {
                res.json({ success: true, data: result })
            }).catch(next);
        }
        else {
           
            OrgMeta.update( {metaKey: req.body.metaKey, metaValue: req.body.metaValue, userId: req.body.userId, updatedBy: req.body.userId },{ where: { metaKey: req.body.metaKey, organizationId: req.body.organizationId } }).then((result) => {
                res.json({ success: true, data: result })
            }).catch(next);
           
        }
    }).catch(next);

});



router.get('/:orgId/:metaKey', async function (req, res, next) {
    OrgMeta.findOne({ where: { metaKey: req.params.metaKey,organizationId:req.params.orgId } }).then((result) => {
        res.json({ success: true, data: result })
    }).catch(next);
});

router.post('/getValue', async function (req, res, next) {
    OrgMeta.findOne({ attributes: ['metaValue'], where: { metaKey: req.body.metaKey, userId: req.body.userId } }).then((result) => {
        res.json({ success: true, data: result })
    }).catch(next);
});



module.exports = router;