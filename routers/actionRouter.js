const express = require('express');

const Projects = require('../data/helpers/projectModel.js');
const Actions = require('../data/helpers/actionModel.js');

const router = express.Router();

router.get('/:id/actions', validateProjectId, (req, res) => {
    Projects.getProjectActions(req.project.id)
        .then(item => {
            if (item) {
                res.status(200).json(item);
            } else {
                res.status(404).json({
                    message: 'There are no actions for this project yet!'
                });
            };
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: "The actions for this project could not be retreived.",
                error: err
            });
        })
})

router.get('/:id/actions/:action_id', validateProjectId, validateActionId, (req, res) => {
    Actions.get(req.action.id)
        .then(item => {
            res.status(200).json(item);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: "The action information could not be retreived.",
                error: err
            });
        });
});

router.post('/:id/actions/', validateProjectId, validateAction, (req, res) => {
    Actions.insert(req.body)
        .then(item => {
            res.status(201).json(item);
        })
        .catch( err => {
            console.log(err);
            res.status(500).json({
                message: "The new action could not be added.",
                error: err
            });
        })
})

router.put('/:id/actions/:action_id', validateProjectId, validateActionId, validateAction, (req, res) => {
    Actions.update(req.action.id, req.body)
        .then(item => {
            res.status(200).json(item);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: "The action could not be updated.",
                error: err
            });
        });
});

router.delete('/:id/actions/:action_id', validateProjectId, validateActionId, (req, res) => {
    Actions.remove(req.action.id)
        .then(item => {
            res.status(200).json({ message: 'Action successfully deleted'})
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: "The action could not be deleted.",
                error: err
            });
        });
});

// Custom Middleware
function validateProjectId(req, res, next) {
    const { id } = req.params;

    Projects.get(id)
        .then(item => {
            if (item) {
                req.project = item;
                next();
            } else {
                res.status(400).json({
                    message: "Project ID does not exist."
                });
            };
        });
};

function validateActionId(req, res, next) {
    const { action_id } = req.params;

    Actions.get(action_id)
        .then(item => {
            if (item) {
                req.action = item;
                next();
            } else {
                res.status(400).json({
                    message: "Action ID does not exist."
                });
            };
        });
};

function validateAction(req, res, next) {
    const { id } = req.params;
    const body = req.body;
    const project_id = req.body.project_id;
    const description = req.body.description;
    const notes = req.body.notes;

    if (!body) {
        res.status(400).json({
            message: "Missing action data"
        });
    } else if (!project_id) {
        res.status(400).json({
            message: "Missing required project ID"
        });
    } else if (!project_id == id) {
        res.status(400).json({
            message: "Project ID does not match current project"
        });
    } else if (!description) {
        res.status(400).json({
            message: "Missing required description"
        });
    } else if (description.length > 128) {
        res.status(400).json({
            message: "Description must be 128 characters or less"
        });
    } else if (!notes) {
        res.status(400).json({
            message: "Missing required notes"
        });
    } else {
        next();
    };
};

function validateProject(req, res, next) {
    const body = req.body;
    const name = req.body.name;
    const description = req.body.description;

    if (!body) {
        res.status(400).json({
            message: "Missing project data"
        });
    } else if (!name) {
        res.status(400).json({
            message: "Missing required project name"
        });
    } else if (!description) {
        res.status(400).json({
            message: "Missing required project description"
        });
    } else {
        next();
    };
};

module.exports = router;