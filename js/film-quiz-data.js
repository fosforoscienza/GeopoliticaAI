// ════════════════════════════════════════════════════
// Dati del quiz film (10 emoji + 6 trame). Usati dalle slide quiz-*.html
// (js/film-quiz.js) e dalla console di regia SNS (soluzioni sulle schede).
// ════════════════════════════════════════════════════
const FILM_QUIZ = {
  emoji: [
    { e: '🚢🧊',     it: 'Titanic',                      en: 'Titanic',                        y: 1997 },
    { e: '🦁👑',     it: 'Il Re Leone',                  en: 'The Lion King',                  y: 1994 },
    { e: '🧙‍♂️⚡👓',     it: 'Harry Potter',                 en: 'Harry Potter',                   y: 2001 },
    { e: '🦖🏝️',     it: 'Jurassic Park',                en: 'Jurassic Park',                  y: 1993 },
    { e: '🦈🏖️',     it: 'Lo Squalo',                    en: 'Jaws',                           y: 1975 },
    { e: '💍🌋',     it: 'Il Signore degli Anelli',      en: 'The Lord of the Rings',          y: 2001 },
    { e: '🚗⚡🕰️',     it: 'Ritorno al futuro',            en: 'Back to the Future',             y: 1985 },
    { e: '🕶️💊',     it: 'Matrix',                       en: 'The Matrix',                     y: 1999 },
    { e: '🔍🐠',     it: 'Alla ricerca di Nemo',         en: 'Finding Nemo',                   y: 2003 },
    { e: '👽🚲🌕',     it: 'E.T. l\'extra-terrestre',      en: 'E.T. the Extra-Terrestrial',     y: 1982 }
  ],
  trama: [
    { it: 'Cenerentola', en: 'Cinderella', y: 1950, g: 'Animazione / fiaba',
      s: ['👧🧹', '🧚‍♀️🎃', '💃🕛', '👠🤴'],
      pit: 'Una ragazza maltrattata dalla matrigna va al ballo del principe grazie alla fata madrina, ma deve fuggire allo scoccare della mezzanotte lasciando una scarpetta di cristallo.',
      pen: 'A girl mistreated by her stepmother attends the prince\'s ball thanks to her fairy godmother, but must flee at midnight, leaving behind a glass slipper.' },
    { it: 'Forrest Gump', en: 'Forrest Gump', y: 1994, g: 'Drammatico',
      s: ['🪑🍫', '🏃‍♂️🇺🇸', '🦐⛵', '❤️👩'],
      pit: 'Seduto su una panchina con una scatola di cioccolatini, un uomo semplice racconta la sua vita: corre attraverso l\'America, fa fortuna pescando gamberi e non smette mai di amare Jenny.',
      pen: 'Sitting on a bench with a box of chocolates, a simple man tells his life story: he runs across America, gets rich catching shrimp and never stops loving Jenny.' },
    { it: 'Terminator', en: 'The Terminator', y: 1984, g: 'Fantascienza',
      s: ['🤖⏳', '🔫👩', '🤰👶', '✊🤖'],
      pit: 'Dal futuro arriva un cyborg con un solo obiettivo: uccidere una giovane cameriera di Los Angeles prima che metta al mondo l\'uomo che guiderà la resistenza contro le macchine.',
      pen: 'A cyborg is sent back from the future with a single goal: kill a young Los Angeles waitress before she gives birth to the man who will lead the resistance against the machines.' },
    { it: 'La vita è bella', en: 'Life Is Beautiful', y: 1997, g: 'Commedia drammatica',
      s: ['👨‍🦱💐👩', '👨‍🦱👦❤️', '🚂⛓️', '🎲🏆'],
      pit: 'Un libraio ebreo conquista la sua «principessa»; deportato in un campo di concentramento con il figlio, gli fa credere che sia tutto un gioco a punti con un carro armato in palio.',
      pen: 'A Jewish bookseller wins his "princess"; deported to a concentration camp with his son, he convinces the boy it is all a game with a real tank as the prize.' },
    { it: 'Mamma, ho perso l\'aereo', en: 'Home Alone', y: 1990, g: 'Commedia',
      s: ['🧳✈️', '👦🏠🎄', '🦹‍♂️🦹‍♂️💰', '🪤😱'],
      pit: 'La famiglia parte per le vacanze di Natale dimenticando a casa il figlio di otto anni, che difende la villa da due ladri maldestri a colpi di trappole.',
      pen: 'The family leaves for Christmas vacation and forgets their eight-year-old son at home, who defends the house from two clumsy burglars with booby traps.' },
    { it: 'Shrek', en: 'Shrek', y: 2001, g: 'Animazione / commedia',
      s: ['👹🏞️', '🐴🗣️', '🏰🐉👸', '💚'],
      pit: 'Un orco burbero, accompagnato da un asino chiacchierone, deve liberare una principessa prigioniera in un castello sorvegliato da un drago… e scopre un segreto che la riguarda.',
      pen: 'A grumpy ogre, joined by a chatty donkey, must rescue a princess locked in a dragon-guarded castle… and discovers her secret.' }
  ]
};
