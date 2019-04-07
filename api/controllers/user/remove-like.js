module.exports = {

  friendlyName: 'Remove like',

  description: 'Remove like from the message.',

  inputs: {
    message_id: {
      type: 'string',
      required: true,
    },
  },

  exits: {
    serverError: {
      responseType: 'serverError'
    },
    notFound: {
      responseType: 'notFound'
    }
  },

  fn: async function (inputs, exits) {
    try {
      let messageId = _.escape(inputs.message_id);

      messageExists = await Message.doesExist(messageId);
      if (!messageExists) {
        return exits.notFound({success: 0, message: 'Message does not exist'});
      }

      await Like.destroy({user_id: this.req.options.userId, message_id: messageId});

      return exits.success({'success': 1, 'message': 'Like removed'});
    } catch (err) {
      console.log(err);
      return exits.serverError();
    }
  }

};
