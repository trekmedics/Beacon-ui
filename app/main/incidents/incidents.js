(function () {
    'use strict'
    angular.module('beacon').controller('incidents', incidents);

    incidents.$inject = ['$scope', '$uibModal', 'incidentsService' ];

    function incidents($scope, $uibModal,incidentsService) {
        var vm = {
            isCollapsed : true,
            init: init,
            showHide: showHide,
            recentIncidents: [],
            recentNext: recentNext,
            recentPrevious: recentPrevious,
            archiveIncidents: [],
            archiveNext: archiveNext,
            archivePrevious: archivePrevious
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

           

            
            //incidentsService.refreshIncidents();
        }

        function loadIncidents() {
            vm.recentIncidents = incidentsService.activeIncidents;
            vm.archiveIncidents = incidentsService.archiveIncidents;
            if (vm.recentIncidents.length) {
                vm.recentCurrent = 0;
                vm.recentIncident = vm.recentIncidents[0];
                vm.recentlastIndex = vm.recentIncidents.length - 1;
            }

            if (vm.archiveIncidents.length) {
                vm.archiveCurrent = 0;
                vm.archiveIncident = vm.archiveIncidents[0];
                vm.archivelastIndex = vm.archiveIncidents.length - 1;
            }
        }
       
        function showHide()
        {
            vm.isCollapsed = !vm.isCollapsed;
            return vm.isCollapsed;
        }

        function recentNext() {
            if (vm.recentCurrent < vm.recentlastIndex) {
                vm.recentIncident = vm.recentIncidents[++vm.recentCurrent];
            }

        }

        function recentPrevious() {
            if (vm.recentCurrent === 0) return;
            vm.recentIncident = vm.recentIncidents[--vm.recentCurrent];

        }
        function archiveNext() {
            if (vm.archiveCurrent < vm.archivelastIndex) {
                vm.archiveIncident = vm.archiveIncidents[++vm.archiveCurrent];
            }
        }
        
        function archivePrevious() {
            if (vm.archiveCurrent === 0) return;
            vm.archiveIncident = vm.archiveIncidents[--vm.archiveCurrent];
        }
    }
})();

