module.exports = {

  friendlyName: 'Change user password',

  description: 'Change-password operations require that the user\'s current password be known before the change is allowed.',

  inputs: {
    current_password: {
      type: 'string',
      required: true,
      minLength: 8,
      maxLength: 64,
    },
    new_password: {
      type: 'string',
      required: true,
      minLength: 8,
      maxLength: 64,
    },
    new_password_confirmation: {
      type: 'string',
      required: true,
      minLength: 8,
      maxLength: 64,
    },
    user_id: {
      type: 'string',
      required: true,
    },
  },

  exits: {
    badRequest: {
      responseType: 'badRequest'
    },
    serverError: {
      responseType: 'serverError'
    },
    forbidden: {
      responseType: 'forbidden'
    }
  },

  fn: async function (inputs, exits) {
    try {
      let currentPassword = _.escape(inputs.current_password);
      let newPassword = _.escape(inputs.new_password);
      let newPasswordConfirmation = _.escape(inputs.new_password_confirmation);
      let userId = _.escape(inputs.user_id);

      if (userId != this.req.options.userId) {
        return exits.forbidden();
      }

      let user = await User.findOne({id: userId}).select(['password']);

      if (user.password != currentPassword || newPassword != newPasswordConfirmation) {
        return exits.badRequest({"success": 0, "message": "Wrong current password or password and its confirmation don't match"});
      }

      await User.update({id: userId}).set({password: newPassword});

      return exits.success({"success": 1, "message": "Password changed"});
    } catch (err) {
      console.log(err);
      return exits.serverError();
    }
  }
};
