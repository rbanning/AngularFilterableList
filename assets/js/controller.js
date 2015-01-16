angular.module("LumaApp")
    .controller("mainCtrl" ,["$scope" ,"dataService" , function($scope ,dataService){

        var data = {
            _raw: {},
            exists: function(name) {
                return typeof(data._raw[name]) !== "undefined";
            },
            get: function(name) {
                var ret = [],
                    raw = data._raw[name];
                if (raw) {
                    for (var i=0; i < raw.length; i++) {
                        ret.push(raw[i]);   //todo: ensure this is not by reference
                    }
                }
                return ret;
            },
            set: function(name, arr) {
                data._raw[name] = arr;
            }
        };
        var itemContains = function(haystack, needle) {
            //NOT CASE SENSITIVE
            needle = needle.toLowerCase();
            var ret = false;


            if (typeof(haystack) === 'string' || typeof(haystack) === 'number') {
                ret = haystack.toString().toLowerCase().indexOf(needle) > -1;
            } else if (typeof(haystack) === 'object') {
                var keys = Object.getOwnPropertyNames(haystack);
                for (var i=0; i<keys.length && ret === false; i++) {
                    var item = haystack[keys[i]];
                    //todo: handle non-string properties

                    if (typeof(item) === 'string' || typeof(item) === 'number') {
                        ret = itemContains(item, needle);
                    }
                }
            }

            return ret;
        };

        dataService.get({ action: "colors" })
            .success(function(result){
                data.set("colors", result);
                $scope.colors = data.get("colors"); //gets a copy of the dataset
            });
        dataService.get({ action: "courses" })
            .success(function(result){
                data.set("courses", result);
                $scope.courses = data.get("courses");
            });


        $scope.filterData = function(e, name) {
            var element = $(e.target);
            if (element && element.length && data.exists(name)) {
                var dataset = data.get(name);

                if (e.keyCode == 27) {
                    element.val(''); //clear
                    $scope[name] = dataset;
                } else {
                    var ret = [],
                        lookingFor = element.val();
                    $scope[name] = $.grep(dataset, function(item) {
                        return itemContains(item, lookingFor);
                    });
                }
            };
        }
    }]);