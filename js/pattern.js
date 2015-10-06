 (function (w, undefined) {
     /* global log4javascript */
     if (!w) {
         return false;
     }

     var d = w.document;

     // 'production' or 'development' or 'test' or 'default'
     var ENV = 'production';
     var log4js = log4javascript;
     var defaultLogLevel = log4js.Level.ALL;
     switch (ENV) {
     case 'production':
         defaultLogLevel = log4js.Level.ERROR;
         break;
     case 'test':
         defaultLogLevel = log4js.Level.OFF;
         break;
     case 'development':
         defaultLogLevel = log4js.Level.DEBUG;
         break;
     default:
         defaultLogLevel = log4js.Level.ALL;
     }
     var consoleAppender = new log4js.BrowserConsoleAppender();

     /**
      * Create a logger
      * @param  {String} name  Name of the logger
      * @param  {log4javascript.Level} level Level threshold for logging
      * @return {log4javascript.Logger}       A Logger object
      */
     function createLogger(name, level) {
         var logger = log4js.getLogger(name);
         level = level || defaultLogLevel;
         logger.setLevel(level);
         logger.addAppender(consoleAppender);
         return logger;
     }

     var logger = createLogger();
     var genPatternLogger = createLogger('getPattern');
     var randomizeLogger = createLogger('randomize', log4js.Level.OFF);
     var genRandomColorLogger = createLogger('genRandomColor', log4js.Level.OFF);
     var getPatternContainersLogger = createLogger('getPatternContainers');
     var addPatternLogger = createLogger('addPattern');
     var createPatternLogger = createLogger('createPattern');
     var getDataAttribsLogger = createLogger('getDataAttribs');

     function genColorPattern(numberOfColors, colorType) {
         var pattern = [],
             contrast = false;
         colorType = (colorType || '').trim().toUpperCase();
         switch (colorType) {
         case 'DARK':
             // falls through
         case 'LIGHT':
             contrast = false;
             break;
         case 'MIXED':
             // falls through
         default:
             contrast = true;
             colorType = 'DARK';
         }
         while (numberOfColors--) {
             if (contrast) {
                 colorType = colorType === 'DARK' ? 'LIGHT' : 'DARK';
             }
             pattern.push(genRandomColor(colorType));
         }

         genPatternLogger.debug('Generated Color Pattern:', pattern);
         return pattern;
     }

     /**
      * Create a randome number between min (inclusive) and max (inclusive) value.
      * @param  {Number} min The minimum value (inclusive)
      * @param  {Number} max The maximum value (inclusive)
      * @return {Number}     Number between min and max
      */
     function randomize(min, max) {
         min = min || 0;
         max = max || 255;
         var rand = Math.floor(Math.random() * (max - min + 1)) + min;
         randomizeLogger.debug('Random Number:', rand);
         return rand;
     }

     /**
      * Generate random color.
      *
      * @return {Array} Generated RGB color array
      */
     function genRandomColor(colorType) {

         var min = 0,
             max = 255;
         colorType = (colorType || '').trim().toUpperCase();
         switch (colorType) {
         case 'DARK':
             min = 0;
             max = Math.floor(256 / 2);
             break;
         case 'MEDIUM':
             min = Math.floor(256 / 4);
             max = Math.floor(256 * 3 / 4);
             break;
         case 'LIGHT':
             min = Math.floor(256 / 2);
             max = 255;
         }

         var red = randomize(min, max),
             green = randomize(min, max),
             blue = randomize(min, max);

         var color = [red, green, blue];
         genRandomColorLogger.debug('Random Color:', color);
         return color;
     }

     /**
      * Find all pattern containers
      * @return {NodeList} All pattern containers
      */
     function getPatternContainers() {
         // All pattern containers (in NodeList)
         var patternContainers = d.querySelectorAll('[data-pattern].pattern');

         getPatternContainersLogger.debug('All Pattern Containers:', patternContainers);
         return patternContainers;
     }

     /**
      * Get data attributes with the "prefix"
      * @param  {NodeElement} element Element from which to get the data- attribute values
      * @param  {String} prefix    The prefix to look for
      * @return {Object}           A data object containing the data attribute property names and values
      */
     function getDataAttribs(element, prefix) {
         var data = {};
         if (!element.hasAttributes()) {
             return data;
         }
         var attribs = [].slice.apply(element.attributes);

         var dataPrefixRegex = new RegExp('^data-' + prefix + '-?', 'i');
         var dataPrefixAttribs = attribs.filter(function (attrib) {
             return dataPrefixRegex.test(attrib.name);
         });

         // No data-prefix is found
         if (dataPrefixAttribs.length === 0) {
             return data;
         }

         getDataAttribsLogger.debug('dataPrefixAttribs:', dataPrefixAttribs);
         // TODO: fill the data object with property names and values
         dataPrefixAttribs.forEach(function (attrib) {
             // remove the data- prefix from attribute name
             var name = attrib.name.replace(/^data-/i, '').toLowerCase();
             data[name] = attrib.value;
         });

         getDataAttribsLogger.debug('Data:', data);
         return data;
     }

     /**
      * Add a pattern inside the pattern container.
      */
     function addPattern() {
         var patternContainers = [].slice.apply(getPatternContainers());
         patternContainers.forEach(function (container) {
             addPatternLogger.debug('Pattern Container:', container);

             // pre-fill default options
             var options = {
                 'pattern': 10,
                 'pattern-width': 10,
                 'pattern-animation': 'outiside-in',
                 'pattern-controller': 'default',
                 'pattern-contrast': ''
             };
             options_ = getDataAttribs(container, 'pattern');
             Object.keys(options_).forEach(function (key) {
                 options[key] = options_[key];
             });
             // TODO: Add additional options

             // TODO: generate pattern
             var colorPattern = genColorPattern(options.pattern, options['pattern-contrast']);
             var patternFragment = createPattern(colorPattern, options, container);
             container.appendChild(patternFragment);
         });
     }

     /**
      * Convert rgb color value to hex value
      * @param  {Array} rgb Array of red, green and blue value
      * @return {String}     Hex value
      */
     function rgbToHex(rgb) {
         var rgbToHexLogger = createLogger('rgbToHex');
         var hex = '#';

         var red = rgb[0];
         var green = rgb[1];
         var blue = rgb[2];

         // TODO: Convert rgb to hex

         rgbToHexLogger.debug('HEX:', hex);
         return hex;
     }

     function rgbString(rgb) {
         return 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
     }

     /**
      * Create pattern DOM elements
      * @param  {Array} colorPattern A set of color patterns to use
      * @param  {Object} options      Options object containing configuration options to create the pattern
      * @return {DocumentFragment}              The document fragment object in which the pattern elements are created
      */
     function createPattern(colorPattern, options, container) {
         var patternFragment = d.createDocumentFragment();
         // TODO: Create and Append all pattern divs to patternFragment
         var nPatterns = Number(options.pattern);
         // FIXME:
         var containerWidth = container.offsetWidth;
         var containerHeight = container.offsetHeight;
         var width = containerWidth,
             height = containerHeight,
             top = 0,
             left = 0;
         for (var i = 0; i < nPatterns; i++) {
             if (i % 2 === 0) { // even
                 div = d.createElement('div');
                 div.style.backgroundColor = rgbString(colorPattern[i]);
                 div.style.width = width + 'px';
                 div.style.height = height + 'px';
                 div.style.top = top + 'px';
                 div.style.left = left + 'px';
                 patternFragment.appendChild(div);
             }
             else { // odd
                 div.style.border = options['pattern-width'] + 'px' + ' solid ' + rgbString(colorPattern[i]);
             }

             width -= 2 * options['pattern-width'];
             height = width;
             top += options['pattern-width'];
             left = top;
         }

         createPatternLogger.debug(patternFragment);
         return patternFragment;
     }

     function init() {
         logger.info('Pattern.js Library Initiated');
         addPattern();

         return true;
     }

     return init();
 })(this.window);
