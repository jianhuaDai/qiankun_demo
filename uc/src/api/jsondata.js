import http from './http.js'


const production = process.env.NODE_ENV === 'production'
const BASE_URL = production ? process.env.BASE_URL :  '//localhost:7788/';
export function getConfig() {
  let url = BASE_URL + 'config/config.json';
  console.log(url, 'urlurlurlurlurlurlurlurlurl');
  return http.get(url, {
    t: new Date().getTime()
  });
}
