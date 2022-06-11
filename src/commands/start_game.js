const { command_args } = require('../messages');
const { generateNextQuestMessage, generateQuestButtons } = require("../game/game_logic");

module.exports.handle = async (session, args) => {
   session.room = 'entry';
   session.state = 'in_game';

   return {
      response: {
         text: await generateNextQuestMessage(session),
         end_session: false,
      }
   };
}

module.exports.info = {
   aliases: command_args.start_game,
   categories: [ 'menu' ],
   hide_button: false,
}
