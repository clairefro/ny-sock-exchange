const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { randomBytes } = require('crypto');
const { promisify } = require('util');
const { hasPermission } = require('../utils');
const stripe = require('../stripe');

const { transport, makeANiceEmail } = require('../mail');


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
    if(!ctx.request.userId) {
      throw new Error('You must be logged in to do that.');
    }
    // here we interact with prisma db
     const item = await ctx.db.mutation.createItem({
      data: {
        user: {
          connect: {
            id: ctx.request.userId
          }
        },
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
    const item = await ctx.db.query.item({ where }, `{id title user { id }}`)
    // check if they own the item or have permissions
    const ownsItem = item.user.id === ctx.request.userId;
    const hasPermissions = ctx.request.user.permissions.some
      (p => ['ADMIN','ITEMDELETE'].includes(p));
    if(!ownsItem && !hasPermissions) {
      throw new Error('You don\'t have permission to do that');
    }
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

  signout(parent, args, ctx, info){
    // can use clearCookie method thanks to cookie parser import in index.js
    ctx.response.clearCookie('token');
    return { message: 'Goodbye!'};
  },

  async requestReset(parent, args, ctx, info) {
    // check if real user
    const user = await ctx.db.query.user({ where: { email: args.email } });
    if(!user){
      throw new Error(`No such user found for: ${args.email}`);
    }
    // set reset token and expiry, save those to the user
    const resetToken = (await promisify(randomBytes)(20)).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1hr from now
    const res = await ctx.db.mutation.updateUser({
      where: { email: args.email },
      data: { resetToken, resetTokenExpiry }
    });
    // email them that token
    const mailRes = await transport.sendMail({
      from: "claire.froelich@gmail.com",
      to: user.email,
      subject: 'Your password reset token',
      html: makeANiceEmail(`You have one hour to reset your password with this token:
        \n\n
        <a href="${process.env.FRONTEND_URL}/reset?resetToken=${resetToken}">Click here to reset</a>`)
    });
    // return success message
    return { message: 'password reset token sent' };
  },

  async resetPassword(parent, args, ctx, info) {
    const { resetToken, password, confirmPassword } = args;
    // check if passwords match
    if(password !== confirmPassword) {
      throw new Error('Passwords do not match');
    }
    // verify reset token
    // verify token is not expired
    const [user] = await ctx.db.query.users({
      where: {
        resetToken,
        resetTokenExpiry_gte: Date.now() - 3600000
      }
    });
    if(!user) {
      throw new Error('this token is either invalid or expired');
    }
    // hash the new password
    const newPassword = await bcrypt.hash(password, 10);
    // Save new pw to user and remove old reset token fields
    const updatedUser = await ctx.db.mutation.updateUser({
      where: { email: user.email },
      data: {
        password: newPassword,
        resetToken: null,
        resetTokenExpiry: null
      },
    });
    // generate JWT
    const token = jwt.sign({ userId: updatedUser.id }, process.env.APP_SECRET);
    // set JWT cookie
    signTokenAndSetCookie(updatedUser, ctx);
    // return new user
    return updatedUser;
  },

  async updatePermissions(parent, args, ctx, info) {
    // check if logged in
    if(!ctx.request.userId) {
      throw new Error('You must be logged in')
    }
    // query the user
    const currentUser = await ctx.db.query.user({
      where: {
        id: ctx.request.userId
      },
    }, info);
    // check that they have permissions to update permissions
    hasPermission(currentUser, ['ADMIN', 'PERMISSIONUPDATE']);
    // update permissions
    return ctx.db.mutation.updateUser({
     data: {
       permissions: {
          set: args.permissions,
       },
     },
     where: {
       id: args.userId,
     },
   }, info)
  },
  async addToCart(parent, args, ctx, info) {
    // check if signed in
    const { userId } = ctx.request;
    if(!userId) {
      throw new Error('You must be signed in to do that');
    }
    // query user's current cart
    const [existingCartItem] = await ctx.db.query.cartItems({
      where: {
        user: { id: userId },
        item: { id: args.id },
      },
    });
    // check if already in cart, inc by 1 if yes
    if(existingCartItem) {
      console.log('this item is already in cart');
      return ctx.db.mutation.updateCartItem({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + 1 },
      }, info);
    }
    // if not, create fresh cart item for that user
    return ctx.db.mutation.createCartItem({
      data: {
        user: {
          connect: { id: userId },
        },
        item: {
          connect: { id: args.id },
        },
      },
    }, info);
  },
  async removeFromCart(parent, args, ctx, info) {
    // find the cartitem
    const cartItem = await ctx.db.query.cartItem({
      where: {
        id: args.id,
      },
    }, `{ id, user { id }}`);
    // make sure we found an item
    if(!cartItem) throw new Error('No CartItem found');
    // make sure this user owns the cart item
    if(cartItem.user.id !== ctx.request.userId) {
      throw new Error('You don\'t have permission to do that');
    }
    // delete the cart item
    return ctx.db.mutation.deleteCartItem({
      where: {
        id: args.id,
      },
    }, info);
  },

  async createOrder(parent, args, ctx, info) {
    // query current user, make sure signed in
    const { userId } = ctx.request;
    if(!userId) throw new Error('You must be signed in to complete order!');
    const user = await ctx.db.query.user(
      { where: { id: userId } },
      `{
      id
      name
      email
      cart {
        id
        quantity
        item { title price id description image largeImage }
      }}`
    );
    console.log(user);
    // recalculate price total
    const amount = user.cart.reduce((tally, cartItem) => {
      console.log(tally);
      console.log(cartItem.item.price*cartItem.quantity);
      return tally + cartItem.item.price*cartItem.quantity;
    },
     0);
    console.log(`going to charge for ${amount}`);
    // create stripe charge
    const charge = await stripe.charges.create({
      amount,
      currency: 'USD',
      source: args.token,
    });
    // convert cart items into order items
    const orderItems = user.cart.map(cartItem=> {
      const orderItem = {
        ...cartItem.item,
        quantity: cartItem.quantity,
        user: { connect: { id: userId } },
      };
      delete orderItem.id;
      return orderItem
    })
    // create the order
    const order = ctx.db.mutation.createOrder({
      data: {
        total: charge.amount,
        charge: charge.id,
        items: { create: orderItems },
        user: { connect: { id: userId }},
      }
    });
    // Clean up user's cart , delete cart item const  = styled.`
    const cartItemIds = user.cart.map(cartItem => cartItem.id);
    await ctx.db.mutation.deleteManyCartItems({
      where: {
        id_in: cartItemIds,
      }
    })
    //  return Order to client
    return order;
  },
};

module.exports = mutations;
