// 400 — invalid data passed to the methods for creating an item/user or updating an item
// or invalid ID passed to the params.

// 404 — there is no user or clothing item with the requested id, or the request was sent to a non-existent address.

// 500 — default error. Accompanied by the message: "An error has occurred on the server."

const ERROR_CODES = {
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

module.exports = {
  ERROR_CODES,
};
