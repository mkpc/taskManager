angular.module('MyApp', ['ngMaterial', 'ngMessages', 'ngResource', 'ngMdIcons'])
    .controller('AppCtrl', AppCtrl)
    .controller('DialogController', DialogController);

function AppCtrl($scope, $mdDialog, $http) {
    $http.get('/book')
        .then(function (response) {
            console.log(response.data);
            $scope.todos = response.data;
        });
    // $scope.save = function () {
    //     if (!$scope.newTodo || $scope.newTodo.length < 1) return;
    //     var todo = new Todos({name: $scope.newTodo, completed: false});
    //
    //     todo.$save(function () {
    //         $scope.todos.push(todo);
    //         $scope.newTodo = ''; // clear textbox
    //     });
    // };


    $scope.addTask = function (event, index) {
        $scope.editing = angular.copy($scope.todos[index]);
        showDialog(index, true, event);
    };

    // $scope.cancel = function (index) {
    //     $scope.todos[index] = angular.copy($scope.editing[index]);
    //     $scope.editing[index] = false;
    // };

    // $scope.remove = function (index) {
    //     var todo = $scope.todos[index];
    //     Todos.remove({id: todo._id}, function () {
    //         $scope.todos.splice(index, 1);
    //     });
    // };

    $scope.selectTask = function (event, index) {
        $scope.editing = angular.copy($scope.todos[index]);
        console.log('editing', $scope.editing);
        showDialog(index, false, event);
    };

    function showDialog(index, isNewTask, event) {
        $mdDialog.show({
            controller: DialogController,
            controllerAs: 'DialogController',
            templateUrl: 'dia.temp.html',
            parent: angular.element(document.body),
            targetEvent: event,
            locals: {
                task: $scope.todos[index],
                isNewTask: isNewTask,
                editing : $scope.editing
            }
        })
            .then(
                function (answer) {
                    $scope.status = 'You said the information was "' + answer + '".';
                }, function () {
                    $scope.status = 'You cancelled the dialog.';
                });
    }
}
function DialogController($scope, $mdDialog, task, isNewTask) {
    var todayDate = new Date();
    $scope.task = task;
    $scope.isNewTask = locals.isNewTask;
    $scope.editing = locals.editing;

    if (isNewTask) {
        $scope.task = {updated: todayDate};
    }
    if (task) {
        if ($scope.task.hasOwnProperty('updated')) {
            $scope.task.updated = new Date($scope.task.updated);
        }
        if ($scope.task.hasOwnProperty('due')) {
            $scope.task.due = new Date($scope.task.due);
        }
    }

    $scope.hide = function () {
        $mdDialog.hide();
    };

    $scope.delete = function () {
        $mdDialog.cancel();
    };

    $scope.done = function (task) {
        console.log('done', task);
        console.log($scope.editing);
        $mdDialog.hide(task);
    };
}




