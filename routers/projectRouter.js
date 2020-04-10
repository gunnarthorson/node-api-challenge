const express = require('express');
const projects = require('../data/helpers/projectModel');
const Act = require("../data/helpers/actionModel");
const router = express.Router();

router.use(express.json());

router.get('/', (req, res) => {
projects.get()
.then(project => {
    res.status(200).json(project)
})
.catch(err => {
    console.log(err)
    res.status(500).json({ errorMessage: 'Cannot get projects'})
    })
})

router.get('/:id', validateProjectId, (req, res) => {
    projects.get(req.params.id)
    .then(project => {
        res.status(200).json(project)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({ errorMessage: 'Cannot retrieve project'})
    })
})

router.get('/:id/actions', validateProjectId, (req, res) => {
    projects.getProjectActions(req.params.id)
    .then(project => {
        res.status(200).json(project)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({ errorMessage: 'Cannot retrieve actions'})
    })
})

router.post('/', validateProject, (req, res) => {
    projects.insert(req.body)
    .then(project => {
        res.status(200).json(project)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({ errorMessage: 'Unable to create project'})
    })
})

router.post('/:id/actions', validateProjectId, validateAction, (req, res) => {
    Act
        .insert({ project_id: req.params.id, description: req.body.description, notes: req.body.notes })
        .then(actions => res.status(200).json(actions))
        .catch(err => res.status(500).json({ error: 'Error adding project' }))
});


router.put('/:id', validateProjectId, validateProject, (req, res) => {
    projects.update(req.params.id, req.body)
    .then(project => {
        res.status(200).json(project)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({ errorMessage: 'Unable to update project'})
    })
})

router.delete('/:id', validateProjectId, (req, res) => {
    projects.remove(req.params.id)
    .then(project => {
        res.status(200).json(project)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({ errorMessage: 'Unable to delete project'})
    })
})

function validateProjectId(req, res, next) {
    if (req.params.id) {
        req.project = req.params.id;
        next();
    } else {
        res.status(400).json({message: 'Invalid project id'})
    }
}

function validateProject(req, res, next) {
    if (!req.body.name || !req.body.description) {
        res.status(400).json({message: 'Insert name and description of project'});
    } else {
        next();
    }
}

function validateAction(req, res, next) {
    if (req.body) {
        if (req.body.description) {
            if(!req.body.notes){
                req.body.notes = "";
            }
            next();
        } else {
            res.status(500).json({ message: "must send action descrioption" });
        }
    } else {
        res.status(500).json({ message: "must send body data" });
    }
};

module.exports = router, validateProjectId, validateProject