const { command_args, commands } = require('../messages');
const { selectRandomFromArray } = require("../utils/random_utils");

module.exports.handle = async (session, args) => {
   return {
      response: {
         text: selectRandomFromArray(commands.exit.messages),
         end_session: true,
      }
   };
}

module.exports.info = {
   aliases: command_args.exit,
   categories: [ 'any' ],
   hide_button: true,
}