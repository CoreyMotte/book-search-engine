const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async(parent, args, context) => {
            if (context.user) {
                const user = await User.findOne({_id: context.user._id});
                return user;
            }
            throw new AuthenticationError('You must be logged in!')
        }
    },

    Mutation: {
        addUser: async(parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);
            return {token, user};
        },
        login: async(parent, { email, password }) => {
            const user = await User.findOne({ email });
            console.log(user)

            if (!user) {
                throw new AuthenticationError('User not found');
            }

            const correctPassword = await user.isCorrectPassword(password);
            if (!correctPassword) {
                throw new AuthenticationError('Password incorrect!')
            }

            const token = signToken(user);

            return { token, user };
        }
    }
};

module.exports = resolvers;