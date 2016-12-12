(function () {
    'use strict'
    angular.module('beacon').controller('dataCenterListing', dataCenterListing);

    dataCenterListing.$inject = ['settingsService','dataCenters'];

    function dataCenterListing(settingsService, dataCenters) {
        var vm = {
            init: init,
            datacenters: [],
            datacenter: {},
            createDataCenter: createDataCenter,
            datacenterSave: datacenterSave,
            datacenterRemove: datacenterRemove

        };

        init();

        return vm;

        function init() {
            //dataCenters.datacentersLoaded.then(function (data) {
                vm.datacenters = dataCenters.datacenters;
            //});
        }

        function createDataCenter(form) {
            if (form.$valid) {
                settingsService.createDatacenter(vm.datacenter).then(function (res) {
                vm.datacenters.unshift(res.data);
                vm.datacenter = {};
                form.$submitted = false;
                form.$setUntouched();
             });
          }
           form.$submitted = true;
        }

        function datacenterSave(datacenter, form) {
            if (form.$valid) {
                datacenter.isEdit = false;
                settingsService.updateDatacenter(datacenter).then(function (res) {
                    var index = vm.datacenters.indexOf(datacenter);
                    vm.datacenters.splice(index, 1, res.data);
                });
            }
            form.$submitted = true;
        }

        function datacenterRemove(datacenter) {
            settingsService.datacenterRemove(datacenter).then(function (res) {
                var index = vm.datacenters.indexOf(datacenter);
                    vm.datacenters.splice(index, 1);
                });
        }
    }
})();

