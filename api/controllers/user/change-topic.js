module.exports = {

  friendlyName: 'Update topic',

  description: 'Update topic.',

  inputs: {
    title: {
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
    badRequest: {
      responseType: 'badRequest'
    },
    forbidden: {
      responseType: 'forbidden'
    }
  },

  fn: async function (inputs, exits) {
    try {
      let title = _.escape(inputs.title);
      let userId = _.escape(inputs.user_id);
      let topicId = _.escape(inputs.topic_id);

      if (userId !== this.req.options.userId) {
        return exits.forbidden();
      }

      let topics = await Topic.update({id: topicId, user_id: userId}).set({title: title}).fetch();
      if (topics.length === 0) {
        return exits.badRequest({success:0 , message: 'Topic does not exist'});
      }

      return exits.success({'success': 1, 'message': 'Topic title changed'/*, "new_title": topics[0].title*/});
    } catch (err) {
      console.log(err);
      return exits.serverError();
    }
  }
};
