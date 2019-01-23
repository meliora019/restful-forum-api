module.exports = {

  attributes: {

    user_id: {
      type: 'string',
      required: true,
    },

    title: {
      type: 'string',
      unique: true,
      required: true,
    },

  },

  compose: async function() {
    await Topic.destroy({});

    let topics = [];

    for (let i = 1; i <= 20; i++) {
      topics.push({user_id: "5c4216daf3b091745f6d5fbf", title: `title ${i}`});
    }

    await Topic.createEach(topics);
  },

  doesExist: async function(id) {
    let topic = await Topic.findOne({id: id});
    if (topic) return true;
    return false;
  },

};
