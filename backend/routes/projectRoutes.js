const express = require('express');
const router = express.Router();
const {
  createProject,
  getProjects,
  getProjectById,
  addMemberToProject,
  removeMemberFromProject
} = require('../controllers/projectController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createProject)
  .get(protect, getProjects);

router.route('/:id')
  .get(protect, getProjectById);

router.route('/:id/members')
  .put(protect, addMemberToProject);

router.route('/:id/members/:userId')
  .delete(protect, removeMemberFromProject);

module.exports = router;
