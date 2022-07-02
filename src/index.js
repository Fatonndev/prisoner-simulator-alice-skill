const ms       = require('./messages');
const commands = require('./commands/_index');

const { getSession } = require("./session");
const { generateNextQuestMessage, generateQuestButtons } = require("./game/game_logic");
const { levenshtein_percent } = require("./utils/levenshtein");
const { check_commands, check_quests, check_similar_commands, check_similar_quests} = require("./utils/command");

/*
https://www.youtube.com/watch?v=He0-YyciQPU
https://www.youtube.com/watch?v=OqRuqcZy-xw
Расстояние Левенштейна

Переезд на другую шконку
к вам подселили другуго заключенного пока стояк

Отжимания

Спереть что то более чем спирт
*/

// Главный хандлер для Yandex Cloud
module.exports.handler = async (event, context) => {
   const { version, session, request } = event;

   const cmd = request['command'];

   const user_session = await getSession(session["session_id"], session["user_id"]);
   const args = cmd.split(' ');

   // Если это первое сообщение
   if (cmd.length === 0) {
      // Продолжаем квест если возможно
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

   // Используем, если нам нужно сначала проверить другие результаты, если их нет, пишем эту ошибку
   let custom_error;

   // Ищем возможные команды
   let result = await check_commands(args, user_session, version, session);
   if (result) {
      return result;
   }

   // Если сейчас пользователь проходит квест, проверяем ответ к квесту
   result = await check_quests(cmd, args, user_session, version, session);

   if (result) {
      if (result.out) {
         return result.out;
      }
      else if (result.error) {
         custom_error = result.error;
      }
   }

   // Ищем возможные команды по левенштеину
   result = await check_similar_commands(args, user_session, version, session);
   if (result) {
      return result;
   }

   // Ищем возможные квесты по левенштеину
   result = await check_similar_quests(cmd, args, user_session, version, session);

   if (result) {
      if (result.out) {
         return result.out;
      }
      else if (result.error) {
         custom_error = result.error;
      }
   }

   // Если ошибка в очереди, пишем её
   if (custom_error) {
      return custom_error;
   }

   // Если ничего не подходит, говорим что не понял команду
   // TODO: рандомизация результата
   return {
      version, session,
      response: {
         text: ms.invalid_arguments[user_session.state],
         buttons: generateQuestButtons(user_session),
         end_session: false,
      },
   };
};
