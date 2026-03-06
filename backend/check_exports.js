const pc = require('./controllers/paymentController');
console.log(Object.keys(pc).map(k => `${k}: ${typeof pc[k]}`));
