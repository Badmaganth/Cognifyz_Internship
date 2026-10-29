// Server-side validation rules for the registration form.
// Kept in its own file (pure functions) so it is easy to test.

const COURSES = ['web', 'data', 'cloud', 'security'];
const SKILLS = ['html', 'css', 'javascript', 'node', 'database'];

function toArray(value) {
  if (value === undefined) return [];
  return Array.isArray(value) ? value : [value];
}

function validateRegistration(body) {
  const errors = {};
  const clean = {};

  // Full name: letters, spaces, dots, hyphens, apostrophes; 2-60 chars
  clean.fullName = String(body.fullName || '').trim();
  if (!clean.fullName) errors.fullName = 'Full name is required.';
  else if (clean.fullName.length < 2 || clean.fullName.length > 60)
    errors.fullName = 'Full name must be 2 to 60 characters.';
  else if (!/^[A-Za-z][A-Za-z .'-]*$/.test(clean.fullName))
    errors.fullName = 'Use letters, spaces, dots, hyphens or apostrophes only.';

  // Email
  clean.email = String(body.email || '').trim().toLowerCase();
  if (!clean.email) errors.email = 'Email is required.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(clean.email))
    errors.email = 'Enter a valid email address.';

  // Phone: 10 digits (Indian mobile style, starts 6-9)
  clean.phone = String(body.phone || '').replace(/[\s-]/g, '');
  if (!clean.phone) errors.phone = 'Phone number is required.';
  else if (!/^[6-9]\d{9}$/.test(clean.phone))
    errors.phone = 'Enter a 10-digit mobile number starting with 6, 7, 8 or 9.';

  // Age
  const age = Number(body.age);
  clean.age = age;
  if (body.age === undefined || String(body.age).trim() === '') errors.age = 'Age is required.';
  else if (!Number.isInteger(age) || age < 16 || age > 60)
    errors.age = 'Age must be a whole number between 16 and 60.';

  // Gender (radio)
  clean.gender = String(body.gender || '');
  if (!['female', 'male', 'other'].includes(clean.gender))
    errors.gender = 'Please select an option.';

  // Course (select)
  clean.course = String(body.course || '');
  if (!COURSES.includes(clean.course)) errors.course = 'Please choose a course.';

  // Skills (checkbox group, at least one, only known values)
  clean.skills = toArray(body.skills).filter(s => SKILLS.includes(s));
  if (clean.skills.length === 0) errors.skills = 'Pick at least one skill.';

  // Bio (optional, max 200)
  clean.bio = String(body.bio || '').trim();
  if (clean.bio.length > 200) errors.bio = 'Bio can be at most 200 characters.';

  // Terms
  clean.terms = body.terms === 'on' || body.terms === 'true';
  if (!clean.terms) errors.terms = 'You must accept the terms to continue.';

  return { valid: Object.keys(errors).length === 0, errors, clean };
}

module.exports = { validateRegistration, COURSES, SKILLS };
