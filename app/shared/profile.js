
(function () {
    'use strict'

    angular.module('beacon').factory('profile', profile);
    profile.$inject = ['loginService', '$cookies', '$cookieStore', '$window', '$q', '$translate'];

    function profile(loginService, $cookies, $cookieStore, $window, $q, $translate) {

        var isAuthenticated = false, dfrdLogin = $q.defer(), dfrdLogout = $q.defer(), dfrdLoginState, dfrdLogoutState;

        var vm = {
            isAuthenticated: isAuthenticated,
            userInfo: {},
            login: login,
            logout: logout,
            isLoggedin: isLoggedin,
            dfrdLogin: dfrdLogin,
            dfrdLogout: dfrdLogout
        };

        init();

        return vm;

        function populate(data) {
            angular.extend(vm.userInfo, data);
            vm.isAuthenticated = false;
            if (data.locale) {
                $translate.use(data.locale);
            }
        };

        function init() {
            var user = angular.fromJson($window.localStorage.getItem('user'));
            if (user) {
                populate(user)
                vm.isAuthenticated = true;
                appendTokenValue();
            }
        }

        function appendTokenValue() {
            if (vm.isAuthenticated) {
                window.authToken = 'sid=' + vm.userInfo.sid + '&auth_token=' + vm.userInfo.auth_token;
            }
            else {
                delete window.authToken;
            }
        }

        function login(userName, password, rememberMe) {
            var user = { 'username': userName, 'password': password };
            delete window.authToken;

            if (dfrdLoginState === undefined)// multiple resolves
                dfrdLoginState = angular.copy(dfrdLogin.promise.$$state);
            angular.extend(dfrdLogin.promise.$$state, dfrdLoginState);

            //if (!isLoggedin()) {
            loginService.login(user).then(function (res) {
                var userJson = angular.toJson(angular.extend(user, res.data));
                populate(res.data)
                vm.isAuthenticated = true;

                vm.dfrdLogin.resolve({});

                $window.localStorage.setItem('user', userJson);
                if (rememberMe) {
                    $cookies.user = userJson;
                    $cookieStore.put('user', userJson);
                }
                appendTokenValue();
            }, function (res) {
                vm.dfrdLogin.reject({});
            });
            //}
            return vm.dfrdLogin.promise;
        }

        function isLoggedin() {
            return vm.isAuthenticated
        }

        function logout() {
            var loggingOut = function () {
                populate({});
                appendTokenValue();
                $window.localStorage.removeItem('user');

                if (dfrdLogoutState === undefined)// multiple resolves
                    dfrdLogoutState = angular.copy(dfrdLogout.promise.$$state);
                angular.extend(dfrdLogout.promise.$$state, dfrdLogoutState);
                vm.dfrdLogout.resolve({});
            };

            loginService.logout().then(loggingOut, loggingOut);
            return vm.dfrdLogout.promise;
        };

    };
})();
