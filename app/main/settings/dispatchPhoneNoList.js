(function () {
    'use strict'
    angular.module('beacon').controller('dispatchPhoneNoList', dispatchPhoneNoList);

    dispatchPhoneNoList.$inject = ['settingsService', 'dataCenters', '$stateParams'];

    function dispatchPhoneNoList(settingsService, dataCenters, $stateParams) {
        var vm = {
            init: init,
            dispatchPhoneNo: { datacenter: {} },
            dataCenterGetById: dataCenterGetById,
            dispatchPhoneNos: [],
            UI: {
                datacenters: [],
                id: parseInt($stateParams.id),
                isEdit: !!$stateParams.edit
            },
            createDispPhoneNumber: createDispPhoneNumber,
            dispPhNoSave: dispPhNoSave,
            dispPhNoRemove: dispPhNoRemove

        };

        init();

        return vm;

        function init() {

            settingsService.getDispatchPhoneNumbers().then(function (res) {
                if (vm.UI.id) {
                    _.findWhere(res.data, { id: vm.UI.id }).isEdit = vm.UI.isEdit;
                }
                return vm.dispatchPhoneNos = res.data;
            });

            //dataCenters.datacentersLoaded.then(function (data) {
                vm.UI.datacenters = dataCenters.datacenters;
            //});

        }
        function dataCenterGetById(dataCenterId) {
            return dataCenters.getDatacenter(dataCenterId);
        }

        function createDispPhoneNumber(form) {
            if (form.$valid) {
                settingsService.createDispatchPhNo(vm.dispatchPhoneNo).then(function (res) {
                    var dp = res.data;
                    vm.dispatchPhoneNos.unshift(dp);
                    vm.dispatchPhoneNo = {};
                    form.$submitted = false;
                    form.$setUntouched();
                });
            }
            form.$submitted = true;
        }

        function dispPhNoSave(disp, form) {
            if (form.$valid) {
                settingsService.updateDispPhNo(disp).then(function (res) {
                    var d = res.data, index = vm.dispatchPhoneNos.indexOf(disp);
                    vm.dispatchPhoneNos.splice(index, 1, d);
                    disp.isEdit = false;
                });
            }
            form.$submitted = true;
        }

        function dispPhNoRemove(disp) {
            settingsService.dispPhNoRemove(disp).then(function (res) {
                var index = vm.dispatchPhoneNos.indexOf(disp);
                vm.dispatchPhoneNos.splice(index, 1);
            });
        }
    }
})();

