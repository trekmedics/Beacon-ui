(function () {
    'use strict'
    angular.module('beacon').controller('notificationList', notificationList);

    notificationList.$inject = ['settingsService'];

    function notificationList( settingsService) {
        var vm = {
            'init': init,
            notifications: [],
            notification: {},           
            createNotification: createNotification,
            notificationSave: notificationSave,
            notificationRemove: notificationRemove
        };

        init();

        return vm;

        function init() {
            settingsService.getNotifications().then(function (res) {
                return vm.notifications = res.data;
            });
            /*vm.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };*/
        }

        function createNotification(form) {

            if (form.$valid) {
                settingsService.createNotification(vm.notification).then(function (res) {
                    var nt = res.data;
                    vm.notifications.unshift(nt);
                    vm.notification = {};                            
                    form.$submitted = false;
                    form.$setUntouched();
                });
            }
            form.$submitted = true;
        }
        function notificationSave(notfn, form) {
            if (form.$valid) {
            notfn.isEdit = false;
            settingsService.updateNotification(notfn).then(function (res) {
                var nt = res.data;
                var index = vm.notifications.indexOf(notfn);
                vm.notifications.splice(index, 1, nt);
                });
            }
            form.$submitted = true;
        }

        function notificationRemove(notfn) {
           settingsService.notificationRemove(notfn).then(function (res) {
                    var index = vm.notifications.indexOf(notfn);
                    vm.notifications.splice(index, 1);
                });
        }
    }
  
})();

