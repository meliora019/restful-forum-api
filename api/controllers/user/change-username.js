module.exports = {

  friendlyName: 'Change username',

  description: 'Change username.',

  inputs: {
    new_username: {
      type: 'string',
      required: true,
      maxLength: 128,
    },
    user_id: {
      type: 'string',
      required: true,
    },
  },

  exits: {
    serverError: {
      responseType: 'serverError'
    },
    forbidden: {
      responseType: 'forbidden'
    }
  },

  fn: async function (inputs, exits) {
    try {
      let newUsername = _.escape(inputs.new_username);
      let userId = _.escape(inputs.user_id);

      if (userId !== this.req.options.userId) {
        return exits.forbidden();
      }

      let user = await User.update({id: userId}).set({username: newUsername}).fetch();
      if (user.length === 0) {
        return exits.badRequest();
      }

      return exits.success({'success': 1, 'message': 'Username changed'/*, "new_username": user[0].username*/});
    } catch (err) {
      console.log(err);
      return exits.serverError();
    }
  }
};
