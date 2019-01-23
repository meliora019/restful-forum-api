module.exports = {

  attributes: {

    client_id: {
      type: 'string',
      required: true,
    },

    user_id: {
      type: 'string',
      required: true,
    },

    token: {
      type: 'string',
      unique: true,
      required: true,
      minLength: 32,
      maxLength: 32,
    },

    type: {
      type: 'string',
      defaultsTo: 'bearer',
    },

    expiration_time: {
      type: 'number',
      columnType: 'integer',
      defaultsTo: 3600,
    }

  },

  truncate: async function() {
    await Token.destroy({});
  },

  generate: async function() {
    const crypto = require('crypto');
    let str = Math.random() + "go" + Math.random();
    return crypto.createHash('md5').update(str).digest("hex");
  },

  doesExist: async function(token) {
    let item = await Token.findOne({token: token});
    if (item) return true;
    return false;
  },

};
