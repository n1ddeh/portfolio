import { audio } from '../audio'
import { RickRollImage } from '../images'
export const useRickRoll = (): string => {
    const terminalWindow = document.getElementById('Portrait')
    const rickRollGif = document.createElement('img')
    rickRollGif.src = RickRollImage
    rickRollGif.className = 'absolute rounded-2xl'
    if (terminalWindow == null) return ''

    const playRickRoll = async (): Promise<void> => {
        const rickRoll = new Audio(audio.rickRoll)
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
