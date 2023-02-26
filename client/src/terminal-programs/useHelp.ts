import { TerminalCommand } from '../contexts/TerminalContext'

export const useHelp = (): string => {
    let res = ''

    const docs: { [command in TerminalCommand]?: string } = {
        [TerminalCommand.AUTHOR]: 'prints the name',
        [TerminalCommand.CLEAR]: 'hides line items from the terminal',
        [TerminalCommand.HELLO]: 'says hi back',
        [TerminalCommand.HELP]: 'documentation per available command',
        [TerminalCommand.TIME]: 'prints the current time',
    }
    const commands = Object.keys(docs).sort() as TerminalCommand[]

    for (let i = 0; i < commands.length; i++) {
        const command = commands[i]
        const helperText = docs[commands[i]]
        if (helperText === undefined) continue
        res += `**${command}**:  ${helperText}`

        if (i < commands.length - 1) {
            res += '\n'
        }
    }

    return res
}
