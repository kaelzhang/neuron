/**
 * user agent
 * author  Kael Zhang
 */
 
(function(K){

	// @namespace KM.UA 
var UA = K.namespace('UA'),
	
	// @enum {RegExp}
	REGEX_UA_MATCHER = {
	
		// the behavior of Google Chrome, Safari, Maxthon 3+, 360 is dependent on the engine they based on
		// so we will no more detect the browser version but the engine version
		
		// KM.UA.chrome and KM.UA.safari are removed
		webkit	: /webkit[ \/]([^ ]+)/,
		opera	: /opera(?:.*version)?[ \/]([\w.]+)/,
		ie		: /msie ([\w.]+)/,
		mozilla	: /mozilla(?:.*? rv:([\w.]+))?/
	},
	
	DEFAULT_PLATFORM = 'other',
	
	userAgent = navigator.userAgent.toLowerCase(),
	platform = navigator.platform.toLowerCase(),
	
	
	ie_documentMode = UA[1] == 'ie' && document.documentMode;


// userAgent
['webkit', 'opera', 'ie', 'mozilla'].forEach(function(name){
	if(!UA.version){
		var match = userAgent.match(REGEX_UA_MATCHER[name]);
			
		if(match){
			UA.version = parseInt(match[1]);
			UA.fullVersion = match[1];	
		}
	}
});


UA.platform = platform = platform.match(/ip(?:ad|od|hone)/) ? 'ios' 
	: ( ua.match(/(?:webos|android)/) || platform.match(/mac|win|linux/) || [DEFAULT_PLATFORM] )[0];


if(platform !== DEFAULT_PLATFORM){
	UA[platform] = true;
}


})(KM);


/**
 change log:
 
 2011-09-03  Kael Zhang:
 - create file
 - remove KM.UA.chrome and KM.UA.safari

 */