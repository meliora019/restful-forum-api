module.exports = {

  friendlyName: 'Show topics',

  description: 'Show topics with pagination.',

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
      let offset = _.escape(inputs.offset);
      let limit = _.escape(inputs.limit);
      if (isNaN(offset) || isNaN(limit) ) {
        return exits.badRequest({"success": 0, "message": "not valid parameters"});
      }

      let topics = await Topic.find().sort([{id: 'desc'}]).skip(offset).limit(limit);

      return exits.success({"success": 1, topics: topics});
    } catch (err) {
      console.log(err);
      return exits.serverError();
    }
  }
};
