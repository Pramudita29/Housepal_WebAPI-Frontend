import jwt from 'jsonwebtoken';
const SECRET_KEY = "336aa64a46bc046c582d411fcd8a424cde5bc5c5f6965df5fff9f8451c84e9d3";
console.log('Seeker:', jwt.sign({ email: 'test@example.com', role: 'Seeker' }, SECRET_KEY, { expiresIn: '1h' }));
console.log('Helper:', jwt.sign({ email: 'test@example.com', role: 'Helper' }, SECRET_KEY, { expiresIn: '1h' }));