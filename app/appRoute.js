(function () {
    'use strict';
    var app = angular.module('beacon');
    app
    .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function ($stateProvider, $urlRouterProvider, $locationProvider) {
        $stateProvider
            .state('login', {
                url: '/login',
                controller: 'login',
                controllerAs: 'vm',
                templateUrl: 'app/login/login.html',
                ncyBreadcrumb: {
                    label: 'login'
                }
            })
            .state('main', {
                controller: 'main',
                controllerAs: 'vm',
                templateUrl: 'app/main/main.html',
                abstract: true,
                resolve:{
                    'load': ['dataCenters', 'profile', 'firstRespondersService', 'incidentsService','$q', function (dataCenters, profile, firstRespondersService, incidentsService, $q) {
                        if (profile.isAuthenticated) {
                            return $q.all([dataCenters.init(), firstRespondersService.init(), incidentsService.init()]);
                        }
                    }]
                },
                ncyBreadcrumb: {
                    label: 'Home'
                }
            })
            .state('main.dashboard', {
                url: '/dashboard',
                controller: 'dashboard',
                controllerAs: 'vm',
                templateUrl: 'app/main/dashboard/dashboard.html',
                ncyBreadcrumb: {
                    label: 'Dashboard',
                    parent: 'main'
                }
            })
            .state('main.newIncident', {
                url: '/newIncident',
                controller: 'newIncident',
                controllerAs: 'vm',
                templateUrl: 'app/main/incidents/newIncident.html',
                resolve:{
                    subCategories: ['settingsService', function (settingsService) {
                        return settingsService.getSubcategories();
                    }]
                },
                ncyBreadcrumb: {
                    label: 'New Incident',
                    parent: 'main'
                }
            })
            .state('main.resources', {
                url: '/resources/:id/:resource',
                controller: 'resources',
                controllerAs: 'vm',
                templateUrl: 'app/main/resources/resources.html',
                ncyBreadcrumb: {
                    label: 'Resources',
                    parent: 'main'
                }
            })
            .state('main.incidents', {
                url: '/incidents',
                controller: 'incidents',
                controllerAs: 'vm',
                templateUrl: 'app/main/incidents/incidents.html',
                ncyBreadcrumb: {
                    label: 'Incidents',
                    parent: 'main'
                }
            })
            .state('main.incidentDetails', {
                url: '/incidents/{id}',
                controller: 'incidentDetails',
                controllerAs: 'vm',
                templateUrl: 'app/main/incidents/incidentDetails.html',
                ncyBreadcrumb: {
                    label: 'Incident Details',
                    parent: 'main'
                }
            })
            .state('main.scanner', {
                url: '/scanner',
                controller: 'scanner',
                controllerAs: 'vm',
                templateUrl: 'app/main/scanner/scanner.html',
                ncyBreadcrumb: {
                    label: 'Scanner',
                    parent: 'main'
                }
            })
            .state('main.settings', {
                url: '/settings',
                controller: 'settings',
                controllerAs: 'vm',
                templateUrl: 'app/main/settings/settings.html',
                resolve:{
                    bSettings: ['settingsService', function (settingsService) {
                        return settingsService.getSettings();
                    }]
                },
                ncyBreadcrumb: {
                    label: 'Settings',
                    parent: 'main'
                }
            })
            .state('main.notificationList', {
                url: '/notificationList',
                controller: 'notificationList',
                controllerAs: 'vm',
                templateUrl: 'app/main/settings/notificationList.html',
                ncyBreadcrumb: {
                    label: 'Notification List',
                    parent: 'main'
                }
            })
            .state('main.hospitalList', {
                url: '/hospitalList/:id/:edit',
                controller: 'hospitalList',
                controllerAs: 'vm',
                templateUrl: 'app/main/settings/hospitalList.html',
                ncyBreadcrumb: {
                    label: 'Hospital List',
                    parent: 'main'
                }
            })
            .state('main.dispatchPhoneNoList', {
                url: '/dispatchPhoneNoList/:id/:edit',
                controller: 'dispatchPhoneNoList',
                controllerAs: 'vm',
                templateUrl: 'app/main/settings/dispatchPhoneNoList.html',
                ncyBreadcrumb: {
                    label: 'Dispatch Phone No List',
                    parent: 'main'
                }
            })
            .state('main.unregisteredParties', {
                url: '/unregisteredParties',
                controller: 'unregisteredParties',
                controllerAs: 'vm',
                templateUrl: 'app/main/settings/unregisteredParties.html',
                ncyBreadcrumb: {
                    label: 'Unregistered Parties',
                    parent: 'main'
                }
            })
            .state('main.userListing', {
                url: '/userListing',
                controller: 'userListing',
                controllerAs: 'vm',
                templateUrl: 'app/main/settings/userListing.html',
                resolve:{
                    users: ['settingsService', function (settingsService) {
                        return settingsService.getUsers();
                    }]
                },
                ncyBreadcrumb: {
                    label: 'User Listing',
                    parent: 'main'
                }
            })
            .state('main.userListing.edit',{
                url: '/{id}',
                 controller: 'userEdit',
                 controllerAs: 'vm',
                 templateUrl: 'app/main/settings/userEdit.html',
                 ncyBreadcrumb: {
                     label: 'User Edit',
                     parent: 'main.userListing'
                 }
             })
            .state('main.dataCenterListing', {
                url: '/dataCenterListing',
                controller: 'dataCenterListing',
                controllerAs: 'vm',
                templateUrl: 'app/main/settings/dataCenterListing.html',
                ncyBreadcrumb: {
                    label: 'dataCenterListing',
                    parent: 'main'
                }
            })
            .state('main.firstResponders', {
                url: '/firstResponders/{id}',
                controller: 'firstResponderCtrl',
                controllerAs: 'vm',
                templateUrl: 'app/main/resources/firstResponder.html',
                ncyBreadcrumb: {
                    label: 'First Responder',
                    parent: 'main'
                }
            })
            .state('main.frPerformance', {
                url: '/frPerformance/{id}',
                controller: 'frPerformanceCtrl',
                controllerAs: 'vm',
                templateUrl: 'app/main/resources/frPerformance.html',
                ncyBreadcrumb: {
                    label: 'First Responder',
                    parent: 'main'
                }
            })
            .state('main.firstResponders.edit', {
                url: '/edit',
                controller: 'firstResponderEdit',
                controllerAs: 'vm',
                templateUrl: 'app/main/resources/firstResponderEdit.html',
                ncyBreadcrumb: {
                    label: 'Edit',
                    parent: 'main.frPerformance'
                }
            })
            .state('main.categories', {
                url: '/categories',
                controller: 'categories',
                controllerAs: 'vm',
                templateUrl: 'app/main/settings/categories.html',
                ncyBreadcrumb: {
                    label: 'Categories',
                    parent: 'main'
                }
            });
        $urlRouterProvider.otherwise('/login');
        //$locationProvider.html5Mode(true);
    }]);

})();