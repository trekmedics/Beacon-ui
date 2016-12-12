(function () {
    'use strict'
    angular.module('beacon').controller('login', login);

    login.$inject = ['$state', 'profile', '$cookies', '$cookieStore'];

    function login($state, profile, $cookies, $cookieStore) {
        var vm = {
            init: init,
            login: login,
            showError:false
        };

console.log('0.0');
console.log(vm);
        init();

        return vm;

        function init() {
            var user = $cookies.user || $cookieStore.get('user')
console.log('0.1');
console.log(vm);

            if (user) {
                user = angular.fromJson(user);
                vm.userName = user.username;
                vm.password = user.password;
console.log('0.2');
console.log(vm);
            }

            if (profile.isLoggedin())
            {
                $state.go('main.dashboard');
console.log('0.3');
console.log(vm);
            }
        }

        function login(form)
        {
console.log('0.4');
console.log(vm);
            if (form.$valid) {
                if (vm.userName && vm.password) {
                    profile.login(vm.userName, vm.password, vm.rememberMe).then(function () {
                        $state.go('main.dashboard');
                        form.$submitted = false;
                        form.$setUntouched();
                    }, function () {
                        vm.showError = true;
                    });
console.log('0.5');
console.log(vm);
                }
            }
console.log('0.6');
console.log(vm);
            form.$submitted = true;
        }
    }
})();
