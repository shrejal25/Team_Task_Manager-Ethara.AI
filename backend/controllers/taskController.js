const Task = require('../models/Task');

exports.createTask = async (req, res) => {
  try {
    const { title, description, project, assignedTo, dueDate } = req.body;
    let task = await Task.create({ title, description, project, assignedTo, dueDate });
    task = await task.populate('assignedTo', 'name email');
    res.status(201).json(task);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.getTasks = async (req, res) => {
  try {
    let query = {};
    if (req.query.project) query.project = req.query.project;
    if (req.user.role === 'Member') query.assignedTo = req.user._id;

    const tasks = await Task.find(query).populate('assignedTo', 'name email').populate('project', 'name');
    res.status(200).json(tasks);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    // Member can only update their own tasks or Admin can update any
    if (req.user.role !== 'Admin' && task.assignedTo?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Admins can edit full task details
    if (req.user.role === 'Admin') {
      if (req.body.title) task.title = req.body.title;
      if (req.body.description !== undefined) task.description = req.body.description;
      if (req.body.assignedTo !== undefined) task.assignedTo = req.body.assignedTo || null;
      if (req.body.dueDate !== undefined) task.dueDate = req.body.dueDate || null;
    }

    // Both Admin and assigned Member can update status
    if (req.body.status) task.status = req.body.status;
    
    const updatedTask = await task.save();
    await updatedTask.populate('assignedTo', 'name email');
    res.status(200).json(updatedTask);
  } catch (error) { res.status(500).json({ message: error.message }); }
};
