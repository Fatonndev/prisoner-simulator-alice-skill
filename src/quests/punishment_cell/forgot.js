// Квест в карцере - забыли про заключеннокго

module.exports = {
   messages: [
      'Про вас похоже забыли.',
      'Похоже, про вас похоже забыли.',
      'Чёт снаружи нет ни хавчика, ни новостей. Про вас похоже забыли.',
   ],
   requirements: [
      { /* Ничего не надо */ },
      { /* Ничего не надо */ },
      {
         // Если есть еда
         any_item: 'food'
      },
      {
         // Если есть заточка
         item: 'sharpening'
      }
   ],
   results: [
      [
         {
            option: 'Ожидать надзирателя',
            chance: [
               60, 30, 10
            ],
            result: [
               {
                  message: '- Небось проголодался? Надзиратель вернулся и дал вам поесть баланду. Остальные пять суток прошли как ни в чём не бывало.',
                  action: {
                     room: 'random'
                  },
               },
               {
                  message: 'Прошло несколько суток, походу про вас действительно забыли. Вас находят без сознания.',
                  action: {
                     room: 'medical_point'
                  },
               },
               {
                  message: 'Походу про вас действительно забыли. Вы умираете от обезвоживания.',
                  action: {
                     died: 'dehydration'
                  },
               },
            ]
         },
         {
            option: 'Молиться и ждать',
            chance: [
               60, 30, 10
            ],
            result: [
               {
                  message: 'Вы слышите звук ключей.\n- Небось проголодался? - Надзиратель подошёл и дал вам поесть баланду. \nОстальные пять суток прошли как ни в чём не бывало.',
                  action: {
                     room: 'random'
                  },
               },
               {
                  message: 'Прошло несколько суток, походу про вас действительно забыли. Вас находят без сознания.',
                  action: {
                     room: 'medical_point'
                  },
               },
               {
                  message: 'Походу про вас действительно забыли. Вы умираете от обезвоживания.',
                  action: {
                     died: 'dehydration'
                  },
               },
            ]
         }
      ],
      [
         {
            option: 'Позвать охрану',
            chance: [
               80, 14, 6
            ],
            result: [
               {
                  message: '- Чего разорался? - Надзиратель подошёл и вспомнил, что забыл про Вас. \nОн побоялся что Вы доложите начальнику, и Вас отпустили в камеру.',
                  action: {
                     room: 'random'
                  },
               },
               {
                  message: 'Как бы Вы не кричали, никто не приходит на помощь. \nПрошло несколько суток, походу про вас действительно забыли. Вас находят без сознания.',
                  action: {
                     room: 'medical_point'
                  },
               },
               {
                  message: 'Как бы Вы не кричали, никто не приходит на помощь. \nПоходу про вас действительно забыли. Вы умираете от обезвоживания.',
                  action: {
                     died: 'dehydration'
                  },
               },
            ]
         }
      ],
      [
         {
            option: 'Сьесть заначку',
            chance: [
               72, 28
            ],
            result: [
               {
                  message: 'Вы вспомнили про хавчик на чёрный день. - Он походу и наступил - думали Вы\nЧерез сутки надзиратель подошёл и вспомнил, что забыл про Вас. \nОн побоялся что Вы доложите начальнику, и Вас отпустили в камеру.',
                  action: {
                     room: 'random'
                  },
               },
               {
                  message: 'Вы вспомнили про хавчик на чёрный день. - Он походу и наступил - думали Вы \nПрошло несколько суток, походу про вас действительно забыли. Из-за обезвоживания Вас отправляют в медпункт.',
                  action: {
                     room: 'medical_point'
                  },
               }
            ]
         }
      ],
      [
         {
            option: 'Открутить унитаз заточкой',
            chance: [
               100
            ],
            result: [
               {
                  message: 'Вы откручиваете унитаз и каким то чудом пролазите через канализацию в свою камеру.',
                  action: {
                     room: 'random'
                  },
               }
            ]
         }
      ],
   ]
};
