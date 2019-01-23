'use strict';

var sails = require('sails');

const host = (JSON.parse(require('fs').readFileSync(require('path').join(__dirname, '../../config.json'), 'utf8'))).host;

const assert = require('assert');
const request = require('request');
const fs = require('fs');
const path = require('path');

describe('UserController', () => {

  let accessToken, userId, topicId, messageId;

  before(async () => {
    const dir = `${sails.config.appPath}/avatars`

    let files = fs.readdirSync(dir);
    for (let file of files) {
      if (file != '.gitkeep') {
        fs.unlinkSync(path.join(dir, file));
      }
    }

    await User.truncate();
    await Token.truncate();
    await Client.compose();
    await Topic.compose();
    await Message.compose();
    await Like.truncate();
  });

  describe('#signup', () => {

  	it('method not allowed', (done) => {
      request.get(`${host}/users`, (err, httpResponse, body) => {
        if (err) console.log(err);
				assert.equal(httpResponse.statusCode, 404);
        done();
			});
		});

    it('invalid param "email"', (done) => {
      request.post(`${host}/users`, {form: {
  			email: 'ivanmail.ru', username: 'Ivan', password: '123456789'
  		}}, (err, httpResponse, body) => {
        if (err) done(err);
				assert.equal(httpResponse.statusCode, 400);
        done()
			});
		});

    it('should register user', (done) => {
      request.post(`${host}/users`, {form: {
  			email: 'ivan@mail.ru', username: 'Ivan', password: '123456789'
  		}}, async (err, httpResponse, body) => {
        if (err) done(err);
        try {
          body = JSON.parse(body);
          let users = await User.find();

  				assert.equal(httpResponse.statusCode, 200);
          assert.equal(body.success, 1);
          assert.equal(users.length, 1);
          assert.equal(users[0].email, "ivan@mail.ru");
          assert.equal(users[0].username, "Ivan");
          assert.equal(users[0].password, "123456789");

          done();
        } catch (err) {
          done(err);
        }
			});
		});

    it('should not register user (user exists)', (done) => {
      request.post(`${host}/users`, {form: {
  			email: 'ivan@mail.ru', username: 'Ivan', password: '123123456789'
  		}}, async (err, httpResponse, body) => {
        if (err) done(err);
        try {
          body = JSON.parse(body);
          let users = await User.find();

          assert.equal(httpResponse.statusCode, 409);
          assert.equal(body.success, 0);
          assert.equal(body.message, "User exists");
          assert.equal(users.length, 1);

          done();
        } catch (err) {
          done(err);
        }
			});
		});

  });

  describe("#login", () => {

    it('not correct user password', (done) => {
      request.post(`${host}/login`, {form: {
  			email: 'ivan@mail.ru', password: '1234567890', client_id: "2bfe9d72a4aae8f0"
  		}}, async (err, httpResponse, body) => {
        if (err) done(err);
        try {
          body = JSON.parse(body);
          let tokens = await Token.find();

  				assert.equal(httpResponse.statusCode, 400);
  				assert.equal(body.success, 0);
  				assert.equal(body.message, "Either wrong client_id or wrong email and/or password");
  				assert.equal(tokens.length, 0);

          done();
        } catch (err) {
          done(err);
        }
			});
		});

    it('not correct client_id', (done) => {
      request.post(`${host}/login`, {form: {
  			email: 'ivan@mail.ru', password: '123456789', client_id: "2bfe9d72a4aae8f0q"
  		}}, async (err, httpResponse, body) => {
        if (err) done(err);
        try {
          body = JSON.parse(body);
          let tokens = await Token.find();

  				assert.equal(httpResponse.statusCode, 400);
  				assert.equal(body.success, 0);
  				assert.equal(body.message, "Either wrong client_id or wrong email and/or password");
  				assert.equal(tokens.length, 0);

          done();
        } catch (err) {
          done(err);
        }
			});
		});

    it('should log in and get token', (done) => {
      request.post(`${host}/login`, {form: {
  			email: 'ivan@mail.ru', password: '123456789', client_id: "2bfe9d72a4aae8f0"
  		}, headers: {"auth-token": "tokkken"}}, async (err, httpResponse, body) => {
        if (err) done(err);
        try {
          body = JSON.parse(body);
          let tokens = await Token.find();

  				assert.equal(httpResponse.statusCode, 200);
  				assert.equal(body.success, 1);
  				assert.equal(body.token_type, "bearer");
  				assert.equal(body.username, "Ivan");
  				assert.equal(typeof body.token, "string");
  				assert.equal(typeof body.user_id, "string");
  				assert.equal(body.token.length, 32);
  				assert.equal(tokens.length, 1);
          assert.equal(typeof tokens[0].token, "string");
  				assert.equal(tokens[0].token.length, 32);
  				assert.equal(tokens[0].client_id, "2bfe9d72a4aae8f0");
  				assert.equal(tokens[0].expiration_time, 3600);

          accessToken = body.token;
          userId = body.user_id;

          done();
        } catch (err) {
          done(err);
        }
			});
		});

  });

  describe('#change-password', () => {

    it('wrong method HTTP', (done) => {
      request.post(`${host}/users/${userId}/password`, {headers: {
        "auth-token": "wrong_token"
      }}, async (err, httpResponse, body) => {
        if (err) done(err);
        try {
  				assert.equal(httpResponse.statusCode, 404);
          done();
        } catch (err) {
          done(err);
        }
			});
		});

    it('wrong token', (done) => {
      request.put(`${host}/users/${userId}/password`, {headers: {
        "auth-token": "wrong_token"
      }}, async (err, httpResponse, body) => {
        if (err) done(err);
        try {
  				assert.equal(httpResponse.statusCode, 403);
          done();
        } catch (err) {
          done(err);
        }
			});
		});

    it('wrong current password', (done) => {
      request.put(`${host}/users/${userId}/password`, {form: {
  			current_password: '1234567899', new_password: '1234567890', new_password_confirmation: '1234567890'
  		}, headers: {"auth-token": accessToken}}, async (err, httpResponse, body) => {
        if (err) done(err);
        try {
          assert.equal(httpResponse.statusCode, 400);
          done();
        } catch (err) {
          done(err);
        }
			});
		});

    it('new password and password confirmation does not match', (done) => {
      request.put(`${host}/users/${userId}/password`, {form: {
  			current_password: '123456789', new_password: '1234567890', new_password_confirmation: '1234567891'
  		}, headers: {"auth-token": accessToken}}, async (err, httpResponse, body) => {
        if (err) done(err);
        try {
          assert.equal(httpResponse.statusCode, 400);
          done();
        } catch (err) {
          done(err);
        }
			});
		});

    it('password should change', (done) => {
      request.put(`${host}/users/${userId}/password`, {form: {
  			current_password: '123456789', new_password: '1234567890', new_password_confirmation: '1234567890'
  		}, headers: {"auth-token": accessToken}}, async (err, httpResponse, body) => {
        if (err) done(err);
        try {
          body = JSON.parse(body);
          let user = await User.findOne({id: userId});

          assert.equal(httpResponse.statusCode, 200);
          assert.equal(body.success, 1);
          assert.equal(user.password, "1234567890");

          done();
        } catch (err) {
          done(err);
        }
			});
		});

  });

  describe('#change-username', () => {

    it('wrong method HTTP', (done) => {
      request.post(`${host}/users/${userId}`, {headers: {
        "auth-token": accessToken
      }}, async (err, httpResponse, body) => {
        if (err) done(err);
        try {
  				assert.equal(httpResponse.statusCode, 404);
          done();
        } catch (err) {
          done(err);
        }
			});
		});

    it('wrong token', (done) => {
      request.put(`${host}/users/${userId}`, {headers: {
        "auth-token": "wrong_token"
      }}, async (err, httpResponse, body) => {
        if (err) done(err);
        try {
  				assert.equal(httpResponse.statusCode, 403);
          done();
        } catch (err) {
          done(err);
        }
			});
		});

    it('username should be changed', (done) => {
      request.put(`${host}/users/${userId}`, {form: {
  			new_username: 'John'
  		}, headers: {"auth-token": accessToken}}, async (err, httpResponse, body) => {
        if (err) done(err);
        try {
          body = JSON.parse(body);
          let user = await User.findOne({id: userId});

          assert.equal(httpResponse.statusCode, 200);
          assert.equal(body.success, 1);
          assert.equal(user.username, "John");

          done();
        } catch (err) {
          done(err);
        }
			});
		});

  });

  describe('#upload-avatar', () => {

    it('wrong method HTTP', (done) => {
      request.post(`${host}/users/${userId}/avatar`, {headers: {
        "auth-token": accessToken
      }}, async (err, httpResponse, body) => {
        if (err) done(err);
        try {
  				assert.equal(httpResponse.statusCode, 404);
          done();
        } catch (err) {
          done(err);
        }
			});
		});

    it('wrong token', (done) => {
      request.put(`${host}/users/${userId}/avatar`, {headers: {
        "auth-token": "wrong_token"
      }}, async (err, httpResponse, body) => {
        if (err) done(err);
        try {
  				assert.equal(httpResponse.statusCode, 403);
          done();
        } catch (err) {
          done(err);
        }
			});
		});

    it('no avatar was uploaded', (done) => {
      request.put(`${host}/users/${userId}/avatar`, {headers: {
        "auth-token": accessToken
      }}, async (err, httpResponse, body) => {
        if (err) done(err);
        try {
          body = JSON.parse(body);
  				assert.equal(httpResponse.statusCode, 400);
  				assert.equal(body.success, 0);
  				assert.equal(body.message, "No avatar was uploaded");
          done();
        } catch (err) {
          done(err);
        }
			});
		});

    it('should upload avatar', (done) => {
      request.put(`${host}/users/${userId}/avatar`, {formData: {
        avatar: [require('fs').createReadStream(sails.config.appPath + '/test_files/cat.jpeg')]
  		}, headers: {"auth-token": accessToken}}, async (err, httpResponse, body) => {
        if (err) done(err);
        try {
          body = JSON.parse(body);

          const file = `${sails.config.appPath}/avatars/ivan@mail.ru.jpg`
          let fileExists;

          fileExists = fs.existsSync(file);

          assert.equal(httpResponse.statusCode, 200);
          assert.equal(body.success, 1);
          assert.equal(fileExists, true);

          done();
        } catch (err) {
          done(err);
        }
			});
		});

  });

  describe('#show-topics', () => {

    it('bad request', (done) => {
      request.get(`${host}/topics?limit=wrong`, async (err, httpResponse, body) => {
        if (err) done(err);
        try {
  				assert.equal(httpResponse.statusCode, 400);
          done();
        } catch (err) {
          done(err);
        }
			});
		});

    it('limit 5, 5 desc', (done) => {
      request.get(`${host}/topics?offset=5&limit=5`, async (err, httpResponse, body) => {
        if (err) done(err);
        try {
          body = JSON.parse(body);

          assert.equal(httpResponse.statusCode, 200);
          assert.equal(body.success, 1);
          assert.equal(body.topics.length, 5);
          assert.equal(body.topics[3].title, 'title 12');

          done();
        } catch (err) {
          done(err);
        }
			});
		});

  });

  describe('#create-topic', () => {

    it('without token', (done) => {
      request.post(`${host}/users/${userId}/topics`, (err, httpResponse, body) => {
        if (err) done(err);
				assert.equal(httpResponse.statusCode, 403);
        done()
			});
		});

    it('without params', (done) => {
      request.post(`${host}/users/${userId}/topics`, {headers: {
  			"auth-token": accessToken
  		}}, async (err, httpResponse, body) => {
        if (err) done(err);
        try {
          assert.equal(httpResponse.statusCode, 400);
          done();
        } catch (err) {
          done(err);
        }
			});
		});

    it('should not create topic', (done) => {
      request.post(`${host}/users/sdfsf7887sdfsdf/topics`, {form: {
  			title: 'title 21'
  		}, headers: {"auth-token": accessToken}}, async (err, httpResponse, body) => {
        if (err) done(err);
        try {
          let topics = await Topic.find();
          assert.equal(httpResponse.statusCode, 403);
          assert.equal(topics.length, 20);
          done();
        } catch (err) {
          done(err);
        }
			});
		});

    it('should create topic', (done) => {
      request.post(`${host}/users/${userId}/topics`, {form: {
  			title: 'title 21'
  		}, headers: {"auth-token": accessToken}}, async (err, httpResponse, body) => {
        if (err) done(err);
        try {
          body = JSON.parse(body);
          let topics = await Topic.find();

          assert.equal(httpResponse.statusCode, 200);
          assert.equal(body.success, 1);
          // assert.equal(body.title, 'title 21');
          assert.equal(typeof body.topic_id, 'string');
          assert.equal(topics.length, 21);
          assert.equal(topics[20].title, 'title 21');
          assert.equal(typeof topics[20].user_id, 'string');

          topicId = body.topic_id;

          done();
        } catch (err) {
          done(err);
        }
			});
		});

  });

  describe('#change-topic', () => {

    it('without token', (done) => {
      request.put(`${host}/users/${userId}/topics/${topicId}`, (err, httpResponse, body) => {
        if (err) done(err);
				assert.equal(httpResponse.statusCode, 403);
        done()
			});
		});

    it('without params', (done) => {
      request.put(`${host}/users/${userId}/topics/${topicId}`, {headers: {
  			"auth-token": accessToken
  		}}, async (err, httpResponse, body) => {
        if (err) done(err);
        try {
          assert.equal(httpResponse.statusCode, 400);
          done();
        } catch (err) {
          done(err);
        }
			});
		});

    it('should change title of the topic', (done) => {
      request.put(`${host}/users/${userId}/topics/${topicId}`, {form: {
  			title: 'title 22'
  		}, headers: {"auth-token": accessToken}}, async (err, httpResponse, body) => {
        if (err) done(err);
        try {
          body = JSON.parse(body);
          let topics = await Topic.find();

          assert.equal(httpResponse.statusCode, 200);
          assert.equal(body.success, 1);
          // assert.equal(body.new_title, 'title 22');
          assert.equal(topics.length, 21);
          assert.equal(typeof topics[20].user_id, 'string');
          assert.equal(topics[20].title, 'title 22');

          done();
        } catch (err) {
          done(err);
        }
			});
		});

  });

  describe('#delete-topic', () => {

    it('without token', (done) => {
      request.delete(`${host}/users/${userId}/topics/${topicId}`, (err, httpResponse, body) => {
        if (err) done(err);
				assert.equal(httpResponse.statusCode, 403);
        done()
			});
		});

    it('not correct param topic_id', (done) => {
      request.delete(`${host}/users/${userId}/topics/sdfsdf5343kkj`, {headers: {
  			"auth-token": accessToken
  		}}, async (err, httpResponse, body) => {
        if (err) done(err);
        try {
          assert.equal(httpResponse.statusCode, 400);
          done();
        } catch (err) {
          done(err);
        }
			});
		});

    it('create and delete topic', (done) => {
      request.post(`${host}/users/${userId}/topics`, {form: {
  			title: 'title 21'
  		}, headers: {"auth-token": accessToken}}, async (err, httpResponse, body) => {
        if (err) done(err);
        try {
          body = JSON.parse(body);
          let tmpTopicId = body.topic_id;

          let topics = await Topic.find();
          assert.equal(topics.length, 22);

          request.delete(`${host}/users/${userId}/topics/${tmpTopicId}`, {headers: {
            "auth-token": accessToken
          }}, async (err, httpResponse, body) => {
            if (err) done(err);
            try {
              body = JSON.parse(body);
              let topics = await Topic.find();

              assert.equal(httpResponse.statusCode, 200);
              assert.equal(body.success, 1);
              assert.equal(topics.length, 21);

              done();
            } catch (err) {
              done(err);
            }
    			});
        } catch (err) {
          done(err);
        }
			});
		});

  });

  describe('#show-messages', () => {

    it('limit 5, 5 desc', (done) => {
      request.get(`${host}/topics/5c445a1da2a54313da01770b/messages?offset=5&limit=5`, async (err, httpResponse, body) => {
        if (err) done(err);
        try {
          body = JSON.parse(body);

          assert.equal(httpResponse.statusCode, 200);
          assert.equal(body.success, 1);
          assert.equal(body.messages.length, 5);
          assert.equal(body.messages[3].message, 'message 12');

          done();
        } catch (err) {
          done(err);
        }
			});
		});

  });

  describe('#create-message', () => {

    it('without token', (done) => {
      request.post(`${host}/users/${userId}/topics/${topicId}/messages`, (err, httpResponse, body) => {
        if (err) done(err);
				assert.equal(httpResponse.statusCode, 403);
        done()
			});
		});

    it('without params', (done) => {
      request.post(`${host}/users/${userId}/topics/${topicId}/messages`, {headers: {
  			"auth-token": accessToken
  		}}, async (err, httpResponse, body) => {
        if (err) done(err);
        try {
          assert.equal(httpResponse.statusCode, 400);
          done();
        } catch (err) {
          done(err);
        }
			});
		});

    it('should not create message (topic does not exist)', (done) => {
      request.post(`${host}/users/${userId}/topics/sdfsdf88sdf/messages`, {form: {
  			message: 'message 21'
  		}, headers: {"auth-token": accessToken}}, async (err, httpResponse, body) => {
        if (err) done(err);
        try {
          let messages = await Message.find();
          assert.equal(httpResponse.statusCode, 400);
          assert.equal(messages.length, 20);
          done();
        } catch (err) {
          done(err);
        }
			});
		});

    it('should create message', (done) => {
      request.post(`${host}/users/${userId}/topics/${topicId}/messages`, {form: {
  			message: 'message 21'
  		}, headers: {"auth-token": accessToken}}, async (err, httpResponse, body) => {
        if (err) done(err);
        try {
          body = JSON.parse(body);
          let messages = await Message.find();

          assert.equal(httpResponse.statusCode, 200);
          assert.equal(body.success, 1);
          assert.equal(typeof body.message_id, 'string');
          assert.equal(messages.length, 21);
          assert.equal(messages[20].message, 'message 21');
          assert.equal(typeof messages[20].user_id, 'string');
          assert.equal(typeof messages[20].topic_id, 'string');

          messageId = body.message_id;

          done();
        } catch (err) {
          done(err);
        }
			});
		});

  });

  describe('#change-message', () => {

    it('without token', (done) => {
      request.put(`${host}/users/${userId}/topics/${topicId}/messages/${messageId}`, (err, httpResponse, body) => {
        if (err) done(err);
				assert.equal(httpResponse.statusCode, 403);
        done()
			});
		});

    it('without params', (done) => {
      request.put(`${host}/users/${userId}/topics/${topicId}/messages/${messageId}`, {headers: {
  			"auth-token": accessToken
  		}}, async (err, httpResponse, body) => {
        if (err) done(err);
        try {
          assert.equal(httpResponse.statusCode, 400);
          done();
        } catch (err) {
          done(err);
        }
			});
		});

    it('should not change message (topic does not exist)', (done) => {
      request.put(`${host}/users/${userId}/topics/sdfsdf88sdf/messages/${messageId}`, {form: {
  			message: 'message 22'
  		}, headers: {"auth-token": accessToken}}, async (err, httpResponse, body) => {
        if (err) done(err);
        try {
          let messages = await Message.find();
          assert.equal(httpResponse.statusCode, 400);
          assert.equal(messages.length, 21);
          assert.equal(messages[20].message, 'message 21');
          done();
        } catch (err) {
          done(err);
        }
			});
		});

    it('should change message', (done) => {
      request.put(`${host}/users/${userId}/topics/${topicId}/messages/${messageId}`, {form: {
  			message: 'message 22'
  		}, headers: {"auth-token": accessToken}}, async (err, httpResponse, body) => {
        if (err) done(err);
        try {
          body = JSON.parse(body);
          let messages = await Message.find();

          assert.equal(httpResponse.statusCode, 200);
          assert.equal(body.success, 1);
          // assert.equal(typeof body.message_id, 'string');
          assert.equal(messages.length, 21);
          assert.equal(messages[20].message, 'message 22');
          assert.equal(typeof messages[20].user_id, 'string');
          assert.equal(typeof messages[20].topic_id, 'string');

          done();
        } catch (err) {
          done(err);
        }
			});
		});

  });

  describe('#delete-message', () => {

    it('without token', (done) => {
      request.delete(`${host}/users/${userId}/topics/${topicId}/messages/${messageId}`, (err, httpResponse, body) => {
        if (err) done(err);
				assert.equal(httpResponse.statusCode, 403);
        done()
			});
		});

    it('should not delete message (topic does not exist)', (done) => {
      request.delete(`${host}/users/${userId}/topics/sdfsdf88sdf/messages/${messageId}`, { headers: {
        "auth-token": accessToken
      }}, async (err, httpResponse, body) => {
        if (err) done(err);
        try {
          let messages = await Message.find();
          assert.equal(httpResponse.statusCode, 400);
          assert.equal(messages.length, 21);
          assert.equal(messages[20].message, 'message 22');
          done();
        } catch (err) {
          done(err);
        }
			});
		});

    it('create and delete message', (done) => {
      request.post(`${host}/users/${userId}/topics/${topicId}/messages`, {form: {
  			message: 'message 99'
  		}, headers: {"auth-token": accessToken}}, async (err, httpResponse, body) => {
        if (err) done(err);
        try {
          body = JSON.parse(body);
          let tmpMessageId = body.message_id;

          let messages = await Message.find();
          assert.equal(messages.length, 22);

          request.delete(`${host}/users/${userId}/topics/${topicId}/messages/${tmpMessageId}`, {headers: {
            "auth-token": accessToken
          }}, async (err, httpResponse, body) => {
            if (err) done(err);
            try {
              body = JSON.parse(body);
              let messages = await Message.find();

              assert.equal(httpResponse.statusCode, 200);
              assert.equal(body.success, 1);
              assert.equal(messages.length, 21);

              done();
            } catch (err) {
              done(err);
            }
    			});
        } catch (err) {
          done(err);
        }
			});
		});

  });

  describe('#set-like', () => {

    it('without token', (done) => {
      request.put(`${host}/messages/${messageId}/like`, (err, httpResponse, body) => {
        if (err) done(err);
				assert.equal(httpResponse.statusCode, 403);
        done()
			});
		});

    it('should not set like (message does not exist)', (done) => {
      request.put(`${host}/messages/sfsd778sdfsdf/like`, {headers: {
        "auth-token": accessToken
      }}, async (err, httpResponse, body) => {
        if (err) done(err);
        try {
          let likes = await Like.find();
          assert.equal(httpResponse.statusCode, 400);
          assert.equal(likes.length, 0);
          done();
        } catch (err) {
          done(err);
        }
			});
		});

    it('should set like', (done) => {
      request.put(`${host}/messages/${messageId}/like`, {headers: {
        "auth-token": accessToken
      }}, async (err, httpResponse, body) => {
        if (err) done(err);
        try {
          body = JSON.parse(body);
          let likes = await Like.find();

          assert.equal(httpResponse.statusCode, 200);
          assert.equal(body.success, 1);
          assert.equal(likes.length, 1);
          assert.equal(likes[0].message_id, messageId);
          assert.equal(likes[0].user_id, userId);

          done();
        } catch (err) {
          done(err);
        }
			});
		});

    it('should set like on the same message again', (done) => {
      request.put(`${host}/messages/${messageId}/like`, {headers: {
        "auth-token": accessToken
      }}, async (err, httpResponse, body) => {
        if (err) done(err);
        try {
          let likes = await Like.find();

          assert.equal(httpResponse.statusCode, 409);
          assert.equal(likes.length, 1);
          assert.equal(likes[0].message_id, messageId);
          assert.equal(likes[0].user_id, userId);

          done();
        } catch (err) {
          done(err);
        }
			});
		});

  });

  describe('#remove-like', () => {

    it('without token', (done) => {
      request.delete(`${host}/messages/${messageId}/like`, (err, httpResponse, body) => {
        if (err) done(err);
				assert.equal(httpResponse.statusCode, 403);
        done()
			});
		});

    it('should not remove like (message does not exist)', (done) => {
      request.delete(`${host}/messages/sfsd778sdfsdf/like`, {headers: {
        "auth-token": accessToken
      }}, async (err, httpResponse, body) => {
        if (err) done(err);
        try {
          let likes = await Like.find();
          assert.equal(httpResponse.statusCode, 404);
          assert.equal(likes.length, 1);
          done();
        } catch (err) {
          done(err);
        }
			});
		});

    it('should remove like', (done) => {
      request.delete(`${host}/messages/${messageId}/like`, {headers: {
        "auth-token": accessToken
      }}, async (err, httpResponse, body) => {
        if (err) done(err);
        try {
          body = JSON.parse(body);
          let likes = await Like.find();

          assert.equal(httpResponse.statusCode, 200);
          assert.equal(body.success, 1);
          assert.equal(likes.length, 0);

          done();
        } catch (err) {
          done(err);
        }
			});
		});

    it('trying remove the same like again', (done) => {
      request.delete(`${host}/messages/${messageId}/like`, {headers: {
        "auth-token": accessToken
      }}, async (err, httpResponse, body) => {
        if (err) done(err);
        try {
          body = JSON.parse(body);
          let likes = await Like.find();

          assert.equal(httpResponse.statusCode, 200);
          assert.equal(body.success, 1);
          assert.equal(likes.length, 0);

          done();
        } catch (err) {
          done(err);
        }
			});
		});

  });

  describe('#logout', () => {

    it('without token', (done) => {
      request.get(`${host}/logout`, (err, httpResponse, body) => {
        if (err) done(err);
				assert.equal(httpResponse.statusCode, 403);
        done()
			});
		});

    it('should logout', (done) => {
      request.get(`${host}/logout`, {headers: {
        "auth-token": accessToken
      }}, async (err, httpResponse, body) => {
        if (err) done(err);
        try {
          body = JSON.parse(body);
          let tokens = await Token.find();

          assert.equal(httpResponse.statusCode, 200);
          assert.equal(body.success, 1);
          assert.equal(tokens.length, 0);

          done();
        } catch (err) {
          done(err);
        }
			});
		});

  });

});
