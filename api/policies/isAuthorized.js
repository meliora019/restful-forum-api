module.exports = async function (req, res, proceed) {
  let accessToken = _.escape(req.headers['auth-token']);

  let tokenExists = await Token.doesExist(accessToken);

  if (!tokenExists) {
    return res.forbidden();
  }

  let token = await Token.findOne({token: accessToken});
  if (Date.now() - token.createdAt > token.expiration_time) {
    return res.forbidden();
  }

  req.options.userId = token.user_id;

  return proceed();

};
