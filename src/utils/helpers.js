export function formatDate(dateStr) {
  if (!dateStr) return 'Not scheduled';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(dateStr) {
  if (!dateStr) return 'Not scheduled';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function timeAgo(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const seconds = Math.floor((now - date) / 1000);

  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
    }
  }
  return 'Just now';
}

export function getInitials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function getStatusColor(status) {
  const map = {
    pending: { bg: 'rgba(255,230,109,0.2)', text: '#B8860B', label: 'Pending' },
    accepted: { bg: 'rgba(78,205,196,0.15)', text: '#3DBDB4', label: 'Accepted' },
    rejected: { bg: 'rgba(255,107,107,0.12)', text: '#E85D5D', label: 'Rejected' },
    completed: { bg: 'rgba(46,204,113,0.12)', text: '#27AE60', label: 'Completed' },
  };
  return map[status] || map.pending;
}

export function getAvatarGradient(id) {
  const gradients = [
    'linear-gradient(135deg, #FF6B6B, #FFE66D)',
    'linear-gradient(135deg, #4ECDC4, #44A8F5)',
    'linear-gradient(135deg, #FFE66D, #FF6B6B)',
    'linear-gradient(135deg, #2ECC71, #4ECDC4)',
    'linear-gradient(135deg, #FF6B6B, #4ECDC4)',
    'linear-gradient(135deg, #44A8F5, #FF6B6B)',
    'linear-gradient(135deg, #FFE66D, #4ECDC4)',
  ];
  const idx = id ? id.charCodeAt(id.length - 1) % gradients.length : 0;
  return gradients[idx];
}

export function renderStars(rating) {
  const stars = [];
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  for (let i = 0; i < 5; i++) {
    if (i < full) stars.push('full');
    else if (i === full && half) stars.push('half');
    else stars.push('empty');
  }
  return stars;
}

export function truncate(str, maxLen = 100) {
  if (!str || str.length <= maxLen) return str;
  return str.slice(0, maxLen).trim() + '...';
}
