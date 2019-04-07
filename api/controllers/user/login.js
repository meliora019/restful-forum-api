module.exports = {

  friendlyName: 'User Login',

  description: 'Checks data from client and if data is correct returns token.',

  inputs: {
    email: {
      type: 'string',
      isEmail: true,
      required: true
    },
    password: {
      type: 'string',
      required: true
    },
    client_id: {
      type: 'string',
      required: true
    },
  },

  exits: {
    badRequest: {
      responseType: 'badRequest'
    },
    serverError: {
      responseType: 'serverError'
    },
  },

  fn: async function (inputs, exits) {
    try {
      let email = _.escape(inputs.email);
      let password = _.escape(inputs.password);
      let clientId = _.escape(inputs.client_id);

      let clientExists = await Client.doesExist(clientId);
      let userIsLoggedIn = await User.isLoggedIn(email, password);

      if (!clientExists || !userIsLoggedIn) {
        return exits.badRequest({success: 0, message: 'Either wrong client_id or wrong email and/or password'});
      }

      let token = await Token.generate();
      let user = await User.findOne({email: email, password: password}).select(['id', 'username']);

      let createdToken = await Token.create({client_id: clientId, user_id: user.id, token: token}).fetch();
      let expiresIn = createdToken.expiration_time;

      return exits.success({
        'success': 1, 'token_type': 'bearer', 'token': token, 'expires_in': expiresIn,
        'user_id': user.id, username: user.username
      });
    } catch (err) {
      console.log(err);
      return exits.serverError();
    }
  }
};
