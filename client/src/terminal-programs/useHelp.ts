import { TerminalCommand } from '../contexts/TerminalContext'

export const useHelp = (): string => {
    let res = ''

    const docs: { [command in TerminalCommand]?: string } = {
        [TerminalCommand.CLEAR]: 'hides line items from the terminal',
        [TerminalCommand.CONTACT_ME]: 'lists contacts info for the author',
        [TerminalCommand.SOURCE]: 'repo for this project',
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
