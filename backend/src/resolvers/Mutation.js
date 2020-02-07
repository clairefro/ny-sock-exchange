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
  }
};

module.exports = mutations;
