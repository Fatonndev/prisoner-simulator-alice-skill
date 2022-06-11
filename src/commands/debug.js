const { command_args } = require('../messages');
const { clear } = require("../database");

module.exports.handle = async (session, args) => {
   if (args[2] === 'очисти') {
      await clear();

      return {
         response: {
            text: 'База данных успешно очищена.',
            end_session: false,
         }
      };
   }

   if (args[3] === 'id') {
      return {
         response: {
            text: 'ID устройства: ' + session.uid,
            end_session: false,
         }
      };
   }

   if (args[3] === 'состояние') {
      const s = JSON.stringify(session, null, 2);

      if (s.length > 1000) {
         console.log(session);

         return {
            response: {
               text: 'Состояние больше 1000 символов, поэтому было отправлено в консоль.',
               end_session: false,
            }
         };
      }

      return {
         response: {
            text: 'Состояние: ' + s,
            tts: 'Состояние отправлено в т+екстовом виде',
            end_session: false,
         }
      };
   }
}

module.exports.info = {
   aliases: command_args.debug,
   categories: [ 'any' ],
   hide_button: true,
}
