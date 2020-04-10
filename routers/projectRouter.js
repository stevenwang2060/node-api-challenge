const express = require('express');

const Projects = require('../data/helpers/projectModel.js');
const actionRouter = require('./actionRouter.js');

const router = express.Router();

router.use('/', actionRouter);

router.get('/', (req, res) => {
    Projects.get()
        .then(item => {
            res.status(200).json(item);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: "The list of projects could not be retrieved.",
                error: err
            })
        });
});

router.get('/:id', validateProjectId, (req, res) => {
    Projects.get(req.project.id)
        .then(item => {
            res.status(200).json(item);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: "The project information could not be retreived.",
                error: err
            });
        });
});

router.post('/', validateProject, (req, res) => {
    Projects.insert(req.body)
        .then(item => {
            res.status(201).json(item);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: "The new project could not be added.",
                error: err
            });
        });
});

router.put('/:id', validateProjectId, validateProject, (req, res) => {
    Projects.update(req.project.id, req.body)
        .then(item => {
            res.status(200).json(item);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: "The project could not be updated.",
                error: err
            });
        })
})

router.delete('/:id', validateProjectId, (req, res) => {
    Projects.remove(req.project.id)
        .then(item => {
            res.status(200).json({ message: 'Project successfully deleted'});
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: "The project could not be deleted.",
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

module.exports = router;