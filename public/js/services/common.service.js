/**
 * Created by MarcoC on 3/1/17.
 */
angular
    .module('MyApp')
    .service('common', function ($mdToast, $http) {
        this.showToast = function (message) {
            $mdToast.show(
                $mdToast.simple()
                    .textContent(message)
                    .position('bottom left')
                    .hideDelay(3000)
            );
        };
        this.makeRequest = function (method, apiUrl, data) {
            return $http({
                method: method,
                url: apiUrl,
                data: data,
                dataType: "json",
                headers: {'Content-Type': 'application/json'}
            })
        }
    });