module.exports = {

  friendlyName: 'Create message',

  description: 'Create message for a topic.',

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

      if (userId !== this.req.options.userId) {
        return exits.forbidden();
      }

      topicExists = await Topic.doesExist(topicId);
      if (!topicExists) {
        return exits.badRequest({success: 0, message: 'Topic does not exist'});
      }

      let item = await Message.create({user_id: userId, topic_id: topicId, message: message}).fetch();

      return exits.success({'success': 1, 'message': 'Message created', 'message_id': item.id});
    } catch (err) {
      console.log(err);
      return exits.serverError();
    }
  }
};
