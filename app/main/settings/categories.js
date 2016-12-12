(function () {
    'use strict'
    angular.module('beacon').controller('categories', categories);

    categories.$inject = ['settingsService'];

    function categories(settingsService) {
        var vm = {
            init: init,
            category: {},
            subcategory: {},
            getSubcategories: getSubcategories,
            categoriesList: [],
            subcategoriesList: [],
            createCategory: createCategory,
            subcategorySave: subcategorySave,
            subcategoryAdd: subcategoryAdd,
            subcategoryRemove: subcategoryRemove,
            categorySave: categorySave,
            categoryRemove: categoryRemove

        };

        init();

        return vm;

        function init() {
            settingsService.getCategories().then(function (res) {
                return vm.categoriesList = res.data;
            });
            settingsService.getSubcategories().then(function (res) {
                return vm.subcategoriesList = res.data
            });
        }

        function getSubcategories(categoryId) {
            return _.filter(vm.subcategoriesList, function (sub) {
                return sub.category_id === categoryId;
            });
        }

        function createCategory(form) {
            if (form.$valid) {
                settingsService.createCategory(vm.category).then(function (res) {
                    vm.categoriesList.unshift(res.data);
                    vm.category = {};
                    form.$submitted = false;
                    form.$setUntouched();
                });
            }
            form.$submitted = true;
        }

        function subcategorySave(sub, form) {
            if (form.$valid) {
                settingsService.updateSubcategory(sub).then(function (res) {
                    var s = res.data, index = vm.subcategoriesList.indexOf(sub);
                    sub.isEdit = false;
                    vm.subcategoriesList.splice(index, 1, s);
                });
            }
            form.$submitted = true;
        }

        function subcategoryAdd(categoryId) {
            var sub = { isEdit: true, name: '', category_id: categoryId };
            vm.subcategoriesList.unshift(sub);
        }

        function subcategoryRemove(sub) {
            settingsService.subcategoryRemove(sub).then(function (res) {
                var index = vm.subcategoriesList.indexOf(sub);
                vm.subcategoriesList.splice(index, 1);
            });
        }

        function categorySave(cat, form) {
            if (form.$valid) {
                settingsService.categorySave(cat).then(function (res) {
                    var c = res.data, index = vm.categoriesList.indexOf(cat);
                    cat.isEdit = false;
                    vm.categoriesList.splice(index, 1, c);
                });
            }
            form.$submitted = true;
        }

        function categoryRemove(cat) {
            settingsService.categoryRemove(cat).then(function (res) {
                var index = vm.categoriesList.indexOf(cat);
                vm.categoriesList.splice(index, 1);
            });
        }

    }
})();