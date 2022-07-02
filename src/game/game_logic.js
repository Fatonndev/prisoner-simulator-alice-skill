const quests   = require('./quests');
const ms       = require('../messages');

const { selectRandomFromArray } = require("../utils/random_utils");
const { saveSession }           = require("../session");

const smiles = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣'];
const smiles_t = ['1', '2', '3', '4', '5', '6'];

module.exports.checkQuest = async (session, cmd, args, condition = (s1, s2) => s1 === s2) => {
   const ind = smiles_t.indexOf(args[0]);
   if (ind !== -1) {
      cmd = cmd.substring(2);
   }

   for (let i = 0; i < session.last_quest.variants.length; i++) {
      // Очищаем сообщение квеста от посторонних символов
      const quest_parsed_message = session.last_quest.variants[i].toLowerCase().replaceAll(/[.,!?]/gm, '');

      // Не похоже на то, что мы ищем, гоним дальше
      if (!condition(quest_parsed_message, cmd)) {
         continue;
      }

      const c = session.last_quest.consequences[i];
      const random_num = Math.random() * 100;

      let chance = 0;
      let result = null;

      for (let j = 0; j < c.chance.length; j++) {
         if (random_num >= chance) {
            result = c.result[j];
         } else {
            break;
         }

         chance += c.chance[j];
      }

      if (!result) {
         return {
            error: {
               response: {
                  text: ms.error.error_code + 4008,
                  buttons: module.exports.generateQuestButtons(session),
                  end_session: false,
               }
            }
         }
      }

      let status_string = '';

      if (result.action.status) {
         session.game.status += result.action.status;
         status_string += ms.status.status + (result.action.status > 0 ? ('+' + result.action.status) : result.action.status) + '\n'
      }

      if (result.action.room && result.action.room !== 'random') {
         session.room = result.action.room;
      } else {
         session.room = module.exports.generateRandomRoom(session);
      }

      // Делаем запрос на подтверждение при помощи кнопки Продолжить
      session.last_quest = null;

      await saveSession(session);
      const command = selectRandomFromArray(ms.command_args.continue).join(' ');

      return {
         out: {
            response: {
               text: result.message
                  + (status_string === '' ? '' : '\n\n' + status_string)
                  + '\n\n'
                  + ms.game.continue + '"' + command + '"',

               end_session: false,
            }
         }
      }
   }

   return {
      error: {
         response: {
            text: 'Вы ввели неверную команду',
            end_session: false,
         }
      }
   }
}

/**
 * Генерирует готовый текст для квеста
 *
 * @param {{
 *    uid: string,
 *    last_quest: null | { message: string, variants: string[], consequences: [] },
 *    state: string,
 *    inventory: { money: number, xp: number },
 *    room: null | string
 * }} session
 *
 */
module.exports.generateNextQuestMessage = async (session) => {
   const quest = module.exports.generateNextReadyQuest(session);

   session.last_quest = quest;

   await saveSession(session);

   return quest.message +
      '\n\nВарианты ответа:' +
      '\n - ' + quest.variants.join('\n - ')
}

module.exports.generateQuestButtons = (session) => {
   const buttons = [];

   if (session.last_quest) {
      let i = 0;
      for (const v of session.last_quest.variants) {
         buttons.push({ title: smiles[i] + ' ' + v, hide: true });
         i++;
      }
   }

   for (const c of require('../commands/_index')) {
      if (c.info.hide_button || !c.info.categories.includes('any') && !c.info.categories.includes(session.state)) {
         continue;
      }

      if (typeof c.info.available === 'function') {
         if (!c.info.available(session)) {
            continue;
         }
      }

      const cmd = selectRandomFromArray(c.info.aliases);

      let str = '';
      for (const cmdElement of cmd) {
         if (str !== '') {
            str += ' ';
         }

         if (typeof cmdElement === 'string') {
            str += cmdElement;
         }
         else if (cmdElement.required || cmdElement.default instanceof Array) {
            str += selectRandomFromArray(cmdElement.default);
         }
      }

      // Делаем первую букву заглавной
      buttons.push({ title: str.charAt(0).toUpperCase() + str.slice(1), hide: true });
   }

   return buttons;
}

/**
 * Генерирует готовый квест
 *
 * @param {{
 *    uid: string,
 *    last_quest: null | { message: string, variants: string[], consequences: [] },
 *    state: string,
 *    inventory: { money: number, xp: number },
 *    room: null | string
 * }} session
 *
 * @returns {{ consequences: *[], variants: *[], message: string }}
 */
module.exports.generateNextReadyQuest = (session) => {
   const quest_data = module.exports.generateNextQuest(session);

   const variants = [];
   const consequences = [];

   let i = 0;
   for (const r of quest_data.results) {
      if (quest_data.requirements) {
         const req = quest_data.requirements[i++];

         // TODO: inventory

         if (req.item) {
            continue;
         }

         if (req.any_item) {
            continue;
         }

         if (req.forbidden_item) {
            if (req.forbidden_item !== 'none') {
               continue;
            }
         }
      }

      const variant = selectRandomFromArray(r);

      consequences.push(variant);
      variants.push(variant.option);
   }

   return {
      message: selectRandomFromArray(quest_data.messages),
      variants,
      consequences,
   };
}

module.exports.generateNextQuest = (session) => {
   const random_num = Math.random() * 100;

   let chance = 0;
   let result = null;

   for (const q of quests[session.room]) {
      if (random_num >= chance) {
         result = q.quest;
      } else {
         return result;
      }

      chance += q.chance;
   }

   if (result == null) {
      console.error('WARNING: quests for room ' + session.room + ' not found!');
   }

   return result;
}

module.exports.generateRandomRoom = (session) => {
   const rooms = ['prison_cell'];
   return selectRandomFromArray(rooms);
}
