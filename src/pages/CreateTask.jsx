import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import AnimatedPage from '../components/AnimatedPage';
import Button from '../components/Button';
import taskService from '../services/taskService';
import toast from 'react-hot-toast';
import './CreateTask.css';

export default function CreateTask() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('todo');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!title.trim()) {
      toast.error('Task title is required');
      return;
    }

    try {
      setLoading(true);
      await taskService.create(id, {
        title: title.trim(),
        description: description.trim(),
        status,
        dueDate: dueDate || null,
      });
      navigate(`/projects/${id}`);
    } catch (error) {
      toast.error(error?.message || 'Unable to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatedPage>
      <section className="create-task-page">
        <div className="container">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <FiArrowLeft /> Back
          </button>

          <motion.div
            className="create-task-card card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="page-title">Create Task</h1>
            <p className="page-subtitle">Add a task to your project roadmap.</p>

            <form className="create-task-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Task Title</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter task title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-input"
                  rows={4}
                  placeholder="Describe this task"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select
                    className="form-input"
                    value={status}
                    onChange={(event) => setStatus(event.target.value)}
                  >
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Due Date (optional)</label>
                  <input
                    type="date"
                    className="form-input"
                    value={dueDate}
                    onChange={(event) => setDueDate(event.target.value)}
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                icon={<FiSave />}
              >
                Create Task
              </Button>
            </form>
          </motion.div>
        </div>
      </section>
    </AnimatedPage>
  );
}
