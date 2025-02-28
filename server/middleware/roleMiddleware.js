const isEmployee = (req, res, next) => {
    if (req.user && (req.user.role === 'employee' || req.user.role === 'admin')) {
        next();
    } else {
        next({ code: 'FORBIDDEN', message: 'Insufficient permissions', status: 403 });
    }
};

const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        next({ code: 'FORBIDDEN', message: 'Insufficient permissions', status: 403 });
    }
};

module.exports = { isEmployee, isAdmin };