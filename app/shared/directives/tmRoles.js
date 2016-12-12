(function () {
    'use strict'
    angular.module('beacon').directive('tmRoles', tmRoles);

    tmRoles.$inject = ['permissions']
    function tmRoles(permissions) {
        return {
            link: function (scope, element, attrs) {
                var roles = scope.$eval(attrs.tmRoles);
                if (!permissions.isAuthrise(roles)) {
                    element.remove();
                }
            }
        };
    }

})();