(function () {
    'use strict'

    angular.module('beacon').factory('firstRespondersService', firstRespondersService);
    firstRespondersService.$inject = ['$http', '$q', '$rootScope'];

    function firstRespondersService($http, $q, $rootScope) {

        var dfrd = $q.defer(), service = {
            firstResponders: [],
            frWithTransport: [],
            frWithoutTransport: [],
            frNotSpecified: [],
            init: init,
            wsOpen: wsOpen,
            frLogout: frLogout,
            frLogin: frLogin,
            getFRPerformance: getFRPerformance,
            createFirstResponder: createFirstResponder,
            updateFirstResponder: updateFirstResponder,
            firstResonderRemove: firstResonderRemove,
            sendMessage: sendMessage,
            frGet: frGet,
            assignedStates: ["is_incident_commander_on_site",
                                   "on_site",
                                   "setting_transport_mode",
                                   "transporting",
                                   "waiting_for_location_update",
                                   "enroute_to_site"]
        };


        return service;

        function init() {
            return $http.get('first_responders').then(function (res) {
               
                var frs = res.data.filter(function (fr) {
                    return fr.state !== 'disabled';
                });
                
                if (frs.length) {
                    //service.firstResponders = _.sortBy(frs, 'state');
                    processFrs(frs);
                }
            });
        }

        function processFrs(frs)
        {
          
            service.firstResponders = sort(frs)

            service.frNotSpecified = sort(_.filter(frs, function (fr) {
                return (fr.transportation_mode === 1);
            }));

            service.frWithTransport = sort(_.filter(frs, function (fr) {
                return (fr.transportation_mode === 3);
            }));

            service.frWithoutTransport = sort(_.filter(frs, function (fr) {
                return (fr.transportation_mode === 2);
            }));
           
        }

        function sort(frs) {
            return _.sortBy(frs, function (fr) {
                if (service.assignedStates.indexOf(fr.state) > -1)
                    return 0;
                if (fr.state === 'available')
                    return 1;
                else return 2;
            });
        }

        function frGet(id) {
            return _.findWhere(service.firstResponders, { id: id });
        }

        function wsOpen(wsDispatcher)
        {
            var fChannel = wsDispatcher.subscribe('first_responder');

            fChannel.bind('update', function (data) {
                console.log("FR Upadated." + angular.toJson(data));
                frChange(data);
            });

            fChannel.bind('create', function (data) {
                console.log("FR Added." + angular.toJson(data));
                frCreate(data);
            });

            fChannel.bind('destroy',function (data) {
                console.log("FR Removed." + angular.toJson(data));
                frRemove(data);
            });
        }

        function frCreate(fr)
        {
            var exist = _.findWhere(service.firstResponders, { id: fr.id });
            if (!exist) {
                service.firstResponders.unshift(fr);
                broadCast(fr);
            }
        }

        function frChange(fr)
        {
            var r = _.findWhere(service.firstResponders, { id: fr.id });

            r = angular.extend(r, fr);
            broadCast(fr);
        }

        function frRemove(fr)
        {
            var frs = service.firstResponders;
            service.firstResponders = _.without(frs, _.findWhere(frs, { id: fr.id }));
            broadCast(fr);
        }

        function broadCast(fr)
        {
            processFrs(service.firstResponders);
            $rootScope.$broadcast('frs.change',fr);
        }
     
        function frLogin(fr) {
            $http.post('first_responders/' + fr.id + '/log_in').then(function (res) {
                frChange(res.data);
            });
        }

        function frLogout(fr) {
            return $http.post('first_responders/' + fr.id + '/log_out').then(function (res) {
                frChange(res.data);
            });
        }

        function getFRPerformance(frId) {
            return $http.get('first_responders/' + frId + '/performance_report');
        }

        function createFirstResponder(firstResponder) {
            var params = {
                name: firstResponder.name,
                phone_number: firstResponder.phone_number,
                locale: firstResponder.locale,
                transportation_mode: firstResponder.transportation_mode
            };
            return $http.post('first_responders', params).then(function (res) {
                frCreate(res.data);
            });
        }

        function updateFirstResponder(firstResponder) {
            var params = {
                name: firstResponder.name,
                phone_number: firstResponder.phone_number,
                locale: firstResponder.locale,
                transportation_mode: firstResponder.transportation_mode
            };
            return $http.patch('first_responders/' + firstResponder.id, params).then(function (res) {
                frChange(res.data);
            });
        }

        function firstResonderRemove(firstResponder) {
            var req = {
                method: 'DELETE',
                url: 'first_responders/' + firstResponder.id
            }
            $http(req).then(function (res) {
                frRemove(firstResponder);
            });
        }

        function sendMessage(firstResponder) {
            var params = {
                first_responder_id: firstResponder.id,
                message: firstResponder.message
            };
            return $http.post('outgoing_messages', params);
        }
    };
})();
