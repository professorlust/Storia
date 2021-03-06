import { configUrl } from '../../content/configs/defaultValues';
import { fileExtension } from '../../content/configs/regex';
import { errorHandler } from '../utils/errorHandler';
import { extract } from '../utils/regexWrappers';
/**
 * @param  {string} url
 * Will use this string to read file
 * @param  {string} configFileUrl
 * Will use this string to fetch config file
 */
export function readScript(url, configFileUrl = configUrl) {
  fetch(url)
    .then(res => res.text())
    .then(script =>
      callInterpreter(configFileUrl, extract(url, fileExtension, script)),
    )
    .catch(error => errorHandler(error));
}
/**
 * @param  {string} url
 * Will use this string to fetch config file
 * @param  {string} fileExtension
 * Will search for this extension in the url's JSON
 * @param  {string} script
 * Scirpt to interpret
 */
function callInterpreter(url, fileExtension, script) {
  fetch(url)
    .then(res => res.json())
    .then(json =>
      import('./' + json.extensions[fileExtension] + '.js').then(interpreter =>
        interpreter.read(script),
      ),
    )
    .catch(error => errorHandler(error));
}
