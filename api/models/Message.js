module.exports = {

  attributes: {

    user_id: {
      type: 'string',
      required: true,
    },

    topic_id: {
      type: 'string',
      required: true,
    },

    message: {
      type: 'string',
      required: true,
    },

  },

  compose: async function() {
    await Message.destroy({});

    let messages = [];

    for (let i = 1; i <= 20; i++) {
      messages.push({
        user_id: '5c4216daf3b091745f6d5fbf',
        topic_id: '5c445a1da2a54313da01770b',
        message: `message ${i}`
      });
    }

    await Message.createEach(messages);
  },

  doesExist: async function(id) {
    let message = await Message.findOne({id: id});
    if (message){
      return true;
    }
    return false;
  },

};
