const { command_args } = require('../messages');
const { generateNextQuestMessage } = require("../game/game_logic");

module.exports.handle = async (session, args) => {
   return {
      response: {
         text: await generateNextQuestMessage(session),
         end_session: false,
      }
   };
}

module.exports.info = {
   aliases: command_args.continue,
   categories: [ 'in_game' ],
   available: (session) => {
      return session.last_quest == null;
   },
   hide_button: false,
}
