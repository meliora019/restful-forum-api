module.exports = {

  attributes: {

    client_id: {
      type: 'string',
      unique: true,
      required: true,
    },

    secret: {
      type: 'string',
      required: true,
    },

  },

  compose: async function() {
    await Client.destroy({});
    await Client.create({
      client_id: '2bfe9d72a4aae8f0',
      secret: '5ebe2294ecd0e0f08eab7690d2a6ee69'
    });
  },

  doesExist: async function(clientId) {
    let client = await Client.findOne({client_id: clientId});
    if (client === undefined){
      return false;
    }
    return true;
  }

};
