
const UsersService = require('../services/UsersService');
const usersService = new UsersService;

describe('User creation', () => {

	it('Should return error if not all required fields are sent', () => {
		let message = usersService.registerUser();
		expect(message.error).toBeTruthy();
		message = usersService.registerUser('test');
		expect(message.error).toBeTruthy();
		message = usersService.registerUser('test', 'test');
		expect(message.error).toBeTruthy();
		message = usersService.registerUser('test', 'test', 'test');
		expect(message.error).toBeTruthy();
	});

});