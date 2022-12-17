console.log('bg')

chrome.runtime.onMessage.addListener((message, a, b) => {
    console.log(message)
    if (message.message == 'doctext') {
        localStorage.setItem('doctext', message.data)
    }
})
