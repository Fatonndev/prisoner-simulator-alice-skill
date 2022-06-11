const quests = {
   entry: [
      {
         chance: 50,
         quest: require('../quests/entry/silently')
      },
      {
         chance: 30,
         quest: require('../quests/entry/asking')
      },
      {
         chance: 20,
         quest: require('../quests/entry/tea')
      }
   ],

   prison_cell: [
      {
         chance: 100,
         quest: require('../quests/prison_cell/search')
      }
   ],

   punishment_cell: [
      {
         chance: 80,
         quest: require('../quests/punishment_cell/nothing')
      },
      {
         chance: 20,
         quest: require('../quests/punishment_cell/forgot')
      }
   ]
}

module.exports = quests;
