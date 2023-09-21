/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 310:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Link: () => (/* binding */ Link),
/* harmony export */   Route: () => (/* binding */ Route),
/* harmony export */   Router: () => (/* binding */ Router),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   exec: () => (/* binding */ exec),
/* harmony export */   getCurrentUrl: () => (/* binding */ getCurrentUrl),
/* harmony export */   route: () => (/* binding */ route),
/* harmony export */   subscribers: () => (/* binding */ subscribers)
/* harmony export */ });
/* harmony import */ var preact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(210);
/* harmony import */ var preact__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(preact__WEBPACK_IMPORTED_MODULE_0__);

var EMPTY$1 = {};
function assign(obj, props) {
  // eslint-disable-next-line guard-for-in
  for (var i in props) {
    obj[i] = props[i];
  }
  return obj;
}
function exec(url, route, opts) {
  var reg = /(?:\?([^#]*))?(#.*)?$/,
    c = url.match(reg),
    matches = {},
    ret;
  if (c && c[1]) {
    var p = c[1].split('&');
    for (var i = 0; i < p.length; i++) {
      var r = p[i].split('=');
      matches[decodeURIComponent(r[0])] = decodeURIComponent(r.slice(1).join('='));
    }
  }
  url = segmentize(url.replace(reg, ''));
  route = segmentize(route || '');
  var max = Math.max(url.length, route.length);
  for (var i$1 = 0; i$1 < max; i$1++) {
    if (route[i$1] && route[i$1].charAt(0) === ':') {
      var param = route[i$1].replace(/(^:|[+*?]+$)/g, ''),
        flags = (route[i$1].match(/[+*?]+$/) || EMPTY$1)[0] || '',
        plus = ~flags.indexOf('+'),
        star = ~flags.indexOf('*'),
        val = url[i$1] || '';
      if (!val && !star && (flags.indexOf('?') < 0 || plus)) {
        ret = false;
        break;
      }
      matches[param] = decodeURIComponent(val);
      if (plus || star) {
        matches[param] = url.slice(i$1).map(decodeURIComponent).join('/');
        break;
      }
    } else if (route[i$1] !== url[i$1]) {
      ret = false;
      break;
    }
  }
  if (opts.default !== true && ret === false) {
    return false;
  }
  return matches;
}
function pathRankSort(a, b) {
  return a.rank < b.rank ? 1 : a.rank > b.rank ? -1 : a.index - b.index;
}

// filter out VNodes without attributes (which are unrankeable), and add `index`/`rank` properties to be used in sorting.
function prepareVNodeForRanking(vnode, index) {
  vnode.index = index;
  vnode.rank = rankChild(vnode);
  return vnode.props;
}
function segmentize(url) {
  return url.replace(/(^\/+|\/+$)/g, '').split('/');
}
function rankSegment(segment) {
  return segment.charAt(0) == ':' ? 1 + '*+?'.indexOf(segment.charAt(segment.length - 1)) || 4 : 5;
}
function rank(path) {
  return segmentize(path).map(rankSegment).join('');
}
function rankChild(vnode) {
  return vnode.props.default ? 0 : rank(vnode.props.path);
}
var customHistory = null;
var ROUTERS = [];
var subscribers = [];
var EMPTY = {};
function setUrl(url, type) {
  if (type === void 0) type = 'push';
  if (customHistory && customHistory[type]) {
    customHistory[type](url);
  } else if (typeof history !== 'undefined' && history[type + 'State']) {
    history[type + 'State'](null, null, url);
  }
}
function getCurrentUrl() {
  var url;
  if (customHistory && customHistory.location) {
    url = customHistory.location;
  } else if (customHistory && customHistory.getCurrentLocation) {
    url = customHistory.getCurrentLocation();
  } else {
    url = typeof location !== 'undefined' ? location : EMPTY;
  }
  return "" + (url.pathname || '') + (url.search || '');
}
function route(url, replace) {
  if (replace === void 0) replace = false;
  if (typeof url !== 'string' && url.url) {
    replace = url.replace;
    url = url.url;
  }

  // only push URL into history if we can handle it
  if (canRoute(url)) {
    setUrl(url, replace ? 'replace' : 'push');
  }
  return routeTo(url);
}

/** Check if the given URL can be handled by any router instances. */
function canRoute(url) {
  for (var i = ROUTERS.length; i--;) {
    if (ROUTERS[i].canRoute(url)) {
      return true;
    }
  }
  return false;
}

/** Tell all router instances to handle the given URL.  */
function routeTo(url) {
  var didRoute = false;
  for (var i = 0; i < ROUTERS.length; i++) {
    if (ROUTERS[i].routeTo(url) === true) {
      didRoute = true;
    }
  }
  for (var i$1 = subscribers.length; i$1--;) {
    subscribers[i$1](url);
  }
  return didRoute;
}
function routeFromLink(node) {
  // only valid elements
  if (!node || !node.getAttribute) {
    return;
  }
  var href = node.getAttribute('href'),
    target = node.getAttribute('target');

  // ignore links with targets and non-path URLs
  if (!href || !href.match(/^\//g) || target && !target.match(/^_?self$/i)) {
    return;
  }

  // attempt to route, if no match simply cede control to browser
  return route(href);
}
function handleLinkClick(e) {
  if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || e.button !== 0) {
    return;
  }
  routeFromLink(e.currentTarget || e.target || this);
  return prevent(e);
}
function prevent(e) {
  if (e) {
    if (e.stopImmediatePropagation) {
      e.stopImmediatePropagation();
    }
    if (e.stopPropagation) {
      e.stopPropagation();
    }
    e.preventDefault();
  }
  return false;
}
function delegateLinkHandler(e) {
  // ignore events the browser takes care of already:
  if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || e.button !== 0) {
    return;
  }
  var t = e.target;
  do {
    if (String(t.nodeName).toUpperCase() === 'A' && t.getAttribute('href')) {
      if (t.hasAttribute('native')) {
        return;
      }
      // if link is handled by the router, prevent browser defaults
      if (routeFromLink(t)) {
        return prevent(e);
      }
    }
  } while (t = t.parentNode);
}
var eventListenersInitialized = false;
function initEventListeners() {
  if (eventListenersInitialized) {
    return;
  }
  if (typeof addEventListener === 'function') {
    if (!customHistory) {
      addEventListener('popstate', function () {
        routeTo(getCurrentUrl());
      });
    }
    addEventListener('click', delegateLinkHandler);
  }
  eventListenersInitialized = true;
}
var Router = function (Component$$1) {
  function Router(props) {
    Component$$1.call(this, props);
    if (props.history) {
      customHistory = props.history;
    }
    this.state = {
      url: props.url || getCurrentUrl()
    };
    initEventListeners();
  }
  if (Component$$1) Router.__proto__ = Component$$1;
  Router.prototype = Object.create(Component$$1 && Component$$1.prototype);
  Router.prototype.constructor = Router;
  Router.prototype.shouldComponentUpdate = function shouldComponentUpdate(props) {
    if (props.static !== true) {
      return true;
    }
    return props.url !== this.props.url || props.onChange !== this.props.onChange;
  };

  /** Check if the given URL can be matched against any children */
  Router.prototype.canRoute = function canRoute(url) {
    var children = (0,preact__WEBPACK_IMPORTED_MODULE_0__.toChildArray)(this.props.children);
    return this.getMatchingChildren(children, url, false).length > 0;
  };

  /** Re-render children with a new URL to match against. */
  Router.prototype.routeTo = function routeTo(url) {
    this.setState({
      url: url
    });
    var didRoute = this.canRoute(url);

    // trigger a manual re-route if we're not in the middle of an update:
    if (!this.updating) {
      this.forceUpdate();
    }
    return didRoute;
  };
  Router.prototype.componentWillMount = function componentWillMount() {
    ROUTERS.push(this);
    this.updating = true;
  };
  Router.prototype.componentDidMount = function componentDidMount() {
    var this$1 = this;
    if (customHistory) {
      this.unlisten = customHistory.listen(function (location) {
        this$1.routeTo("" + (location.pathname || '') + (location.search || ''));
      });
    }
    this.updating = false;
  };
  Router.prototype.componentWillUnmount = function componentWillUnmount() {
    if (typeof this.unlisten === 'function') {
      this.unlisten();
    }
    ROUTERS.splice(ROUTERS.indexOf(this), 1);
  };
  Router.prototype.componentWillUpdate = function componentWillUpdate() {
    this.updating = true;
  };
  Router.prototype.componentDidUpdate = function componentDidUpdate() {
    this.updating = false;
  };
  Router.prototype.getMatchingChildren = function getMatchingChildren(children, url, invoke) {
    return children.filter(prepareVNodeForRanking).sort(pathRankSort).map(function (vnode) {
      var matches = exec(url, vnode.props.path, vnode.props);
      if (matches) {
        if (invoke !== false) {
          var newProps = {
            url: url,
            matches: matches
          };
          assign(newProps, matches);
          delete newProps.ref;
          delete newProps.key;
          return (0,preact__WEBPACK_IMPORTED_MODULE_0__.cloneElement)(vnode, newProps);
        }
        return vnode;
      }
    }).filter(Boolean);
  };
  Router.prototype.render = function render(ref, ref$1) {
    var children = ref.children;
    var onChange = ref.onChange;
    var url = ref$1.url;
    var active = this.getMatchingChildren((0,preact__WEBPACK_IMPORTED_MODULE_0__.toChildArray)(children), url, true);
    var current = active[0] || null;
    var previous = this.previousUrl;
    if (url !== previous) {
      this.previousUrl = url;
      if (typeof onChange === 'function') {
        onChange({
          router: this,
          url: url,
          previous: previous,
          active: active,
          current: current
        });
      }
    }
    return current;
  };
  return Router;
}(preact__WEBPACK_IMPORTED_MODULE_0__.Component);
var Link = function (props) {
  return (0,preact__WEBPACK_IMPORTED_MODULE_0__.createElement)('a', assign({
    onClick: handleLinkClick
  }, props));
};
var Route = function (props) {
  return (0,preact__WEBPACK_IMPORTED_MODULE_0__.createElement)(props.component, props);
};
Router.subscribers = subscribers;
Router.getCurrentUrl = getCurrentUrl;
Router.route = route;
Router.Router = Router;
Router.Route = Route;
Router.Link = Link;
Router.exec = exec;

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Router);

/***/ }),

/***/ 927:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

var __webpack_unused_export__;


__webpack_unused_export__ = ({
  value: true
});
exports.rU = __webpack_unused_export__ = undefined;
var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];
    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }
  return target;
};
var _preact = __webpack_require__(210);
var _preactRouter = __webpack_require__(310);
function _objectWithoutProperties(obj, keys) {
  var target = {};
  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }
  return target;
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return call && (typeof call === "object" || typeof call === "function") ? call : self;
}
function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}
var Match = __webpack_unused_export__ = function (_Component) {
  _inherits(Match, _Component);
  function Match() {
    var _temp, _this, _ret;
    _classCallCheck(this, Match);
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    return _ret = (_temp = (_this = _possibleConstructorReturn(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.update = function (url) {
      _this.nextUrl = url;
      _this.setState({});
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }
  Match.prototype.componentDidMount = function componentDidMount() {
    _preactRouter.subscribers.push(this.update);
  };
  Match.prototype.componentWillUnmount = function componentWillUnmount() {
    _preactRouter.subscribers.splice(_preactRouter.subscribers.indexOf(this.update) >>> 0, 1);
  };
  Match.prototype.render = function render(props) {
    var url = this.nextUrl || (0, _preactRouter.getCurrentUrl)(),
      path = url.replace(/\?.+$/, '');
    this.nextUrl = null;
    return props.children({
      url: url,
      path: path,
      matches: (0, _preactRouter.exec)(path, props.path, {}) !== false
    });
  };
  return Match;
}(_preact.Component);
var Link = function Link(_ref) {
  var activeClassName = _ref.activeClassName,
    path = _ref.path,
    props = _objectWithoutProperties(_ref, ['activeClassName', 'path']);
  return (0, _preact.h)(Match, {
    path: path || props.href
  }, function (_ref2) {
    var matches = _ref2.matches;
    return (0, _preact.h)(_preactRouter.Link, _extends({}, props, {
      'class': [props.class || props.className, matches && activeClassName].filter(Boolean).join(' ')
    }));
  });
};
exports.rU = Link;
__webpack_unused_export__ = Match;
Match.Link = Link;

/***/ }),

/***/ 210:
/***/ ((module) => {

module.exports = require("preact");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ App)
});

// EXTERNAL MODULE: ../node_modules/preact-router/dist/preact-router.es.js
var preact_router_es = __webpack_require__(310);
// EXTERNAL MODULE: ../node_modules/preact-router/match.js
var match = __webpack_require__(927);
;// CONCATENATED MODULE: ./components/header/style.module.css
// extracted by mini-css-extract-plugin
/* harmony default export */ const style_module = ({"header":"header__wTXVc","logo":"logo__W6bmZ","active":"active__SWT8b"});
;// CONCATENATED MODULE: ./manifest.json
const manifest_namespaceObject = JSON.parse('{"$Q":"/react-portfolio/"}');
;// CONCATENATED MODULE: ./absPath.ts

function absPath_link(oldPath) {
  console.log(manifest_namespaceObject.$Q + oldPath);
  return manifest_namespaceObject.$Q + oldPath;
}
// EXTERNAL MODULE: external "preact"
var external_preact_ = __webpack_require__(210);
;// CONCATENATED MODULE: ../node_modules/preact/jsx-runtime/dist/jsxRuntime.mjs


var _ = 0;
function o(o, e, n, t, f, l) {
  var s,
    u,
    a = {};
  for (u in e) "ref" == u ? s = e[u] : a[u] = e[u];
  var i = {
    type: o,
    props: a,
    key: n,
    ref: s,
    __k: null,
    __: null,
    __b: 0,
    __e: null,
    __d: void 0,
    __c: null,
    __h: null,
    constructor: void 0,
    __v: --_,
    __source: f,
    __self: l
  };
  if ("function" == typeof o && (s = o.defaultProps)) for (u in s) void 0 === a[u] && (a[u] = s[u]);
  return external_preact_.options.vnode && external_preact_.options.vnode(i), i;
}

;// CONCATENATED MODULE: ./components/header/index.tsx




// TODO: use tech from prerender to auto-populate this


function Header() {
  return o("header", {
    class: style_module.header,
    children: [o("a", {
      href: "/",
      class: style_module.logo,
      children: [o("img", {
        src: "../../assets/preact-logo-inverse.svg",
        alt: "Preact Logo",
        height: "32",
        width: "32"
      }), o("h1", {
        children: ["Fast's Code Creations ", o("b", {
          children: o("i", {
            children: "2"
          })
        })]
      })]
    }), o("nav", {
      children: o(match/* Link */.rU, {
        activeClassName: style_module.active,
        href: absPath_link(""),
        children: "Home"
      })
    })]
  });
}
;// CONCATENATED MODULE: ./routes/style.module.css
// extracted by mini-css-extract-plugin
/* harmony default export */ const routes_style_module = ({"home":"home__tpNym","resource":"resource__P7LUF"});
;// CONCATENATED MODULE: ./routes/index.tsx



const pageHeader = {
  title: "Home"
};
function Home() {
  return o("div", {
    class: routes_style_module.home,
    children: [o("h1", {
      children: "Get Started Building PWAs with Preact-CLI"
    }), o("section", {
      children: [o(Resource, {
        title: "Learn Preact",
        description: "If you're new to Preact, try the interactive tutorial to learn important concepts",
        link: "https://preactjs.com/tutorial/"
      }), o(Resource, {
        title: "Differences to React",
        description: "If you're coming from React, check out our docs for where Preact differs",
        link: "https://preactjs.com/guide/v10/differences-to-react"
      }), o(Resource, {
        title: "Learn Preact-CLI",
        description: "To learn more about Preact-CLI, read through the ReadMe & Wiki",
        link: "https://github.com/preactjs/preact-cli#preact-cli--"
      })]
    })]
  });
}
function Resource(props) {
  return o("a", {
    href: props.link,
    class: routes_style_module.resource,
    children: [o("h2", {
      children: props.title
    }), o("p", {
      children: props.description
    })]
  });
}
;// CONCATENATED MODULE: ./style/index.css
// extracted by mini-css-extract-plugin

;// CONCATENATED MODULE: ./index.tsx



// Code-splitting is automated for `routes` directory




// TODO: use tech from prerender to auto-populate this


function App() {
  return o("div", {
    id: "app",
    children: [o(Header, {}), o("main", {
      children: o(preact_router_es.Router, {
        children: o(preact_router_es.Route, {
          path: absPath_link(""),
          component: Home
        })
      })
    })]
  });
}
})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=ssr-bundle.js.map