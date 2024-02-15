let apiEndpoint = ''
let commonApi = ''
let bucketPathUrl = ''
let socketApi = ''
let munimApiEndpoint = ''
const bucketUrl = 'https://cdn.themunim.com/ecom/'
const hostname = window.location.hostname
const isLocal = window.location.hostname !== 'localhost'
if (hostname === 'devecom.themunim.com') {
    apiEndpoint = 'https://devecomapi.themunim.com/api'
    commonApi = 'https://devecomapi.themunim.com/'
    socketApi = 'https://devecomapi.themunim.com/'
    bucketPathUrl = `${bucketUrl}dev/`
    munimApiEndpoint = 'https://devapi.themunim.com/api'
} else if (hostname === 'localhost') {
    apiEndpoint = 'http://localhost:6070/api'
    munimApiEndpoint = 'https://stageapi.themunim.com/api'
    commonApi = 'http://localhost:6070/'
    bucketPathUrl = `${bucketUrl}local/`
}

module.exports = {
    apiEndpoint,
    commonApi,
    bucketPathUrl,
    socketApi,
    bucketUrl,
    isLocal,
    munimApiEndpoint
}
