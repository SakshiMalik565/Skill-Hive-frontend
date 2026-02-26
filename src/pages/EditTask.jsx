import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import AnimatedPage from '../components/AnimatedPage';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import taskService from '../services/taskService';
import toast from 'react-hot-toast';
import './EditTask.css';

export default function EditTask() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('todo');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTask = async () => {
      try {
        setIsLoading(true);
        const res = await taskService.getById(id);
        const loadedTask = res.data.data.task;
        setTask(loadedTask);
        setTitle(loadedTask.title || '');
        setDescription(loadedTask.description || '');
        setStatus(loadedTask.status || 'todo');
        setDueDate(loadedTask.dueDate ? loadedTask.dueDate.slice(0, 10) : '');
      } catch (error) {
        toast.error(error?.message || 'Unable to load task');
      } finally {
        setIsLoading(false);
      }
    };

    loadTask();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!title.trim()) {
      toast.error('Task title is required');
      return;
    }

    try {
      setLoading(true);
      await taskService.update(id, {
        title: title.trim(),
        description: description.trim(),
        status,
        dueDate: dueDate || null,
      });
      navigate(`/projects/${task?.project}`);
    } catch (error) {
      toast.error(error?.message || 'Unable to update task');
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Loading task..." />;
  }

  if (!task) {
    return (
      <AnimatedPage>
        <section className="edit-task-page">
          <div className="container">
            <div className="projects-empty">
              <h3>Task not found</h3>
              <Button variant="teal" onClick={() => navigate('/projects')}>
                Back to Projects
              </Button>
            </div>
          </div>
        </section>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage>
      <section className="edit-task-page">
        <div className="container">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <FiArrowLeft /> Back
          </button>

          <motion.div
            className="edit-task-card card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="page-title">Edit Task</h1>
            <p className="page-subtitle">Update details and keep things on track.</p>

            <form className="edit-task-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Task Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-input"
                  rows={4}
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
                Save Changes
              </Button>
            </form>
          </motion.div>
        </div>
      </section>
    </AnimatedPage>
  );
}
