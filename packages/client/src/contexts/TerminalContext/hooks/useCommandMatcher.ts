import { chain, isEmpty, startsWith } from 'lodash'

export type UseCommandMatcherParams = {
    commands: string[]

    text: string
}

export type UseCommandMatcherResponse = {
    commandMatch: string | undefined
}

export const useCommandMatcher = ({
    commands,
    text,
}: UseCommandMatcherParams): UseCommandMatcherResponse => {
    if (text === '') {
        return {
            commandMatch: undefined,
        }
    }

    const matches = chain(commands)
        .filter((command) => startsWith(command, text))
        .value()

    return {
        commandMatch: isEmpty(matches) ? undefined : matches[0],
    }
}
