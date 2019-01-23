module.exports = {

  friendlyName: 'Change message',

  description: 'Change own message of a topic.',

  inputs: {
    message: {
      type: 'string',
      required: true,
    },
    user_id: {
      type: 'string',
      required: true,
    },
    topic_id: {
      type: 'string',
      required: true,
    },
    message_id: {
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
    },
    badRequest: {
      responseType: 'badRequest'
    }
  },

  fn: async function (inputs, exits) {
    try {
      let message = _.escape(inputs.message);
      let userId = _.escape(inputs.user_id);
      let topicId = _.escape(inputs.topic_id);
      let messageId = _.escape(inputs.message_id);

      if (userId != this.req.options.userId) {
        return exits.forbidden();
      }

      let messages = await Message.update({id: messageId, topic_id: topicId, user_id: userId}).set({message: message}).fetch();
      if (messages.length == 0) {
        return exits.badRequest({success: 0, message: "Message does not exist"});
      }

      return exits.success({"success": 1, "message": "Message changed"/*, "message_id": messages[0].id*/});
    } catch (err) {
      console.log(err);
      return exits.serverError();
    }
  }
};
