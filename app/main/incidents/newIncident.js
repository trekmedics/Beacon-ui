(function () {
    'use strict'
    angular.module('beacon').controller('newIncident', newIncident);

    newIncident.$inject = ['dataCenters', '$uibModal', '$translate', 'incidentsService', 'subCategories'];

    function newIncident(dataCenters, $uibModal, $translate, incidentsService, subCategories) {
        var vm = {
            init: init,
            saveIncident: saveIncident,
            incident:{  dispatcherName: '',
                location: '',
                frsToAllocate: 3,
                vehiclesToAllocate: 1,
                subcategory: '',
            },
            UI: {
                traumaSubcategories: [],
                medicalSubcategories: [],
                otherSubcategories: []
            }
        };

        init();

        return vm;

        function init() {
            vm.incident.frsToAllocate = parseInt(_.findWhere(dataCenters.settings, { key: 'number_of_frs_to_allocate' }).value);
            vm.incident.vehiclesToAllocate = parseInt(_.findWhere(dataCenters.settings, { key: 'number_of_transport_vehicles_to_allocate' }).value);


            vm.UI.traumaSubcategories = _.filter(subCategories.data, function (subcategory) {
                if (subcategory.category_id === 22) {
                    $translate('category.trauma.' + subcategory.name).then(function (val) {
                        subcategory.name = val;
                    });
                    return true;
                }
                return false;
            });

            vm.UI.medicalSubcategories = _.filter(subCategories.data, function (subcategory) {
                if (subcategory.category_id === 2) {
                    $translate('category.medical.' + subcategory.name).then(function (val) {
                        subcategory.name = val;
                    });
                    return true;
                }
                return false;
            });

            vm.UI.otherSubcategories = _.filter(subCategories.data, function (subcategory) {
                if (subcategory.category_id === 3) {
                    $translate('category.other.' + subcategory.name).then(function (val) {
                        subcategory.name = val;
                    });
                    return true;
                }
                return false;
            });
        }
        function saveIncident(form) {
            if (form.$valid) {
                incidentsService.createIncident(vm.incident).then(function (res) {
                    var newIncident = res, modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: 'app/main/incidents/incidentCreationConfirm.html',
                        controller: 'incidentCreationConfirmCtrl as vm',
                        resolve:
                            {
                                id: function () {
                                    return newIncident.id;
                                }
                            }
                    });
                    incidentsService.allIncidents.unshift(newIncident);
                    form.$submitted = false;
                    form.$setUntouched();
                });
            }
            form.$submitted = true;
        }
        
    }

    //Modal Controller
    angular.module('beacon').controller('incidentCreationConfirmCtrl', incidentCreationConfirmCtrl);

    function incidentCreationConfirmCtrl($uibModalInstance, id) {
        var vm = {
            init: init,
            id: id,
            cancel: cancel
        };

        init();

        return vm;

        function init() {
        }

        function cancel () {
                $uibModalInstance.dismiss('cancel');
            };
        }

})();

