angular.module('MyApp', ['ngMaterial', 'ngMessages'])
    .controller('AppCtrl', AppCtrl)
    .controller('DialogController', DialogController);

function AppCtrl($scope, $mdDialog, $http) {
    $http.get('/book')
        .then(function (response) {
            console.log(response.data);
            $scope.todos = response.data;
        });

    $scope.save = function () {
        if (!$scope.newTodo || $scope.newTodo.length < 1) return;
        var todo = new Todos({name: $scope.newTodo, completed: false});

        todo.$save(function () {
            $scope.todos.push(todo);
            $scope.newTodo = ''; // clear textbox
        });
    };

    $scope.cancel = function (index) {
        $scope.todos[index] = angular.copy($scope.editing[index]);
        $scope.editing[index] = false;
    };

    $scope.remove = function (index) {
        var todo = $scope.todos[index];
        Todos.remove({id: todo._id}, function () {
            $scope.todos.splice(index, 1);
        });
    };

    $scope.selectTask = function (ev, index) {
        $scope.editing = angular.copy($scope.todos[index]);
        console.log($scope.editing);

        $mdDialog.show({
            controller: DialogController,
            controllerAs: 'DialogController',
            templateUrl: 'dia.temp.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            locals: {
                task: $scope.todos[index]
            }
        })
            .then(
                function (answer) {
                    $scope.status = 'You said the information was "' + answer + '".';
                }, function () {
                    $scope.status = 'You cancelled the dialog.';
                });
    };
}


function DialogController($scope, $mdDialog, task) {
    $scope.task = task;

    (function parseDate() {
        if ($scope.task.updated !== null) {
            $scope.task.updated = new Date($scope.task.updated);
        }
        if ($scope.task.hasOwnProperty('due')) {
            $scope.task.due = new Date($scope.task.due);
            console.log($scope.task.due);
        }
    })();

    $scope.hide = function () {
        $mdDialog.hide();
    };

    $scope.delete = function () {
        $mdDialog.cancel();
    };

    $scope.done = function (task) {
        console.log('done',task);
        console.log($scope.editing);
        $mdDialog.hide(task);
    };
}


