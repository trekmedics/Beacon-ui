(function () {
    'use strict'
    angular.module('beacon').controller('firstResponderCtrl', firstResponderCtrl);

    firstResponderCtrl.$inject = ['firstRespondersService', '$scope'];

    function firstResponderCtrl(firstRespondersService, $scope) {
        var vm = {
            init: init,
            firstResponders: [],
            firstResponder: { transportation_mode: 0 },
            createFirstResponder: createFirstResponder,
            checkFr: checkFr
        };

        init();

        return vm;

        function init() {
            loadFrs();
            $scope.$on('frs.change', function () {
                loadFrs();
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            });
        }

        function loadFrs() {
            vm.firstResponders = firstRespondersService.firstResponders;
        }
        function createFirstResponder(form) {
            if (form.$valid) {
                firstRespondersService.createFirstResponder(vm.firstResponder).then(function () {
                    vm.firstResponder = {};
                    form.$submitted = false;
                    form.$setUntouched();
                });
            }
            form.$submitted = true;
        }
        function checkFr(ctrl)
        {
            var exist = _.findWhere(firstRespondersService.firstResponders, { phone_number: vm.firstResponder.phone_number });
            if (exist) {
                ctrl.$setValidity('duplicate', false);
            }
            else {
                ctrl.$setValidity('duplicate', true);
            }
        }
    }
})();

