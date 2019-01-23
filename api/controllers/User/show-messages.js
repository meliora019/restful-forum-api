module.exports = {

  friendlyName: 'Show messages',

  description: 'Show messages of a topic.',

  inputs: {
    offset: {
      type: 'number',
      columnType: 'integer',
      defaultsTo: 0,
    },
    limit: {
      type: 'number',
      columnType: 'integer',
      defaultsTo: 10,
    },
    topic_id: {
      type: 'string',
      required: true,
    },
  },

  exits: {
    badRequest: {
      responseType: 'badRequest'
    },
    serverError: {
      responseType: 'serverError'
    },
  },

  fn: async function (inputs, exits) {
    try {
      let topicId = _.escape(inputs.topic_id);
      let offset = _.escape(inputs.offset);
      let limit = _.escape(inputs.limit);
      if (isNaN(offset) || isNaN(limit) ) {
        return exits.badRequest({"success": 0, "message": "not valid parameters"});
      }

      let messages = await Message.find({topic_id: topicId}).sort([{id: 'desc'}]).skip(offset).limit(limit);

      return exits.success({"success": 1, messages: messages});
    } catch (err) {
      console.log(err);
      return exits.serverError();
    }
  }
};
