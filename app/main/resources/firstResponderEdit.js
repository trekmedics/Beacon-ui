(function () {
    'use strict'
    angular.module('beacon').controller('firstResponderEdit', firstResponderEdit);

    firstResponderEdit.$inject = ['firstRespondersService', 'settingsService', '$stateParams', '$state', '$scope'];

    function firstResponderEdit(firstRespondersService, settingsService, $stateParams, $state, $scope) {
        var vm = {
            init: init,
            firstResponder: {},
            firstResponderSave: firstResponderSave,
            index: -1,
            pVm: $scope.$parent.vm
        }, state = $state;

        init();

        return vm;

        function init() {
            //if (firstRespondersService.firstResponders.length > 0) {
            loadFrs();
            vm.firstResponder = getCloned();           
            $scope.$on('frs.change', function (event, fr) {
                var frId = fr.id;
                if (frId === $stateParams.id) {
                    loadFrs();
                    vm.firstResponder = getCloned();                   
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                }
            });
            
        }
        function loadFrs() {
            vm.firstResponders = firstRespondersService.firstResponders;
        }

        function getCloned()
        {
            var fr = _.findWhere(vm.firstResponders, { id: parseInt($stateParams.id) });
            vm.index = vm.firstResponders.indexOf(fr);
            if (vm.index === -1) {
                state.go('main.resources', { id: 0 });
            }

            return angular.copy(fr);
        }

        function firstResponderSave(form) {
            if (form.$valid) {
                firstRespondersService.updateFirstResponder(vm.firstResponder).then(function (res) {
                    //firstRespondersService.firstResponders.splice(vm.index, 1, res.data);
                    //vm.pVm.firstResponders.splice(vm.index, 1, res.data);
                    state.go('^');
                });
            }
            form.$submitted = true;
        }
    }
})();

