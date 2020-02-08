const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const mutations = {
  async createItem(parent, args, ctx, info) {
    // TODO: check if user logged in

    // here we interact with prisma db
     const item = await ctx.db.mutation.createItem({
      data: {
        ... args
      }
    }, info);
    return item;
  },

  updateItem(parent, args, ctx, info) {
    // get copy of updates
    const updates = { ...args };
    // remove ID from updates
    delete updates.id;
    // run update method (db is actual prisma db)
    return ctx.db.mutation.updateItem({
      data: updates,
      where: {
        id: args.id
      }
    }, info)
  },

  async deleteItem(parent, args, ctx, info) {
    const where = { id: args.id };
    // find item
    const item = await ctx.db.query.item({ where }, `{id title}`)
    // check if they own the item
    // TODO
    // delete
    return ctx.db.mutation.deleteItem({ where }, info);
  },

  async signup(parent, args, ctx, info) {
    // standardize email casing
    args.email = args.email.toLowerCase();
    // hash their password
    const password = await bcrypt.hash(args.password, 10);
    // create user in db
    const user = await ctx.db.mutation.createUser({
      data: {
        ...args,
        password,
        permissions: { set: ['USER'] }
      }
    }, info);
    // create their JWT token for session
    const token = jwt.sign({ userID: user.id }, process.env.APP_SECRET);
    // set JWT as a cookie on the res
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365, // one year
    });
    // return user to browser
    return user;
  },
};

module.exports = mutations;
