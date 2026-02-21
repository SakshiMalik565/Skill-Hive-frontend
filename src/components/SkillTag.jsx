import { motion } from 'framer-motion';
import './SkillTag.css';

export default function SkillTag({ skill, variant = 'teal', removable = false, onRemove, index = 0 }) {
  return (
    <motion.span
      className={`skill-tag skill-tag-${variant}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.08, y: -2 }}
      layout
    >
      {skill}
      {removable && (
        <button className="skill-tag-remove" onClick={() => onRemove?.(skill)}>
          ×
        </button>
      )}
    </motion.span>
  );
}
