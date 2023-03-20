import { TerminalCommand } from '../data/types/TerminalCommand'

export const useHelp = (): string[] => {
    const result: string[] = []

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
        result.push(`**${command}**:  ${helperText}`)
    }

    return result
}
