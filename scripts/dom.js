
const createNode = (tag, text, attr) => {
    const node = document.createElement(tag)
    if (text) node.innerText = text
    if (attr) {
        for (const [key, value] of Object.entries(attr)) {
            if (key == 'class') {
                node.classList.add(...value)
                continue
            }
            node.setAttribute(key, value)
        }
    }
    return node
}



const createTabContent = (name) => {
    const container = createNode('div')
    const form = createForm(name)
    container.appendChild(form)
    if (name == tabNames.titles.var) {
        const badgeContainer = createTitleBadge()
        container.appendChild(badgeContainer)
    }
    const tableContainer = createNode('div', null, attrTableContainer)
    const table = createTable(name)
    tableContainer.appendChild(table)
    container.appendChild(tableContainer)
    return container
}



const createForm = (tabName) => {
    const form = createNode('form', null, attrForm)
    // form.id = `${name}-form`
    form.addEventListener('submit', event => {
        event.preventDefault()
        event.stopPropagation()
        // const id = form.id
        // const tabName = id.slice(0, id.indexOf('-form'))
        const validation = validateForm(tabName)
        if (validation) {
            reloadTabResult(tabName, validation)
            form.classList.add('was-validated')
            setTimeout(() => form.classList.remove('was-validated'), 2000)
        } else {
            form.classList.add('was-validated')
            setTimeout(() => form.classList.remove('was-validated'), 5000)
        }
    }, false)
    let inputNames = ['amount', 'rmin']
    if (tabName == tabNames.phrases.var) inputNames.push('dmin', 'dmax')
    inputNames.forEach(q => {
        const col = createFormInput(tabName, q)
        form.appendChild(col)
    })
    const colSubmit = createNode('div', null, attrFormCol2)
    const btn = createNode('button', textFormBtn, attrFormBtn)
    colSubmit.appendChild(btn)
    form.appendChild(colSubmit)
    return form
}


const createFormInput = (tabName, inputName) => {
    const id = `${inputName}-${tabName}`
    const col = createNode('div', null, attrFormCol1)
    const label = createNode('label', textFormLabels[inputName], attrFormLabel)
    label.setAttribute('for', id)
    const input = createNode('input', null, attrFormInput)
    input.id = id
    input.value = tabNames[tabName][inputName]
    const valid = createNode('div', textFormValidation.valid, attrFormValid)
    const invalid = createNode('div', textFormValidation.invalid, attrFormInvalid)
    col.appendChild(label)
    col.appendChild(input)
    col.appendChild(valid)
    col.appendChild(invalid)
    return col
}


const createTitleBadge = () => {
    const txt = output[tabNames.titles.var][0]
    const badgeContainer = createNode('div', null, attrBadgeRow)
    const badgePara = createNode('p')
    const badgeSpan = createNode('span', txt, attrBadgeSpan)
    badgePara.appendChild(badgeSpan)
    badgeContainer.appendChild(badgePara)
    return badgeContainer
}



const createTable = (name) => {
    let items = output[name]
    const table = createNode('table', null, attrTable)
    const thead = createNode('thead')
    const thr = createNode('tr')
    let th1Text = 'Words'
    let th2Text = 'Count'
    const th3Text = 'Metric'
    if (name == tabNames.phrases.var) {
        th1Text = 'Phrases'
        th2Text = 'Score'
    }
    const th1 = createNode('th', th1Text, attrTableHead)
    const th2 = createNode('th', th2Text, attrTableHead)
    const th3 = createNode('th', th3Text, attrTableHead)
    thr.appendChild(th1)
    thr.appendChild(th2)
    thr.appendChild(th3)
    thead.appendChild(thr)
    table.appendChild(thead)
    const tbody = createNode('tbody')
    let max
    if (name == tabNames.titles.var) {
        max = items[1][1]
        items = items.slice(1)
    }
    max = items[0][1]
    items.forEach(item => {
        const q = { 'value': item[1], 'max': max }
        const tr = createNode('tr')
        const td1 = createNode('td', item[0], attrTableData1)
        const td2 = createNode('td', item[1], attrTableData2)
        const td3 = createNode('td', null, attrTableData2)
        const progress = createNode('progress', null, q)
        td3.appendChild(progress)
        tr.appendChild(td1)
        tr.appendChild(td2)
        tr.appendChild(td3)
        tbody.appendChild(tr)
    })
    table.appendChild(tbody)
    return table
}



const createTabs = () => {
    const ul = createNode('ul', null, attrTabs)
    const tabContent = createNode('div', null, attrTabContent)
    Object.keys(tabNames).forEach(name => {
        if (output[name]) {
            const li = createNode('li', null, attrTabItem)
            const liBtn = createNode('button', tabNames[name].dom, attrTabBtn)
            liBtn.setAttribute('id', `${name}-tab`)
            liBtn.setAttribute('data-bs-target', `#${name}-tab-pane`)
            liBtn.addEventListener('click', () => {
                if (!tabNames[name].updated) updateTable(name)
            })
            li.appendChild(liBtn)
            ul.appendChild(li)
            const tabPane = createNode('div', null, attrTabContentItem)
            tabPane.setAttribute('id', `${name}-tab-pane`)
            const content = createTabContent(name)
            tabPane.appendChild(content)
            tabContent.appendChild(tabPane)
        }
    })
    target.appendChild(ul)
    target.appendChild(tabContent)
}



const openTab = (name) => {
    const tabBtn = document.getElementById(`${name}-tab`)
    tabBtn.click()
}



const reloadTabResult = (tabName, validation) => {
    switch (tabName) {
        case tabNames.words.var:
            amountWords = validation.amount
            rminWords = validation.rmin
            break
        case tabNames.phrases.var:
            amountPhrases = validation.amount
            rminPhrases = validation.rmin
            dmin = validation.min
            dmax = validation.max
            break
        case tabNames.titles.var:
            amountTitles = validation.amount
            rminTitles = validation.rmin
            break
        case tabNames.snippet.var:
            amountSnippet = validation.amount
            rminSnippet = validation.rmin
            break
        default:
            break
    }
    getOutput()
    Object.keys(tabNames).forEach(name => {
        tabNames[name].updated = false
    })
    updateTable(tabName)
}



const updateTable = (name) => {
    const tableContainer = document.querySelector(`#${name}-tab-pane .table-container`)
    const table = createTable(name)
    tableContainer.replaceChildren(table)
    tabNames[name].updated = true
}


const validateForm = (tabName) => {
    const amountInput = document.getElementById(`amount-${tabName}`)
    const rminInput = document.getElementById(`rmin-${tabName}`)
    const amount = Number(amountInput.value)
    const rmin = Number(rminInput.value)
    const amountValid = Number.isInteger(amount) && amount > 1
    const rminValid = Number.isInteger(rmin) && rmin > 1
    amountValid ? amountInput.classList.add('is-valid') : amountInput.classList.add('is-invalid')
    rminValid ? rminInput.classList.add('is-valid') : rminInput.classList.add('is-invalid')
    if (tabName == tabNames.phrases.var) {
        const minInput = document.getElementById('dmin')
        const maxInput = document.getElementById('dmax')
        const min = Number(minInput.value)
        const max = Number(maxInput.value)
        const minValid = Number.isInteger(min) && min > 1
        const maxValid = Number.isInteger(max) && max > 1
        minValid ? minInput.classList.add('is-valid') : minInput.classList.add('is-invalid')
        maxValid ? maxInput.classList.add('is-valid') : maxInput.classList.add('is-invalid')
        if (amountValid && rminValid && minValid && maxValid) return { amount, rmin, min, max }
        return false
    }
    if (amountValid && rminValid) return { amount, rmin }
    return false
}