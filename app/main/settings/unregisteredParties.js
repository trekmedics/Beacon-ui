(function () {
    'use strict'
    angular.module('beacon').controller('unregisteredParties', unregisteredParties);

    unregisteredParties.$inject = ['settingsService'];
    function unregisteredParties(settingsService) {
        var vm = {
            init: init,
            urParties: []

        };

        init();

        return vm;

        function init() {
            settingsService.getURparties().then(function (res) {
                return vm.urParties = _.sortBy(res.data, function (o) { return new Date(o.updated_at); }).reverse();               
            });
        }
    }
})();

