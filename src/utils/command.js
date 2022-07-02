const commands = require("../commands/_index");
const { generateQuestButtons, checkQuest } = require("../game/game_logic");
const { levenshtein_percent } = require("./levenshtein");

const get_alias_length = (alias) => {
   let count = 0;

   for (let i = 0; i < alias.length; i++) {
      if (typeof alias[i] === 'object') {
         if (alias[i].required) {
            count++;
         }

         continue;
      }

      count++;
   }

   return count;
}

const check_alias = (alias, args,  condition = (s1, s2) => s1 === s2) => {
   let ok = true;

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

      if (!condition(alias[i], args[i])) {
         ok = false;
         break;
      }
   }

   return ok;
}

const check_command = (command, args, user_session, alias_condition) => {
   if (!command.info.categories.includes('any') && !command.info.categories.includes(user_session.state)) {
      return false;
   }

   for (const alias of command.info.aliases) {
      if (get_alias_length(alias) < args.length) {
         continue;
      }

      if (check_alias(alias, args, alias_condition)) {
         return true;
      }
   }

   return false;
}

const check_commands = async (args, user_session, version, session, alias_condition) => {
   for (const c of commands) {
      if (check_command(c, args, user_session, alias_condition)) {
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

const check_similar_commands = async (args, user_session, version, session) => {
   const cond = (s1, s2) => levenshtein_percent(s1, s2) >= 0.8;

   const r = await check_commands(args, user_session, version, session, cond);

   return r;
}

const check_quests = async (cmd, args, user_session, version, session, alias_condition) => {
   if (user_session.last_quest != null) {
      const quest_res = await checkQuest(user_session, cmd, args, alias_condition);

      if (quest_res.error) {
         return {
            error: {
               version, session,
               ...quest_res.error
            }
         };
      }

      const result = {
         version, session,
         ...quest_res.out
      }

      result.response.buttons = generateQuestButtons(user_session);

      return { out: result };
   }
}

const check_similar_quests = async (cmd, args, user_session, version, session) => {
   const r = await check_quests(cmd, args, user_session, version, session,
      (s1, s2) => levenshtein_percent(s1, s2) >= 0.8);

   return r;
}

module.exports = {
   get_alias_length,
   check_command,
   check_commands,
   check_similar_commands,
   check_quests,
   check_similar_quests,
}
