/* Modernizr 2.6.2 (Custom Build) | MIT & BSD
 * Build: http://modernizr.com/download/#-cssanimations-csstransforms-csstransforms3d-applicationcache-draganddrop-audio-video-indexeddb-localstorage-sessionstorage-websockets-webworkers-geolocation-touch-webgl-cssclasses-addtest-prefixed-teststyles-testprop-testallprops-hasevent-prefixes-domprefixes-battery_api-fullscreen_api-gamepad-vibration-cssclassprefix:feat!
 */
;window.Modernizr = (function( window, document, undefined ) {

    var version = '2.6.2',

    Modernizr = {},

    enableClasses = true,

    docElement = document.documentElement,

    mod = 'modernizr',
    modElem = document.createElement(mod),
    mStyle = modElem.style,

    inputElem  ,


    toString = {}.toString,

    prefixes = ' -webkit- -moz- -o- -ms- '.split(' '),



    omPrefixes = 'Webkit Moz O ms',

    cssomPrefixes = omPrefixes.split(' '),

    domPrefixes = omPrefixes.toLowerCase().split(' '),


    tests = {},
    inputs = {},
    attrs = {},

    classes = [],

    slice = classes.slice,

    featureName, 


    injectElementWithStyles = function( rule, callback, nodes, testnames ) {

      var style, ret, node, docOverflow,
          div = document.createElement('div'),
                body = document.body,
                fakeBody = body || document.createElement('body');

      if ( parseInt(nodes, 10) ) {
                      while ( nodes-- ) {
              node = document.createElement('div');
              node.id = testnames ? testnames[nodes] : mod + (nodes + 1);
              div.appendChild(node);
          }
      }

                style = ['&#173;','<style id="s', mod, '">', rule, '</style>'].join('');
      div.id = mod;
          (body ? div : fakeBody).innerHTML += style;
      fakeBody.appendChild(div);
      if ( !body ) {
                fakeBody.style.background = '';
                fakeBody.style.overflow = 'hidden';
          docOverflow = docElement.style.overflow;
          docElement.style.overflow = 'hidden';
          docElement.appendChild(fakeBody);
      }

      ret = callback(div, rule);
        if ( !body ) {
          fakeBody.parentNode.removeChild(fakeBody);
          docElement.style.overflow = docOverflow;
      } else {
          div.parentNode.removeChild(div);
      }

      return !!ret;

    },



    isEventSupported = (function() {

      var TAGNAMES = {
        'select': 'input', 'change': 'input',
        'submit': 'form', 'reset': 'form',
        'error': 'img', 'load': 'img', 'abort': 'img'
      };

      function isEventSupported( eventName, element ) {

        element = element || document.createElement(TAGNAMES[eventName] || 'div');
        eventName = 'on' + eventName;

            var isSupported = eventName in element;

        if ( !isSupported ) {
                if ( !element.setAttribute ) {
            element = document.createElement('div');
          }
          if ( element.setAttribute && element.removeAttribute ) {
            element.setAttribute(eventName, '');
            isSupported = is(element[eventName], 'function');

                    if ( !is(element[eventName], 'undefined') ) {
              element[eventName] = undefined;
            }
            element.removeAttribute(eventName);
          }
        }

        element = null;
        return isSupported;
      }
      return isEventSupported;
    })(),


    _hasOwnProperty = ({}).hasOwnProperty, hasOwnProp;

    if ( !is(_hasOwnProperty, 'undefined') && !is(_hasOwnProperty.call, 'undefined') ) {
      hasOwnProp = function (object, property) {
        return _hasOwnProperty.call(object, property);
      };
    }
    else {
      hasOwnProp = function (object, property) { 
        return ((property in object) && is(object.constructor.prototype[property], 'undefined'));
      };
    }


    if (!Function.prototype.bind) {
      Function.prototype.bind = function bind(that) {

        var target = this;

        if (typeof target != "function") {
            throw new TypeError();
        }

        var args = slice.call(arguments, 1),
            bound = function () {

            if (this instanceof bound) {

              var F = function(){};
              F.prototype = target.prototype;
              var self = new F();

              var result = target.apply(
                  self,
                  args.concat(slice.call(arguments))
              );
              if (Object(result) === result) {
                  return result;
              }
              return self;

            } else {

              return target.apply(
                  that,
                  args.concat(slice.call(arguments))
              );

            }

        };

        return bound;
      };
    }

    function setCss( str ) {
        mStyle.cssText = str;
    }

    function setCssAll( str1, str2 ) {
        return setCss(prefixes.join(str1 + ';') + ( str2 || '' ));
    }

    function is( obj, type ) {
        return typeof obj === type;
    }

    function contains( str, substr ) {
        return !!~('' + str).indexOf(substr);
    }

    function testProps( props, prefixed ) {
        for ( var i in props ) {
            var prop = props[i];
            if ( !contains(prop, "-") && mStyle[prop] !== undefined ) {
                return prefixed == 'pfx' ? prop : true;
            }
        }
        return false;
    }

    function testDOMProps( props, obj, elem ) {
        for ( var i in props ) {
            var item = obj[props[i]];
            if ( item !== undefined) {

                            if (elem === false) return props[i];

                            if (is(item, 'function')){
                                return item.bind(elem || obj);
                }

                            return item;
            }
        }
        return false;
    }

    function testPropsAll( prop, prefixed, elem ) {

        var ucProp  = prop.charAt(0).toUpperCase() + prop.slice(1),
            props   = (prop + ' ' + cssomPrefixes.join(ucProp + ' ') + ucProp).split(' ');

            if(is(prefixed, "string") || is(prefixed, "undefined")) {
          return testProps(props, prefixed);

            } else {
          props = (prop + ' ' + (domPrefixes).join(ucProp + ' ') + ucProp).split(' ');
          return testDOMProps(props, prefixed, elem);
        }
    }


    tests['webgl'] = function() {
        return !!window.WebGLRenderingContext;
    };


    tests['touch'] = function() {
        var bool;

        if(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
          bool = true;
        } else {
          injectElementWithStyles(['@media (',prefixes.join('touch-enabled),('),mod,')','{#modernizr{top:9px;position:absolute}}'].join(''), function( node ) {
            bool = node.offsetTop === 9;
          });
        }

        return bool;
    };



    tests['geolocation'] = function() {
        return 'geolocation' in navigator;
    };
    tests['indexedDB'] = function() {
      return !!testPropsAll("indexedDB", window);
    };



    tests['draganddrop'] = function() {
        var div = document.createElement('div');
        return ('draggable' in div) || ('ondragstart' in div && 'ondrop' in div);
    };

    tests['websockets'] = function() {
        return 'WebSocket' in window || 'MozWebSocket' in window;
    };



    tests['cssanimations'] = function() {
        return testPropsAll('animationName');
    };



    tests['csstransforms'] = function() {
        return !!testPropsAll('transform');
    };


    tests['csstransforms3d'] = function() {

        var ret = !!testPropsAll('perspective');

                        if ( ret && 'webkitPerspective' in docElement.style ) {

                      injectElementWithStyles('@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}', function( node, rule ) {
            ret = node.offsetLeft === 9 && node.offsetHeight === 3;
          });
        }
        return ret;
    };
    tests['video'] = function() {
        var elem = document.createElement('video'),
            bool = false;

            try {
            if ( bool = !!elem.canPlayType ) {
                bool      = new Boolean(bool);
                bool.ogg  = elem.canPlayType('video/ogg; codecs="theora"')      .replace(/^no$/,'');

                            bool.h264 = elem.canPlayType('video/mp4; codecs="avc1.42E01E"') .replace(/^no$/,'');

                bool.webm = elem.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/^no$/,'');
            }

        } catch(e) { }

        return bool;
    };

    tests['audio'] = function() {
        var elem = document.createElement('audio'),
            bool = false;

        try {
            if ( bool = !!elem.canPlayType ) {
                bool      = new Boolean(bool);
                bool.ogg  = elem.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/,'');
                bool.mp3  = elem.canPlayType('audio/mpeg;')               .replace(/^no$/,'');

                                                    bool.wav  = elem.canPlayType('audio/wav; codecs="1"')     .replace(/^no$/,'');
                bool.m4a  = ( elem.canPlayType('audio/x-m4a;')            ||
                              elem.canPlayType('audio/aac;'))             .replace(/^no$/,'');
            }
        } catch(e) { }

        return bool;
    };


    tests['localstorage'] = function() {
        try {
            localStorage.setItem(mod, mod);
            localStorage.removeItem(mod);
            return true;
        } catch(e) {
            return false;
        }
    };

    tests['sessionstorage'] = function() {
        try {
            sessionStorage.setItem(mod, mod);
            sessionStorage.removeItem(mod);
            return true;
        } catch(e) {
            return false;
        }
    };


    tests['webworkers'] = function() {
        return !!window.Worker;
    };


    tests['applicationcache'] = function() {
        return !!window.applicationCache;
    };


    for ( var feature in tests ) {
        if ( hasOwnProp(tests, feature) ) {
                                    featureName  = feature.toLowerCase();
            Modernizr[featureName] = tests[feature]();

            classes.push((Modernizr[featureName] ? '' : 'no-') + featureName);
        }
    }



     Modernizr.addTest = function ( feature, test ) {
       if ( typeof feature == 'object' ) {
         for ( var key in feature ) {
           if ( hasOwnProp( feature, key ) ) {
             Modernizr.addTest( key, feature[ key ] );
           }
         }
       } else {

         feature = feature.toLowerCase();

         if ( Modernizr[feature] !== undefined ) {
                                              return Modernizr;
         }

         test = typeof test == 'function' ? test() : test;

         if (typeof enableClasses !== "undefined" && enableClasses) {
           docElement.className+=" feat-" + (test ? '' : 'no-') + feature;
         }
         Modernizr[feature] = test;

       }

       return Modernizr; 
     };


    setCss('');
    modElem = inputElem = null;


    Modernizr._version      = version;

    Modernizr._prefixes     = prefixes;
    Modernizr._domPrefixes  = domPrefixes;
    Modernizr._cssomPrefixes  = cssomPrefixes;


    Modernizr.hasEvent      = isEventSupported;

    Modernizr.testProp      = function(prop){
        return testProps([prop]);
    };

    Modernizr.testAllProps  = testPropsAll;


    Modernizr.testStyles    = injectElementWithStyles;
    Modernizr.prefixed      = function(prop, obj, elem){
      if(!obj) {
        return testPropsAll(prop, 'pfx');
      } else {
            return testPropsAll(prop, obj, elem);
      }
    };


    docElement.className = docElement.className.replace(/(^|\s)no-js(\s|$)/, '$1$2') +

                                                    (enableClasses ? " feat-js feat-"+classes.join(" feat-") : '');

    return Modernizr;

})(this, this.document);

// Battery API
// https://developer.mozilla.org/en/DOM/window.navigator.mozBattery
// By: Paul Sayre

Modernizr.addTest('battery',
	!!Modernizr.prefixed('battery', navigator)
);Modernizr.addTest('fullscreen',function(){
     for(var i = 0; i < Modernizr._domPrefixes.length; i++) {
        if( document[Modernizr._domPrefixes[i].toLowerCase() + 'CancelFullScreen'])
            return true;
     }
     return !!document['cancelFullScreen'] || false;
});

// http://developer.apple.com/library/safari/documentation/AudioVideo/Conceptual/Using_HTML5_Audio_Video/ControllingMediaWithJavaScript/ControllingMediaWithJavaScript.html#//apple_ref/doc/uid/TP40009523-CH3-SW20
// https://developer.mozilla.org/en/API/Fullscreen
// Vibration API
// http://www.w3.org/TR/vibration/
// https://developer.mozilla.org/en/DOM/window.navigator.mozVibrate
Modernizr.addTest('vibrate', !!Modernizr.prefixed('vibrate', navigator));// GamePad API
// https://dvcs.w3.org/hg/gamepad/raw-file/default/gamepad.html
// By Eric Bidelman

// FF has Gamepad API support only in special builds, but not in any release (even behind a flag)
// Their current implementation has no way to feature detect, only events to bind to.
//   http://www.html5rocks.com/en/tutorials/doodles/gamepad/#toc-featuredetect

// but a patch will bring them up to date with the spec when it lands (and they'll pass this test)
//   https://bugzilla.mozilla.org/show_bug.cgi?id=690935

Modernizr.addTest('gamepads', !!Modernizr.prefixed('getGamepads', navigator));


// Version: 3.5.3.1
/* =-====================================================================-= */
/* =-====================================================================-= */
/* =-=========================     JSON     =============================-= */
/* =-====================================================================-= */
/* =-====================================================================-= */

(window['JSON'] && window['JSON']['stringify']) || (function () {
    window['JSON'] || (window['JSON'] = {});

    function toJSON(key) {
        try      { return this.valueOf() }
        catch(e) { return null }
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;

    function quote(string) {
        escapable.lastIndex = 0;
        return escapable.test(string) ?
            '"' + string.replace(escapable, function (a) {
                var c = meta[a];
                return typeof c === 'string' ? c :
                    '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' :
            '"' + string + '"';
    }

    function str(key, holder) {
        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            partial,
            mind  = gap,
            value = holder[key];

        if (value && typeof value === 'object') {
            value = toJSON.call( value, key );
        }

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':
            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':
            return String(value);

        case 'object':

            if (!value) {
                return 'null';
            }

            gap += indent;
            partial = [];

            if (Object.prototype.toString.apply(value) === '[object Array]') {

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

                v = partial.length === 0 ? '[]' :
                    gap ? '[\n' + gap +
                            partial.join(',\n' + gap) + '\n' +
                                mind + ']' :
                          '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }
            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    k = rep[i];
                    if (typeof k === 'string') {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {
                for (k in value) {
                    if (Object.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

            v = partial.length === 0 ? '{}' :
                gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' +
                        mind + '}' : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

    if (typeof JSON['stringify'] !== 'function') {
        JSON['stringify'] = function (value, replacer, space) {
            var i;
            gap = '';
            indent = '';

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }
            } else if (typeof space === 'string') {
                indent = space;
            }
            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                     typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }
            return str('', {'': value});
        };
    }

    if (typeof JSON['parse'] !== 'function') {
        // JSON is parsed on the server for security.
        JSON['parse'] = function (text) {return eval('('+text+')')};
    }
}());
var NOW             = 1
,   READY           = false
,   READY_BUFFER    = []
,   PRESENCE_SUFFIX = '-pnpres'
,   DEF_WINDOWING   = 10     // MILLISECONDS.
,   DEF_TIMEOUT     = 10000  // MILLISECONDS.
,   DEF_SUB_TIMEOUT = 310    // SECONDS.
,   DEF_KEEPALIVE   = 60     // SECONDS.
,   SECOND          = 1000   // A THOUSAND MILLISECONDS.
,   URLBIT          = '/'
,   PARAMSBIT       = '&'
,   REPL            = /{([\w\-]+)}/g;

/**
 * UTILITIES
 */
function unique() { return'x'+ ++NOW+''+(+new Date) }
function rnow()   { return+new Date }

/**
 * NEXTORIGIN
 * ==========
 * var next_origin = nextorigin();
 */
var nextorigin = (function() {
    var max = 20
    ,   ori = Math.floor(Math.random() * max);
    return function( origin, failover ) {
        return origin.indexOf('pubsub.') > 0
            && origin.replace(
             'pubsub', 'ps' + (
                failover ? uuid().split('-')[0] :
                (++ori < max? ori : ori=1)
            ) ) || origin;
    }
})();


/**
 * Build Url
 * =======
 *
 */
function build_url( url_components, url_params ) {
    var url    = url_components.join(URLBIT)
    ,   params = [];

    if (!url_params) return url;

    each( url_params, function( key, value ) {
         params.push(key + "=" + encode(value));
    } );

    url += "?" + params.join(PARAMSBIT);

    return url;
}

/**
 * UPDATER
 * =======
 * var timestamp = unique();
 */
function updater( fun, rate ) {
    var timeout
    ,   last   = 0
    ,   runnit = function() {
        if (last + rate > rnow()) {
            clearTimeout(timeout);
            timeout = setTimeout( runnit, rate );
        }
        else {
            last = rnow();
            fun();
        }
    };

    return runnit;
}

/**
 * GREP
 * ====
 * var list = grep( [1,2,3], function(item) { return item % 2 } )
 */
function grep( list, fun ) {
    var fin = [];
    each( list || [], function(l) { fun(l) && fin.push(l) } );
    return fin
}

/**
 * SUPPLANT
 * ========
 * var text = supplant( 'Hello {name}!', { name : 'John' } )
 */
function supplant( str, values ) {
    return str.replace( REPL, function( _, match ) {
        return values[match] || _
    } );
}

/**
 * timeout
 * =======
 * timeout( function(){}, 100 );
 */
function timeout( fun, wait ) {
    return setTimeout( fun, wait );
}

/**
 * uuid
 * ====
 * var my_uuid = uuid();
 */
function uuid(callback) {
    var u = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
    function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
    if (callback) callback(u);
    return u;
}

/**
 * EACH
 * ====
 * each( [1,2,3], function(item) { } )
 */
function each( o, f ) {
    if ( !o || !f ) return;

    if ( typeof o[0] != 'undefined' )
        for ( var i = 0, l = o.length; i < l; )
            f.call( o[i], o[i], i++ );
    else
        for ( var i in o )
            o.hasOwnProperty    &&
            o.hasOwnProperty(i) &&
            f.call( o[i], i, o[i] );
}

/**
 * MAP
 * ===
 * var list = map( [1,2,3], function(item) { return item + 1 } )
 */
function map( list, fun ) {
    var fin = [];
    each( list || [], function( k, v ) { fin.push(fun( k, v )) } );
    return fin;
}

/**
 * ENCODE
 * ======
 * var encoded_path = encode('path');
 */
function encode(path) {
    return map( (encodeURIComponent(path)).split(''), function(chr) {
        return "-_.!~*'()".indexOf(chr) < 0 ? chr :
               "%"+chr.charCodeAt(0).toString(16).toUpperCase()
    } ).join('');
}

/**
 * Generate Subscription Channel List
 * ==================================
 * generate_channel_list(channels_object);
 */
function generate_channel_list(channels) {
    var list = [];
    each( channels, function( channel, status ) {
        if (status.subscribed) list.push(channel);
    } );
    return list.sort();
}

// PUBNUB READY TO CONNECT
function ready() { timeout( function() {
    if (READY) return;
    READY = 1;
    each( READY_BUFFER, function(connect) { connect() } );
}, SECOND ); }

function PN_API(setup) {
    var SUB_WINDOWING =  +setup['windowing']   || DEF_WINDOWING
    ,   SUB_TIMEOUT   = (+setup['timeout']     || DEF_SUB_TIMEOUT) * SECOND
    ,   KEEPALIVE     = (+setup['keepalive']   || DEF_KEEPALIVE)   * SECOND
    ,   NOLEAVE       = setup['noleave']       || 0
    ,   PUBLISH_KEY   = setup['publish_key']   || ''
    ,   SUBSCRIBE_KEY = setup['subscribe_key'] || ''
    ,   AUTH_KEY      = setup['auth_key']      || ''
    ,   SSL           = setup['ssl']            ? 's' : ''
    ,   ORIGIN        = 'http'+SSL+'://'+(setup['origin']||'pubsub.pubnub.com')
    ,   STD_ORIGIN    = nextorigin(ORIGIN)
    ,   SUB_ORIGIN    = nextorigin(ORIGIN)
    ,   CONNECT       = function(){}
    ,   PUB_QUEUE     = []
    ,   SUB_CALLBACK  = 0
    ,   SUB_CHANNEL   = 0
    ,   SUB_RECEIVER  = 0
    ,   SUB_RESTORE   = 0
    ,   SUB_BUFF_WAIT = 0
    ,   TIMETOKEN     = 0
    ,   CHANNELS      = {}
    ,   xdr           = setup['xdr']
    ,   error         = setup['error']      || function() {}
    ,   _is_online    = setup['_is_online'] || function() { return 1 }
    ,   jsonp_cb      = setup['jsonp_cb']   || function() { return 0 }
    ,   db            = setup['db']         || {'get': function(){}, 'set': function(){}}
    ,   UUID          = setup['uuid']       || ( db && db['get'](SUBSCRIBE_KEY+'uuid') || '');

    function publish(next) {
        if (next) PUB_QUEUE.sending = 0;
        if (PUB_QUEUE.sending || !PUB_QUEUE.length) return;
        PUB_QUEUE.sending = 1;
        xdr(PUB_QUEUE.shift());
    }

    function each_channel(callback) {
        var count = 0;

        each( generate_channel_list(CHANNELS), function(channel) {
            var chan = CHANNELS[channel];

            if (!chan) return;

            count++;
            (callback||function(){})(chan);
        } );

        return count;
    }

    // Announce Leave Event
    var SELF = {
        'LEAVE' : function( channel, blocking ) {
            var data   = { 'uuid' : UUID, 'auth' : AUTH_KEY }
            ,   origin = nextorigin(ORIGIN)
            ,   jsonp  = jsonp_cb();

            // Prevent Leaving a Presence Channel
            if (channel.indexOf(PRESENCE_SUFFIX) > 0) return;

            // No Leave Patch (Prevent Blocking Leave if Desired)
            if (NOLEAVE) return;

            if (jsonp != '0') data['callback'] = jsonp;

            xdr({
                blocking : blocking || SSL,
                timeout  : 2000,
                callback : jsonp,
                data     : data,
                url      : [
                    origin, 'v2', 'presence', 'sub_key',
                    SUBSCRIBE_KEY, 'channel', encode(channel), 'leave'
                ]
            });
        },
        /*
            PUBNUB.history({
                channel  : 'my_chat_channel',
                limit    : 100,
                callback : function(history) { }
            });
        */
        'history' : function( args, callback ) {
            var callback = args['callback'] || callback
            ,   count    = args['count']    || args['limit'] || 100
            ,   reverse  = args['reverse']  || "false"
            ,   err      = args['error']    || function(){}
            ,   channel  = args['channel']
            ,   start    = args['start']
            ,   end      = args['end']
            ,   params   = {}
            ,   jsonp    = jsonp_cb();

            // Make sure we have a Channel
            if (!channel)       return error('Missing Channel');
            if (!callback)      return error('Missing Callback');
            if (!SUBSCRIBE_KEY) return error('Missing Subscribe Key');

            params['stringtoken'] = 'true';
            params['count']       = count;
            params['reverse']     = reverse;
            params['auth']        = AUTH_KEY;

            if (jsonp) params['callback'] = jsonp;
            if (start) params['start']    = start;
            if (end)   params['end']      = end;

            // Send Message
            xdr({
                callback : jsonp,
                data     : params,
                success  : function(response) { callback(response) },
                fail     : err,
                url      : [
                    STD_ORIGIN, 'v2', 'history', 'sub-key',
                    SUBSCRIBE_KEY, 'channel', encode(channel)
                ]
            });
        },

        /*
            PUBNUB.replay({
                source      : 'my_channel',
                destination : 'new_channel'
            });
        */
        'replay' : function(args) {
            var callback    = callback || args['callback'] || function(){}
            ,   source      = args['source']
            ,   destination = args['destination']
            ,   stop        = args['stop']
            ,   start       = args['start']
            ,   end         = args['end']
            ,   reverse     = args['reverse']
            ,   limit       = args['limit']
            ,   jsonp       = jsonp_cb()
            ,   data        = {}
            ,   url;

            // Check User Input
            if (!source)        return error('Missing Source Channel');
            if (!destination)   return error('Missing Destination Channel');
            if (!PUBLISH_KEY)   return error('Missing Publish Key');
            if (!SUBSCRIBE_KEY) return error('Missing Subscribe Key');

            // Setup URL Params
            if (jsonp != '0') data['callback'] = jsonp;
            if (stop)         data['stop']     = 'all';
            if (reverse)      data['reverse']  = 'true';
            if (start)        data['start']    = start;
            if (end)          data['end']      = end;
            if (limit)        data['count']    = limit;

            data['auth'] = AUTH_KEY;

            // Compose URL Parts
            url = [
                STD_ORIGIN, 'v1', 'replay',
                PUBLISH_KEY, SUBSCRIBE_KEY,
                source, destination
            ];

            // Start (or Stop) Replay!
            xdr({
                callback : jsonp,
                success  : function(response) { callback(response) },
                fail     : function() { callback([ 0, 'Disconnected' ]) },
                url      : url,
                data     : data
            });
        },

        /*
            PUBNUB.auth('AJFLKAJSDKLA');
        */
        'auth' : function(auth) {
            AUTH_KEY = auth;
            CONNECT();
        },

        /*
            PUBNUB.time(function(time){ });
        */
        'time' : function(callback) {
            var jsonp = jsonp_cb();
            xdr({
                callback : jsonp,
                data     : { 'uuid' : UUID, 'auth' : AUTH_KEY },
                timeout  : SECOND * 5,
                url      : [STD_ORIGIN, 'time', jsonp],
                success  : function(response) { callback(response[0]) },
                fail     : function() { callback(0) }
            });
        },

        /*
            PUBNUB.publish({
                channel : 'my_chat_channel',
                message : 'hello!'
            });
        */
        'publish' : function( args, callback ) {
            var callback = callback || args['callback'] || function(){}
            ,   msg      = args['message']
            ,   channel  = args['channel']
            ,   jsonp    = jsonp_cb()
            ,   url;

            if (!msg)           return error('Missing Message');
            if (!channel)       return error('Missing Channel');
            if (!PUBLISH_KEY)   return error('Missing Publish Key');
            if (!SUBSCRIBE_KEY) return error('Missing Subscribe Key');

            // If trying to send Object
            msg = JSON['stringify'](msg);

            // Create URL
            url = [
                STD_ORIGIN, 'publish',
                PUBLISH_KEY, SUBSCRIBE_KEY,
                0, encode(channel),
                jsonp, encode(msg)
            ];

            // Queue Message Send
            PUB_QUEUE.push({
                callback : jsonp,
                timeout  : SECOND * 5,
                url      : url,
                data     : { 'uuid' : UUID, 'auth' : AUTH_KEY },
                success  : function(response){callback(response);publish(1)},
                fail     : function(){callback([0,'Failed',msg]);publish(1)}
            });

            // Send Message
            publish();
        },

        /*
            PUBNUB.unsubscribe({ channel : 'my_chat' });
        */
        'unsubscribe' : function(args) {
            var channel = args['channel'];

            TIMETOKEN   = 0;
            SUB_RESTORE = 1;

            // Prepare Channel(s)
            channel = map( (
                channel.join ? channel.join(',') : ''+channel
            ).split(','), function(channel) {
                return channel + ',' + channel + PRESENCE_SUFFIX;
            } ).join(',');

            // Iterate over Channels
            each( channel.split(','), function(channel) {
                if (READY) SELF['LEAVE']( channel, 0 );
                CHANNELS[channel] = 0;
            } );

            // Reset Connection if Count Less
            //if (each_channel() < 2)
            CONNECT();
        },

        /*
            PUBNUB.subscribe({
                channel  : 'my_chat'
                callback : function(message) { }
            });
        */
        'subscribe' : function( args, callback ) {
            var channel       = args['channel']
            ,   callback      = callback            || args['callback']
            ,   callback      = callback            || args['message']
            ,   connect       = args['connect']     || function(){}
            ,   reconnect     = args['reconnect']   || function(){}
            ,   disconnect    = args['disconnect']  || function(){}
            ,   errcb         = args['error']       || function(){}
            ,   presence      = args['presence']    || 0
            ,   noheresync    = args['noheresync']  || 0
            ,   backfill      = args['backfill']    || 0
            ,   timetoken     = args['timetoken']   || 0
            ,   sub_timeout   = args['timeout']     || SUB_TIMEOUT
            ,   windowing     = args['windowing']   || SUB_WINDOWING
            ,   restore       = args['restore'];

            // Restore Enabled?
            SUB_RESTORE = restore;

            // Always Reset the TT
            TIMETOKEN = timetoken;

            // Make sure we have a Channel
            if (!channel)       return error('Missing Channel');
            if (!callback)      return error('Missing Callback');
            if (!SUBSCRIBE_KEY) return error('Missing Subscribe Key');

            // Setup Channel(s)
            each( (channel.join ? channel.join(',') : ''+channel).split(','),
            function(channel) {
                var settings = CHANNELS[channel] || {};

                // Store Channel State
                CHANNELS[SUB_CHANNEL = channel] = {
                    name         : channel,
                    connected    : settings.connected,
                    disconnected : settings.disconnected,
                    subscribed   : 1,
                    callback     : SUB_CALLBACK = callback,
                    connect      : connect,
                    disconnect   : disconnect,
                    reconnect    : reconnect
                };

                // Presence Enabled?
                if (!presence) return;

                // Subscribe Presence Channel
                SELF['subscribe']({
                    'channel'  : channel + PRESENCE_SUFFIX,
                    'callback' : presence
                });

                // Presence Subscribed?
                if (settings.subscribed) return;

                // See Who's Here Now?
                if (noheresync) return;
                SELF['here_now']({
                    'channel'  : channel,
                    'callback' : function(here) {
                        each( 'uuids' in here ? here['uuids'] : [],
                        function(uid) { presence( {
                            'action'    : 'join',
                            'uuid'      : uid,
                            'timestamp' : rnow(),
                            'occupancy' : here['occupancy'] || 1
                        }, here, channel ); } );
                    }
                });
            } );

            // Test Network Connection
            function _test_connection(success) {
                if (success) {
                    // Begin Next Socket Connection
                    timeout( CONNECT, SECOND );
                }
                else {
                    // New Origin on Failed Connection
                    STD_ORIGIN = nextorigin( ORIGIN, 1 );
                    SUB_ORIGIN = nextorigin( ORIGIN, 1 );

                    // Re-test Connection
                    timeout( function() {
                        SELF['time'](_test_connection);
                    }, SECOND );
                }

                // Disconnect & Reconnect
                each_channel(function(channel){
                    // Reconnect
                    if (success && channel.disconnected) {
                        channel.disconnected = 0;
                        return channel.reconnect(channel.name);
                    }

                    // Disconnect
                    if (!success && !channel.disconnected) {
                        channel.disconnected = 1;
                        channel.disconnect(channel.name);
                    }
                });
            }

            // Evented Subscribe
            function _connect() {
                var jsonp    = jsonp_cb()
                ,   channels = generate_channel_list(CHANNELS).join(',');

                // Stop Connection
                if (!channels) return;

                // Connect to PubNub Subscribe Servers
                _reset_offline();
                SUB_RECEIVER = xdr({
                    timeout  : sub_timeout,
                    callback : jsonp,
                    fail     : function() { 
                        SUB_RECEIVER = null;
                        SELF['time'](_test_connection);
                    },
                    data     : { 'uuid' : UUID, 'auth' : AUTH_KEY },
                    url      : [
                        SUB_ORIGIN, 'subscribe',
                        SUBSCRIBE_KEY, encode(channels),
                        jsonp, TIMETOKEN
                    ],
                    success : function(messages) {
                        SUB_RECEIVER = null;

                        // Check for Errors
                        if (!messages || (
                            typeof messages == 'object' &&
                            'error' in messages         &&
                            !messages['error'])
                        ) {
                            errcb(messages);
                            return timeout( CONNECT, windowing );
                        }

                        // Restore Previous Connection Point if Needed
                        TIMETOKEN = !TIMETOKEN               &&
                                    SUB_RESTORE              &&
                                    db['get'](SUBSCRIBE_KEY) || messages[1];

                        // Connect
                        each_channel(function(channel){
                            if (channel.connected) return;
                            channel.connected = 1;
                            channel.connect(channel.name);
                        });

                        // Invoke Memory Catchup and Receive Up to 100
                        // Previous Messages from the Queue.
                        if (backfill) {
                            TIMETOKEN = 10000;
                            backfill  = 0;
                        }

                        // Update Saved Timetoken
                        db['set']( SUBSCRIBE_KEY, messages[1] );

                        // Route Channel <---> Callback for Message
                        var next_callback = (function() {
                            var channels = (messages.length>2?messages[2]:map(
                                CHANNELS, function(chan) { return map(
                                    Array(messages[0].length)
                                    .join(',').split(','),
                                    function() { return chan; }
                                ) }).join(','));
                            var list = channels.split(',');

                            return function() {
                                var channel = list.shift()||SUB_CHANNEL;
                                return [
                                    (CHANNELS[channel]||{})
                                    .callback||SUB_CALLBACK,
                                    channel.split(PRESENCE_SUFFIX)[0]
                                ];
                            };
                        })();

                        each( messages[0], function(msg) {
                            var next = next_callback();
                            next[0]( msg, messages, next[1] );
                        } );

                        timeout( _connect, windowing );
                    }
                });
            }

            CONNECT = function() {
                _reset_offline();
                timeout( _connect, windowing );
            };

            // Reduce Status Flicker
            if (!READY) return READY_BUFFER.push(CONNECT);

            // Connect Now
            CONNECT();
        },

        'here_now' : function( args, callback ) {
            var callback = args['callback'] || callback
            ,   err      = args['error']    || function(){}
            ,   channel  = args['channel']
            ,   jsonp    = jsonp_cb()
            ,   data     = { 'uuid' : UUID, 'auth' : AUTH_KEY };

            // Make sure we have a Channel
            if (!channel)       return error('Missing Channel');
            if (!callback)      return error('Missing Callback');
            if (!SUBSCRIBE_KEY) return error('Missing Subscribe Key');

            if (jsonp != '0') { data['callback'] = jsonp; }

            xdr({
                callback : jsonp,
                data     : data,
                success  : function(response) { callback(response,channel) },
                fail     : err,
                url      : [
                    STD_ORIGIN, 'v2', 'presence',
                    'sub_key', SUBSCRIBE_KEY,
                    'channel', encode(channel)
                ]
            });
        },

        // Expose PUBNUB Functions
        'xdr'           : xdr,
        'ready'         : ready,
        'db'            : db,
        'uuid'          : uuid,
        'map'           : map,
        'each'          : each,
        'each-channel'  : each_channel,
        'grep'          : grep,
        'offline'       : function(){_reset_offline(1)},
        'supplant'      : supplant,
        'now'           : rnow,
        'unique'        : unique,
        'updater'       : updater
    };

    function _poll_online() {
        _is_online() || _reset_offline(1);
        timeout( _poll_online, SECOND );
    }

    function _poll_online2() {
        SELF['time'](function(success){
            success || _reset_offline(1);
            timeout( _poll_online2, KEEPALIVE );
        })
    }

    function _reset_offline(err) {
        SUB_RECEIVER && SUB_RECEIVER(err);
        SUB_RECEIVER = null;
    }

    if (!UUID) UUID = SELF['uuid']();
    db['set']( SUBSCRIBE_KEY + 'uuid', UUID );

    timeout( _poll_online,  SECOND    );
    timeout( _poll_online2, KEEPALIVE );

    SELF['time'](function() {});

    return SELF;
}
/* =-====================================================================-= */
/* =-====================================================================-= */
/* =-=========================     UTIL     =============================-= */
/* =-====================================================================-= */
/* =-====================================================================-= */

window['PUBNUB'] || (function() {

/**
 * UTIL LOCALS
 */

var SWF             = 'https://pubnub.a.ssl.fastly.net/pubnub.swf'
,   ASYNC           = 'async'
,   UA              = navigator.userAgent
,   PNSDK           = 'PubNub-JS-' + 'Web' + '/' + '3.5.3.1'
,   XORIGN          = UA.indexOf('MSIE 6') == -1;

/**
 * CONSOLE COMPATIBILITY
 */
window.console || (window.console=window.console||{});
console.log    || (
    console.log   =
    console.error =
    ((window.opera||{}).postError||function(){})
);

/**
 * LOCAL STORAGE OR COOKIE
 */
var db = (function(){
    var ls = window['localStorage'];
    return {
        'get' : function(key) {
            try {
                if (ls) return ls.getItem(key);
                if (document.cookie.indexOf(key) == -1) return null;
                return ((document.cookie||'').match(
                    RegExp(key+'=([^;]+)')
                )||[])[1] || null;
            } catch(e) { return }
        },
        'set' : function( key, value ) {
            try {
                if (ls) return ls.setItem( key, value ) && 0;
                document.cookie = key + '=' + value +
                    '; expires=Thu, 1 Aug 2030 20:00:00 UTC; path=/';
            } catch(e) { return }
        }
    };
})();


/**
 * $
 * =
 * var div = $('divid');
 */
function $(id) { return document.getElementById(id) }

/**
 * ERROR
 * =====
 * error('message');
 */
function error(message) { console['error'](message) }

/**
 * SEARCH
 * ======
 * var elements = search('a div span');
 */
function search( elements, start ) {
    var list = [];
    each( elements.split(/\s+/), function(el) {
        each( (start || document).getElementsByTagName(el), function(node) {
            list.push(node);
        } );
    } );
    return list;
}

/**
 * BIND
 * ====
 * bind( 'keydown', search('a')[0], function(element) {
 *     ...
 * } );
 */
function bind( type, el, fun ) {
    each( type.split(','), function(etype) {
        var rapfun = function(e) {
            if (!e) e = window.event;
            if (!fun(e)) {
                e.cancelBubble = true;
                e.returnValue  = false;
                e.preventDefault && e.preventDefault();
                e.stopPropagation && e.stopPropagation();
            }
        };

        if ( el.addEventListener ) el.addEventListener( etype, rapfun, false );
        else if ( el.attachEvent ) el.attachEvent( 'on' + etype, rapfun );
        else  el[ 'on' + etype ] = rapfun;
    } );
}

/**
 * UNBIND
 * ======
 * unbind( 'keydown', search('a')[0] );
 */
function unbind( type, el, fun ) {
    if ( el.removeEventListener ) el.removeEventListener( type, false );
    else if ( el.detachEvent ) el.detachEvent( 'on' + type, false );
    else  el[ 'on' + type ] = null;
}

/**
 * HEAD
 * ====
 * head().appendChild(elm);
 */
function head() { return search('head')[0] }

/**
 * ATTR
 * ====
 * var attribute = attr( node, 'attribute' );
 */
function attr( node, attribute, value ) {
    if (value) node.setAttribute( attribute, value );
    else return node && node.getAttribute && node.getAttribute(attribute);
}

/**
 * CSS
 * ===
 * var obj = create('div');
 */
function css( element, styles ) {
    for (var style in styles) if (styles.hasOwnProperty(style))
        try {element.style[style] = styles[style] + (
            '|width|height|top|left|'.indexOf(style) > 0 &&
            typeof styles[style] == 'number'
            ? 'px' : ''
        )}catch(e){}
}

/**
 * CREATE
 * ======
 * var obj = create('div');
 */
function create(element) { return document.createElement(element) }


/**
 * jsonp_cb
 * ========
 * var callback = jsonp_cb();
 */
function jsonp_cb() { return XORIGN || FDomainRequest() ? 0 : unique() }



/**
 * EVENTS
 * ======
 * PUBNUB.events.bind( 'you-stepped-on-flower', function(message) {
 *     // Do Stuff with message
 * } );
 *
 * PUBNUB.events.fire( 'you-stepped-on-flower', "message-data" );
 * PUBNUB.events.fire( 'you-stepped-on-flower', {message:"data"} );
 * PUBNUB.events.fire( 'you-stepped-on-flower', [1,2,3] );
 *
 */
var events = {
    'list'   : {},
    'unbind' : function( name ) { events.list[name] = [] },
    'bind'   : function( name, fun ) {
        (events.list[name] = events.list[name] || []).push(fun);
    },
    'fire' : function( name, data ) {
        each(
            events.list[name] || [],
            function(fun) { fun(data) }
        );
    }
};

/**
 * XDR Cross Domain Request
 * ========================
 *  xdr({
 *     url     : ['http://www.blah.com/url'],
 *     success : function(response) {},
 *     fail    : function() {}
 *  });
 */
function xdr( setup ) {
    if (XORIGN || FDomainRequest()) return ajax(setup);

    var script    = create('script')
    ,   callback  = setup.callback
    ,   id        = unique()
    ,   finished  = 0
    ,   xhrtme    = setup.timeout || DEF_TIMEOUT
    ,   timer     = timeout( function(){done(1)}, xhrtme )
    ,   fail      = setup.fail    || function(){}
    ,   data      = setup.data    || {}
    ,   success   = setup.success || function(){}
    ,   append    = function() { head().appendChild(script) }
    ,   done      = function( failed, response ) {
            if (finished) return;
            finished = 1;

            script.onerror = null;
            clearTimeout(timer);

            (failed || !response) || success(response);

            timeout( function() {
                failed && fail();
                var s = $(id)
                ,   p = s && s.parentNode;
                p && p.removeChild(s);
            }, SECOND );
        };

    window[callback] = function(response) {
        done( 0, response );
    };

    if (!setup.blocking) script[ASYNC] = ASYNC;

    script.onerror = function() { done(1) };
    data['pnsdk']  = PNSDK;
    script.src     = build_url( setup.url, data );

    attr( script, 'id', id );

    append();
    return done;
}

/**
 * CORS XHR Request
 * ================
 *  xdr({
 *     url     : ['http://www.blah.com/url'],
 *     success : function(response) {},
 *     fail    : function() {}
 *  });
 */
function ajax( setup ) {
    var xhr, response
    ,   finished = function() {
            if (loaded) return;
            loaded = 1;

            clearTimeout(timer);

            try       { response = JSON['parse'](xhr.responseText); }
            catch (r) { return done(1); }

            complete = 1;
            success(response);
        }
    ,   complete = 0
    ,   loaded   = 0
    ,   xhrtme   = setup.timeout || DEF_TIMEOUT
    ,   timer    = timeout( function(){done(1)}, xhrtme )
    ,   fail     = setup.fail    || function(){}
    ,   data     = setup.data    || {}
    ,   success  = setup.success || function(){}
    ,   async    = ( typeof(setup.blocking) === 'undefined' )
    ,   done     = function(failed) {
            if (complete) return;
            complete = 1;

            clearTimeout(timer);

            if (xhr) {
                xhr.onerror = xhr.onload = null;
                xhr.abort && xhr.abort();
                xhr = null;
            }

            failed && fail();
        };

    // Send
    try {
        xhr = FDomainRequest()      ||
              window.XDomainRequest &&
              new XDomainRequest()  ||
              new XMLHttpRequest();

        xhr.onerror = xhr.onabort   = function(){ done(1) };
        xhr.onload  = xhr.onloadend = finished;
        if (async) xhr.timeout = xhrtme;

        data['pnsdk'] = PNSDK;
        var url = build_url(setup.url,data);

        xhr.open( 'GET', url, async );
        xhr.send();
    }
    catch(eee) {
        done(0);
        XORIGN = 0;
        return xdr(setup);
    }

    // Return 'done'
    return done;
}



 // Test Connection State
function _is_online() {
    if (!('onLine' in navigator)) return 1;
    return navigator['onLine'];
}


/* =-====================================================================-= */
/* =-====================================================================-= */
/* =-=========================     PUBNUB     ===========================-= */
/* =-====================================================================-= */
/* =-====================================================================-= */

var PDIV          = $('pubnub') || 0
,   CREATE_PUBNUB = function(setup) {

    // Force JSONP if requested from user.
    if (setup['jsonp']) XORIGN = 0;

    var SUBSCRIBE_KEY = setup['subscribe_key'] || ''
    ,   KEEPALIVE     = (+setup['keepalive']   || DEF_KEEPALIVE)   * SECOND
    ,   UUID          = setup['uuid'] || db['get'](SUBSCRIBE_KEY+'uuid')||'';

    setup['xdr']        = xdr;
    setup['db']         = db;
    setup['error']      = error;
    setup['_is_online'] = _is_online;
    setup['jsonp_cb']   = jsonp_cb;

    var SELF            = PN_API(setup);
    SELF['css']         = css;
    SELF['$']           = $;
    SELF['create']      = create;
    SELF['bind']        = bind;
    SELF['head']        = head;
    SELF['search']      = search;
    SELF['attr']        = attr;
    SELF['events']      = events;
    SELF['init']        = CREATE_PUBNUB;


    // Add Leave Functions
    bind( 'beforeunload', window, function() {
        SELF['each-channel'](function(ch){ SELF['LEAVE']( ch.name, 0 ) });
        return true;
    } );

    // Return without Testing
    if (setup['notest']) return SELF;

    bind( 'offline', window,   SELF['offline'] );
    bind( 'offline', document, SELF['offline'] );

    // Return PUBNUB Socket Object
    return SELF;
};

// Bind for PUBNUB Readiness to Subscribe
bind( 'load', window, function(){ timeout( ready, 0 ) } );

var pdiv = PDIV || {};

// CREATE A PUBNUB GLOBAL OBJECT
PUBNUB = CREATE_PUBNUB({
    'notest'        : 1,
    'publish_key'   : attr( pdiv, 'pub-key' ),
    'subscribe_key' : attr( pdiv, 'sub-key' ),
    'ssl'           : !document.location.href.indexOf('https') ||
                      attr( pdiv, 'ssl' ) == 'on',
    'origin'        : attr( pdiv, 'origin' ),
    'uuid'          : attr( pdiv, 'uuid' )
});

// jQuery Interface
window['jQuery'] && (window['jQuery']['PUBNUB'] = PUBNUB);

// For Modern JS + Testling.js - http://testling.com/
typeof(module) !== 'undefined' && (module['exports'] = PUBNUB) && ready();

var pubnubs = $('pubnubs') || 0;

// LEAVE NOW IF NO PDIV.
if (!PDIV) return;

// PUBNUB Flash Socket
css( PDIV, { 'position' : 'absolute', 'top' : -SECOND } );

if ('opera' in window || attr( PDIV, 'flash' )) PDIV['innerHTML'] =
    '<object id=pubnubs data='  + SWF +
    '><param name=movie value=' + SWF +
    '><param name=allowscriptaccess value=always></object>';

// Create Interface for Opera Flash
PUBNUB['rdx'] = function( id, data ) {
    if (!data) return FDomainRequest[id]['onerror']();
    FDomainRequest[id]['responseText'] = unescape(data);
    FDomainRequest[id]['onload']();
};

function FDomainRequest() {
    if (!pubnubs || !pubnubs['get']) return 0;

    var fdomainrequest = {
        'id'    : FDomainRequest['id']++,
        'send'  : function() {},
        'abort' : function() { fdomainrequest['id'] = {} },
        'open'  : function( method, url ) {
            FDomainRequest[fdomainrequest['id']] = fdomainrequest;
            pubnubs['get']( fdomainrequest['id'], url );
        }
    };

    return fdomainrequest;
}
FDomainRequest['id'] = SECOND;

})();
(function(){

// ---------------------------------------------------------------------------
// WEBSOCKET INTERFACE
// ---------------------------------------------------------------------------
var WS = PUBNUB['ws'] = function( url, protocols ) {
    if (!(this instanceof WS)) return new WS( url, protocols );

    var self     = this
    ,   url      = self.url      = url || ''
    ,   protocol = self.protocol = protocols || 'Sec-WebSocket-Protocol'
    ,   bits     = url.split('/')
    ,   setup    = {
         'ssl'           : bits[0] === 'wss:'
        ,'origin'        : bits[2]
        ,'publish_key'   : bits[3]
        ,'subscribe_key' : bits[4]
        ,'channel'       : bits[5]
    };

    // READY STATES
    self['CONNECTING'] = 0; // The connection is not yet open.
    self['OPEN']       = 1; // The connection is open and ready to communicate.
    self['CLOSING']    = 2; // The connection is in the process of closing.
    self['CLOSED']     = 3; // The connection is closed or couldn't be opened.

    // CLOSE STATES
    self['CLOSE_NORMAL']         = 1000; // Normal Intended Close; completed.
    self['CLOSE_GOING_AWAY']     = 1001; // Closed Unexpecttedly.
    self['CLOSE_PROTOCOL_ERROR'] = 1002; // Server: Not Supported.
    self['CLOSE_UNSUPPORTED']    = 1003; // Server: Unsupported Protocol.
    self['CLOSE_TOO_LARGE']      = 1004; // Server: Too Much Data.
    self['CLOSE_NO_STATUS']      = 1005; // Server: No reason.
    self['CLOSE_ABNORMAL']       = 1006; // Abnormal Disconnect.

    // Events Default
    self['onclose']   = self['onerror'] =
    self['onmessage'] = self['onopen']  =
    self['onsend']    =  function(){};

    // Attributes
    self['binaryType']     = '';
    self['extensions']     = '';
    self['bufferedAmount'] = 0;
    self['trasnmitting']   = false;
    self['buffer']         = [];
    self['readyState']     = self['CONNECTING'];

    // Close if no setup.
    if (!url) {
        self['readyState'] = self['CLOSED'];
        self['onclose']({
            'code'     : self['CLOSE_ABNORMAL'],
            'reason'   : 'Missing URL',
            'wasClean' : true
        });
        return self;
    }

    // PubNub WebSocket Emulation
    self.pubnub       = PUBNUB['init'](setup);
    self.pubnub.setup = setup;
    self.setup        = setup;

    self.pubnub['subscribe']({
        'restore'    : false,
        'channel'    : setup['channel'],
        'disconnect' : self['onerror'],
        'reconnect'  : self['onopen'],
        'error'      : function() {
            self['onclose']({
                'code'     : self['CLOSE_ABNORMAL'],
                'reason'   : 'Missing URL',
                'wasClean' : false
            });
        },
        'callback'   : function(message) {
            self['onmessage']({ 'data' : message });
        },
        'connect'    : function() {
            self['readyState'] = self['OPEN'];
            self['onopen']();
        }
    });
};

// ---------------------------------------------------------------------------
// WEBSOCKET SEND
// ---------------------------------------------------------------------------
WS.prototype.send = function(data) {
    var self = this;
    self.pubnub['publish']({
        'channel'  : self.pubnub.setup['channel'],
        'message'  : data,
        'callback' : function(response) {
            self['onsend']({ 'data' : response });
        }
    });
};

// ---------------------------------------------------------------------------
// WEBSOCKET CLOSE
// ---------------------------------------------------------------------------
WS.prototype.close = function() {
    var self = this;
    self.pubnub['unsubscribe']({ 'channel' : self.pubnub.setup['channel'] });
    self['readyState'] = self['CLOSED'];
    self['onclose']({});
};

})();



/*!
  * Bean - copyright (c) Jacob Thornton 2011-2012
  * https://github.com/fat/bean
  * MIT license
  */
(function (name, context, definition) {
  if (typeof module != 'undefined' && module.exports) module.exports = definition()
  else if (typeof define == 'function' && define.amd) define(definition)
  else context[name] = definition()
})('bean', this, function (name, context) {
  name    = name    || 'bean'
  context = context || this

  var win            = window
    , old            = context[name]
    , namespaceRegex = /[^\.]*(?=\..*)\.|.*/
    , nameRegex      = /\..*/
    , addEvent       = 'addEventListener'
    , removeEvent    = 'removeEventListener'
    , doc            = document || {}
    , root           = doc.documentElement || {}
    , W3C_MODEL      = root[addEvent]
    , eventSupport   = W3C_MODEL ? addEvent : 'attachEvent'
    , ONE            = {} // singleton for quick matching making add() do one()

    , slice          = Array.prototype.slice
    , str2arr        = function (s, d) { return s.split(d || ' ') }
    , isString       = function (o) { return typeof o == 'string' }
    , isFunction     = function (o) { return typeof o == 'function' }

      // events that we consider to be 'native', anything not in this list will
      // be treated as a custom event
    , standardNativeEvents =
        'click dblclick mouseup mousedown contextmenu '                  + // mouse buttons
        'mousewheel mousemultiwheel DOMMouseScroll '                     + // mouse wheel
        'mouseover mouseout mousemove selectstart selectend '            + // mouse movement
        'keydown keypress keyup '                                        + // keyboard
        'orientationchange '                                             + // mobile
        'focus blur change reset select submit '                         + // form elements
        'load unload beforeunload resize move DOMContentLoaded '         + // window
        'readystatechange message '                                      + // window
        'error abort scroll '                                              // misc
      // element.fireEvent('onXYZ'... is not forgiving if we try to fire an event
      // that doesn't actually exist, so make sure we only do these on newer browsers
    , w3cNativeEvents =
        'show '                                                          + // mouse buttons
        'input invalid '                                                 + // form elements
        'touchstart touchmove touchend touchcancel '                     + // touch
        'gesturestart gesturechange gestureend '                         + // gesture
        'textinput'                                                      + // TextEvent
        'readystatechange pageshow pagehide popstate '                   + // window
        'hashchange offline online '                                     + // window
        'afterprint beforeprint '                                        + // printing
        'dragstart dragenter dragover dragleave drag drop dragend '      + // dnd
        'loadstart progress suspend emptied stalled loadmetadata '       + // media
        'loadeddata canplay canplaythrough playing waiting seeking '     + // media
        'seeked ended durationchange timeupdate play pause ratechange '  + // media
        'volumechange cuechange '                                        + // media
        'checking noupdate downloading cached updateready obsolete '       // appcache

      // convert to a hash for quick lookups
    , nativeEvents = (function (hash, events, i) {
        for (i = 0; i < events.length; i++) events[i] && (hash[events[i]] = 1)
        return hash
      }({}, str2arr(standardNativeEvents + (W3C_MODEL ? w3cNativeEvents : ''))))

      // custom events are events that we *fake*, they are not provided natively but
      // we can use native events to generate them
    , customEvents = (function () {
        var isAncestor = 'compareDocumentPosition' in root
              ? function (element, container) {
                  return container.compareDocumentPosition && (container.compareDocumentPosition(element) & 16) === 16
                }
              : 'contains' in root
                ? function (element, container) {
                    container = container.nodeType === 9 || container === window ? root : container
                    return container !== element && container.contains(element)
                  }
                : function (element, container) {
                    while (element = element.parentNode) if (element === container) return 1
                    return 0
                  }
          , check = function (event) {
              var related = event.relatedTarget
              return !related
                ? related == null
                : (related !== this && related.prefix !== 'xul' && !/document/.test(this.toString())
                    && !isAncestor(related, this))
            }

        return {
            mouseenter: { base: 'mouseover', condition: check }
          , mouseleave: { base: 'mouseout', condition: check }
          , mousewheel: { base: /Firefox/.test(navigator.userAgent) ? 'DOMMouseScroll' : 'mousewheel' }
        }
      }())

      // we provide a consistent Event object across browsers by taking the actual DOM
      // event object and generating a new one from its properties.
    , Event = (function () {
            // a whitelist of properties (for different event types) tells us what to check for and copy
        var commonProps  = str2arr('altKey attrChange attrName bubbles cancelable ctrlKey currentTarget ' +
              'detail eventPhase getModifierState isTrusted metaKey relatedNode relatedTarget shiftKey '  +
              'srcElement target timeStamp type view which propertyName')
          , mouseProps   = commonProps.concat(str2arr('button buttons clientX clientY dataTransfer '      +
              'fromElement offsetX offsetY pageX pageY screenX screenY toElement'))
          , mouseWheelProps = mouseProps.concat(str2arr('wheelDelta wheelDeltaX wheelDeltaY wheelDeltaZ ' +
              'axis')) // 'axis' is FF specific
          , keyProps     = commonProps.concat(str2arr('char charCode key keyCode keyIdentifier '          +
              'keyLocation location'))
          , textProps    = commonProps.concat(str2arr('data'))
          , touchProps   = commonProps.concat(str2arr('touches targetTouches changedTouches scale rotation'))
          , messageProps = commonProps.concat(str2arr('data origin source'))
          , stateProps   = commonProps.concat(str2arr('state'))
          , overOutRegex = /over|out/
            // some event types need special handling and some need special properties, do that all here
          , typeFixers   = [
                { // key events
                    reg: /key/i
                  , fix: function (event, newEvent) {
                      newEvent.keyCode = event.keyCode || event.which
                      return keyProps
                    }
                }
              , { // mouse events
                    reg: /click|mouse(?!(.*wheel|scroll))|menu|drag|drop/i
                  , fix: function (event, newEvent, type) {
                      newEvent.rightClick = event.which === 3 || event.button === 2
                      newEvent.pos = { x: 0, y: 0 }
                      if (event.pageX || event.pageY) {
                        newEvent.clientX = event.pageX
                        newEvent.clientY = event.pageY
                      } else if (event.clientX || event.clientY) {
                        newEvent.clientX = event.clientX + doc.body.scrollLeft + root.scrollLeft
                        newEvent.clientY = event.clientY + doc.body.scrollTop + root.scrollTop
                      }
                      if (overOutRegex.test(type)) {
                        newEvent.relatedTarget = event.relatedTarget
                          || event[(type == 'mouseover' ? 'from' : 'to') + 'Element']
                      }
                      return mouseProps
                    }
                }
              , { // mouse wheel events
                    reg: /mouse.*(wheel|scroll)/i
                  , fix: function () { return mouseWheelProps }
                }
              , { // TextEvent
                    reg: /^text/i
                  , fix: function () { return textProps }
                }
              , { // touch and gesture events
                    reg: /^touch|^gesture/i
                  , fix: function () { return touchProps }
                }
              , { // message events
                    reg: /^message$/i
                  , fix: function () { return messageProps }
                }
              , { // popstate events
                    reg: /^popstate$/i
                  , fix: function () { return stateProps }
                }
              , { // everything else
                    reg: /.*/
                  , fix: function () { return commonProps }
                }
            ]
          , typeFixerMap = {} // used to map event types to fixer functions (above), a basic cache mechanism

          , Event = function (event, element, isNative) {
              if (!arguments.length) return
              event = event || ((element.ownerDocument || element.document || element).parentWindow || win).event
              this.originalEvent = event
              this.isNative       = isNative
              this.isBean         = true

              if (!event) return

              var type   = event.type
                , target = event.target || event.srcElement
                , i, l, p, props, fixer

              this.target = target && target.nodeType === 3 ? target.parentNode : target

              if (isNative) { // we only need basic augmentation on custom events, the rest expensive & pointless
                fixer = typeFixerMap[type]
                if (!fixer) { // haven't encountered this event type before, map a fixer function for it
                  for (i = 0, l = typeFixers.length; i < l; i++) {
                    if (typeFixers[i].reg.test(type)) { // guaranteed to match at least one, last is .*
                      typeFixerMap[type] = fixer = typeFixers[i].fix
                      break
                    }
                  }
                }

                props = fixer(event, this, type)
                for (i = props.length; i--;) {
                  if (!((p = props[i]) in this) && p in event) this[p] = event[p]
                }
              }
            }

        // preventDefault() and stopPropagation() are a consistent interface to those functions
        // on the DOM, stop() is an alias for both of them together
        Event.prototype.preventDefault = function () {
          if (this.originalEvent.preventDefault) this.originalEvent.preventDefault()
          else this.originalEvent.returnValue = false
        }
        Event.prototype.stopPropagation = function () {
          if (this.originalEvent.stopPropagation) this.originalEvent.stopPropagation()
          else this.originalEvent.cancelBubble = true
        }
        Event.prototype.stop = function () {
          this.preventDefault()
          this.stopPropagation()
          this.stopped = true
        }
        // stopImmediatePropagation() has to be handled internally because we manage the event list for
        // each element
        // note that originalElement may be a Bean#Event object in some situations
        Event.prototype.stopImmediatePropagation = function () {
          if (this.originalEvent.stopImmediatePropagation) this.originalEvent.stopImmediatePropagation()
          this.isImmediatePropagationStopped = function () { return true }
        }
        Event.prototype.isImmediatePropagationStopped = function () {
          return this.originalEvent.isImmediatePropagationStopped && this.originalEvent.isImmediatePropagationStopped()
        }
        Event.prototype.clone = function (currentTarget) {
          //TODO: this is ripe for optimisation, new events are *expensive*
          // improving this will speed up delegated events
          var ne = new Event(this, this.element, this.isNative)
          ne.currentTarget = currentTarget
          return ne
        }

        return Event
      }())

      // if we're in old IE we can't do onpropertychange on doc or win so we use doc.documentElement for both
    , targetElement = function (element, isNative) {
        return !W3C_MODEL && !isNative && (element === doc || element === win) ? root : element
      }

      /**
        * Bean maintains an internal registry for event listeners. We don't touch elements, objects
        * or functions to identify them, instead we store everything in the registry.
        * Each event listener has a RegEntry object, we have one 'registry' for the whole instance.
        */
    , RegEntry = (function () {
        // each handler is wrapped so we can handle delegation and custom events
        var wrappedHandler = function (element, fn, condition, args) {
            var call = function (event, eargs) {
                  return fn.apply(element, args ? slice.call(eargs, event ? 0 : 1).concat(args) : eargs)
                }
              , findTarget = function (event, eventElement) {
                  return fn.__beanDel ? fn.__beanDel.ft(event.target, element) : eventElement
                }
              , handler = condition
                  ? function (event) {
                      var target = findTarget(event, this) // deleated event
                      if (condition.apply(target, arguments)) {
                        if (event) event.currentTarget = target
                        return call(event, arguments)
                      }
                    }
                  : function (event) {
                      if (fn.__beanDel) event = event.clone(findTarget(event)) // delegated event, fix the fix
                      return call(event, arguments)
                    }
            handler.__beanDel = fn.__beanDel
            return handler
          }

        , RegEntry = function (element, type, handler, original, namespaces, args, root) {
            var customType     = customEvents[type]
              , isNative

            if (type == 'unload') {
              // self clean-up
              handler = once(removeListener, element, type, handler, original)
            }

            if (customType) {
              if (customType.condition) {
                handler = wrappedHandler(element, handler, customType.condition, args)
              }
              type = customType.base || type
            }

            this.isNative      = isNative = nativeEvents[type] && !!element[eventSupport]
            this.customType    = !W3C_MODEL && !isNative && type
            this.element       = element
            this.type          = type
            this.original      = original
            this.namespaces    = namespaces
            this.eventType     = W3C_MODEL || isNative ? type : 'propertychange'
            this.target        = targetElement(element, isNative)
            this[eventSupport] = !!this.target[eventSupport]
            this.root          = root
            this.handler       = wrappedHandler(element, handler, null, args)
          }

        // given a list of namespaces, is our entry in any of them?
        RegEntry.prototype.inNamespaces = function (checkNamespaces) {
          var i, j, c = 0
          if (!checkNamespaces) return true
          if (!this.namespaces) return false
          for (i = checkNamespaces.length; i--;) {
            for (j = this.namespaces.length; j--;) {
              if (checkNamespaces[i] == this.namespaces[j]) c++
            }
          }
          return checkNamespaces.length === c
        }

        // match by element, original fn (opt), handler fn (opt)
        RegEntry.prototype.matches = function (checkElement, checkOriginal, checkHandler) {
          return this.element === checkElement &&
            (!checkOriginal || this.original === checkOriginal) &&
            (!checkHandler || this.handler === checkHandler)
        }

        return RegEntry
      }())

    , registry = (function () {
        // our map stores arrays by event type, just because it's better than storing
        // everything in a single array.
        // uses '$' as a prefix for the keys for safety and 'r' as a special prefix for
        // rootListeners so we can look them up fast
        var map = {}

          // generic functional search of our registry for matching listeners,
          // `fn` returns false to break out of the loop
          , forAll = function (element, type, original, handler, root, fn) {
              var pfx = root ? 'r' : '$'
              if (!type || type == '*') {
                // search the whole registry
                for (var t in map) {
                  if (t.charAt(0) == pfx) {
                    forAll(element, t.substr(1), original, handler, root, fn)
                  }
                }
              } else {
                var i = 0, l, list = map[pfx + type], all = element == '*'
                if (!list) return
                for (l = list.length; i < l; i++) {
                  if ((all || list[i].matches(element, original, handler)) && !fn(list[i], list, i, type)) return
                }
              }
            }

          , has = function (element, type, original, root) {
              // we're not using forAll here simply because it's a bit slower and this
              // needs to be fast
              var i, list = map[(root ? 'r' : '$') + type]
              if (list) {
                for (i = list.length; i--;) {
                  if (!list[i].root && list[i].matches(element, original, null)) return true
                }
              }
              return false
            }

          , get = function (element, type, original, root) {
              var entries = []
              forAll(element, type, original, null, root, function (entry) {
                return entries.push(entry)
              })
              return entries
            }

          , put = function (entry) {
              var has = !entry.root && !this.has(entry.element, entry.type, null, false)
                , key = (entry.root ? 'r' : '$') + entry.type
              ;(map[key] || (map[key] = [])).push(entry)
              return has
            }

          , del = function (entry) {
              forAll(entry.element, entry.type, null, entry.handler, entry.root, function (entry, list, i) {
                list.splice(i, 1)
                entry.removed = true
                if (list.length === 0) delete map[(entry.root ? 'r' : '$') + entry.type]
                return false
              })
            }

            // dump all entries, used for onunload
          , entries = function () {
              var t, entries = []
              for (t in map) {
                if (t.charAt(0) == '$') entries = entries.concat(map[t])
              }
              return entries
            }

        return { has: has, get: get, put: put, del: del, entries: entries }
      }())

      // we need a selector engine for delegated events, use querySelectorAll if it exists
      // but for older browsers we need Qwery, Sizzle or similar
    , selectorEngine
    , setSelectorEngine = function (e) {
        if (!arguments.length) {
          selectorEngine = doc.querySelectorAll
            ? function (s, r) {
                return r.querySelectorAll(s)
              }
            : function () {
                throw new Error('Bean: No selector engine installed') // eeek
              }
        } else {
          selectorEngine = e
        }
      }

      // we attach this listener to each DOM event that we need to listen to, only once
      // per event type per DOM element
    , rootListener = function (event, type) {
        if (!W3C_MODEL && type && event && event.propertyName != '_on' + type) return

        var listeners = registry.get(this, type || event.type, null, false)
          , l = listeners.length
          , i = 0

        event = new Event(event, this, true)
        if (type) event.type = type

        // iterate through all handlers registered for this type, calling them unless they have
        // been removed by a previous handler or stopImmediatePropagation() has been called
        for (; i < l && !event.isImmediatePropagationStopped(); i++) {
          if (!listeners[i].removed) listeners[i].handler.call(this, event)
        }
      }

      // add and remove listeners to DOM elements
    , listener = W3C_MODEL
        ? function (element, type, add) {
            // new browsers
            element[add ? addEvent : removeEvent](type, rootListener, false)
          }
        : function (element, type, add, custom) {
            // IE8 and below, use attachEvent/detachEvent and we have to piggy-back propertychange events
            // to simulate event bubbling etc.
            var entry
            if (add) {
              registry.put(entry = new RegEntry(
                  element
                , custom || type
                , function (event) { // handler
                    rootListener.call(element, event, custom)
                  }
                , rootListener
                , null
                , null
                , true // is root
              ))
              if (custom && element['_on' + custom] == null) element['_on' + custom] = 0
              entry.target.attachEvent('on' + entry.eventType, entry.handler)
            } else {
              entry = registry.get(element, custom || type, rootListener, true)[0]
              if (entry) {
                entry.target.detachEvent('on' + entry.eventType, entry.handler)
                registry.del(entry)
              }
            }
          }

    , once = function (rm, element, type, fn, originalFn) {
        // wrap the handler in a handler that does a remove as well
        return function () {
          fn.apply(this, arguments)
          rm(element, type, originalFn)
        }
      }

    , removeListener = function (element, orgType, handler, namespaces) {
        var type     = orgType && orgType.replace(nameRegex, '')
          , handlers = registry.get(element, type, null, false)
          , removed  = {}
          , i, l

        for (i = 0, l = handlers.length; i < l; i++) {
          if ((!handler || handlers[i].original === handler) && handlers[i].inNamespaces(namespaces)) {
            // TODO: this is problematic, we have a registry.get() and registry.del() that
            // both do registry searches so we waste cycles doing this. Needs to be rolled into
            // a single registry.forAll(fn) that removes while finding, but the catch is that
            // we'll be splicing the arrays that we're iterating over. Needs extra tests to
            // make sure we don't screw it up. @rvagg
            registry.del(handlers[i])
            if (!removed[handlers[i].eventType] && handlers[i][eventSupport])
              removed[handlers[i].eventType] = { t: handlers[i].eventType, c: handlers[i].type }
          }
        }
        // check each type/element for removed listeners and remove the rootListener where it's no longer needed
        for (i in removed) {
          if (!registry.has(element, removed[i].t, null, false)) {
            // last listener of this type, remove the rootListener
            listener(element, removed[i].t, false, removed[i].c)
          }
        }
      }

      // set up a delegate helper using the given selector, wrap the handler function
    , delegate = function (selector, fn) {
        //TODO: findTarget (therefore $) is called twice, once for match and once for
        // setting e.currentTarget, fix this so it's only needed once
        var findTarget = function (target, root) {
              var i, array = isString(selector) ? selectorEngine(selector, root) : selector
              for (; target && target !== root; target = target.parentNode) {
                for (i = array.length; i--;) {
                  if (array[i] === target) return target
                }
              }
            }
          , handler = function (e) {
              var match = findTarget(e.target, this)
              if (match) fn.apply(match, arguments)
            }

        // __beanDel isn't pleasant but it's a private function, not exposed outside of Bean
        handler.__beanDel = {
            ft       : findTarget // attach it here for customEvents to use too
          , selector : selector
        }
        return handler
      }

    , fireListener = W3C_MODEL ? function (isNative, type, element) {
        // modern browsers, do a proper dispatchEvent()
        var evt = doc.createEvent(isNative ? 'HTMLEvents' : 'UIEvents')
        evt[isNative ? 'initEvent' : 'initUIEvent'](type, true, true, win, 1)
        element.dispatchEvent(evt)
      } : function (isNative, type, element) {
        // old browser use onpropertychange, just increment a custom property to trigger the event
        element = targetElement(element, isNative)
        isNative ? element.fireEvent('on' + type, doc.createEventObject()) : element['_on' + type]++
      }

      /**
        * Public API: off(), on(), add(), (remove()), one(), fire(), clone()
        */

      /**
        * off(element[, eventType(s)[, handler ]])
        */
    , off = function (element, typeSpec, fn) {
        var isTypeStr = isString(typeSpec)
          , k, type, namespaces, i

        if (isTypeStr && typeSpec.indexOf(' ') > 0) {
          // off(el, 't1 t2 t3', fn) or off(el, 't1 t2 t3')
          typeSpec = str2arr(typeSpec)
          for (i = typeSpec.length; i--;)
            off(element, typeSpec[i], fn)
          return element
        }

        type = isTypeStr && typeSpec.replace(nameRegex, '')
        if (type && customEvents[type]) type = customEvents[type].base

        if (!typeSpec || isTypeStr) {
          // off(el) or off(el, t1.ns) or off(el, .ns) or off(el, .ns1.ns2.ns3)
          if (namespaces = isTypeStr && typeSpec.replace(namespaceRegex, '')) namespaces = str2arr(namespaces, '.')
          removeListener(element, type, fn, namespaces)
        } else if (isFunction(typeSpec)) {
          // off(el, fn)
          removeListener(element, null, typeSpec)
        } else {
          // off(el, { t1: fn1, t2, fn2 })
          for (k in typeSpec) {
            if (typeSpec.hasOwnProperty(k)) off(element, k, typeSpec[k])
          }
        }

        return element
      }

      /**
        * on(element, eventType(s)[, selector], handler[, args ])
        */
    , on = function(element, events, selector, fn) {
        var originalFn, type, types, i, args, entry, first

        //TODO: the undefined check means you can't pass an 'args' argument, fix this perhaps?
        if (selector === undefined && typeof events == 'object') {
          //TODO: this can't handle delegated events
          for (type in events) {
            if (events.hasOwnProperty(type)) {
              on.call(this, element, type, events[type])
            }
          }
          return
        }

        if (!isFunction(selector)) {
          // delegated event
          originalFn = fn
          args       = slice.call(arguments, 4)
          fn         = delegate(selector, originalFn, selectorEngine)
        } else {
          args       = slice.call(arguments, 3)
          fn         = originalFn = selector
        }

        types = str2arr(events)

        // special case for one(), wrap in a self-removing handler
        if (this === ONE) {
          fn = once(off, element, events, fn, originalFn)
        }

        for (i = types.length; i--;) {
          // add new handler to the registry and check if it's the first for this element/type
          first = registry.put(entry = new RegEntry(
              element
            , types[i].replace(nameRegex, '') // event type
            , fn
            , originalFn
            , str2arr(types[i].replace(namespaceRegex, ''), '.') // namespaces
            , args
            , false // not root
          ))
          if (entry[eventSupport] && first) {
            // first event of this type on this element, add root listener
            listener(element, entry.eventType, true, entry.customType)
          }
        }

        return element
      }

      /**
        * add(element[, selector], eventType(s), handler[, args ])
        *
        * Deprecated: kept (for now) for backward-compatibility
        */
    , add = function (element, events, fn, delfn) {
        return on.apply(
            null
          , !isString(fn)
              ? slice.call(arguments)
              : [ element, fn, events, delfn ].concat(arguments.length > 3 ? slice.call(arguments, 5) : [])
        )
      }

      /**
        * one(element, eventType(s)[, selector], handler[, args ])
        */
    , one = function () {
        return on.apply(ONE, arguments)
      }

      /**
        * fire(element, eventType(s)[, args ])
        *
        * The optional 'args' argument must be an array, if no 'args' argument is provided
        * then we can use the browser's DOM event system, otherwise we trigger handlers manually
        */
    , fire = function (element, type, args) {
        var types = str2arr(type)
          , i, j, l, names, handlers

        for (i = types.length; i--;) {
          type = types[i].replace(nameRegex, '')
          if (names = types[i].replace(namespaceRegex, '')) names = str2arr(names, '.')
          if (!names && !args && element[eventSupport]) {
            fireListener(nativeEvents[type], type, element)
          } else {
            // non-native event, either because of a namespace, arguments or a non DOM element
            // iterate over all listeners and manually 'fire'
            handlers = registry.get(element, type, null, false)
            args = [false].concat(args)
            for (j = 0, l = handlers.length; j < l; j++) {
              if (handlers[j].inNamespaces(names)) {
                handlers[j].handler.apply(element, args)
              }
            }
          }
        }
        return element
      }

      /**
        * clone(dstElement, srcElement[, eventType ])
        *
        * TODO: perhaps for consistency we should allow the same flexibility in type specifiers?
        */
    , clone = function (element, from, type) {
        var handlers = registry.get(from, type, null, false)
          , l = handlers.length
          , i = 0
          , args, beanDel

        for (; i < l; i++) {
          if (handlers[i].original) {
            args = [ element, handlers[i].type ]
            if (beanDel = handlers[i].handler.__beanDel) args.push(beanDel.selector)
            args.push(handlers[i].original)
            on.apply(null, args)
          }
        }
        return element
      }

    , bean = {
          on                : on
        , add               : add
        , one               : one
        , off               : off
        , remove            : off
        , clone             : clone
        , fire              : fire
        , Event             : Event
        , setSelectorEngine : setSelectorEngine
        , noConflict        : function () {
            context[name] = old
            return this
          }
      }

  // for IE, clean up on unload to avoid leaks
  if (win.attachEvent) {
    var cleanup = function () {
      var i, entries = registry.entries()
      for (i in entries) {
        if (entries[i].type && entries[i].type !== 'unload') off(entries[i].element, entries[i].type)
      }
      win.detachEvent('onunload', cleanup)
      win.CollectGarbage && win.CollectGarbage()
    }
    win.attachEvent('onunload', cleanup)
  }

  // initialize selector engine to internal default (qSA or throw Error)
  setSelectorEngine()

  return bean
});