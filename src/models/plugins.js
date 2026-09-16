// Shared Mongoose helpers so every model speaks the same shape as the
// admin-panel front-end (lib/types.ts): a string `id`, no `_id`/`__v`, and an
// auto-incrementing `slNo`.

function toJSONPlugin(schema) {
  schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform(_doc, ret) {
      ret.id = ret._id ? ret._id.toString() : ret.id;
      delete ret._id;
      delete ret.__v;
      // never leak the hashed password
      delete ret.password;
      return ret;
    },
  });
}

// Fill slNo = (current count) + 1 on first save. Good enough for an admin CRUD;
// not meant to survive heavy concurrent inserts.
function autoSlNo(schema) {
  schema.pre('save', async function assignSlNo(next) {
    if (this.isNew && (this.slNo === undefined || this.slNo === null)) {
      this.slNo = (await this.constructor.countDocuments()) + 1;
    }
    next();
  });
}

module.exports = { toJSONPlugin, autoSlNo };
