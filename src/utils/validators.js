export function validateLogin(values) {
  const errors = {};

  if (!values.email) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'Invalid email format';
  }

  if (!values.password) {
    errors.password = 'Password is required';
  } else if (values.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  return errors;
}

export function validateRegister(values) {
  const errors = {};

  if (!values.name) {
    errors.name = 'Name is required';
  } else if (values.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }

  if (!values.email) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'Invalid email format';
  }

  if (!values.otp) {
    errors.otp = 'OTP is required';
  } else if (!/^\d{6}$/.test(values.otp)) {
    errors.otp = 'OTP must be 6 digits';
  }

  return errors;
}

export function validatePassword(values) {
  const errors = {};

  if (!values.password) {
    errors.password = 'Password is required';
  } else if (values.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  } else if (!/(?=.*[A-Z])/.test(values.password)) {
    errors.password = 'Need at least one uppercase letter';
  } else if (!/(?=.*[0-9])/.test(values.password)) {
    errors.password = 'Need at least one number';
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password';
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return errors;
}

export function validateSwap(values) {
  const errors = {};

  if (!values.receiverId) {
    errors.receiverId = 'Please select a user';
  }

  if (!values.skillOffered) {
    errors.skillOffered = 'Please select a skill to offer';
  }

  if (!values.skillRequested) {
    errors.skillRequested = 'Please select a skill you want';
  }

  return errors;
}

export function validateProfile(values) {
  const errors = {};

  if (!values.name || values.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }

  if (values.bio && values.bio.length > 500) {
    errors.bio = 'Bio must be under 500 characters';
  }

  return errors;
}
