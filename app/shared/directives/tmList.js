(function () {
    'use strict'
    angular.module('beacon').directive('tmList', function () {

        var controller = ['$scope', '$element', '$transclude', function ($scope, $element, $transclude) {
            debugger;
           
            //init();
            function init() {
                $scope.length = ($scope.list || []).length;
                if ($scope.length) {
                    $scope.last = $scope.length - 1;
                    $scope._Index = 0;
                    $scope.current = $scope.list[$scope._Index];
                }
            }

            $scope.isActive = function (index) {
                return $scope._Index === index;
            }

            $scope.moveNext = function () {
                if ($scope._Index < $scope.last) {
                    $scope.current = $scope.list[++$scope._Index];
                }
            }

            $scope.movePrevious = function () {
                if ($scope._Index) {
                    $scope.current = $scope.list[--$scope._Index];
                }
            }
            $scope.$watch('list', function (val) {

                debugger;
                init();
                $transclude();
            });

        }];

        return {
            restrict: 'EA',
            scope: { list: '=' , current: '=', tmSref: '@' },
            template:
                '<div class="panel-body" ng-swipe-right="movePrevious()" ng-swipe-left="moveNext()">' +
                    '<div ng-show="$scope._Index===$index" ng-transclude class="slider" ng-repeate="item in list"></div>' +
                    '<div class="btn-actions">'+
                        '<div class="btn-group-sm" role="group">'+
                            '<div class="col-xs-4 text-left">'+
                                '<button type="button" ng-if="_Index" ng-click="movePrevious()" class="btn btn-sm btn-primary pull-left">'+
                                    '<span class="glyphicon glyphicon-arrow-left">'+
                                    '</span>'+
                                    '<span translate>v2.dashboard.next</span>'+
                                '</button>'+
                            '</div>'+
                            '<div class="col-xs-4 text-center">'+
                                '<button type="button" class="btn btn-sm btn-primary" ng-if="length" ui-sref="{{tmSref}}" translate>' +
                                    'v2.resources.details'+
                                '</button>'+
                            '</div>'+
                            '<div class="col-xs-4 text-left">'+
                                '<button type="button" ng-if="last && (last > _Index)" ng-click="moveNext()" class="btn btn-sm btn-primary pull-right">'+
                                    '<span translate>v2.dashboard.previous</span> '+ 
                                    '<span class="glyphicon glyphicon-arrow-right"></span>'+
                                '</button>'+
                            '</div>'+
                        '</div>'+
                    '</div>'+
                '</div>',
            transclude: true,
            controller: controller
            //link: function (scope, iele, attr, controller, transcludeFn) {

            //    scope.$watch('list', function (nVal, oVal) {
            //        debugger;
            //        var transInstance = transcludeFn();
            //    });
            //    //var transInstance = new transcludeFn(scope, function(cloned, sc) {
            //    //    debugger;
            //    //});
            //}
        }
    });

})();