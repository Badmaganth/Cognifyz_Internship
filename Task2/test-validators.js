// Run with: npm test   (no extra packages needed)
const assert = require('assert');
const { validateRegistration } = require('./validators');

const good = {
  fullName: 'Asha Raman', email: 'Asha@Example.com', phone: '98765 43210',
  age: '21', gender: 'female', course: 'web', skills: ['html', 'node'],
  bio: 'Hello', terms: 'on'
};

let r = validateRegistration(good);
assert.strictEqual(r.valid, true);
assert.strictEqual(r.clean.email, 'asha@example.com');
assert.strictEqual(r.clean.phone, '9876543210');

r = validateRegistration({ ...good, email: 'bad@', phone: '12345', age: '10', skills: undefined, terms: undefined });
assert.strictEqual(r.valid, false);
['email', 'phone', 'age', 'skills', 'terms'].forEach(k => assert.ok(r.errors[k], k + ' should have an error'));

r = validateRegistration({ ...good, skills: 'css' });   // a single checkbox arrives as a string
assert.deepStrictEqual(r.clean.skills, ['css']);

console.log('All validator tests passed.');
