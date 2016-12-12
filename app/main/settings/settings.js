(function () {
    'use strict'
    angular.module('beacon').controller('settings', settings);

    settings.$inject = ['dataCenters', '$uibModal', 'settingsService', 'bSettings', '$scope'];

    function settings(dataCenters, $uibModal, settingsService, bSettings, $scope) {
        var vm = {
            init: init,
            openDialog: openDialog,
            settingsList: [],
            settingSave: settingSave,
            settings: {}
        };

        init();

        return vm;

        function init() {
            dataCenters.settings = bSettings.data
            vm.settingsList = _.sortBy(bSettings.data, function (o) {
                return o.id;
            });
            angular.forEach(vm.settingsList, function (value, key) {
                vm.settings[value.key] = value;
            });
            vm.settings.is_white_list_enabled.value = vm.settings.is_white_list_enabled.value === 'true';
            vm.settings.is_data_center_on.value = vm.settings.is_data_center_on.value === 'true';
        }
        function openDialog(size) {

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'app/main/settings/notificationList.html',
                controller: 'notificationList as vm',
                size: size
            });
        }


        function settingSave(setting, form) {
            if (!form || form.$valid) {
                settingsService.settingSave(setting).then(function (res) {
                    var s = res.data, index = vm.settingsList.indexOf(setting);
                    vm.settingsList.splice(index, 1, s);
                    if (setting.key === 'beacon_number')
                    {
                        $scope.$emit('beaconNum.changed', setting.value);
                    }
                    setting.isEdit = false;
                });
            }
            if (form) {
                form.$submitted = true;
            }
        }

    }

})();

