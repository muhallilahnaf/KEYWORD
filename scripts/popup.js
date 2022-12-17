const initialize = () => {
    const btn = document.getElementById('btn')
    btn.addEventListener('click', () => {
        const message = localStorage.getItem('doctext')
        const output = getOutput(message)
        console.log(output)
        if (!output['phrases']) {
            displayOutput()
            return
        }
        displayOutput(output)
    })
}
window.addEventListener('load', initialize)


const createNode = (tag, text, classList, attr) => {
    const node = document.createElement(tag)
    if (text) node.innerText = text
    if (classList) node.classList.add(...classList)
    if (attr) {
        for (const [key, value] of Object.entries(attr)) {
            node.setAttribute(key, value)
        }
    }
    return node
}

const clsTabs = ['tabs', 'is-small', 'is-centered', 'is-boxed', 'pr-5']
const clsColumns = ['columns', 'is-mobile', 'mb-4', 'mr-3']
const clsColumn = ['column', 'is-three-fifths']
const clsMessageNoWords = ['message', 'is-danger']



const displayOutput = (output) => {
    const target = document.getElementById('target')
    target.replaceChildren()
    if (!output) {
        const msgContainer = createNode('article', null, clsMessageNoWords)
        const msgBody = createNode('div', 'no words found! reload the page and try again', ['message-body'])
        msgContainer.appendChild(msgBody)
        target.appendChild(msgContainer)
        return
    }

    const tabs = createTabs(output)
    target.appendChild(tabs)

    createOutputPhrases(output, target)
    // TODO
    // createOutputWords(output, target)
    // createOutputTitles(output, target)
    // createOutputSnippet(output, target)
}


const createOutputPhrases = (output, target) => {
    const phrases = output['phrases']
    const divCols = createNode('div', null, clsColumns)
    const divCol1 = createNode('div', null, clsColumn)
    const col1Heading = createNode('b', 'Phrases')
    const divCol2 = createNode('div', null, ['column'])
    const col2Heading = createNode('b', 'Score')
    divCol1.appendChild(col1Heading)
    divCol2.appendChild(col2Heading)
    divCols.appendChild(divCol1)
    divCols.appendChild(divCol2)
    target.appendChild(divCols)

    const max = phrases[0][1]
    phrases.forEach(item => {
        const q = { 'value': item[1], 'max': max }
        const divCols = createNode('div', null, clsColumns)
        const divCol1 = createNode('div', item[0], clsColumn)
        const divCol2 = createNode('div', null, ['column'])
        const progress = createNode('progress', null, null, q)
        divCol2.appendChild(progress)
        divCols.appendChild(divCol1)
        divCols.appendChild(divCol2)
        target.appendChild(divCols)
    })
}



const createTabs = (output) => {
    const tabs = createNode('div', null, clsTabs)
    const ulTabs = createNode('ul')

    const liWords = createNode('li', null, ['is-active'])
    const spanWords = createNode('a', 'Words')
    liWords.appendChild(spanWords)
    ulTabs.appendChild(liWords)

    const liPhrases = createNode('li')
    const spanPhrases = createNode('a', 'Phrases')
    liPhrases.appendChild(spanPhrases)
    ulTabs.appendChild(liPhrases)

    if (output['titles']) {
        const liTitles = createNode('li')
        const spanTitles = createNode('a', 'Titles')
        liTitles.appendChild(spanTitles)
        ulTabs.appendChild(liTitles)
    }

    if (output['snippet']) {
        const liSnippet = createNode('li')
        const spanSnippet = createNode('a', 'Snippet')
        liSnippet.appendChild(spanSnippet)
        ulTabs.appendChild(liSnippet)
    }

    tabs.appendChild(ulTabs)
    return tabs
}

const getOutput = (message) => {
    const data = JSON.parse(message)
    let outputPhrases, topWordList, outputTitles, outputSnippet
    const text = data['text']
    if (text !== '') {
        const matches = text.toLowerCase().matchAll(/[a-z][a-z0-9]+/gm)
        let wordList = []
        for (const match of matches) {
            wordList.push(match[0])
        }
        const sWordList = wordList.filter(w => !stopwords.includes(w))
        const wordDict = counter(sWordList)
        topWordList = mostCommon(wordDict, 10)
        let phrases = []
        topWordList.forEach(item => {
            const word = item[0]
            const wordPhrases1 = getPhrasesByWord1(word, wordList, 3, 9)
            const wordPhrases2 = getPhrasesByWord2(word, wordList, 3, 9)
            phrases = phrases.concat(wordPhrases1).concat(wordPhrases2)
        })
        outputPhrases = mostCommon(counter(phrases), 15)
    }
    const snippet = data['snippet']
    if (snippet && snippet !== '') {
        const snippetMatches = snippet.toLowerCase().matchAll(/[a-z][a-z0-9]+/gm)
        let snippetWordList = []
        for (const match of snippetMatches) {
            snippetWordList.push(match[0])
        }
        const sSnippetWordList = snippetWordList.filter(w => !stopwords.includes(w))
        const snippetWordDict = counter(sSnippetWordList)
        outputSnippet = mostCommon(snippetWordDict, 10)
    }
    const titles = data['titles']
    if (titles && titles.length > 0) {
        const titleNo = titles.length
        let titleDigitCount = 0
        let titleWordList = []
        titles.forEach(title => {
            if (/\d+/gm.test(title)) titleDigitCount++
            const matches = title.toLowerCase().matchAll(/[a-z][a-z0-9]+/gm)
            for (const match of matches) {
                titleWordList.push(match[0])
            }
        })
        const sTitleWordList = titleWordList.filter(w => !stopwords.includes(w))
        const titleWordDict = counter(sTitleWordList)
        outputTitles = [`titles with digits: ${titleDigitCount}/${titleNo}`, ...mostCommon(titleWordDict, 10)]
    }
    return {
        'words': topWordList,
        'phrases': outputPhrases,
        'snippet': outputSnippet,
        'lsi': '',
        'titles': outputTitles
    }
}


const stopwords = ['i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your',
    'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', 'her', 'hers',
    'herself', 'it', 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves',
    'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those', 'am', 'is', 'are',
    'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does',
    'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if', 'or', 'because', 'as',
    'until', 'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between',
    'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up',
    'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then',
    'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each',
    'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same',
    'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don',
    'should', 'now', 'http', 'https', 'www', 'com']


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


const mostCommon = (dict, q) => {
    let temp = []
    for (const [key, value] of Object.entries(dict)) {
        if (value > 1) temp.push([key, value])
    }
    temp.sort((a, b) => b[1] - a[1])
    return temp.slice(0, q)
}


const getPhrasesByWord1 = (word, wordList, dmin, dmax) => {
    if (dmin < 1 || dmax - dmin < 1) return
    let radius
    if (dmax % 2 == 0) {
        radius = Math.round(dmax / 2)
    } else {
        radius = Math.floor(dmax / 2)
    }
    let indices = []
    wordList.forEach((w, i) => {
        if (w == word) indices.push(i)
    })
    let a = []
    for (let index = -radius; index < -dmin + 2; index++) {
        a.push(index)
    }
    for (let index = dmin - 1; index < radius + 1; index++) {
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


const getPhrasesByWord2 = (word, wordList, dmin, dmax) => {
    if (dmin < 1 || dmax - dmin < 1) return
    let radius
    if (dmax % 2 == 0) {
        radius = Math.round(dmax / 2)
    } else {
        radius = Math.floor(dmax / 2)
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
                if (start > -1 && distance >= dmin - 1 && end < wordList.length) {
                    const phrase = wordList.slice(start, end + 1).join(' ')
                    temp.push(phrase)
                }
            }
        }
    })
    return temp
}