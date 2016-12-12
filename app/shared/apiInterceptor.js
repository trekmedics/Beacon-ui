(function () {
    'use strict';

    angular.module('beacon').factory('apiInterceptor', apiInterceptor);
    apiInterceptor.$inject = ['$q'];

    function apiInterceptor($q) {

//        var apiPrefix = 'https://dispatch.trekmedics.org/api/v2/', appUrl = 'app/', currentApiCounter = 0;
        var apiPrefix = 'https://localhost:5000/api/v2/', appUrl = 'app/', currentApiCounter = 0;
        return {
            request: request,
            requestError: requestError,
            response: response,
            responseError: responseError
        };

        function isApiCall(config)
        {
            return config.url.indexOf(appUrl) !== 0 && config.url.indexOf(".html") === -1 && config.url.indexOf(".js") === -1 && config.url.indexOf(".css") === -1;
        }

        function checkLoading(isRequest)
        {
            if(isRequest){
                currentApiCounter++;
            }
            else {
                currentApiCounter--;
            }

            if (currentApiCounter > 0) {
                angular.element('#divLoader').removeClass('overlayInactive');
            }
            else {
                currentApiCounter = 0;
                angular.element('#divLoader').addClass(('overlayInactive'))
            }
        }

        //request success
        function request(config) {
            checkLoading(true);
            if (isApiCall(config)) {
                if (config.url.indexOf(apiPrefix) !== 0) {
                    config.url = apiPrefix + config.url;
                }
                if (config.url.indexOf('?')=== -1)
                    config.url = config.url + '?';
                if (window.authToken) {
                    config.url = config.url + window.authToken;
                }
            }

            // Return the config or promise.
            return config || $q.when(config);
        }

        //request error
        function requestError(rejection) {
            checkLoading(false);
            //if (rejection.url.indexOf(apiUrl) === 0)
            //    navigation.isLoading = false;
            //utility.showError(rejection.data.Message);

            // Return the promise rejection.
            return $q.reject(rejection);
        }

        // response success
        function response(response) {
            checkLoading(false);
            if (isApiCall(response.config))
            {

            }
                //navigation.isLoading = false;

            //checking whether we got our AjaxModel
            //if (response.data.hasOwnProperty("Success") && response.data.hasOwnProperty("Message") && response.data.hasOwnProperty("Model")) {
            //    if (response.data.Success === false) {
            //        //alert(response.data.Message);
            //        if (response.config.data.supressToastr === true) {
            //            response.config.data.supressToastr = false;
            //            return $q.reject(response.data.Message);
            //        }
            //        else {
            //            utility.showError(response.data.Message);
            //            return $q.reject(response);
            //        }
            //    }
            //    else {
            //        utility.showInfo(response.data.Message);
            //        response.data = response.data.Model;
            //    }
            //}

            // Return the response or promise.
            return response || $q.when(response);
        }

        //response Error
        function responseError(rejection) {
            checkLoading(false);
            //if (rejection.config.url.indexOf(appUrl) !== 0) {
            //    navigation.isLoading = false;
            //    utility.showError(rejection.data.Message);
            //}

            // Return the promise rejection.
            return $q.reject(rejection);
        }
    }
})();
