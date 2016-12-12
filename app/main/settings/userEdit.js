(function () {
    'use strict'
    angular.module('beacon').controller('userEdit', userEdit);

    userEdit.$inject = ['settingsService', '$stateParams', '$scope', '$state'];

    function userEdit(settingsService, $stateParams, $scope, $state) {
        var vm = {
            init: init,
            index: -1,
            users: [],
            user: {},
            datacenters: [],
            userSave: userSave
        };

        init();

        return vm;

        function init() {
            vm.users = $scope.$parent.vm.users;
            vm.datacenters = $scope.$parent.vm.datacenters;
            vm.user = _.findWhere(vm.users, { id: parseInt($stateParams.id) });
            vm.index = vm.users.indexOf(vm.user);
            vm.user = angular.copy(vm.user);
            $scope.array = vm.user.data_center_permissions;
        }
        function userSave(form) {
            vm.user.data_center_permissions = $scope.array;
            if (form.$valid) {
                settingsService.updateUser(vm.user).then(function (res) {
                    vm.users.splice(vm.index, 1, res.data);
                    $state.go('^');
                });
            }
            form.$submitted = true;
        }
    }


    angular.module('beacon').directive("checkboxGroup", function () {
        return {
            restrict: "A",
            link: function(scope, elem, attrs) {
                // Determine initial checked boxes
                if (scope.array.indexOf(scope.dc.id) !== -1) {
                    elem[0].checked = true;
                }

                // Update array on click
                elem.bind('click', function() {
                    var index = scope.array.indexOf(scope.dc.id);
                    // Add if checked
                    if (elem[0].checked) {
                        if (index === -1) scope.array.push(scope.dc.id);
                    }
                        // Remove if unchecked
                    else {
                        if (index !== -1) scope.array.splice(index, 1);
                    }
                    // Sort and update DOM display
                    scope.$apply(scope.array.sort(function(a, b) {
                        return a - b
                    }));
                });
            }
        }
    });
})();

