import { some, values } from 'lodash'
import { TerminalCommand } from '../../../data/types/TerminalCommand'

export type UseCommandsParams = {
    commandCallbackMap: {
        [commandKey in TerminalCommand]: () => string[]
    }
}

export type UseCommandParserResponse = {
    commandParser: (command: string) => string[] | false
}

export const useCommandParser = ({
    commandCallbackMap,
}: UseCommandsParams): UseCommandParserResponse => {
    const validateCommand = (text: string): text is TerminalCommand => {
        const validCommands = values(TerminalCommand)
        return some(validCommands, (validCommand) => validCommand === text)
    }

    const commandParser = (command: string): string[] | false => {
        if (!validateCommand(command)) return false

        return commandCallbackMap[command]()
    }

    return {
        commandParser,
    }
}
