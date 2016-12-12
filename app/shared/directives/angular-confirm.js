/*
 * angular-confirm
 * https://github.com/Schlogen/angular-confirm
 * @version v1.2.3 - 2016-01-26
 * @license Apache
 */
(function (root, factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['angular'], factory);
    } else if (typeof module !== 'undefined' && typeof module.exports === 'object') {
        module.exports = factory(require('angular'));
    } else {
        return factory(root.angular);
    }
}(this, function (angular) {
    angular.module('beacon')
      .controller('ConfirmModalController', function ($scope, $uibModalInstance, data, $translate) {


          $translate([data.title, data.ok, data.cancel, data.text], data.obj).then(function (result) {
              data.title=result[data.title];
              data.ok = result[data.ok];
              data.cancel = result[data.cancel];
              data.text = result[data.text];
              $scope.data = angular.copy(data);
          });
          $scope.ok = function (closeMessage) {
              $uibModalInstance.close(closeMessage);
          };
          $scope.cancel = function (dismissMessage) {
              if (angular.isUndefined(dismissMessage)) {
                  dismissMessage = 'cancel';
              }
              $uibModalInstance.dismiss(dismissMessage);
          };

      })
      .value('$confirmModalDefaults', {
          template: '<div class="modal-header"><h3 class="modal-title"><strong>{{data.title}}</strong></h3></div>' +
          '<div class="modal-body">{{data.text}}</div>' +
          '<div class="margin10 text-center">' +
          '<button class="btn btn-primary btn-fullradius" ng-click="ok()">{{data.ok}}</button>' +
          '<button class="link btn-link " ng-click="cancel()">{{data.cancel}}</button>' +
          '</div>',
          controller: 'ConfirmModalController',
          defaultLabels: {
              title: 'Confirm',
              ok: 'OK',
              cancel: 'Cancel',
              text: 'system.confirm_destroy',
              obj: {}
          }
      })
      .factory('$confirm', function ($uibModal, $confirmModalDefaults) {
          return function (data, settings) {
              var defaults = angular.copy($confirmModalDefaults);
              settings = angular.extend(defaults, (settings || {}));

              data = angular.extend({}, settings.defaultLabels, data || {});

              if ('templateUrl' in settings && 'template' in settings) {
                  delete settings.template;
              }

              settings.resolve = {
                  data: function () {
                      return data;
                  }
              };

              return $uibModal.open(settings).result;
          };
      })
      .directive('confirmObj', function ($confirm) {
          return {
              priority: 1,
              restrict: 'A',
              scope: {
                  confirmIf: "=",
                  ngClick: '&',
                  confirmObj: '=',
                  confirmSettings: "=",
                  confirmTitle: '@',
                  confirmText: '@',
                  confirmOk: '@',
                  confirmCancel: '@',
                  interpolate: '='
              },
              link: function (scope, element, attrs) {

                  element.unbind("click").bind("click", function ($event) {

                      $event.preventDefault();

                      if (angular.isUndefined(scope.confirmIf) || scope.confirmIf) {

                          var data = { obj: scope.confirmObj };
                          if (scope.confirmTitle) {
                              data.title = scope.confirmTitle;
                          }
                          if (scope.confirmText) {
                              data.text = scope.confirmText;
                          }
                          if (scope.confirmOk) {
                              data.ok = scope.confirmOk;
                          }
                          if (scope.confirmCancel) {
                              data.cancel = scope.confirmCancel;
                          }

                          $confirm(data, scope.confirmSettings || {}).then(scope.ngClick);
                      } else {

                          scope.$apply(scope.ngClick);
                      }
                  });
              }
          }
      });
}));