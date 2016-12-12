(function () {
    'use strict';

    angular.module('beacon').config(appConfig);

    appConfig.$inject = ['$httpProvider', '$breadcrumbProvider', '$translateProvider'];

    function appConfig($httpProvider, $breadcrumbProvider, $translateProvider) {
        $breadcrumbProvider.setOptions({
            prefixStateName: '',
            template: 'bootstrap2'
        });

        $httpProvider.interceptors.push('apiInterceptor');

        $translateProvider.preferredLanguage('en');
        $translateProvider.useLoader('yamlLoader');
        $translateProvider.usePostCompiling(true);
        $translateProvider.useSanitizeValueStrategy(null);
        $translateProvider.useMissingTranslationHandler('yamlMissingHandler');

        delete $httpProvider.defaults.headers.common['X-Requested-With'];
        delete $httpProvider.defaults.headers.common['Origin'];
        delete $httpProvider.defaults.headers.common['Referer'];
    }

    angular.module('beacon').run(appRun);
    appRun.$inject = ['$templateCache', '$rootScope', '$state'];
    function appRun($templateCache, $rootScope, $state) {
        $templateCache.put('app/tmpls/ph-no', '<a href="tel:{{phoneNumber}}"><i ng-if="phoneNumber" class="fa fa-phone"></i> {{phoneNumber}}</a>');
        $templateCache.put('app/tmpls/icon-ph-no', '<a href="tel:{{phoneNumber}}">'
                                                    + '<div class="form-group">'
                                                        + '<div class="input-group">'
                                                            + '<div class="input-group-addon info input-group-left"><i class="fa fa-phone"></i></div>'
                                                            + '<span type="text" class="form-control input-sm input-group-right">{{phoneNumber}}</span>'
                                                        + '</div>'
                                                    + '</div>'
                                                + '</a>');



        $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
            $state.go('login');
        });
    }

    angular.module('beacon').factory('yamlLoader', function ($q, $http) {
        return function (options) {
            var deferred = $q.defer();

            $http({ method: "GET", url: 'app/i18n/' + options.key + ".yml" }).success(function (data) {
                data = data.replace(/\%\{\w+\}/g, function (match) {
                    return match.replace(/\}$/, '}}').replace(/^\%\{/, '{{')
                });
                data = YAML.eval(data);
                deferred.resolve(data[options.key]);
            });

            //YAML.fromURL(filename, function (data) {
            //    var errors = YAML.getErrors();
            //    deferred.resolve(data[options.key]);
            //});
            return deferred.promise;
        };
    });

    // define custom handler
    angular.module('beacon').factory('yamlMissingHandler', function () {
        // has to return a function which gets a tranlation ID
        return function (key) {
            return key.split('.').pop();
        };
    });

    angular.module('beacon').value('$ws', {});

})();