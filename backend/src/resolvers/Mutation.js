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

  updateItem(paremt, args, ctx, info) {
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
  }
};

module.exports = mutations;
