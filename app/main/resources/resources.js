(function () {
    'use strict'
    angular.module('beacon').controller('resources', resources);

    resources.$inject = ['$scope', '$stateParams', 'firstRespondersService', 'settingsService'];

    function resources($scope, $stateParams, firstRespondersService, settingsService) {
        var vm = {
            init: init,
            firstResponders: [],
            moveNextFR: moveNextFR,
            movePreviousFR: movePreviousFR,
            firstResponder: {state:'_'},
            hospitalsList: [],
            moveNextHospital: moveNextHospital,
            movePreviousHospital: movePreviousHospital,
            hospital: null,
            medicalDoctors: [],
            getDoctors: getDoctors,
            hospitalRemove: hospitalRemove,
            UI: {
                id: $stateParams.id,
                resource: $stateParams.resource
            },
            dispPhNosList: [],
            disp: null,
            moveNextDisp: moveNextDisp,
            movePreviousDisp: movePreviousDisp,
            dispRemove: dispRemove
        };

        init();

        return vm;

        function init() {
            vm.frCurrent = 0;
            loadFrs();
            $scope.$on('frs.change', function () {
                loadFrs();
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            });
            loadFrs();

            settingsService.getHospitals().then(function (res) {
                vm.hospitalsList = res.data;
                if (vm.hospitalsList.length) {
                    vm.hospitalCurrent = 0;
                    if (vm.UI.id && vm.UI.resource === 'h') {
                        vm.hospitalCurrent = _.findLastIndex(vm.hospitalsList, { id: parseInt(vm.UI.id) });
                    }
                    vm.hospital = vm.hospitalsList[vm.hospitalCurrent];
                    vm.lastHospitalIndex = vm.hospitalsList.length - 1;
                }
                settingsService.getMedicalDoctors().then(function (res) {
                    return vm.medicalDoctors = res.data
                });

                settingsService.getDispatchPhoneNumbers().then(function (res) {
                    vm.dispPhNosList = res.data;
                    if (vm.dispPhNosList.length) {
                        vm.dispPhNoCurrent = 0;
                        if (vm.UI.id && vm.UI.resource === 'w') {
                            vm.dispPhNoCurrent = _.findLastIndex(vm.dispPhNosList, { id: parseInt(vm.UI.id) });
                        }
                        vm.dispPhNo = vm.dispPhNosList[vm.dispPhNoCurrent];
                        vm.lastDispIndex = vm.dispPhNosList.length - 1;
                    }

                });
            });
        }
        function loadFrs() {
            vm.firstResponders = firstRespondersService.firstResponders;
            if (vm.firstResponders.length) {
                vm.lastFRIndex = vm.firstResponders.length - 1;
                vm.frCurrent = vm.frCurrent > vm.lastFRIndex ? vm.lastFRIndex : vm.frCurrent
                if (vm.UI.id && vm.UI.resource === 'frs') {
                    vm.frCurrent = _.findLastIndex(vm.firstResponders, { id: parseInt(vm.UI.id) });
                }
                vm.firstResponder = vm.firstResponders[vm.frCurrent];
            }
        }
        function moveNextFR() {
            if (vm.frCurrent < vm.lastFRIndex) {
                vm.firstResponder = vm.firstResponders[++vm.frCurrent];
            }
        }

        function movePreviousFR() {
            if (vm.frCurrent === 0) return;
            vm.firstResponder = vm.firstResponders[--vm.frCurrent];
        }

        function moveNextHospital() {
            if (vm.hospitalCurrent < vm.lastHospitalIndex) {
                vm.hospital = vm.hospitalsList[++vm.hospitalCurrent];
            }
        }

        function movePreviousHospital() {
            if (vm.hospitalCurrent === 0) return;
            vm.hospital = vm.hospitalsList[--vm.hospitalCurrent];
        }

        function hospitalRemove(hspl) {
            settingsService.hospitalRemove(hspl).then(function (res) {
                vm.hospitalsList.splice(vm.hospitalCurrent, 1);
                vm.lastHospitalIndex--;
                if (vm.hospitalsList.length) {
                    if (vm.hospitalCurrent < vm.hospitalsList.length)
                        vm.hospital = vm.hospitalsList[vm.hospitalCurrent];
                    else {
                        vm.hospital = vm.hospitalsList[vm.hospitalCurrent - 1];
                        vm.hospitalCurrent--;
                    }
                }
                else {
                    vm.hospital = {};
                }
            });

        }

        function getDoctors(hospitalId) {
            return _.filter(vm.medicalDoctors, function (doctor) {
                return doctor.hospital_id === hospitalId;
            });
        }

        function moveNextDisp() {
            if (vm.dispPhNoCurrent < vm.lastDispIndex) {
                vm.dispPhNo = vm.dispPhNosList[++vm.dispPhNoCurrent];
            }
        }

        function movePreviousDisp() {
            if (vm.dispPhNoCurrent === 0) return;
            vm.dispPhNo = vm.dispPhNosList[--vm.dispPhNoCurrent];
        }

        function dispRemove(disp) {
            settingsService.dispPhNoRemove(disp).then(function (res) {
                vm.dispPhNosList.splice(vm.dispPhNoCurrent, 1);
                vm.lastDispIndex--;
                if (vm.dispPhNosList.length) {
                    if (vm.dispPhNoCurrent < vm.dispPhNosList.length)
                        vm.dispPhNo = vm.dispPhNosList[vm.dispPhNoCurrent];
                    else {
                        vm.dispPhNo = vm.dispPhNosList[vm.dispPhNoCurrent - 1];
                        vm.dispPhNoCurrent--;
                    }
                }
                else {
                    vm.dispPhNo = {};
                }
            });

        }
    }
})();

