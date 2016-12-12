(function () {
    'use strict'

    angular.module('beacon').filter('time', function ($filter) {
        return function (input, utc_offset) {
            if (!input) { return ''; }
            var _time = $filter('date')(new Date(input), 'HH:mm:ss', utc_offset);
            return _time.toUpperCase();
        };
    });

    angular.module('beacon').filter('datetime', function ($filter) {
        return function (input, utc_offset) {
            if (!input) { return ''}
            var _time = $filter('date')(new Date(input), 'HH:mm:ss.sss', utc_offset), _date = $filter('date')(new Date(input), 'yyyy-MM-dd', utc_offset);

            return (_date + ' ' + _time).toUpperCase();
        };
    });
})();

