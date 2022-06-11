const ms       = require('./messages');
const commands = require('./commands/_index');

const { getSession } = require("./session");
const { checkQuest, generateNextQuestMessage, generateQuestButtons } = require("./game/game_logic");

/*
https://www.youtube.com/watch?v=He0-YyciQPU
https://www.youtube.com/watch?v=OqRuqcZy-xw
Расстояние Левенштейна

Переезд на другую шконку
к вам подселили другуго заключенного пока стояк

Отжимания

Спереть что то более чем спирт
*/

module.exports.handler = async (event, context) => {
   const { version, session, request } = event;

   const cmd = request['command'];

   const user_session = await getSession(session["session_id"], session["user_id"]);
   const args = cmd.split(' ');

   if (cmd.length === 0) {
      if (user_session.last_quest != null) {
         return {
            version, session,
            response: {
               text: await generateNextQuestMessage(user_session),
               buttons: generateQuestButtons(user_session),
               end_session: false,
            }
         };
      }

      return {
         version, session,
         response: {
            text: ms.welcome.message,
            buttons: generateQuestButtons(user_session),
            end_session: false
         },
      };
   }

   // Clear empty arguments
   for (let i = 0; i < args.length; i++) {
      if (args[0] === '') {
         args.splice(i, 1);
         i--;
      }
   }

   // Search for commands
   for (const c of commands) {
      if (!c.info.categories.includes('any') && !c.info.categories.includes(user_session.state)) {
         continue;
      }

      for (const alias of c.info.aliases) {
         let ok = true;

         if (alias.length < args.length) {
            continue;
         }

         for (let i = 0; i < alias.length; i++) {
            if (typeof alias[i] === 'object') {
               if (alias[i].required) {
                  if (args.length < i + 1) {
                     ok = false;
                     break;
                  }

                  continue;
               } else {
                  console.error('WARNING: alias[i].required is false! This function is not implemented')
                  continue;
               }
            }

            if (alias[i] !== args[i]) {
               ok = false;
               break;
            }
         }

         if (ok) {
            const out = await c.handle(user_session, args);

            const result = {
               version, session,
               ...out
            }

            result.response.buttons = generateQuestButtons(user_session);

            return result;
         }
      }
   }

   if (user_session.last_quest != null) {
      const result = {
         version, session,
         ...await checkQuest(user_session, cmd, args)
      }

      result.response.buttons = generateQuestButtons(user_session);

      return result;
   }

   return {
      version, session,
      response: {
         text: ms.invalid_arguments[user_session.state],
         buttons: generateQuestButtons(user_session),
         end_session: false,
      },
   };
};
