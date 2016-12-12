(function () {
    'use strict'

    angular.module('beacon').factory('dataCenters', dataCenters);
    dataCenters.$inject = ['$http', '$q', 'profile'];

    function dataCenters($http, $q, profile) {

        var dfrd = $q.defer(), service = {
            //getDataCenters: getDataCenters,
            init: init,
            getDatacenter: getDatacenter,
            //datacentersLoaded: dfrd.promise,
            datacenters: [],
            settings:[],
            dataCenterChange: dataCenterChange,
            //getSettings: getSettings

        }, dfrdState;

        return service;



        function init() {
            var url = 'data_centers/' + profile.userInfo.id + '/user_data_centers'
            return $q.all([
                $http.get(url).then(function (res) { service.datacenters = res.data }),
                $http.get('settings').then(function (res) { service.settings = res.data })
            ]);
        }

        function getDatacenter(id) {
            if (id) {
                return _.findWhere(service.datacenters, { id: id });
            }
        }

        function dataCenterChange(dc, user)
        {
            var params = {
                "username": user.username,
                "password": user.password,
                "password_confirmation": user.password_confirmation,
                "user_role_id": user.user_role_id,
                "locale": user.locale,
                "data_center_id": dc.id
            };

            return $http.patch('users/' + user.id, params);
        }

    };
})();

