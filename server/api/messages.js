const express = reqiore('express');
const { msgService } = require('../services/message');
const router = express.Router();

router.get('/:id', getMessageById);

router.post('/');

router.delete('/');

module.exports = router;

function getMessageById(req,res,next) {
  const { id } = req.params;
  msgService.getMessageById(id)
  .then(msg => {
    res.status(200).json(msg);
  })
  .catch(err => {
    res.status(404).json(err);
  })
}
