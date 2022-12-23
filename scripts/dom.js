
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



const createTabContent = (tabName) => {
    const container = createNode('div')
    const topContainer = createNode('div', null, attr.topContainer)
    const formToggle = createFormToggle(tabName)
    topContainer.appendChild(formToggle)
    const form = createForm(tabName)
    topContainer.appendChild(form)
    if (tabName == tabNames.titles.var) {
        const badgeContainer = createTitleBadge()
        topContainer.appendChild(badgeContainer)
    }
    container.appendChild(topContainer)
    const tableContainer = createNode('div', null, attr.tableContainer)
    const table = createTable(tabName)
    tableContainer.appendChild(table)
    container.appendChild(tableContainer)
    return container
}



const createFormToggle = (tabName) => {
    const formToggleContainer = createNode('div', null, attr.formToggleContainer)
    const formToggle = createNode('button', textFormToggle.show, attr.formToggle)
    formToggle.addEventListener('click', (e) => {
        const form = document.getElementById(id.getForm(tabName))
        const present = form.classList.toggle(clsFormToggleHide)
        if (present) {
            e.target.innerText = textFormToggle.hide
        }
        e.target.innerText = textFormToggle.show
    })
    formToggleContainer.appendChild(formToggle)
    return formToggleContainer
}



const createForm = (tabName) => {
    const form = createNode('form', null, attr.form)
    form.id = id.getForm(tabName)
    form.addEventListener('submit', event => {
        event.preventDefault()
        event.stopPropagation()
        const validation = validateForm(tabName)
        if (validation) {
            reloadTabResult(tabName, validation)
            setTimeout(() => removeFormValidation(tabName), 2000)
        } else {
            setTimeout(() => removeFormValidation(tabName), 2000)
        }
    }, false)
    Object.keys(tabNames[tabName].inputNames).forEach(q => {
        const col = createFormInput(tabName, q)
        form.appendChild(col)
    })
    const colSubmit = createNode('div', null, attr.formCol2)
    const btn = createNode('button', textFormBtn, attr.formBtn)
    colSubmit.appendChild(btn)
    form.appendChild(colSubmit)
    return form
}



const removeFormValidation = (tabName) => {
    const form = document.getElementById(id.getForm(tabName))
    for (const [k, v] of Object.entries(tabNames[tabName].inputNames)) {
        const input = document.getElementById(id.getFormInput(v, tabName))
        input.classList.remove(clsValid, clsInvalid)
    }
}



const createFormInput = (tabName, inputName) => {
    const idStr = id.getFormInput(inputName, tabName)
    const col = createNode('div', null, attr.formCol1)
    const label = createNode('label', textFormLabels[inputName], attr.formLabel)
    label.setAttribute('for', idStr)
    const input = createNode('input', null, attr.formInput)
    input.id = idStr
    input.value = tabNames[tabName][inputName]
    const valid = createNode('div', textFormValidation.valid, attr.formValid)
    const invalid = createNode('div', textFormValidation.invalid, attr.formInvalid)
    col.appendChild(label)
    col.appendChild(input)
    col.appendChild(valid)
    col.appendChild(invalid)
    return col
}


const createTitleBadge = () => {
    const txt = output[tabNames.titles.var][0]
    const badgeContainer = createNode('div', null, attr.badgeRow)
    const badgePara = createNode('p')
    const badgeSpan = createNode('span', txt, attr.badgeSpan)
    badgePara.appendChild(badgeSpan)
    badgeContainer.appendChild(badgePara)
    return badgeContainer
}



const createTable = (tabName) => {
    let items = output[tabName]
    const table = createNode('table', null, attr.table)
    const thead = createNode('thead')
    const thr = createNode('tr')
    const th1 = createNode('th', tabNames[tabName].th1Text, attr.tableHead)
    const th2 = createNode('th', tabNames[tabName].th2Text, attr.tableHead)
    const th3 = createNode('th', tabNames[tabName].th3Text, attr.tableHead)
    thr.appendChild(th1)
    thr.appendChild(th2)
    thr.appendChild(th3)
    thead.appendChild(thr)
    table.appendChild(thead)
    const tbody = createNode('tbody')
    let max
    if (tabName == tabNames.titles.var) {
        max = items[1][1]
        items = items.slice(1)
    }
    max = items[0][1]
    items.forEach(item => {
        const q = { 'value': item[1], 'max': max }
        const tr = createNode('tr')
        const td1 = createNode('td', item[0], attr.tableData1)
        const td2 = createNode('td', item[1], attr.tableData2)
        const td3 = createNode('td', null, attr.tableData2)
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
    const ul = createNode('ul', null, attr.tabs)
    const tabContent = createNode('div', null, attr.tabContent)
    Object.keys(tabNames).forEach(tabName => {
        if (output[tabName]) {
            const li = createNode('li', null, attr.tabItem)
            const liBtn = createNode('button', tabNames[tabName].dom, attr.tabBtn)
            liBtn.id = id.getTabBtn(tabName)
            liBtn.setAttribute('data-bs-target', `#${id.getTabPane(tabName)}`)
            liBtn.addEventListener('click', () => {
                if (!tabNames[tabName].updated) updateTable(tabName)
            })
            li.appendChild(liBtn)
            ul.appendChild(li)
            const tabPane = createNode('div', null, attr.tabContentItem)
            tabPane.id = id.getTabPane(tabName)
            const content = createTabContent(tabName)
            tabPane.appendChild(content)
            tabContent.appendChild(tabPane)
        }
    })
    target.appendChild(ul)
    target.appendChild(tabContent)
}



const openTab = (tabName) => {
    const tabBtn = document.getElementById(id.getTabBtn(tabName))
    tabBtn.click()
}



const reloadTabResult = (tabName, validation) => {
    for (const [k, v] of Object.entries(tabNames[tabName].inputNames)) {
        tabNames[tabName][k] = validation[v]
    }
    getOutput()
    Object.keys(tabNames).forEach(q => {
        tabNames[q].updated = false
    })
    updateTable(tabName)
}



const updateTable = (tabName) => {
    const tableContainer = document.querySelector(`#${tabName}-tab-pane .table-container`)
    const table = createTable(tabName)
    tableContainer.replaceChildren(table)
    tabNames[tabName].updated = true
}


const validateForm = (tabName) => {
    let validity = []
    let temp = {}
    for (const [k, v] of Object.entries(tabNames[tabName].inputNames)) {
        const input = document.getElementById(id.getFormInput(v, tabName))
        const value = Number(input.value)
        temp[v] = value
        const isValid = Number.isInteger(value) && value > inputMinVal
        isValid ? input.classList.add(clsValid) : input.classList.add(clsInvalid)
        validity.push(isValid)
    }
    if (validity.every(Boolean)) return temp
    return false
}


