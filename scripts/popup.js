
const initialize = () => {
    const btn = document.getElementById(idRefresh)
    btn.addEventListener('click', clickRefresh)
    btn.click()
}


const clickRefresh = () => {
    const message = localStorage.getItem(storageKey)
    output = getOutput(message)
    console.log(output)
    if (!output[tabNames.phrases.var]) {
        displayOutput()
        return
    }
    displayOutput(output)
}



const displayOutput = (output) => {
    target = document.getElementById(idTarget)
    target.replaceChildren()
    if (!output) {
        const alert = createNode('div', textAlert, attrAlert)
        target.appendChild(alert)
        return
    }
    createTabs()
    openTab(tabNames.words.var)
}



const getOutput = (message) => {
    const data = JSON.parse(message)
    let outputPhrases, topWordList, outputTitles, outputSnippet
    const text = data['text']
    if (text !== '') {
        const matches = text.toLowerCase().matchAll(regexAlphaNum)
        let wordList = []
        for (const match of matches) {
            wordList.push(match[0])
        }
        const sWordList = wordList.filter(w => !stopwords.includes(w))
        const wordDict = counter(sWordList)
        topWordList = mostCommon(wordDict, amount)
        let phrases = []
        topWordList.forEach(item => {
            const word = item[0]
            const wordPhrases1 = getPhrasesByWord1(word, wordList, dmin, dmax)
            const wordPhrases2 = getPhrasesByWord2(word, wordList, dmin, dmax)
            phrases = phrases.concat(wordPhrases1).concat(wordPhrases2)
        })
        outputPhrases = mostCommon(counter(phrases), amount)
    }
    const snippet = data[tabNames.snippet.var]
    if (snippet && snippet !== '') {
        const snippetMatches = snippet.toLowerCase().matchAll(regexAlphaNum)
        let snippetWordList = []
        for (const match of snippetMatches) {
            snippetWordList.push(match[0])
        }
        const sSnippetWordList = snippetWordList.filter(w => !stopwords.includes(w))
        const snippetWordDict = counter(sSnippetWordList)
        outputSnippet = mostCommon(snippetWordDict, amount)
    }
    const titles = data[tabNames.titles.var]
    if (titles && titles.length > 0) {
        const titleNo = titles.length
        let titleDigitCount = 0
        let titleWordList = []
        const filteredTitles = titles.filter(title => !gTitles.includes(title.trim()))
        filteredTitles.forEach(title => {
            if (/\d+/gm.test(title)) titleDigitCount++
            const matches = title.toLowerCase().matchAll(regexAlphaNum)
            for (const match of matches) {
                titleWordList.push(match[0])
            }
        })
        const sTitleWordList = titleWordList.filter(w => !stopwords.includes(w))
        const titleWordDict = counter(sTitleWordList)
        outputTitles = [`${textTitleSpan}: ${titleDigitCount}/${titleNo}`, ...mostCommon(titleWordDict, 10)]
    }
    return {
        'words': topWordList,
        'phrases': outputPhrases,
        'snippet': outputSnippet,
        'lsi': '',
        'titles': outputTitles
    }
}



window.addEventListener('load', initialize)
