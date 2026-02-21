import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiEdit2, FiSave, FiX, FiPlus, FiStar, FiMail, FiUser } from 'react-icons/fi';
import AnimatedPage from '../components/AnimatedPage';
import Button from '../components/Button';
import SkillTag from '../components/SkillTag';
import StarRating from '../components/StarRating';
import { useAuth } from '../context/AuthContext';
import { getInitials, getAvatarGradient } from '../utils/helpers';
import toast from 'react-hot-toast';
import './Profile.css';

const SKILL_SUGGESTIONS = [
  'React', 'Node.js', 'JavaScript', 'TypeScript', 'Python', 'Java', 'C++',
  'UI/UX Design', 'Figma', 'Photoshop', 'Illustration', 'Flutter', 'Dart',
  'Machine Learning', 'Data Science', 'SQL', 'MongoDB', 'Docker', 'AWS',
  'DevOps', 'GraphQL', 'Vue.js', 'Angular', 'Go', 'Rust', 'Blockchain',
  'Mobile Development', 'Firebase', 'System Design', 'CI/CD',
];

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [editData, setEditData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    skillsOffered: user?.skillsOffered || [],
    skillsWanted: user?.skillsWanted || [],
  });

  const [newSkillOffered, setNewSkillOffered] = useState('');
  const [newSkillWanted, setNewSkillWanted] = useState('');

  const handleEdit = () => {
    setEditData({
      name: user?.name || '',
      bio: user?.bio || '',
      skillsOffered: [...(user?.skillsOffered || [])],
      skillsWanted: [...(user?.skillsWanted || [])],
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setNewSkillOffered('');
    setNewSkillWanted('');
  };

  const handleSave = async () => {
    if (!editData.name.trim()) {
      toast.error('Name is required');
      return;
    }
    setLoading(true);
    try {
      await updateProfile(editData);
      setIsEditing(false);
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const addSkill = (type) => {
    const value = type === 'offered' ? newSkillOffered.trim() : newSkillWanted.trim();
    const field = type === 'offered' ? 'skillsOffered' : 'skillsWanted';
    if (!value) return;
    if (editData[field].includes(value)) {
      toast.error('Skill already added');
      return;
    }
    setEditData((prev) => ({ ...prev, [field]: [...prev[field], value] }));
    type === 'offered' ? setNewSkillOffered('') : setNewSkillWanted('');
  };

  const removeSkill = (type, skill) => {
    const field = type === 'offered' ? 'skillsOffered' : 'skillsWanted';
    setEditData((prev) => ({
      ...prev,
      [field]: prev[field].filter((s) => s !== skill),
    }));
  };

  const displayData = isEditing ? editData : user;

  return (
    <AnimatedPage>
      <section className="profile-page">
        <div className="container">
          {/* Profile Header Card */}
          <motion.div
            className="profile-hero-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="profile-hero-bg" />

            <div className="profile-hero-content">
              <motion.div
                className="profile-avatar-large"
                style={{ background: getAvatarGradient(user?._id) }}
                whileHover={{ scale: 1.05 }}
              >
                {getInitials(user?.name)}
              </motion.div>

              <div className="profile-hero-info">
                {isEditing ? (
                  <input
                    type="text"
                    className="profile-name-input"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  />
                ) : (
                  <h1 className="profile-name">{user?.name}</h1>
                )}
                <div className="profile-meta">
                  <span className="profile-meta-item">
                    <FiMail /> {user?.email}
                  </span>
                  <span className="profile-meta-item">
                    <FiStar /> <StarRating rating={user?.rating || 0} size={14} />
                  </span>
                  <span className={`badge ${user?.role === 'admin' ? 'badge-coral' : 'badge-teal'}`}>
                    {user?.role === 'admin' ? '⚡ Admin' : '👤 User'}
                  </span>
                </div>
              </div>

              <div className="profile-hero-actions">
                {isEditing ? (
                  <>
                    <Button variant="teal" onClick={handleSave} loading={loading} icon={<FiSave />}>
                      Save
                    </Button>
                    <Button variant="ghost" onClick={handleCancel} icon={<FiX />}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button variant="secondary" onClick={handleEdit} icon={<FiEdit2 />}>
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>
          </motion.div>

          {/* Bio Section */}
          <motion.div
            className="profile-section card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="profile-section-title">
              <FiUser /> About
            </h2>
            {isEditing ? (
              <textarea
                className="form-input profile-bio-input"
                value={editData.bio}
                onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                placeholder="Write something about yourself..."
                rows={4}
              />
            ) : (
              <p className="profile-bio">
                {displayData?.bio || 'No bio added yet. Click edit to add one!'}
              </p>
            )}
          </motion.div>

          {/* Skills Section */}
          <div className="profile-skills-grid">
            {/* Skills Offered */}
            <motion.div
              className="profile-section card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="profile-section-title" style={{ color: 'var(--coral-dark)' }}>
                🎯 Skills I Can Teach
              </h2>
              <div className="skill-tags-list">
                <AnimatePresence>
                  {(displayData?.skillsOffered || []).map((skill, i) => (
                    <SkillTag
                      key={skill}
                      skill={skill}
                      variant="coral"
                      index={i}
                      removable={isEditing}
                      onRemove={() => removeSkill('offered', skill)}
                    />
                  ))}
                </AnimatePresence>
                {(displayData?.skillsOffered || []).length === 0 && (
                  <p className="no-skills">No skills added yet</p>
                )}
              </div>
              {isEditing && (
                <div className="add-skill-row">
                  <input
                    type="text"
                    className="form-input add-skill-input"
                    placeholder="Type a skill or select below..."
                    value={newSkillOffered}
                    onChange={(e) => setNewSkillOffered(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill('offered'))}
                    list="skill-suggestions-offered"
                  />
                  <datalist id="skill-suggestions-offered">
                    {SKILL_SUGGESTIONS.filter((s) => !editData.skillsOffered.includes(s)).map((s) => (
                      <option key={s} value={s} />
                    ))}
                  </datalist>
                  <Button variant="coral" size="sm" onClick={() => addSkill('offered')} icon={<FiPlus />}>
                    Add
                  </Button>
                </div>
              )}
            </motion.div>

            {/* Skills Wanted */}
            <motion.div
              className="profile-section card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="profile-section-title" style={{ color: 'var(--teal-dark)' }}>
                📚 Skills I Want to Learn
              </h2>
              <div className="skill-tags-list">
                <AnimatePresence>
                  {(displayData?.skillsWanted || []).map((skill, i) => (
                    <SkillTag
                      key={skill}
                      skill={skill}
                      variant="teal"
                      index={i}
                      removable={isEditing}
                      onRemove={() => removeSkill('wanted', skill)}
                    />
                  ))}
                </AnimatePresence>
                {(displayData?.skillsWanted || []).length === 0 && (
                  <p className="no-skills">No skills added yet</p>
                )}
              </div>
              {isEditing && (
                <div className="add-skill-row">
                  <input
                    type="text"
                    className="form-input add-skill-input"
                    placeholder="Type a skill or select below..."
                    value={newSkillWanted}
                    onChange={(e) => setNewSkillWanted(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill('wanted'))}
                    list="skill-suggestions-wanted"
                  />
                  <datalist id="skill-suggestions-wanted">
                    {SKILL_SUGGESTIONS.filter((s) => !editData.skillsWanted.includes(s)).map((s) => (
                      <option key={s} value={s} />
                    ))}
                  </datalist>
                  <Button variant="teal" size="sm" onClick={() => addSkill('wanted')} icon={<FiPlus />}>
                    Add
                  </Button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </AnimatedPage>
  );
}
