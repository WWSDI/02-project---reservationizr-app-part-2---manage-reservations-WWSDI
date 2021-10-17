const jwt = jest.fn().mockImplementation((options) => (req, res, next) => {
  req.user = {
    sub: "mock-user-id",
  };
  next();
});

module.exports = jwt;
