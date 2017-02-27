var app = angular.module('MyApp', ['ngRoute', 'ngMaterial', 'ngMessages', 'ngResource', 'ngMdIcons'])
    .controller('AppCtrl', AppCtrl)
    .controller('DialogController', DialogController);


function AppCtrl($scope, $mdDialog, $http, $rootScope) {
    $http.get('/tasks')
        .then(function (response) {
            console.log(response.data);
            $rootScope.tasks = response.data;
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
        $scope.editing = angular.copy($scope.tasks[index]);
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
        $scope.editing = angular.copy($scope.tasks[index]);
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
                selectedIndex: index,
                isNewTask: isNewTask,
                editing: $scope.editing
            }
        })
    }
}
function DialogController($scope, $mdDialog, locals, $http, $rootScope) {
    var todayDate = new Date();
    var selectedIndex = locals.selectedIndex;
    $scope.isNewTask = locals.isNewTask;
    $scope.editing = locals.editing;
    console.log(locals);
    // $scope.myForm

    if ($scope.isNewTask) {
        $scope.editing = {updated: todayDate};
        console.log($scope.isNewTask, $scope.editing);
    }
    if ($scope.editing) {
        if ($scope.editing.hasOwnProperty('updated')) {
            $scope.editing.updated = new Date($scope.editing.updated);
        }
        if ($scope.editing.hasOwnProperty('due')) {
            $scope.editing.due = new Date($scope.editing.due);
        }
    }

    var convertDateToString = function (task) {
        var newTask = angular.copy(task);
        if (task.hasOwnProperty('updated')) {
            newTask.updated = task.updated.toISOString();
        }
        if (task.hasOwnProperty('due')) {
            newTask.due = task.due.toISOString();
        }
        return newTask;
    };

    $scope.get = function () {
        $http.get('/tasks')
            .then(function (response) {
                $rootScope.tasks = response.data;
            });
    };

    $scope.delete = function (task) {
        console.log('Delete this task : ', task);

        $http.delete('/', JSON.stringify(task));
        console.log('selectedIndex : ', selectedIndex);
        $rootScope.tasks.splice(selectedIndex, 1);
        $mdDialog.cancel();
        $scope.get();
    };

    $scope.save = function (task) {
        var preparedTask = convertDateToString(task);
        $http.post('/', JSON.stringify(preparedTask));
        $scope.get();
        $mdDialog.hide();
    };

    $scope.add = function (task) {
        $mdDialog.hide();

        var preparedTask = convertDateToString(task);
        console.log('Add this task : ', preparedTask);

         $http.put('/', JSON.stringify(task));
    };


}
//
//
// var a = {
//     "kind": "tasks#task",
//     "id": "MTI1MjkyOTc4MTA3NzU5ODQ4NjI6MDoxNzMyNDg4Mzkw",
//     "etag": "NEVtLf5Q_dTURZbE3E-zlPpPgGk/LTExMzcwMzU5ODY",
//     "title": "I changed it",
//     "updated": "2017-02-26T06:59:12.000Z",
//     "selfLink": "https://www.googleapis.com/tasks/v1/lists/MTI1MjkyOTc4MTA3NzU5ODQ4NjI6MDow/tasks/MTI1MjkyOTc4MTA3NzU5ODQ4NjI6MDoxNzMyNDg4Mzkw",
//     "position": "00000000001234803096",
//     "notes": "there are no note to change",
//     "status": "completed",
//     "due": "2017-02-28T00:00:00.000Z",
//     "completed": "2017-02-26T06:59:12.000Z",
//     "deleted": false
// }