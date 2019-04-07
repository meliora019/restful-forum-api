module.exports = {

  friendlyName: 'Delete topic',

  description: 'Delete topic.',

  inputs: {
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
    badRequest: {
      responseType: 'badRequest'
    },
    forbidden: {
      responseType: 'forbidden'
    }
  },

  fn: async function (inputs, exits) {
    try {
      let userId = _.escape(inputs.user_id);
      let topicId = _.escape(inputs.topic_id);

      if (userId !== this.req.options.userId) {
        return exits.forbidden();
      }

      let topics = await Topic.destroy({id: topicId}).fetch();
      if (topics.length === 0) {
        return exits.badRequest({success: 0, message: 'Topic does not exist'});
      }

      return exits.success({'success': 1, 'message': 'Topic deleted'});
    } catch (err) {
      console.log(err);
      return exits.serverError();
    }
  }
};
