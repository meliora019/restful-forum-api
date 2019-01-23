module.exports = {

  friendlyName: 'User Signup',

  description: 'Sanitizes client data and records it to database if data is correct.',

  inputs: {
    email: {
      type: 'string',
      unique: true,
      isEmail: true,
      required: true,
    },
    username: {
      type: 'string',
      unique: true,
      required: true,
    },
    password: {
      type: 'string',
      required: true
    },
  },

  exits: {
    serverError: {
      responseType: 'serverError'
    },
    conflict: {
      description: 'Conflict',
      statusCode: 409
    },
  },

  fn: async function (inputs, exits) {
    try {
      let email = _.escape(inputs.email);
      let username = _.escape(inputs.username);
      let password = _.escape(inputs.password);

      let user = await User.findOne({email: email});
      if (user) {
        return exits.conflict({"success": 0, "message": "User exists"});
      }

      await User.create({email: email, username: username, password: password});

      return exits.success({"success": 1, "message": "Registration successful"});
    } catch (err) {
      console.log(err);
      return exits.serverError();
    }

  }
};
