(function () {
    'use strict'

    angular.module('beacon').factory('settingsService', settingsService);
    settingsService.$inject = ['$http','profile'];

    function settingsService($http,profile) {

        var service = {    
            getURparties: getURparties,
            getCategories: getCategories,
            getSubcategories: getSubcategories,
            getSettings: getSettings,
            getHospitals: getHospitals,
            getMedicalDoctors: getMedicalDoctors,
            getNotifications: getNotifications,
            getDispatchPhoneNumbers: getDispatchPhoneNumbers,
            getUsers: getUsers,
            createHospital: createHospital,
            createNotification: createNotification,
            createCategory: createCategory,
            createDispatchPhNo: createDispatchPhNo,
            updateSubcategory: updateSubcategory,
            subcategoryRemove: subcategoryRemove,
            updateNotification: updateNotification,
            notificationRemove: notificationRemove,
            updateDispPhNo: updateDispPhNo,
            dispPhNoRemove: dispPhNoRemove,
            updateDoctor: updateDoctor,
            doctorRemove: doctorRemove,
            hospitalSave: hospitalSave,
            hospitalRemove: hospitalRemove,
            categorySave: categorySave,
            categoryRemove: categoryRemove,
            settingSave: settingSave,
            createDatacenter: createDatacenter,
            updateDatacenter: updateDatacenter,
            datacenterRemove: datacenterRemove,
            createUser: createUser,
            updateUser: updateUser,
            userRemove: userRemove,
            profile: profile
           
        };
        return service;

       
        function getURparties() {
            return $http.get('unregistered_parties');
        }

        function getCategories() {
            return $http.get('categories');
        }
        function getSubcategories() {
            return $http.get('subcategories');
        }
          
        function getSettings() {
            return $http.get('settings');
        }
        function getHospitals() {
            return $http.get('hospitals');
        }
        function getMedicalDoctors() {
            return $http.get('medical_doctors');
        }
        function getNotifications() {
            return $http.get('administrators');
        }

        function getDispatchPhoneNumbers() {
            return $http.get('dispatch_phone_numbers');
        }
        
        function getUsers() {
            return $http.get('users');
        }

        function createNotification(notification) {
           
            var params = {                
                name : notification.name,
                phone_number : notification.phone_number,
                email : notification.email,
                data_center_id: profile.userInfo.data_center_id
            };
            var req = {
                method: 'POST',
                data: $.param(params),
                url: 'administrators'
            }
            //return $http(req);
            return $http.post('administrators', params);

        }
        function updateNotification(notfn) {
            var params = {
                name: notfn.name,
                phone_number: notfn.phone_number,
                email: notfn.email,
                data_center_id: profile.userInfo.data_center_id
            };
            var req = {
                method: 'PATCH',
                data: $.param(params),
                url: 'administrators/' + notfn.id
            }
            //return $http(req);
            return $http.patch('administrators/' + notfn.id, params);


        }

        function notificationRemove(notfn) {
            
            var req = {
                method: 'DELETE',
                url: 'administrators/' + notfn.id
            }
            return $http(req);

        }

        function createCategory(category) {
            console.log('Category Name: ' + category.name );

            var params = {                
                name : category.name                
            };
            var req = {
                method: 'POST',
                data: $.param(params),
                url: 'categories'
            }
            return $http.post('categories', params);
        }
        function categorySave(cat) {

            var params = {
                'name': cat.name
            };
            var req = {
                method: 'PATCH',
                data: $.param(params),
                url: 'categories/' + cat.id
            }
            return $http.patch('categories/' + cat.id, params);
        }

        function categoryRemove(cat) {

            var req = {
                method: 'DELETE',
                url: 'categories/' + cat.id
            }
            return $http(req);
        }

        function createDispatchPhNo(dispPhNo) {
            
            var params = {                
                name : dispPhNo.name,               
                phone_number : dispPhNo.phone_number,
                data_center_id: profile.userInfo.data_center_id
            };
            var req = {
                method: 'POST',
                data: $.param(params),
                url: 'dispatch_phone_numbers'
            }
            return $http.post('dispatch_phone_numbers', params);
        }

        function updateDispPhNo(disp) {
                      
            var params = {
                name: disp.name,
                phone_number: disp.phone_number,
                data_center_id: profile.userInfo.data_center_id
            };
            var req = {
                method: 'PATCH',
                data: $.param(params),
                url: 'dispatch_phone_numbers/'+disp.id
            }
            return $http.patch('dispatch_phone_numbers/' + disp.id, params);
        }

        function dispPhNoRemove(disp) {
            var req = {
                method: 'DELETE',
                url: 'dispatch_phone_numbers/' + disp.id
            }
            return $http(req);
        }

        function updateSubcategory(sub) {

            var requestType, urlName = 'subcategories', params = {
                category_id: sub.category_id,
                name: sub.name
            }, req;

            if (sub.id) {
                requestType = 'PATCH';
                urlName = urlName + '/' + sub.id;
            }
            else
                requestType = 'POST';

            req = {
                method: requestType,
                data: $.param(params),
                url: urlName
            }
            if (sub.id) {
                return $http.patch('subcategories/' + sub.id, params);
            }
            else
                return $http.post('subcategories', params);
        }

        function subcategoryRemove(sub) {
            var req = {
                method: 'DELETE',
                url: 'subcategories/'+sub.id
            }
            return $http(req);
        }
        function createHospital(hospital) {

            var params = {
                'name': hospital.name,
                'address':hospital.address
            };
            var req = {
                method: 'POST',
                data: $.param(params),
                url: 'hospitals'
            }
            return $http.post('hospitals', params);
        }

        function hospitalSave(hospital) {
            var params = {    
                'name': hospital.name,
                'address': hospital.address
            };
            var req = {
                method: 'PATCH',
                data: $.param(params),
                url: 'hospitals/' + hospital.id
            }
            return $http.patch('hospitals/' + hospital.id, params);
        }

        function hospitalRemove(hspl) {

            var req = {
                method: 'DELETE',
                url: 'hospitals/' + hspl.id
            }
            return $http(req);
        }
        function updateDoctor(doc) {

            var params = {    
                hospital_id: doc.hospital_id,
                name: doc.name,
                phone_number: doc.phone_number
            };
            
            if (doc.id) {
                return $http.patch('medical_doctors/' + doc.id, params);
            } else
                return $http.post('medical_doctors', params);
        }

        function doctorRemove(doc) {
            var req = {
                method: 'DELETE',
                url: 'medical_doctors/' + doc.id
            }
            return $http(req);
        }
        function settingSave(setting) {
            var params = {
                value: setting.value.toString()
            };
            
            return $http.patch('settings/' + setting.id, params);
        }

        function createDatacenter(datacenter) {
            datacenter.is_simulator = datacenter.is_simulator ? 1 : 0;
            console.log('Datacenter Name: ' + datacenter.name + ' is Simmulator: ' + datacenter.is_simulator);

            var params = {
                name: datacenter.name,
                is_simulator: datacenter.is_simulator                
            };
            return $http.post('data_centers', params);
        }

        function updateDatacenter(datacenter) {
            datacenter.is_simulator = datacenter.is_simulator ? 1 : 0;

            var params = {
                name: datacenter.name,
                is_simulator: datacenter.is_simulator
            };
            return $http.patch('data_centers/' + datacenter.id, params);
        }

        function datacenterRemove(datacenter) {
            var req = {
                method: 'DELETE',
                url: 'data_centers/' + datacenter.id
            }
            return $http(req);
        }
        function createUser(user) {           
            console.log('User Name: ' + user.username + ' Password: ' + user.password + ' Passowrd Confirm: '+ user.password_confirmation+ ' Datacenter Id: ' + user.datacenter.id + ' Role:' + user.user_role_id + ' Lang: ' + user.locale);
            var params = {
                username: user.username,
                password: user.password,
                password_confirmation : user.password_confirmation,
                user_role_id : user.user_role_id,
                locale : user.locale,
                data_center_id: user.datacenter.id
            };
            return $http.post('users', params);
        }

        function updateUser(user) {           
            var params = {
                username: user.username,
                password: user.password,
                password_confirmation: user.password_confirmation,
                user_role_id: user.user_role_id,
                locale: user.locale,
                data_center_id: user.data_center_id,
                data_center_permissions: user.data_center_permissions
            };
            return $http.patch('users/' + user.id, params);
        }

        function userRemove(user) {
            var req = {
                method: 'DELETE',
                url: 'users/' + user.id
            }
            return $http(req);
        }
    };
})();
