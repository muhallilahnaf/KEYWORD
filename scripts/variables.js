let message // body.innerText
let output = {} // {data, wordlist, ...tabNames}
let target // div#target



const storageKey = 'doctext'



const id = {
    refresh: 'btn',
    target: 'target',
    tab: 'tab',
    tabContent: 'tabContent',
    titleDigits: 'titleDigits',
    getFormInput: (inputName, tabName) => `${inputName}-${tabName}`,
    getForm: (tabName) => `${tabName}-form`,
    getTabBtn: (tabName) => `${tabName}-tab`,
    getTabPane: (tabName) => `${tabName}-tab-pane`

}



const textAlert = 'No words found! reload the page and try again'
const gTitles = ['people also ask', 'related searches', 'videos']
const textTitleSpan = 'titles containing digits'
const textFormValidation = {
    valid: 'Applied!',
    invalid: 'Please choose an integer greater than 1.'
}
const textFormLabels = {
    amount: 'Maximum outputs',
    rmin: 'Minimum occurances',
    dmin: 'Minimum words in a phrase',
    dmax: 'Maximum words in a phrase'
}
const textFormToggle = {
    show: 'Show Settings',
    hide: 'Hide Settings',
}
const textFormBtn = 'Apply'



const regexAlphaNum = /[a-z][a-z0-9]+/gm
const inputMinVal = 1
const clsValid = 'is-valid'
const clsInvalid = 'is-invalid'
const clsValidated = 'was-validated'
const clsFormToggle = 'form-hide'



let tabNames = {
    words: {
        var: 'words',
        dom: 'Words',
        updated: true,
        amount: 10,
        rmin: 5,
        th1Text: 'Words',
        th2Text: 'Count',
        th3Text: 'Metric',
        inputNames: {
            amount: 'amount',
            rmin: 'rmin',
        }
    },
    phrases: {
        var: 'phrases',
        dom: 'Phrases',
        updated: true,
        amount: 15,
        rmin: 3,
        dmin: 3,
        dmax: 9,
        th1Text: 'Phrases',
        th2Text: 'Score',
        th3Text: 'Metric',
        inputNames: {
            amount: 'amount',
            rmin: 'rmin',
            dmin: 'dmin',
            dmax: 'dmax'
        }
    },
    titles: {
        var: 'titles',
        dom: 'Titles',
        updated: true,
        amount: 5,
        rmin: 2,
        th1Text: 'Words',
        th2Text: 'Count',
        th3Text: 'Metric',
        inputNames: {
            amount: 'amount',
            rmin: 'rmin',
        }
    },
    snippet: {
        var: 'snippet',
        dom: 'Snippet',
        updated: true,
        amount: 5,
        rmin: 2,
        th1Text: 'Words',
        th2Text: 'Count',
        th3Text: 'Metric',
        inputNames: {
            amount: 'amount',
            rmin: 'rmin',
        }
    },
}



const attr = {
    tabs: {
        'class': ['nav', 'nav-tabs', 'justify-content-center'],
        'id': id.tab
    },
    tabItem: {
        'class': ['nav-item'],
    },
    tabBtn: {
        'class': ['nav-link'],
        'data-bs-toggle': 'tab',
        'type': 'button'
    },
    // class:"nav-link active" id:"Words-tab" data-bs-target:"#Words-tab-pane"
    tabContent: {
        'class': ['tab-content'],
        'id': id.tabContent
    },
    tabContentItem: {
        'class': ['tab-pane', 'fade']
    },
    // class:"tab-pane fade show active" id:"Words-tab-pane"
    badgeRow: {
        'class': ['row'],
        'id': id.titleDigits
    },
    badgeSpan: {
        'class': ['badge', 'text-bg-info']
    },
    table: {
        'class': ['table', 'table-striped', 'table-hover', 'table-sm']
    },
    tableContainer: {
        'class': ['table-container']
    },
    tableHead: {
        'scope': 'col',
        'class': ['text-center']
    },
    tableData1: {
        'class': ['text-center', 'text-wrap']
    },
    tableData2: {
        'class': ['text-center']
    },
    alert: {
        'class': ['alert', 'alert-danger']
    },
    form: {
        'class': ['row', 'g-3', 'needs-validation'],
        'novalidate': true
    },
    formCol1: {
        'class': ['col-6']
    },
    formCol2: {
        'class': ['col-12']
    },
    formLabel: {
        'class': ['form-label']
    },
    formInput: {
        'class': ['form-control', 'form-control-sm'],
        'type': 'number',
        'required': true
    },
    formValid: {
        'class': ['valid-feedback']
    },
    formInvalid: {
        'class': ['invalid-feedback']
    },
    formBtn: {
        'class': ['btn', 'btn-sm'],
        'type': 'submit'
    },
    formToggle: {
        'class': ['btn', 'btn-sm']
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



