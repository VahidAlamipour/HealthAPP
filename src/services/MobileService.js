/*import { PREVIOUS_PATH_KEY } from './constant';*/
import { Orientations } from '../pages/PageConstants';


export function isLoadedFromMobile()
{
   // the variable isLoadedFromMobile
   // is declared in the index.html file
   // under the <Scripts> tag
   return window.isLoadedFromMobile;
}

export function getCurrentOrientation()
{
   if( window.innerWidth > window.innerHeight )
   {
      return Orientations.LANDSCAPE;
   }
   else
   {
      return Orientations.PORTRAIT;
   }
}

/**
 * This will return the current base URL depending on where this app is hosted
 */
export function getBaseUrl()
{
   const _url = window.location;
   return _url.protocol + '//' + _url.host;
}

/**
 * @param {String} p_pageConstantsPage you can get this from the 'Pages' enum in '../pages/PageConstants'
 */
/*export function moveToPage( p_pageConstantsPage )
{
   var _targetUrl = getBaseUrl() + p_pageConstantsPage;
   //setTimeout( ()=> { window.location = _targetUrl }, 500 );
   window.location = _targetUrl;
}*/

/*export function getPreviousPath()
{
   return localStorage.getItem( PREVIOUS_PATH_KEY );
}*/

/**
 * @param {String} p_pageConstantsPage you can get this from the 'Pages' enum in '../pages/PageConstants'
 */
/*export function setPreviousPath( p_pageConstantsPage )
{
   localStorage.setItem( PREVIOUS_PATH_KEY, p_pageConstantsPage );
}*/

/*export function resetPreviousPath()
{
   localStorage.setItem( PREVIOUS_PATH_KEY, undefined );
}*/