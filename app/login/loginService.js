
(function () {
    'use strict'

    angular.module('beacon').factory('loginService', loginService);
    loginService.$inject = ['$http'];

    function loginService($http) {

        var service = {
            login: login,
            logout: logout
        }
console.log('1.0');
console.log(service);

        return service;

        function login(user) {
console.log('1.1');
console.log(user);
console.log($http);

            var params = {
                'user[username]': user.username,
                'user[password]': user.password
            };

            var req = {
                method: 'POST',
                url: 'users/sessions',
                data: $.param(params),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }
console.log('1.2');
console.log(req.data);
console.log('1.3');
            return $http(req);
        }


        function logout()
        {
            return $http.delete('users/sessions');
        }
    };
})();
