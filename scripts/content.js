// console.log('from content')
let handle

const check = () => {
    const ready = document.readyState
    if (ready == 'interactive' || ready == 'complete') {
        console.log('check pass')
        const serp = document.URL.includes('https://www.google.com/search')
        // console.log(serp)
        let data
        if (serp) {
            const text = document.getElementById('rso').innerText || ''
            const snippet = document.querySelector('block-component').innerText || ''
            const titleNodes = document.querySelectorAll('#rso h3')
            let titles = []
            if (titleNodes.length > 0) {
                titleNodes.forEach(title => titles.push(title.innerText))
            }
            data = { text, snippet, titles }
        } else {
            data = { text: document.querySelector('body').innerText || '' }
        }
        chrome.runtime.sendMessage({ text: 'what is my tab_id?' }, (res) => {
            // console.log(`My tabId is ${res.tabId}`)
            data.tabId = res.tabId
            const msg = {
                message: `doctext-${res.tabId}`,
                data: JSON.stringify(data)
            }
            localStorage.setItem(msg.message, msg.data)
            chrome.runtime.sendMessage(msg)
            clearInterval(handle)
        })
    }
}

handle = setInterval(check, 500)