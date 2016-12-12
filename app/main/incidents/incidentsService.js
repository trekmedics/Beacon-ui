(function () {
    'use strict'

    angular.module('beacon').factory('incidentsService', incidentsService);
    incidentsService.$inject = ['$http', '$q', '$rootScope'];

    function incidentsService($http, $q, $rootScope) {

        var dfrd = $q.defer(), service = {
            allIncidents: [],
            activeIncidents: [],
            archiveIncidents: [],
            init: init,
            getIncident: getIncident,
            incidentsUpdated: function () { return dfrd.promise },
            updateIncident: updateIncident,
            createIncident: createIncident,
            cancelIncident: cancelIncident,
            wsOpen: wsOpen



        }, dfrdState;


        return service;



        function init() {
            return $http.get('incidents').then(function (res) {
                var incs = res.data;
                if (incs.length) {
                    processIncidents(incs);
                }
            });
        }

        function processIncidents(incs) {
            service.allIncidents = _.sortBy(incs, function (o) { return new Date(o.created_at); }).reverse();

            service.activeIncidents = _.filter(service.allIncidents, function (incident) {
                return incident.state !== 'incident_complete';
            });
            //$rootScope.$broadcast('incidentsCount.changed', service.activeIncidents.length);

            service.archiveIncidents = _.filter(service.allIncidents, function (incident) {
                return incident.state === 'incident_complete';
            });
        }


        function wsOpen(wsDispatcher) {
            var iChannel = wsDispatcher.subscribe('incident');

            iChannel.bind('create', function (data) {
                console.log("Incident Created." + angular.toJson(data));
                return incidentCreate(data);
            });

            iChannel.bind('update', function (data) {
                if (data.state === "incident_complete") {
                }
                console.log("Incident Upadated." + angular.toJson(data));
                incidentChange(data);
            });

        }
        function getIncident(id)
        {
            if(id)
            {
                return $http.get('incidents/' + id);
            }
        }

        function incidentCreate(inc) {
            var exist = _.findWhere(service.allIncidents, { id: inc.id });
            if (!exist) {
                service.allIncidents.unshift(inc);
                broadCast(inc);
            }
            return inc;
        }
        function incidentChange(inc) {
            var i = _.findWhere(service.allIncidents, { id: inc.id });

            i = angular.extend(i, inc);
            broadCast(inc);
            return inc;
        }

        function broadCast(inc) {
            processIncidents(service.allIncidents);
            $rootScope.$broadcast('incidents.change',inc);
        }

        function updateIncident(incident) {
            //console.log("Incident Id: "+ incidentId + " Comment: " + comment);
            //return
            var params = {
                'comment': incident.comment
            };

            return $http.patch('incidents/' + incident.id + '/edit_comment', params).then(function (res) {
                 return incidentChange(res.data);
            });
        }
        function createIncident(incident) {
            var params = {
                 'help_message' : incident.dispatcherName,
                 'location' : incident.location,
                 'number_of_frs_to_allocate' : incident.frsToAllocate,
                 'number_of_transport_vehicles_to_allocate' : incident.vehiclesToAllocate,
                 'subcategory_id' : incident.subcategory.id
            };

            return $http.post('incidents', params).then(function(res){
                return incidentCreate(res.data);
            });

        }

        function cancelIncident(incidentId, reason)
        {
            var params = {
                'comment ': reason
            }
            return $http.post('incidents/' + incidentId + '/cancel_incident', params);
        }
    };
})();
