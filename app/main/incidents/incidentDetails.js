(function () {
    'use strict'
    angular.module('beacon').controller('incidentDetails', incidentDetails);

    incidentDetails.$inject = ['$stateParams', 'incidentsService', 'firstRespondersService', '$scope', '$state'];

    function incidentDetails($stateParams, incidentsService, firstRespondersService, $scope, $state) {
        var vm = {
            incident: {},
            isCollapsed: true,
            init: init,
            showHide: showHide,
            messageLogs: {},
            incidentLogs: {},
            logKeys: [],
            iKeys: [],
            counter: 0,
            msgCounter: 0,
            movePreviousLog: movePreviousLog,
            moveNextLog: moveNextLog,
            moveNextMsg: moveNextMsg,
            movePreviousMsg: movePreviousMsg,
            updateComment: updateComment,
            NewReplyRecevied: '',
            reloadMsg: reloadMsg
        };

        init();

        return vm;

        function init() {
            var assignedStates = ["is_incident_commander_on_site",
                                   "on_site",
                                   "setting_transport_mode",
                                   "transporting",
                                   "waiting_for_location_update",
                                   "enroute_to_site"];

            getIncidentDetails($stateParams.id, true);
            $scope.$on('incidents.change', function (event, inc) {
                if (parseInt($stateParams.id) === parseInt(inc.id)) {
                    getIncidentDetails(inc.id);
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                }
            });
            $scope.$on('frs.change', function (event, fr) {
                if (fr.state === "enroute_to_site") {
                    vm.NewReplyRecevied = "New Replies Received";
                }
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            });

        }


        function getIncidentDetails(incidentId, refresh) {
            incidentsService.getIncident(incidentId).then(function (res) {
                var msgs;
                vm.incident = res.data;
                if (vm.incident && vm.incident.abridged_message_log.length) {
                    vm.incident.abridged_message_log = _.each(vm.incident.abridged_message_log, function (msg) {
                        if (msg.resource_type === 'FirstResponder') {
                            var fr = firstRespondersService.frGet(msg.resource_id);
                            if (!fr || vm.incident.state === 'incident_complete') {
                                fr = { id: msg.resource_id, name: msg.resource_name, phone_number: msg.resource_phone_number };
                            }
                            msg.resource = fr;
                        }
                        else if (msg.resource_type === 'ReportingParty' && vm.incident.reporting_party && !vm.incident.reporting_party.resource_type && msg.resource_id == vm.incident.reporting_party.id) {
                            vm.incident.reporting_party.resource_type = msg.resource_type;
                            vm.incident.reporting_party.resource_name = msg.resource_name;
                            vm.incident.reporting_party.resource_phone_number = msg.resource_phone_number;
                        }
                    });
                    vm.messageLogs = _.groupBy(vm.incident.abridged_message_log, function (ms) { return ms.resource_phone_number + ', ' + ms.resource_id });

                    var logkeys = Object.getOwnPropertyNames(vm.messageLogs)
                    vm.logKeys = _.filter(logkeys, function (key) {
                        var r = vm.messageLogs[key], replys;
                        if (r[0].resource_type !== 'FirstResponder') { return true; }
                        else {
                            replys = _.filter(r, function (ms) { return ms.is_incoming; }).length;
                            return replys > 1;
                        }
                    });
                    var arrmsg = [];
                    msgs = _.filter(vm.incident.abridged_message_log, function (log) { return log.resource_type === 'FirstResponder' });
                    vm.incidentLogs = _.groupBy(msgs, 'resource_id');
                    vm.iKeysOld = _.each(Object.getOwnPropertyNames(vm.incidentLogs), function (id) {
                        if (vm.incidentLogs[id].length > 3)
                            vm.incidentLogs[id] = _.first(vm.incidentLogs[id], 2);

                    });
                    vm.iKeys = _.each(Object.getOwnPropertyNames(vm.incidentLogs), function (id) {
                        if (vm.incidentLogs[id].length > 3)
                            vm.incidentLogs[id] = _.first(vm.incidentLogs[id], 2);
                        if (vm.incidentLogs[id][1] !== undefined) {
                            var msgDetails = vm.incidentLogs[id][1].resource_id + "," + vm.incidentLogs[id][1].message;
                            arrmsg.push(msgDetails);
                            arrmsg.sort(function (a, b) {
                                var fi = a.split('.')[1];
                                var se = b.split('.')[1]
                                return parseFloat(fi) - parseFloat(se);
                            });
                        }
                    });
                    var arrItems = [];
                    for (var x = 0; x < arrmsg.length; x++) {
                        var arrItem = arrmsg[x].split(',')[0];
                        arrItems.push(arrItem);
                        var iKeyIndex = vm.iKeys.indexOf(arrItem);
                        if (iKeyIndex != -1) {
                            var indexrw = vm.iKeys.splice(iKeyIndex, 1);

                        }
                    }
                    if (vm.incident.incident_commander !== undefined) {
                        for (var x = 0; x < arrItems.length; x++) {
                            vm.incidentLogs[vm.iKeys.splice(x, x, arrItems[x])];

                        }

                    }
                    
                    var arrdiff = [];
                    arrdiff = _.difference(vm.iKeysOld, arrItems);
                    for (var x = 0; x < arrdiff.length; x++) {
                        arrItems.push(arrdiff[x]);
                    }
                    if (vm.logKeys.length) {
                        if (refresh) {
                            vm.currentLog = vm.messageLogs[vm.logKeys[0]];
                        }
                        else {
                            vm.currentLog = vm.messageLogs[vm.logKeys[vm.counter]];
                        }
                    }


                    if (vm.logKeys.length) {
                        if (refresh) {
                            vm.currentLog = vm.messageLogs[vm.logKeys[0]];
                        }
                        else {
                            vm.currentLog = vm.messageLogs[vm.logKeys[vm.counter]];
                        }
                    }
                    if (vm.iKeys.length) {
                        if (refresh) {
                            vm.iKeys = arrItems;
                            vm.currentMsg = vm.incidentLogs[vm.iKeys[0]];
                        }
                        else {
                            vm.currentMsg = vm.incidentLogs[vm.iKeys[vm.msgCounter]];
                        }
                    }
                }
            });
        }

        function movePreviousLog() {
            if (vm.counter > 0) {
                vm.currentLog = vm.messageLogs[vm.logKeys[--vm.counter]];
            }
        }

        function moveNextLog() {
            if (vm.counter < vm.logKeys.length - 1) {
                vm.currentLog = vm.messageLogs[vm.logKeys[++vm.counter]];
            }
        }

        function moveNextMsg() {
            if (vm.msgCounter < vm.iKeys.length - 1) {
                vm.currentMsg = vm.incidentLogs[vm.iKeys[++vm.msgCounter]]
            }
        }
        function movePreviousMsg() {
            if (vm.msgCounter > 0) {
                vm.currentMsg = vm.incidentLogs[vm.iKeys[--vm.msgCounter]];
            }
        }

        function showHide() {
            vm.isCollapsed = !vm.isCollapsed;
            return vm.isCollapsed;
        }

        function updateComment() {
            incidentsService.updateIncident(vm.incident).then(function (res) {
                var inc = res;
                vm.incident = inc;
            });
        }
        function sendIMessage() {
            firstRespondersService.sendMessage({ id: vm.currentLog[0].resource_id, message: vm.mLogMsg });
        }

        function reloadMsg() {
            $state.go($state.current, {}, { reload: true });
            vm.msgCounter = 0;
            vm.currentMsg = vm.incidentLogs[vm.iKeys[0]];

        };

    }
})();
