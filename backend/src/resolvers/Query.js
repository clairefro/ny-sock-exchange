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

  async order(parent, args, ctx, info) {
    // make sure logged in
    if(!ctx.request.userId) {
      throw new Error('you aren\'t logged in!');
    }
    // query current order
    const order = await ctx.db.query.order({
      where: {
        id: args.id,
      }
    }, info);
    // check they have permissions to see order
    const ownsOrder = order.user.id === ctx.request.userId;
    const hasPermissionToSeeOrder = ctx.request.user.permissions.includes('ADMIN');
    if(!ownsOrder && !hasPermissionToSeeOrder) {
      throw new Error('You don\'t have permission to view this order.');
    }
    // return order
    return order;
  },

  async orders(parent, args, ctx, info) {
    // chek if logged in
    if(!ctx.request.userId) throw new Error('You need to be logged in to do that');
    return ctx.db.query.orders({
      where: {
        user: {
          id: ctx.request.userId,
        },
      }
    }, info)
  }
}

module.exports = Query;
