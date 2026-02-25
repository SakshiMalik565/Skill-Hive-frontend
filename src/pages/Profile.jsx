import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiEdit2, FiSave, FiX, FiPlus, FiStar, FiMail, FiUser } from 'react-icons/fi';
import { useParams } from 'react-router-dom';
import AnimatedPage from '../components/AnimatedPage';
import Button from '../components/Button';
import SkillTag from '../components/SkillTag';
import StarRating from '../components/StarRating';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { useSwaps } from '../context/SwapContext';
import { getInitials, getAvatarGradient } from '../utils/helpers';
import userService from '../services/userService';
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
  const { user, updateProfile, applyUserUpdate } = useAuth();
  const { id } = useParams();
  const { getUserSwaps } = useSwaps();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [viewedUser, setViewedUser] = useState(null);
  const [uploading, setUploading] = useState({ profile: false, background: false });

  const isOwner = !id || id === user?._id;
  const activeUser = isOwner ? user : viewedUser;

  const [editData, setEditData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    skillsOffered: user?.skillsOffered || [],
    skillsWanted: user?.skillsWanted || [],
  });

  const [newSkillOffered, setNewSkillOffered] = useState('');
  const [newSkillWanted, setNewSkillWanted] = useState('');

  const handleEdit = () => {
    if (!isOwner) return;
    setEditData({
      name: activeUser?.name || '',
      bio: activeUser?.bio || '',
      skillsOffered: [...(activeUser?.skillsOffered || [])],
      skillsWanted: [...(activeUser?.skillsWanted || [])],
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

  const displayData = isEditing ? editData : activeUser;

  useEffect(() => {
    const loadUser = async () => {
      if (isOwner) {
        setViewedUser(null);
        return;
      }
      try {
        setIsLoading(true);
        const res = await userService.getById(id);
        setViewedUser(res.data.data.user);
      } catch {
        toast.error('Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, [id, isOwner]);

  const swapHistory = useMemo(() => {
    if (!activeUser?._id) return [];
    return getUserSwaps(activeUser._id).completed || [];
  }, [activeUser, getUserSwaps]);

  const handleUpload = async (type, file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    try {
      setUploading((prev) => ({ ...prev, [type]: true }));
      const res =
        type === 'profile'
          ? await userService.uploadProfilePhoto(formData)
          : await userService.uploadBackgroundPhoto(formData);
      applyUserUpdate(res.data.data.user);
      toast.success('Image updated');
    } catch (error) {
      toast.error(error.message || 'Upload failed');
    } finally {
      setUploading((prev) => ({ ...prev, [type]: false }));
    }
  };

  if (isLoading || !activeUser) {
    return <LoadingSpinner fullScreen text="Loading profile..." />;
  }

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
            <div
              className="profile-hero-bg"
              style={
                activeUser?.backgroundPhoto
                  ? { backgroundImage: `url(${activeUser.backgroundPhoto})` }
                  : undefined
              }
            />

            <div className="profile-hero-content">
              <motion.div
                className="profile-avatar-large"
                style={{ background: getAvatarGradient(activeUser?._id) }}
                whileHover={{ scale: 1.05 }}
              >
                {activeUser?.profilePhoto || activeUser?.profilePic ? (
                  <img
                    src={activeUser.profilePhoto || activeUser.profilePic}
                    alt={activeUser?.name || 'User'}
                  />
                ) : (
                  getInitials(activeUser?.name)
                )}
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
                  <h1 className="profile-name">{activeUser?.name}</h1>
                )}
                <div className="profile-meta">
                  <span className="profile-meta-item">
                    <FiMail /> {activeUser?.email}
                  </span>
                  <span className="profile-meta-item">
                    <FiStar /> <StarRating rating={activeUser?.rating || 0} size={14} />
                  </span>
                  <span className={`badge ${activeUser?.role === 'admin' ? 'badge-coral' : 'badge-teal'}`}>
                    {activeUser?.role === 'admin' ? '⚡ Admin' : '👤 User'}
                  </span>
                </div>
              </div>

              <div className="profile-hero-actions">
                {isOwner && isEditing ? (
                  <>
                    <Button variant="teal" onClick={handleSave} loading={loading} icon={<FiSave />}>
                      Save
                    </Button>
                    <Button variant="ghost" onClick={handleCancel} icon={<FiX />}>
                      Cancel
                    </Button>
                  </>
                ) : isOwner ? (
                  <Button variant="secondary" onClick={handleEdit} icon={<FiEdit2 />}>
                    Edit Profile
                  </Button>
                ) : null}
              </div>

              {isOwner && isEditing && (
                <div className="profile-upload-row">
                  <label className="profile-upload-btn">
                    {uploading.profile ? 'Uploading...' : 'Upload Profile Photo'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleUpload('profile', e.target.files?.[0])}
                      disabled={uploading.profile}
                    />
                  </label>
                  <label className="profile-upload-btn ghost">
                    {uploading.background ? 'Uploading...' : 'Upload Background'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleUpload('background', e.target.files?.[0])}
                      disabled={uploading.background}
                    />
                  </label>
                </div>
              )}
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

          {/* Swap History */}
          <motion.div
            className="profile-section card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="profile-section-title">Swap History</h2>
            {swapHistory.length === 0 ? (
              <p className="profile-bio">No completed swaps yet.</p>
            ) : (
              <div className="swap-history">
                {swapHistory.map((swap) => (
                  <div key={swap._id} className="swap-history-item">
                    <div>
                      <strong>{swap.skillOffered}</strong> for <strong>{swap.skillRequested}</strong>
                    </div>
                    <span>{new Date(swap.updatedAt || swap.createdAt).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </AnimatedPage>
  );
}
