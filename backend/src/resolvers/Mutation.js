const mutations = {
  async createItem(paremt, args, ctx, info) {
    // TODO: check if user logged in

    // here we interact with prisma db
     const item = await ctx.db.mutation.createItem({
      data: {
        ... args
      }
    }, info);
    return item;
  }
};

module.exports = mutations;
