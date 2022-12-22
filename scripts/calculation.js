
const counter = (list) => {
    let temp = {}
    list.forEach(item => {
        if (temp.hasOwnProperty(item)) {
            temp[item] = temp[item] + 1
        } else {
            temp[item] = 1
        }
    })
    return temp
}


const mostCommon = (dict, amount, rmin) => {
    let temp = []
    for (const [key, value] of Object.entries(dict)) {
        if (value >= rmin) temp.push([key, value])
    }
    temp.sort((a, b) => b[1] - a[1])
    return temp.slice(0, amount)
}


const getPhrasesByWord1 = (word, wordList, idmin, idmax) => {
    if (idmin < 1 || idmax - idmin < 1) return
    let radius
    if (idmax % 2 == 0) {
        radius = Math.round(idmax / 2)
    } else {
        radius = Math.floor(idmax / 2)
    }
    let indices = []
    wordList.forEach((w, i) => {
        if (w == word) indices.push(i)
    })
    let a = []
    for (let index = -radius; index < -idmin + 2; index++) {
        a.push(index)
    }
    for (let index = idmin - 1; index < radius + 1; index++) {
        a.push(index)
    }
    let temp = []
    indices.forEach(k => {
        for (let i = 0; i < a.length; i++) {
            const s = a[i]
            const pos = k + s
            if (pos < 0 || pos >= wordList.length) continue
            let start, end
            if (s < 0) {
                start = pos
                end = k + 1
            }
            if (s > 0) {
                start = k
                end = pos + 1
            }
            const phrase = wordList.slice(start, end).join(' ')
            temp.push(phrase)
        }
    })
    return temp
}


const getPhrasesByWord2 = (word, wordList, idmin, idmax) => {
    if (idmin < 1 || idmax - idmin < 1) return
    let radius
    if (idmax % 2 == 0) {
        radius = Math.round(idmax / 2)
    } else {
        radius = Math.floor(idmax / 2)
    }
    let indices = []
    wordList.forEach((w, i) => {
        if (w == word) indices.push(i)
    })
    let temp = []
    indices.forEach(k => {
        for (let start = k - radius; start < k + 1; start++) {
            for (let end = k; end < k + radius + 1; end++) {
                distance = Math.abs(start - end)
                if (start > -1 && distance >= idmin - 1 && end < wordList.length) {
                    const phrase = wordList.slice(start, end + 1).join(' ')
                    temp.push(phrase)
                }
            }
        }
    })
    return temp
}
