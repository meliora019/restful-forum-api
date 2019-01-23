module.exports = {

  friendlyName: 'User logout',

  description: 'User logout.',

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
      await Token.destroy({token: this.req.options.accessToken});

      return exits.success({"success": 1, "message": "Logged out"});
    } catch (err) {
      console.log(err);
      return exits.serverError();
    }
  }
};
