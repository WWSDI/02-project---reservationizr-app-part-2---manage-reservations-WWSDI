const jwksRsa = jest.createMockFromModule("express-jwt");

jwksRsa.expressJwtSecret = jest.fn();

module.exports = jwksRsa;
