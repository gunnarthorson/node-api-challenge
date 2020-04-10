const express = require('express');
const actions = require('../data/helpers/actionModel');

const router = express.Router();
router.use(express.json());

router.get('/', (req, res) => {
    actions.get()
    .then(action => {
        res.status(200).json(action)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({ errorMessage: 'Error: Cannot retrieve action'});
    })
})

router.get('/:id', validateUserId, (req, res) => {
    actions.get(req.params.id)
    .then(action => {
        res.status(200).json(action)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({errorMessage: 'Error: Canno retrieve this id' })
    })
})


router.put('/:id', validateUser, validateUserId, (req,res) => {
    actions.update(req.params.id, req.body)
    .then(action => {
        res.status(200).json(action)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({ errorMessage: 'Error: unable to edit' })
    })
})

router.delete('/:id', validateUserId, (req,res) => {
    actions.remove(req.params.id)
    .then(action => {
        res.status(200).json(action)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({ errorMessage: 'Error: unable to delete'})
    })
})

function validateUserId(req, res, next) {
    if(req.params.id) {
        next();
    } else {
        res.status(400).json({ errorMessage: 'Invalid ID'})
    }
}

function validateUser(req, res, next) {
    if (!req.body.project_id || !req.body.description || ! req.body.notes) {
        res.status(400).json({message: `Provide project id, description and notes`});
    } else if (req.body.description.length > 128) {
        res.status(400).json({message: 'Description character limit is 128 characters'});
    } else {
        next();
    }
}

module.exports = router, validateUser;