// Validation utility functions

export const validateUsername = (username) => {
  const errors = [];
  
  if (!username || !username.trim()) {
    errors.push('Username is required');
    return errors;
  }
  
  const trimmed = username.trim();
  
  if (trimmed.length < 3) {
    errors.push('Username must be at least 3 characters long');
  }
  
  if (trimmed.length > 30) {
    errors.push('Username must not exceed 30 characters');
  }
  
  if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) {
    errors.push('Username can only contain letters, numbers, and underscores');
  }
  
  return errors;
};

export const validateEmail = (email) => {
  const errors = [];
  
  if (!email || !email.trim()) {
    errors.push('Email is required');
    return errors;
  }
  
  const trimmed = email.trim();
  
  // Basic email format validation
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(trimmed)) {
    errors.push('Please enter a valid email address');
  }
  
  return errors;
};

export const validatePassword = (password) => {
  const errors = [];
  
  if (!password) {
    errors.push('Password is required');
    return errors;
  }
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character (!@#$%^&*(),.?":{}|<>)');
  }
  
  return errors;
};

export const validateName = (name, fieldName = 'Name') => {
  const errors = [];
  
  if (!name || !name.trim()) {
    errors.push(`${fieldName} is required`);
    return errors;
  }
  
  const trimmed = name.trim();
  
  if (trimmed.length < 2) {
    errors.push(`${fieldName} must be at least 2 characters long`);
  }
  
  if (!/^[A-Za-z]+$/.test(trimmed)) {
    errors.push(`${fieldName} must contain only letters`);
  }
  
  return errors;
};

export const validateBio = (bio) => {
  const errors = [];
  
  if (bio && bio.length > 500) {
    errors.push('Bio must not exceed 500 characters');
  }
  
  return errors;
};

export const validatePasswordMatch = (password, confirmPassword) => {
  if (password !== confirmPassword) {
    return ['Passwords do not match'];
  }
  return [];
};

// Combined validation for registration
export const validateRegistration = (formData) => {
  const errors = {};
  
  const usernameErrors = validateUsername(formData.username);
  if (usernameErrors.length > 0) {
    errors.username = usernameErrors[0];
  }
  
  const emailErrors = validateEmail(formData.email);
  if (emailErrors.length > 0) {
    errors.email = emailErrors[0];
  }
  
  const firstNameErrors = validateName(formData.first_name, 'First name');
  if (firstNameErrors.length > 0) {
    errors.first_name = firstNameErrors[0];
  }
  
  const lastNameErrors = validateName(formData.last_name, 'Last name');
  if (lastNameErrors.length > 0) {
    errors.last_name = lastNameErrors[0];
  }
  
  const passwordErrors = validatePassword(formData.password);
  if (passwordErrors.length > 0) {
    errors.password = passwordErrors[0];
  }
  
  const matchErrors = validatePasswordMatch(formData.password, formData.password2);
  if (matchErrors.length > 0) {
    errors.password2 = matchErrors[0];
  }
  
  return errors;
};

// Combined validation for login
export const validateLogin = (username, password) => {
  const errors = {};
  
  if (!username || !username.trim()) {
    errors.username = 'Username or email is required';
  }
  
  if (!password || !password.trim()) {
    errors.password = 'Password is required';
  }
  
  return errors;
};

// Combined validation for profile update
export const validateProfileUpdate = (formData) => {
  const errors = {};
  
  if (formData.first_name !== undefined) {
    const firstNameErrors = validateName(formData.first_name, 'First name');
    if (firstNameErrors.length > 0) {
      errors.first_name = firstNameErrors[0];
    }
  }
  
  if (formData.last_name !== undefined) {
    const lastNameErrors = validateName(formData.last_name, 'Last name');
    if (lastNameErrors.length > 0) {
      errors.last_name = lastNameErrors[0];
    }
  }
  
  if (formData.email !== undefined) {
    const emailErrors = validateEmail(formData.email);
    if (emailErrors.length > 0) {
      errors.email = emailErrors[0];
    }
  }
  
  if (formData.bio !== undefined) {
    const bioErrors = validateBio(formData.bio);
    if (bioErrors.length > 0) {
      errors.bio = bioErrors[0];
    }
  }
  
  return errors;
};
