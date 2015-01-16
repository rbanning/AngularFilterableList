angular.module("LumaApp")
    .factory("dataService" ,["$http" ,function($http){

        var appRoot = function() {
            var href = window.location.href;
            //remove index.html
            var q = href.indexOf("index.html");
            if (q > 0) { href = href.substr(0, q); }
            return href;
        };
        var dataPath = function(filename) {
            return appRoot() + 'assets/data/' + filename;
        }

        return {
            get: function(options) {
                options = typeof(options) === 'string' ? { action: options } : options;

                url = dataPath(options.action + '.json');
                return $http.get(url);
            }
        };
    }]);