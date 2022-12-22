let output
let amountWords = 10
let amountPhrases = 15
let amountTitles = 5
let amountSnippet = 5
let rminWords = 5
let rminPhrases = 3
let rminTitles = 2
let rminSnippet = 2
let dmin = 3
let dmax = 9
let target



const storageKey = 'doctext'



const idRefresh = 'btn'
const idTarget = 'target'
const idTab = 'tab'
const idTabContent = 'tabContent'
const idtitleDigits = 'titleDigits'




const textAlert = 'no words found! reload the page and try again'
const gTitles = ['people also ask', 'related searches', 'videos']
const regexAlphaNum = /[a-z][a-z0-9]+/gm
const textTitleSpan = 'titles containing digits'



const tabNames = {
    'words': {
        'var': 'words',
        'dom': 'Words'
    },
    'phrases': {
        'var': 'phrases',
        'dom': 'Phrases'
    },
    'titles': {
        'var': 'titles',
        'dom': 'Titles'
    },
    'snippet': {
        'var': 'snippet',
        'dom': 'Snippet'
    },
}


const attrTabs = {
    'class': ['nav', 'nav-tabs', 'justify-content-center'],
    'id': idTab
}
const attrTabItem = {
    'class': ['nav-item'],
}
const attrTabBtn = {
    'class': ['nav-link'],
    'data-bs-toggle': 'tab',
    'type': 'button'
}
// class="nav-link active" id="Words-tab" data-bs-target="#Words-tab-pane"
const attrTabContent = {
    'class': ['tab-content'],
    'id': idTabContent
}
const attrTabContentItem = {
    'class': ['tab-pane', 'fade']
}
// class="tab-pane fade show active" id="Words-tab-pane"
const attrBadgeRow = {
    'class': ['row'],
    'id': idtitleDigits
}
const attrBadgeSpan = {
    'class': ['badge', 'text-bg-info']
}
const attrTable = {
    'class': ['table', 'table-striped', 'table-hover', 'table-sm']
}
const attrTableHead = {
    'scope': 'col',
    'class': ['text-center']
}
const attrTableData1 = {
    'class': ['text-center', 'text-wrap']
}
const attrTableData2 = {
    'class': ['text-center']
}
const attrAlert = {
    'class': ['alert', 'alert-danger']
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



