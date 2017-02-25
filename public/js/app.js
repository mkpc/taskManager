angular.module('MyApp', ['ngMaterial', 'ngMessages'])
    .controller('AppCtrl', function ($scope, $mdDialog) {

        $scope.todos = [
            {
                what: 'Buy apple juice',
                who: 'Min Li Chan',
                when: '11/23/2016',
                notes: " I'll be in your neighborhood doing errands"
            },
            {
                what: 'Fix Ryan computer',
                who: 'Min Li Chan',
                when: '2/14/2016',
                notes: " I'll be in your neighborhood doing errands"
            },
            {
                what: 'Brunch with Raymond',
                who: 'Min Li Chan',
                when: '9/30/2016',
                notes: " I'll be in your neighborhood doing errands"
            },
            {
                what: 'Oil change',
                who: 'Min Li Chan',
                when: '12/23/2016',
                notes: " I'll be in your neighborhood doing errands"
            },
            {
                what: 'Camping!',
                who: 'Min Li Chan',
                when: '12/24/2016',
                notes: " I'll be in your neighborhood doing errands"
            },
            {
                what: 'Buy apple juice',
                who: 'Min Li Chan',
                when: '11/23/2016',
                notes: " I'll be in your neighborhood doing errands"
            },
            {
                what: 'Fix Ryan computer',
                who: 'Min Li Chan',
                when: '2/14/2016',
                notes: " I'll be in your neighborhood doing errands"
            },
            {
                what: 'Brunch with Raymond',
                who: 'Min Li Chan',
                when: '9/30/2016',
                notes: " I'll be in your neighborhood doing errands"
            },
            {
                what: 'Oil change',
                who: 'Min Li Chan',
                when: '12/23/2016',
                notes: " I'll be in your neighborhood doing errands"
            },
            {
                what: 'Camping!',
                who: 'Min Li Chan',
                when: '12/24/2016',
                notes: " I'll be in your neighborhood doing errands"
            },
            {
                what: 'Buy apple juice',
                who: 'Min Li Chan',
                when: '11/23/2016',
                notes: " I'll be in your neighborhood doing errands"
            },
            {
                what: 'Fix Ryan computer',
                who: 'Min Li Chan',
                when: '2/14/2016',
                notes: " I'll be in your neighborhood doing errands"
            },
            {
                what: 'Brunch with Raymond',
                who: 'Min Li Chan',
                when: '9/30/2016',
                notes: " I'll be in your neighborhood doing errands"
            },
            {
                what: 'Oil change',
                who: 'Min Li Chan',
                when: '12/23/2016',
                notes: " I'll be in your neighborhood doing errands"
            },
            {
                what: 'Camping!',
                who: 'Min Li Chan',
                when: '12/24/2016',
                notes: " I'll be in your neighborhood doing errands"
            }
        ];

        $scope.doSecondaryAction = function (event) {
            $mdDialog.show(
                $mdDialog.alert()
                    .title('Secondary Action')
                    .textContent('Secondary actions can be used for one click actions')
                    .ariaLabel('Secondary click demo')
                    .ok('Neat!')
                    .targetEvent(event)
            );
        };

        $scope.showAdvanced = function (ev, index) {
            $mdDialog.show({
                controller: function DialogController($scope, $mdDialog, user) {
                    //make ajax call to get task
                   // console.log(user);
                    $scope.user = user;
                    $scope.hide = function () {
                        $mdDialog.hide();
                    };

                    $scope.delete = function () {
                        $mdDialog.cancel();
                    };

                    $scope.answer = function (answer) {
                        console.log(answer);
                        $mdDialog.hide(answer);
                    };
                },
                controllerAs: 'ctrl',
                templateUrl: 'dia.temp.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
                locals: {
                    user: $scope.todos[index]
                }
            })
                .then(function (answer) {
                    $scope.status = 'You said the information was "' + answer + '".';
                }, function () {
                    $scope.status = 'You cancelled the dialog.';
                });

        };
    });

