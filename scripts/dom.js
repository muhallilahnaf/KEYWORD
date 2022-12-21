
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
    let items = output[name]
    const container = createNode('div')
    if (name == tabNames.titles.var) {
        const badgeContainer = createNode('div', null, attrBadgeRow)
        const badgePara = createNode('p')
        const badgeSpan = createNode('span', items[0], attrBadgeSpan)
        badgePara.appendChild(badgeSpan)
        badgeContainer.appendChild(badgePara)
        container.appendChild(badgeContainer)
    }
    const table = createNode('table', null, attrTable)
    const thead = createNode('thead')
    const thr = createNode('tr')
    let th1Text = 'Words'
    let th2Text = 'Count'
    if (name == tabNames.phrases.var) {
        th1Text = 'Phrases'
        th2Text = 'Score'
    }
    const th1 = createNode('th', th1Text, attrTableHeadScope)
    const th2 = createNode('th', th2Text, attrTableHeadScope)
    thr.appendChild(th1)
    thr.appendChild(th2)
    // [th1, th2].forEach(th => thr.appendChild(th))
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
        const td1 = createNode('td', item[0])
        let td2Text = item[1]
        if (name == tabNames.phrases.var) td2Text = ''
        const td2 = createNode('td', td2Text)
        const td3 = createNode('td')
        const progress = createNode('progress', null, q)
        td3.appendChild(progress)
        tr.appendChild(td1)
        tr.appendChild(td2)
        tr.appendChild(td3)
        // [td1, td2, td3].forEach(td => tr.appendChild(td))
        tbody.appendChild(tr)
    })
    table.appendChild(tbody)
    container.appendChild(table)
    return container
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
            li.appendChild(liBtn)
            ul.appendChild(li)
            const tabPane = createNode('div', null, attrTabContentItem)
            tabPane.setAttribute('id', `${name}-tab-pane`)
            const content = createTabContent(name)
            tabPane.appendChild(content)
            tabContent.appendChild(tabPane)
        }
    })
    const triggerTabList = document.querySelectorAll(`${idTab} button`)
    triggerTabList.forEach(triggerEl => {
        const tabTrigger = new bootstrap.Tab(triggerEl)
        triggerEl.addEventListener('click', event => {
            event.preventDefault()
            tabTrigger.show()
        })
    })
    target.appendChild(ul)
    target.appendChild(tabContent)
}



const openTab = (name) => {
    const triggerEl = document.querySelector(`#${idTab} button[data-bs-target="#${name}-tab-pane"]`)
    bootstrap.Tab.getInstance(triggerEl).show()
}
