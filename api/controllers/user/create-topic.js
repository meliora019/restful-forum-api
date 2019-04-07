module.exports = {

  friendlyName: 'Create topic',

  description: 'Create topic.',

  inputs: {
    title: {
      type: 'string',
      required: true,
    },
    user_id: {
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
    }
  },

  fn: async function (inputs, exits) {
    try {
      let title = _.escape(inputs.title);
      let userId = _.escape(inputs.user_id);

      if (userId !== this.req.options.userId) {
        return exits.forbidden();
      }

      let topic = await Topic.create({user_id: userId, title: title}).fetch();

      return exits.success({'success': 1, 'message': 'Topic created', /*"title": topic.title,*/ 'topic_id': topic.id});
    } catch (err) {
      console.log(err);
      return exits.serverError();
    }
  }
};
