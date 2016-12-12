(function () {
    'use strict'
    angular.module('beacon').controller('main', main);

    main.$inject = ['$state', 'profile', 'dataCenters', '$stateParams', '$window', '$scope', '$ws', 'firstRespondersService', 'incidentsService'];

    function main($state, profile, dataCenters, $stateParams, $window, $scope, $ws, firstRespondersService, incidentsService) {
        var vm = {
            init: init,
            logout: logout,
            profile: profile,
            changeDataCenter: changeDataCenter,
            UI: {},
            dataCenter: {},
            beaconNumber: '',
            incidentsCount: 0
        };

        init();

        return vm;

        function init() {
            if (!profile.isAuthenticated) {
                $state.go('login');
            }
            else {
                vm.beaconNumber = _.findWhere(dataCenters.settings, { key: 'beacon_number' }).value;
                vm.UI.dataCenters = dataCenters.datacenters;
                vm.dataCenter = _.findWhere(vm.UI.dataCenters, { id: profile.userInfo.data_center_id });
                vm.incidentsCount = incidentsService.activeIncidents.length;
                $scope.$on('incidents.change', function (event, inc) {
                    vm.incidentsCount = incidentsService.activeIncidents.length;
                    vm.incidentId = inc.id;
                });
                $scope.$on('beaconNum.changed', function (event, val) {
                    vm.beaconNumber = val;
                });
                if (!$ws.dispatcher) {
                    createWSDispatcher();
                }
                else {
                    createWSDispatcher(true);
                }

            }
        }

        function createWSDispatcher(reConnect) {
            var iChannel;
            if (reConnect) {
                $ws.dispatcher.reconnect();
                wsUnsubcribe();
            } else {
//                $ws.dispatcher = new WebSocketRails('dispatch.trekmedics.org/websocket');
                $ws.dispatcher = new WebSocketRails('localhost:5000/websocket');
            }

            $ws.dispatcher.bind('connection_closed', function () {
                console.log("Connection Closed... Reopening...");
                init();
                //createWSDispatcher(true);
            });

            firstRespondersService.wsOpen($ws.dispatcher);
            incidentsService.wsOpen($ws.dispatcher);

            $ws.dispatcher.on_open = function (data) {
                console.log("Connection Opened. " + angular.toJson(data));
            };

            $scope.$on('$destroy', function () {
                $ws.dispatcher.unbind('connection_closed');
                $ws.dispatcher.disconnect();
                wsUnsubcribe();
            });

        }

        function wsUnsubcribe() {
            $ws.dispatcher.unsubscribe('incident');
            $ws.dispatcher.unsubscribe('first_responder');
        }

        function changeDataCenter(dc) {
            if (vm.dataCenter !== dc) {
                dataCenters.dataCenterChange(dc, profile.userInfo).then(function (res) {
                    vm.dataCenter = dc;
                    $window.localStorage.setItem('user', angular.toJson(angular.extend(profile.userInfo, res.data)));
                    $state.transitionTo($state.current, $state.params, {
                        reload: true
                    });
                });
            }
        }

        function logout() {
            profile.logout().then(function () {
                init();
            });
        }
    }
})();
