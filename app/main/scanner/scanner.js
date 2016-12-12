(function () {
    'use strict'
    angular.module('beacon').controller('scanner', scanner);

    scanner.$inject = [];

    function scanner() {
        var vm = {
            init: init,

        };

        init();

        return vm;

        function init() {

        }
    }
})();

