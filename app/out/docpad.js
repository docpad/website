// Generated by CoffeeScript 1.6.2
var appPath, balUtil, docpadConfig, extendr, fsUtil, getCategoryName, getContributors, getLabelName, getLinkName, getName, getProjectName, humanize, moment, navigationData, pathUtil, rootPath, sitePath, strUtil, textData, websiteVersion,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

fsUtil = require('fs');

pathUtil = require('path');

moment = require('moment');

strUtil = require('underscore.string');

getContributors = require('getcontributors');

balUtil = require('bal-util');

extendr = require('extendr');

rootPath = __dirname + '/../..';

appPath = __dirname;

sitePath = rootPath + '/site';

textData = balUtil.requireFresh(appPath + '/templateData/text');

navigationData = balUtil.requireFresh(appPath + '/templateData/navigation');

websiteVersion = require(rootPath + '/package.json').version;

getName = function(a, b) {
  var _ref, _ref1;

  if (b === null) {
    return (_ref = textData[b]) != null ? _ref : humanize(b);
  } else {
    return (_ref1 = textData[a][b]) != null ? _ref1 : humanize(b);
  }
};

getProjectName = function(project) {
  return getName('projectNames', project);
};

getCategoryName = function(category) {
  return getName('categoryNames', category);
};

getLinkName = function(link) {
  return getName('linkNames', link);
};

getLabelName = function(label) {
  return getName('labelNames', label);
};

humanize = function(text) {
  if (text == null) {
    text = '';
  }
  return strUtil.humanize(text.replace(/^[\-0-9]+/, '').replace(/\..+/, ''));
};

docpadConfig = {
  rootPath: rootPath,
  outPath: rootPath + '/site/out',
  srcPath: rootPath + '/site/src',
  reloadPaths: [appPath],
  regenerateEvery: 1000 * 60 * 60 * 24,
  templateData: {
    strUtil: strUtil,
    moment: moment,
    text: textData,
    navigation: navigationData,
    site: {
      url: "http://docpad.org",
      title: "DocPad - Streamlined Web Development",
      description: "Empower your website frontends with layouts, meta-data, pre-processors (markdown, jade, coffeescript, etc.), partials, skeletons, file watching, querying, and an amazing plugin system. Use it either standalone, as a build script, or even as a module in a bigger system. Either way, DocPad will streamline your web development process allowing you to craft full-featured websites quicker than ever before.",
      keywords: "bevry, bevryme, balupton, benjamin lupton, docpad, node, node.js, javascript, coffeescript, query engine, queryengine, backbone.js, cson",
      services: {
        facebookLikeButton: {
          applicationId: '266367676718271'
        },
        twitterTweetButton: 'docpad',
        twitterFollowButton: 'docpad',
        disqus: 'docpad',
        ircwebchat: 'docpad',
        gauges: '50dead2bf5a1f541d7000008',
        googleAnalytics: 'UA-35505181-2',
        mixpanel: 'd0f9b33c0ec921350b5419352028577e',
        reinvigorate: '89t63-62ne18262h'
      },
      styles: ["/vendor/ui-lightness/jquery-ui-1.9.2.custom.css", '/vendor/highlight.css', '/vendor/normalize.css', '/vendor/h5bp.css', '/styles/style.css'].map(function(url) {
        return "" + url + "?websiteVersion=" + websiteVersion;
      }),
      scripts: ["/vendor/jquery.js", "/vendor/jquery-ui-1.9.2.custom.js", "/vendor/log.js", "/vendor/jquery.scrollto.js", "/vendor/modernizr.js", "/vendor/history.js", "/scripts/historyjsit.js", "/scripts/bevry.js", "/scripts/script.js"].map(function(url) {
        return "" + url + "?websiteVersion=" + websiteVersion;
      })
    },
    getName: getName,
    getProjectName: getProjectName,
    getCategoryName: getCategoryName,
    getLinkName: getLinkName,
    getLabelName: getLabelName,
    getPreparedTitle: function() {
      if (this.document.pageTitle !== false && this.document.title) {
        return "" + (this.document.pageTitle || this.document.title) + " | " + this.site.title;
      } else if (this.document.pageTitle === false || (this.document.title != null) === false) {
        return this.site.title;
      }
    },
    getPreparedDescription: function() {
      return this.document.description || this.site.description;
    },
    getPreparedKeywords: function() {
      return this.site.keywords.concat(this.document.keywords || []).join(', ');
    },
    getVersion: function(v, places) {
      if (places == null) {
        places = 1;
      }
      return v.split('.').slice(0, places).join('.');
    },
    readFile: function(relativePath) {
      var path, result;

      path = this.document.fullDirPath + '/' + relativePath;
      result = fsUtil.readFileSync(path);
      if (result instanceof Error) {
        throw result;
      } else {
        return result.toString();
      }
    },
    codeFile: function(relativePath, language) {
      var contents;

      if (language == null) {
        language = pathUtil.extname(relativePath).substr(1);
      }
      contents = this.readFile(relativePath);
      return "<pre><code class=\"" + language + "\">" + contents + "</code></pre>";
    }
  },
  collections: {
    docs: function(database) {
      var query, sorting;

      query = {
        relativeOutDirPath: {
          $startsWith: 'docs'
        },
        body: {
          $ne: ""
        }
      };
      sorting = [
        {
          categoryDirectory: 1,
          filename: 1
        }
      ];
      return database.findAllLive(query, sorting).on('add', function(document) {
        var a, category, categoryDirectory, categoryName, editUrl, layout, name, pageTitle, standalone, title, urls;

        a = document.attributes;
        layout = 'doc';
        standalone = true;
        categoryDirectory = pathUtil.basename(pathUtil.dirname(a.fullPath));
        category = categoryDirectory.replace(/^[\-0-9]+/, '');
        categoryName = getCategoryName(category);
        name = a.basename.replace(/^[\-0-9]+/, '');
        urls = ["/docs/" + name, "/docs/" + category + "-" + name, "/docpad/" + name];
        title = "" + (a.title || humanize(name));
        pageTitle = "" + title + " | " + categoryName;
        editUrl = "https://github.com/bevry/docpad-documentation/edit/master/" + a.relativePath.replace('docs/', '');
        return document.setMetaDefaults({
          title: title,
          pageTitle: pageTitle,
          layout: layout,
          categoryDirectory: categoryDirectory,
          category: category,
          categoryName: categoryName,
          url: urls[0],
          standalone: standalone,
          editUrl: editUrl
        }).addUrl(urls);
      });
    },
    pages: function(database) {
      return database.findAllLive({
        relativeOutDirPath: 'pages'
      }, [
        {
          filename: 1
        }
      ]);
    }
  },
  plugins: {
    highlightjs: {
      aliases: {
        stylus: 'css'
      }
    },
    feedr: {
      feeds: {
        latestPackage: {
          url: 'http://docpad.org/latest.json'
        },
        exchange: {
          url: 'http://docpad.org/exchange.json'
        }
      }
    },
    repocloner: {
      repos: [
        {
          name: 'DocPad Documentation',
          path: 'src/documents/docs',
          url: 'https://github.com/bevry/docpad-documentation.git'
        }
      ]
    }
  },
  environments: {
    development: {
      templateData: {
        site: {
          services: {
            gauges: false,
            googleAnalytics: false,
            mixpanel: false,
            reinvigorate: false
          }
        }
      }
    }
  },
  events: {
    extendTemplateData: function(opts, next) {
      var contributors, docpad;

      docpad = this.docpad;
      contributors = {};
      opts.templateData.contributors = [];
      getContributors({
        users: ['bevry', 'docpad'],
        github_client_id: process.env.BEVRY_GITHUB_CLIENT_ID,
        github_client_secret: process.env.BEVRY_GITHUB_CLIENT_ID,
        log: docpad.log,
        next: function(err, contributors) {
          if (err) {
            return next(err);
          }
          opts.templateData.contributors = contributors.filter(function(item) {
            return item.username !== 'balupton';
          });
          return next();
        }
      });
    },
    serverExtend: function(opts) {
      var docpad, express, request, server;

      server = opts.server, express = opts.express;
      docpad = this.docpad;
      request = require('request');
      server.all('/pushover', function(req, res) {
        if (__indexOf.call(docpad.getEnvironments(), 'development') >= 0 || (process.env.BEVRY_PUSHOVER_TOKEN != null) === false) {
          return res.send(200);
        }
        return request({
          url: "https://api.pushover.net/1/messages.json",
          method: "POST",
          form: extendr.extend({
            token: process.env.BEVRY_PUSHOVER_TOKEN,
            user: process.env.BEVRY_PUSHOVER_USER_KEY,
            message: req.query
          }, req.query)
        }, function(_req, _res, body) {
          return res.send(body);
        });
      });
      server.all('/regenerate', function(req, res) {
        var _ref;

        if (((_ref = req.query) != null ? _ref.key : void 0) === process.env.WEBHOOK_KEY) {
          docpad.log('info', 'Regenerating for documentation change');
          docpad.action('generate');
          return res.send(200, 'regenerated');
        } else {
          return res.send(400, 'key is incorrect');
        }
      });
      server.get('/exchange.json', function(req, res) {
        var branch, version;

        branch = 'master';
        version = req.query.version.split('.');
        if (version) {
          if (version[0] === '5') {
            if (version[1] === '3') {
              branch = 'docpad-5.3.x';
            } else {
              branch = 'docpad-5.x';
            }
          } else if (version[0] === '6') {
            branch = 'docpad-6.x';
          }
        }
        return res.redirect(301, "https://raw.github.com/bevry/docpad-extras/" + branch + "/exchange.json");
      });
      server.get(/^\/(plugins|upgrade|install|troubleshoot)\/?$/, function(req, res) {
        var relativeUrl;

        relativeUrl = req.params[0] || '';
        return res.redirect(301, "http://docpad.org/docs/" + relativeUrl);
      });
      server.get(/^\/docpad(?:\/(.*))?$/, function(req, res) {
        var relativeUrl;

        relativeUrl = req.params[0] || '';
        return res.redirect(301, "http://docpad.org/docs/" + relativeUrl);
      });
      server.get(/^\/((?:support|node|joe|query-?engine).*)$/, function(req, res) {
        var relativeUrl;

        relativeUrl = req.params[0] || '';
        return res.redirect(301, "http://bevry.me/" + relativeUrl);
      });
      server.get(/^\/(?:g|github)(?:\/(.*))?$/, function(req, res) {
        var issueQuery;

        issueQuery = req.params[0] || '';
        return res.redirect(301, "https://github.com/bevry/docpad/" + issueQuery);
      });
      server.get(/^\/(?:i|issues)(?:\/(.*))?$/, function(req, res) {
        var issueQuery;

        issueQuery = req.params[0] || '';
        return res.redirect(301, "https://github.com/bevry/docpad/issues/" + issueQuery);
      });
      server.get(/^\/(?:p|plugin)(?:\/(.*))?$/, function(req, res) {
        var plugin;

        plugin = req.params[0] || '';
        return res.redirect(301, "https://github.com/docpad/docpad-plugin-" + plugin);
      });
    }
  }
};

module.exports = docpadConfig;
