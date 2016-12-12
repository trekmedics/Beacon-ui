(function () {
    'use strict'
    angular.module('beacon').directive('firstResponder', function () {

        var controller = ['$scope', 'firstRespondersService', 'incidentsService', function ($scope, firstRespondersService, incidentsService) {
            $scope.responding = false;
            $scope.statusGet = function () {
                if (firstRespondersService.assignedStates.indexOf($scope.firstResponder.state) > -1) {
                    return "v2.first_responder.assigned"
                }
                else {
                    return "system.first_responder_state." + $scope.firstResponder.state;
                }
            }

            $scope.styleGet = function () {
                if (firstRespondersService.assignedStates.indexOf($scope.firstResponder.state) > -1) {
                    $scope.responding = true;
                    return "text-warning"
                }
                else if ($scope.firstResponder.state === 'available') {
                    $scope.responding = true;
                    return "text-success";
                }
                else
                    return "text-muted";
            }

            $scope.iconGet = function () {
                var fr = $scope.firstResponder;
                if (fr.transportation_mode === 1)
                    return "icon icon-user"

                else if (fr.transportation_mode === 3) {
                    if (firstRespondersService.assignedStates.indexOf($scope.firstResponder.state) > -1) {
                        return "icon icon-warning"
                    }
                   else if ($scope.firstResponder.state === 'available') {
                        return "icon icon-success";
                    }
                    else  {
                        return "icon icon-muted";
                    }
                }
                else if (fr.transportation_mode === 2) {
                    return 'icon icon-bike';
                }
                return '';
            }
           
            $scope.logout = function () {
                firstRespondersService.frLogout($scope.firstResponder);
            }

            $scope.login = function () {
                firstRespondersService.frLogin($scope.firstResponder);
            }

            $scope.remove = function () {
                firstRespondersService.firstResonderRemove($scope.firstResponder);
            }

            $scope.sendMessage = function (form) {
                if (form.$valid) {
                    firstRespondersService.sendMessage($scope.firstResponder).then(function (res) {
                        form.$submitted = false;
                        form.$setUntouched();
                    });

                }
                form.$submitted = true;
            }

        }];

        return {
            restrict: 'E',
            scope: {
                firstResponder: '=',
                mode: '@',
                hideMsg: '=',
                initiatedAt: '=',
                reportingParty: '='
                //onChange: '&onChange',
                //onRemove: '&'
            },
            templateUrl: 'app/main/directives/firstResponder.html',
            controller: controller
        };
    });

})();