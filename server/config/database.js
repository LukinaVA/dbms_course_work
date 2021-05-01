module.exports = {
    connectionPool: {
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        connectString: process.env.CONNECTIONSTRING,
        poolMin: 10,
        poolMax: 10,
        poolIncrement: 0
    }
};