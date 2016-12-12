(function () {
    'use strict'

    angular.module('beacon').factory('permissions', permissions);
    permissions.$inject = ['profile'];

    function permissions(profile) {

        var roles = [, 'Admin', 'Manager', 'Dispatcher', 'Supervisor'];
        var localeRoles = [, 'views.user.admin', 'v2.users.manager', 'v2.users.dispatcher', 'v2.users.supervisor']
        var service = {
            getRole: getRole,
            isAuthrise: isAuthrise,
            getLocaleRole: getLocaleRole
        };
        
        return service;

        function getRole(id)
        {
            return roles[id];
        }

        function isAuthrise(roles)
        {
            var userRole=service.getRole(profile.userInfo.user_role_id);
            return _.contains(roles, userRole);
        }

        function getLocaleRole(id) {
            return localeRoles[id];
        }
    };
})();
