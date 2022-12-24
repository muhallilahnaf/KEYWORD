// console.log('bg')
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    // console.log(msg)
    if (msg.message.includes('doctext')) {
        localStorage.setItem(msg.message, msg.data)
    }
})



chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.text == 'what is my tab_id?') sendResponse({ tabId: sender.tab.id })
})