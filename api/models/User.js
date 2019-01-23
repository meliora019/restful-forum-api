module.exports = {

  attributes: {

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
      maxLength: 128,
    },

    password: {
      type: 'string',
      required: true,
      minLength: 8,
      maxLength: 64,
    },

  },

  truncate: async function() {
    await User.destroy({});
  },

  isLoggedIn: async function(email, password) {
    let user = await User.findOne({email: email, password: password});
    if (user === undefined) return false;
    return true;
  },

};
