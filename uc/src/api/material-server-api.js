import http from './http.js'
import API from '@/api/index'
const SERVICE = 'material-server-api'
function getUrl(apiUrl) {
	return http.formatUrl(SERVICE, apiUrl)
}

function getBaseUrl(apiUrl) {
	return http.formatUrl('nfs', apiUrl)
}