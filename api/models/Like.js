module.exports = {

  attributes: {

    user_id: {
      type: 'string',
      required: true,
    },

    message_id: {
      type: 'string',
      required: true,
    },

  },

  truncate: async function() {
    await Like.destroy({});
  }

};
