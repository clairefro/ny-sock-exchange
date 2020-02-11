const { forwardTo } = require('prisma-binding');
const { hasPermission } = require('../utils');

// note: 'dogs() {}' is shorthand for 'dogs: function() {}'
const Query = {
  items: forwardTo('db'),
  // async items(parent, args, ctx, info) {
  //   const items = await ctx.db.query.items();
  //   return items;
  // }
  item: forwardTo('db'),
  itemsConnection: forwardTo('db'),
  me(parent, args, ctx, info) {
    // check if there is current user
    if(!ctx.request.userId) {
      return null;
    }
    return ctx.db.query.user({
      where: { id: ctx.request.userId }
    }, info);
  },

  async users(parent, args, ctx, info) {
    // check if logged in
    if(!ctx.request.userId) {
      throw new Error('You must be logged in to do that.');
    }
    // check if current user have has permissions to query all the users
    hasPermission(ctx.request.user, ['ADMIN','PERMISSIONUPDATE']);
    // if so, query all the users
    return ctx.db.query.users({}, info)
  },
}

module.exports = Query;
