module.exports = {

  friendlyName: 'Upload avatar',

  description: 'Upload avatar.',

  files: ['avatar'],

  inputs: {
    avatar: {
      example: '===',
      required: true,
    },
    user_id: {
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
    forbidden: {
      responseType: 'forbidden'
    }
  },

  fn: async function (inputs, exits) {
    var user;

    try {
      let userId = _.escape(inputs.user_id);
      user = await User.findOne({id: userId});

      if (userId !== this.req.options.userId) {
        return exits.forbidden();
      }
    } catch(err) {
      console.log(err);
      return exits.serverError();
    }

    inputs.avatar.upload({
      maxBytes: 10000000,
      dirname: require('path').resolve(sails.config.appPath, `avatars`),
      // saveAs: user.email + '.jpg'
      saveAs: function (file, next) {
        let extension = file.filename.split('.').pop();

        if (file.headers['content-type'] !== 'image/jpeg') {
          return next(new Error('Not valid Content-Type'));
        }

        if (extension !== 'jpg' && extension !== 'jpeg') {
          return next(new Error('Not valid extension'));
        }

        return next(null, user.email + '.jpg');
      }
    }, (err, uploadedFiles) => {
      if (err) {
        console.log(err);
        return exits.serverError();
      }

      try {
        if (uploadedFiles.length === 0) {
          return exits.badRequest({'success': 0, 'message': 'No avatar was uploaded'});
        }

        return exits.success({'success': 1, 'message': 'Avatar uploaded'});
      } catch (err) {
        console.log(err);
        return exits.serverError();
      }
    });
  }

};
