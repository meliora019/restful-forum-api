module.exports = {

  friendlyName: 'Set like',

  description: 'Set like to the message.',

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
    badRequest: {
      responseType: 'badRequest'
    },
    conflict: {
      description: 'Conflict',
      statusCode: 409
    }
  },

  fn: async function (inputs, exits) {
    try {
      let messageId = _.escape(inputs.message_id);

      messageExists = await Message.doesExist(messageId);
      if (!messageExists) {
        return exits.badRequest({success:0, message: "Message does not exist"});
      }

      let like = await Like.findOne({user_id: this.req.options.userId, message_id: messageId});
      if (like) {
        return exits.conflict({success: 0, message: "You have alreadey liked this message"});
      }

      await Like.create({user_id: this.req.options.userId, message_id: messageId});

      return exits.success({"success": 1, "message": "Like set"});
    } catch (err) {
      console.log(err);
      return exits.serverError();
    }
  }

};
