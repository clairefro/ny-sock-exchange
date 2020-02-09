const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const signTokenAndSetCookie = (user, ctx) => {
  const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
  ctx.response.cookie('token', token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 365, // one year
  });
}

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
    // const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    // // set JWT as a cookie on the res
    // ctx.response.cookie('token', token, {
    //   httpOnly: true,
    //   maxAge: 1000 * 60 * 60 * 24 * 365, // one year
    // });
    signTokenAndSetCookie(user, ctx);
    // return user to browser
    return user;
  },

  async signin(parent, { email, password }, ctx, info) {
    // check if user exists
    const user = await ctx.db.query.user({where: { email }});
    if(!user){
      throw new Error(`No such user found for: ${email}`);
    }
    // check if pw is correct by comparing hashes
    const valid = await bcrypt.compare(password, user.password);
    if(!valid) {
      throw new Error('invalid password');
    }
    // generate jwt token
    // const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    // set cookie with token`
    signTokenAndSetCookie(user, ctx);
    // return the user
    return user;
  },
};

module.exports = mutations;
