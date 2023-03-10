
const initialize = () => {
    const btn = document.getElementById(id.refresh)
    btn.addEventListener('click', clickRefresh)
    btn.click()
}


const clickRefresh = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tabId = tabs[0].id
        message = localStorage.getItem(`${storageKey}-${tabId}`)
        if (message) {
            getOutput()
            // console.log(output)
        }
        displayOutput()
    })
}



const displayOutput = () => {
    target = document.getElementById(id.target)
    target.replaceChildren()
    if (!output) {
        const alert = createNode('div', textAlert, attr.alert)
        target.appendChild(alert)
        return
    }
    createTabs()
    openTab(tabNames.words.var)
}



const getOutput = () => {
    output['data'] = JSON.parse(message)
    getOutputWords()
    getOutputPhrases()
    getOutputSnippet()
    getOutputTitles()
}



const getOutputWords = () => {
    let topWordList
    const text = output.data.text
    if (text !== '') {
        const matches = text.toLowerCase().matchAll(regexAlphaNum)
        let wordList = []
        for (const match of matches) {
            wordList.push(match[0])
        }
        output.wordlist = wordList
        const sWordList = wordList.filter(w => !stopwords.includes(w))
        const wordDict = counter(sWordList)
        topWordList = mostCommon(wordDict, tabNames.words.amount, tabNames.words.rmin)
    }
    output[tabNames.words.var] = topWordList
}


const getOutputPhrases = () => {
    let outputPhrases
    const topWordList = output[tabNames.words.var]
    if (topWordList) {
        let phrases = []
        topWordList.forEach(item => {
            const word = item[0]
            const wordPhrases1 = getPhrasesByWord1(
                word,
                output.wordlist,
                tabNames.phrases.dmin,
                tabNames.phrases.dmax
            )
            const wordPhrases2 = getPhrasesByWord2(
                word,
                output.wordlist,
                tabNames.phrases.dmin,
                tabNames.phrases.dmax
            )
            phrases = phrases.concat(wordPhrases1).concat(wordPhrases2)
        })
        outputPhrases = mostCommon(counter(phrases), tabNames.phrases.amount, tabNames.phrases.rmin)
    }
    output[tabNames.phrases.var] = outputPhrases
}



const getOutputSnippet = () => {
    let outputSnippet
    const snippet = output.data[tabNames.snippet.var]
    if (snippet && snippet !== '') {
        const snippetMatches = snippet.toLowerCase().matchAll(regexAlphaNum)
        let snippetWordList = []
        for (const match of snippetMatches) {
            snippetWordList.push(match[0])
        }
        const sSnippetWordList = snippetWordList.filter(w => !stopwords.includes(w))
        const snippetWordDict = counter(sSnippetWordList)
        outputSnippet = mostCommon(snippetWordDict, tabNames.snippet.amount, tabNames.snippet.rmin)
    }
    output[tabNames.snippet.var] = outputSnippet
}



const getOutputTitles = () => {
    let outputTitles
    const titles = output.data[tabNames.titles.var]
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
        outputTitles = [
            `${textTitleSpan}: ${titleDigitCount}/${titleNo}`,
            ...mostCommon(titleWordDict, tabNames.titles.amount, tabNames.titles.rmin)
        ]
    }
    output[tabNames.titles.var] = outputTitles
}



window.addEventListener('load', initialize)
