import { AudioRickRoll } from '../audio'
import { ImageRickRoll } from '../images'
export const useRickRoll = (): string => {
    const terminalWindow = document.getElementById('Terminal')
    const rickRollGif = document.createElement('img')
    rickRollGif.src = ImageRickRoll
    rickRollGif.className = 'absolute rounded-2xl top-0 right-0 w-64'
    if (terminalWindow == null) return ''

    const playRickRoll = async (): Promise<void> => {
        const rickRoll = new Audio(AudioRickRoll)
        rickRoll.addEventListener('play', () => {
            terminalWindow.appendChild(rickRollGif)
        })
        rickRoll.addEventListener('ended', () => {
            rickRollGif.remove()
            rickRoll.remove()
        })
        await rickRoll.play()
    }

    playRickRoll().catch((e) => {
        console.log(e)
    })

    return ''
}
