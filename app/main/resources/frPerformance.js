(function () {
    'use strict'
    angular.module('beacon').controller('frPerformanceCtrl', frPerformanceCtrl);

    frPerformanceCtrl.$inject = ['$scope', 'firstRespondersService','$stateParams','dataCenters','profile','$state'];

    function frPerformanceCtrl($scope, firstRespondersService, $stateParams, dataCenters, profile,$state) {
        var vm = {
            init: init,
            perDetails: {},
            fr: {icon: '',
                style: '',
            },                       
            assignedStates :
                        ["is_incident_commander_on_site",
                            "on_site",
                            "setting_transport_mode",
                            "transporting",
                            "waiting_for_location_update",
                            "enroute_to_site"]
        };

        init();

        return vm;

        function init() {
            
            loadfrPerformance($stateParams.id);
            $scope.$on('frs.change', function (event, fr) {
                if (fr.id === $stateParams.id) {
                    var fr = _.findWhere(firstRespondersService.firstResponders, { id: parseInt($stateParams.id) });
                    vm.index = firstRespondersService.firstResponders.indexOf(fr);
                    if (vm.index === -1) {
                        $state.go('main.resources', { id: 0 });
                    }
                    else{
                        loadfrPerformance(fr.id);
                        if (!$scope.$$phase) {
                            $scope.$apply();
                        }
                    }
                    
                }
            });
        }

        function loadfrPerformance(frId) {
            firstRespondersService.getFRPerformance(frId).then(function (res) {
                vm.fr = res.data.first_responder;
                vm.fr.datacCenterName = dataCenters.getDatacenter(profile.userInfo.data_center_id).name;
                if (vm.fr.transportation_mode === 1)
                    vm.fr.icon = "fa-user";

                else if (vm.fr.transportation_mode === 3) {
                    vm.fr.icon = 'icon icon-default';
                }
                else if (vm.fr.transportation_mode === 2) {
                    vm.fr.icon = 'fa-motorcycle';
                }

                var state = vm.fr.state;
                if (vm.assignedStates.indexOf(state) > -1) {
                    vm.fr.style = "text-warning";
                }
                else if (state === 'available') {
                    vm.fr.style = "text-success";
                }
                else
                    vm.fr.style = "text-muted";

                vm.perDetails = res.data;
            });
        }
        
    }
})();

