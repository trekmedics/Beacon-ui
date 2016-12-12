(function () {
    'use strict'
    angular.module('beacon').controller('hospitalList', hospitalList);

    hospitalList.$inject = ['$stateParams', 'settingsService'];

    function hospitalList($stateParams, settingsService) {
        var vm = {
            init: init,
            hospital: {
                name: null,
                address: ''
            },
            UI: {
                hospitals: [],
                medicalDoctors: [],
                id: parseInt($stateParams.id),
                isEdit: !!$stateParams.edit
            },
            getDoctors: getDoctors,
            createHospital: createHospital,
            doctorSave: doctorSave,
            doctorAdd: doctorAdd,
            doctorRemove: doctorRemove,
            hospitalSave: hospitalSave,
            hospitalRemove: hospitalRemove
        };

        init();

        return vm;

        function init() {

            settingsService.getHospitals().then(function (res) {
                if (vm.UI.id) {
                    _.findWhere(res.data, { id: vm.UI.id }).isEdit = vm.UI.isEdit;
                }
                return vm.UI.hospitals = res.data;
            });
            settingsService.getMedicalDoctors().then(function (res) {
                return vm.UI.medicalDoctors = res.data
            });
        }
        function getDoctors(hospitalId) {
            return _.filter(vm.UI.medicalDoctors, function (doctor) {
                return doctor.hospital_id === hospitalId;
            });
        }
        function createHospital(form) {
            if (form.$valid) {
                settingsService.createHospital(vm.hospital).then(function (res) {
                    vm.UI.hospitals.unshift(res.data);
                    vm.hospital = {};
                    form.$submitted = false;
                    form.$setUntouched();
                });
            }
            form.$submitted = true;
        }

        function doctorSave(doc, form) {
            if (form.$valid) {
                doc.isEdit = false;
                settingsService.updateDoctor(doc).then(function (res) {
                    var d = res.data;
                    var index = vm.UI.medicalDoctors.indexOf(doc);
                    vm.UI.medicalDoctors.splice(index, 1, d);
                });
            }
            form.$submitted = true;
        }

        function doctorAdd(hospitalId) {
            var doc = { isEdit: true, name: '', phone_number: '', hospital_id: hospitalId };
            vm.UI.medicalDoctors.unshift(doc);
        }

        function doctorRemove(doc) {
            settingsService.doctorRemove(doc).then(function (res) {
                var index = vm.UI.medicalDoctors.indexOf(doc);
                vm.UI.medicalDoctors.splice(index, 1);
            });
        }

        function hospitalSave(hspl, form) {
            if (form.$valid) {
                hspl.isEdit = false;
                settingsService.hospitalSave(hspl).then(function (res) {
                    var h = res.data;
                    var index = vm.UI.hospitals.indexOf(hspl);
                    vm.UI.hospitals.splice(index, 1, h);
                });
            }
            form.$submitted = true;
        }

        function hospitalRemove(hspl) {
            settingsService.hospitalRemove(hspl).then(function (res) {
                var index = vm.UI.hospitals.indexOf(hspl);
                vm.UI.hospitals.splice(index, 1);
            });
        }
    }
})();

