module.exports = {

	mongoUrl: 'mongodb://localhost:27017/uus',

	jwtSecret: 'yoursecret',
	jwtOptions: {
		algorithms: ["HS384"],
		maxAge: "7d"
	}

}