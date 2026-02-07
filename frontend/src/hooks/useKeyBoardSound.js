

const keyStrokeSounds = [
    new Audio("/sounds/keystroke1.mp3"),
    new Audio("/sounds/keystroke2.mp3"),
    new Audio("/sounds/keystroke3.mp3"),
    new Audio("/sounds/keystroke4.mp3"),
]

function useKeyboardSound (){
    const playRandomSound = ()=>{
        const sound = keyStrokeSounds[Math.floor(Math.random() * keyStrokeSounds.length)]
        sound.currentTime = 0
        sound.play().catch(error=>console.log("audio play failed:",error))
    }
    return {playRandomSound}
}

export default useKeyboardSound