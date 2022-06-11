const { getSession, updateSession, newSession } = require("./database");

module.exports.saveSession = async (session) => {
   await updateSession(session.uid, session);
}

module.exports.saveNewSession = async (session) => {
   await newSession(session.uid, session);
}

/**
 * Создаёт новую сессию, но не записывает её
 * @param {string} session_id
 * @param {string} user_id
 * @returns {{uid, last_quest: null, state: string, inventory: {money: number, xp: number}, room: null}}
 */
module.exports.newSession = (session_id, user_id) => {
   return {
      // ID пользователя для сохранений
      uid: user_id,

      game: {
         status: 50,
      },

      // Текущая комната игрока. null - не играет
      room: null,

      // Последний квест и условия
      last_quest: null,

      // Состояние игрока
      state: 'menu',

      // Инвентарь игрока
      inventory: {
         money: 100,
         xp: 0,
      },
   }
}

/**
 * Получает сессию из кэша
 * @param {string} session_id
 * @param {string} user_id
 * @returns {{uid, last_quest: null, state: string, inventory: {money: number, xp: number}, room: null}|*}
 */
module.exports.getSession = async (session_id, user_id) => {
   try {
      const data = await getSession(user_id);
      return data;
   } catch (e) {

   }

   const session = module.exports.newSession(session_id, user_id);
   await module.exports.saveNewSession(session);

   return session;
}
