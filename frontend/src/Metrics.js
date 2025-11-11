
const feelings = [
    { idx: 1, emote: '(╥﹏╥)' },
    { idx: 2, emote: '(ಥ﹏ಥ)' },
    { idx: 3, emote: '(｡•́︿•̀｡)' },
    { idx: 4, emote: '(・_・;)' },
    { idx: 5, emote: '(＾‿＾)' },
    { idx: 6, emote: '(｡ᵕᴗᵕ｡)' },
    { idx: 7, emote: '(๑>◡<๑)' },
    { idx: 8, emote: '(๑˃́ꇴ˂̀๑)/' },
    { idx: 9, emote: '(｡♥ ³♥｡)' },
    { idx: 10, emote: '(ﾉ◕ヮ◕)ﾉ･✧' },
]

const sleeps = [
    { idx: 1, emote: '(￣□￣;)!!' },
    { idx: 2, emote: '(◎_◎;)' },
    { idx: 3, emote: '(=_=)' },
    { idx: 4, emote: '(-_-)' },
    { idx: 5, emote: '( -.-)Z' },
    { idx: 6, emote: '( -_-)Zz' },
    { idx: 7, emote: '( ~.~)Zzz' },
    { idx: 8, emote: '( -‿-)💤' },
    { idx: 9, emote: '(๑˘︶˘๑)✧🌙' },
    { idx: 10, emote: '( ˘ ³˘)♡💤' },
];

const selfcares = [
    { idx: 1, emote: '(×_×;)' },
    { idx: 2, emote: '(;¬_¬)' },
    { idx: 3, emote: '(¬_¬")' },
    { idx: 4, emote: '(・_・)' },
    { idx: 5, emote: '(＾_＾)' },
    { idx: 6, emote: '(｡•ᴗ•｡)' },
    { idx: 7, emote: '(＾▽＾)🧴' },
    { idx: 8, emote: '(｡•̀ᴗ-)✧🛁' },
    { idx: 9, emote: '(๑˃ᴗ˂)ﻭ ✨' },
    { idx: 10, emote: '(˘ᵕ˘)🌿✨' },
];

const metricConfig = {
    'feeling' : {
        name: 'feeling',
        prompt: 'how do u feel?',
        emoji: '🙂',
        array: feelings,
    },
    'sleep' : {
        name: 'sleep',
        prompt: 'how was ur sleep?',
        emoji: '💤',
        array: sleeps,
    },
    'selfcare' : {
        name: 'selfcare',
        prompt: 'selfcare, hygiene, routines?',
        emoji: '🛀',
        array: selfcares,
    },
}

export { metricConfig };