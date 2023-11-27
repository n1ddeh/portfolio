import { some, values } from 'lodash'
import { TerminalCommand } from '../../../data/types/TerminalCommand'

export type UseCommandsParams = {
    commandCallbackMap: {
        [commandKey in TerminalCommand]: () => string[]
    }
}

export type UseCommandParserResponse = {
    commandParser: (command: string) => { linesItems: string[], command: TerminalCommand } | false
}

export const useCommandParser = ({
    commandCallbackMap,
}: UseCommandsParams): UseCommandParserResponse => {
    const validateCommand = (text: string): text is TerminalCommand => {
        const validCommands = values(TerminalCommand)
        // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
        return some(validCommands, (validCommand) => validCommand === text)
    }

    const commandParser: UseCommandParserResponse['commandParser'] = (command) => {
        if (!validateCommand(command)) return false

        return {
            linesItems: commandCallbackMap[command](),
            command
        }
    }

    return {
        commandParser,
    }
}
