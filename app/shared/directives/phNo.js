(function () {
    'use strict'
    angular.module('beacon').directive('phNo', function () {
           return {
               scope: { phoneNumber: '=' },
               templateUrl: function (el, attrs) {
                   return (angular.isDefined(attrs.icon)) ? 'app/tmpls/icon-ph-no' : 'app/tmpls/ph-no';
               }
        };
    });

    angular.module('beacon').directive('scrollIf', function () {
        return function (scope, element, attributes) {
            setTimeout(function () {
                if (scope.$eval(attributes.scrollIf)) {
                    window.scrollTo(0, element[0].offsetTop - 20)
                }
            });
        }
    });
    
    angular.module('beacon').directive("compareTo", function () {
        return {
            require: "ngModel",
            scope: {
                otherModelValue: "=compareTo"
            },
            link: function (scope, element, attributes, ngModel) {

                ngModel.$validators.compareTo = function (modelValue) {
                    return modelValue == scope.otherModelValue;
                };

                scope.$watch("otherModelValue", function () {
                    ngModel.$validate();
                });
            }
        };
    });
})();



