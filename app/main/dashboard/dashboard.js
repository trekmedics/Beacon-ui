(function () {
    'use strict'
    angular.module('beacon').controller('dashboard', dashboard);

    dashboard.$inject = ['incidentsService', 'firstRespondersService', 'settingsService', '$scope'];

    function dashboard(incidentsService, firstRespondersService, settingsService, $scope) {
        var vm = {
            init: init,
            activeIncidents: [],
            archiveIncidents: [],
            moveNext: moveNext,
            movePrevious: movePrevious,
            availableCountGet: availableCountGet,
            frWithTransport: [],
            frWithoutTransport: [],
            frNotSpecified: [],
            hospitalsList: [],
            dispPhNosList: []
        };

        init();

        return vm;

        function init() {
            loadIncidents();
            $scope.$on('incidents.change', function (event, inc) {
                loadIncidents();
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            });
            
            

            loadFrs();
            $scope.$on('frs.change', function () {
                loadFrs();
                 if (!$scope.$$phase) {
                    $scope.$apply();
                 }
            });
            settingsService.getHospitals().then(function (res) {
                return vm.hospitalsList = res.data;
            });

            settingsService.getDispatchPhoneNumbers().then(function (res) {
                return vm.dispPhNosList = res.data;
            });

        }

        function loadFrs() {
            vm.frWithTransport = firstRespondersService.frWithTransport;
            vm.frWithoutTransport = firstRespondersService.frWithoutTransport;
            vm.frNotSpecified = firstRespondersService.frNotSpecified;
        }
        function loadIncidents() {
            vm.activeIncidents = incidentsService.activeIncidents;
            vm.archiveIncidents = incidentsService.archiveIncidents;
            if (vm.activeIncidents && vm.activeIncidents.length) {
                vm.current = 0;
                vm.incident = vm.activeIncidents[0];
                vm.lastIndex = vm.activeIncidents.length - 1;
            }
        }
        function moveNext() {
            if (vm.current < vm.lastIndex) {
                vm.incident = vm.activeIncidents[++vm.current];
            }
        }

        function movePrevious() {
            if (vm.current === 0) return;
            vm.incident = vm.activeIncidents[--vm.current];
        }
        function availableCountGet(frs) {
            return frs.filter(function (fr) {
                return fr.state === 'available';
            }).length;
        }
    }
})();

