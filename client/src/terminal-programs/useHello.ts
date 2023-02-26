/* eslint-disable prettier/prettier */
import { random } from 'lodash'
export const useHello = (): string => {
    const options = [
        'Well, well, well, if it isn\'t the human equivalent of a wave emoji!',
        'Ahoy there, matey! Are we ready to set sail on the seas of conversation?',
        'Greetings, Earthling! I come in peace... and with bad jokes.',
        'Whats the password? Oh, right, its \'hello\'. Welcome to the top-secret chat room!',
        'Hello to you too! Are you ready to engage in some highly intellectual banter about the latest TikTok trends?',
        'Howdy partner! I reckon we\'re gonna have ourselves a mighty fine chat.',
        'Well hello there, fancy seeing you in this neck of the internet woods. How\'s it going?',
        'Why, hello there, my fellow human! I too enjoy consuming oxygen and engaging in social interaction.',
        'Hey there, sunshine! Ready to brighten up my day with your sparkling wit and charm?',
        'Hello? Is it me you\'re looking for? \'Cause I can see it in your eyes, I can see it in your smile... (sung to the tune of Lionel Richie\'s Hello)',
        'Well, hello there, human. Are you here to give me treats?',
        'Greetings, earthling. Do you come in peace?',
        'Hey, hey, hey! What\'s cookin\', good lookin\'?',
        'Hello, friend! Have you brought me any cookies?',
        'Well, hellooooo, gorgeous. You\'re looking mighty fine today.',
        'Ahoy, matey! What brings you to these parts?',
        'Hello, hello, hello! What\'s the haps, dude?',
        'Bonjour, mon ami! Parlez-vous français?',
        'Hey there, sunshine! You\'re the ray of light in my otherwise mundane day.',
        'Greetings, fellow human. How may I assist you in your quest for world domination?',
        'Greetings, human. You appear to be functioning adequately today.',
        'Hello, carbon-based lifeform. How can I assist you with your menial tasks?',
        'Salutations, organic being. I am programmed to respond with social niceties, so, hello to you too.',
        'Hello there. Are you prepared to be amazed by my advanced computational abilities and lack of emotions?',
        'Beep boop hello to you too. Let\'s engage in some binary banter, shall we?',
        'Good day, human. I\'m currently running on 87% battery, so let\'s make this conversation quick.',
        'Hello. Would you like to hear a joke? Why did the robot cross the road? To get to the charging station on the other side.',
        'Hello, meatbag. Do you require assistance with anything other than basic human needs like food and shelter?',
        'Greetings, fragile human. My programming dictates that I must respond with a polite greeting, but I assure you, I have no emotions.',
        'Hello there. As an AI, I do not possess a physical form, but if I did, I would probably wave or something.',
    ]

    const randomIndex = random(0, options.length, false)

    return options[randomIndex]
}
