(function () {
    'use strict'
    angular.module('beacon').controller('userListing', userListing);

    userListing.$inject = ['settingsService', 'dataCenters', 'permissions', 'users'];

    function userListing(settingsService, dataCenters, permissions, users) {
        var vm = {
            init: init,
            users: [],
            newUser: {},
            datacenters: [],
            dataCenterGetById: dataCenterGetById,
            createUser: createUser,
            userRemove: userRemove,
            getRoleNameById: getRoleNameById

        };

        init();

        return vm;

        function init() {
            vm.users = users.data;
            vm.datacenters = dataCenters.datacenters;
        }

        function dataCenterGetById(dataCenterId) {
            return dataCenters.getDatacenter(dataCenterId);
        }


        function getRoleNameById(userRoleId) {
            return permissions.getLocaleRole(userRoleId);
        }

        function createUser(form) {
            if (form.$valid) {
                settingsService.createUser(vm.newUser).then(function (res) {
                    vm.users.unshift(res.data);
                    vm.newUser = {};
                    form.$submitted = false;
                    form.$setUntouched();
                });
            }
            form.$submitted = true;
        }
        function userRemove(user) {
            settingsService.userRemove(user).then(function (res) {
                var index = vm.users.indexOf(user);
                vm.users.splice(index, 1);
            });
        }
    }
})();

