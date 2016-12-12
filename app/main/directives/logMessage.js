(function () {
    'use strict'
    angular.module('beacon').directive('logMessage', function () {

        var controller = ['$scope', function ($scope) {
            $scope.getMessages = function () {
                if ($scope.logMessage.is_incoming) {
                    return $scope.logMessage.message.match(/[^\n]+/g);
                }
                else {
                    if ($scope.logMessage.abridged_message.length) {
                        return $scope.logMessage.abridged_message.match(/[^\n]+/g);
                    }
                    else {
                        return $scope.logMessage.message.match(/[^\n]+/g);
                    }
                }
                return [];
            };
        }];

        return {
            restrict: 'E',
            scope: { logMessage: '=' },
            templateUrl: 'app/main/directives/logMessage.html',
            controller: controller
        };
    });

})();