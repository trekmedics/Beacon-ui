(function () {
    'use strict'
    angular.module('beacon').directive('incident', function () {

        var controller = ['$scope', '$uibModal', '$state', function ($scope, $uibModal,  $state) {
            var vm = {
                incident: null,
                isCompleted: isCompleted,
                cancelIncident: cancelIncident
            };

            return vm;

            function isCompleted() {
                var states;
                vm.incident = $scope.incident;
                if (vm.incident.state_string) {
                    states = vm.incident.state_string.split('\n');
                    vm.state = states[0];
                    vm.completionState = states[1].substring(2);
                };
                if (vm.incident.state === 'incident_complete') {
                    //Customising the Incident Data.
                    return true;
                }
                else {
                    return false;
                }
            }

            function cancelIncident() {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'app/main/dashboard/incidentCancelConfirm.html',
                    controller: 'incidentCancelConfirmCtrl as vm',
                    resolve:
                        {
                            id: function () {
                                return vm.incident.id;
                            }
                        }
                });
            }
        }];

        return {
            restrict: 'E',
            scope: { incident: '=' },
            templateUrl: 'app/main/directives/incident.html',
            controller: controller,
            controllerAs: 'vm'
        };
    });

    //Modal popup Controller
    angular.module('beacon').controller('incidentCancelConfirmCtrl', incidentCancelConfirmCtrl);
    incidentCancelConfirmCtrl.$inject = ['$uibModalInstance', 'incidentsService', 'id', '$state','$stateParams'];
    function incidentCancelConfirmCtrl($uibModalInstance, incidentsService, id, $state, $stateParams) {
        var vm = {
            id: id,
            init: init,
            close: close,
            cancel: cancel
        };

        init();

        return vm;

        function init() {
        }
        function cancel() {
            incidentsService.cancelIncident(this.id, vm.reason).then(function (res) {
                vm.incident = res.data;
                $uibModalInstance.dismiss('cancel');
                $state.transitionTo($state.current, $stateParams, { reload: true, inherit: false, notify: true });
              
            });
        }
        function close() {
            $uibModalInstance.dismiss('cancel');
        }
    }
})();
