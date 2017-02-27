var app = angular.module('MyApp', ['ngRoute', 'ngMaterial', 'ngMessages', 'ngResource', 'ngMdIcons'])
    .controller('AppCtrl', AppCtrl)
    .controller('DialogController', DialogController);


function AppCtrl($scope, $mdDialog, $http, $rootScope) {
    $scope.toggleSelection = function (index) {
        var status = $rootScope.tasks[index].status === 'completed';
        $rootScope.tasks[index].status = !status ? 'completed' : 'needsAction';


        if ($rootScope.tasks[index].status === 'needsAction' ) {
            delete $rootScope.tasks[index].completed;
        }
        // var preparedTask = convertDateToString(task);
        $http.put('/', $rootScope.tasks[index]);
        // $rootScope.tasks[index] = task;
    };

    $scope.getShortDate = function(date){
        return new Date(date).toLocaleDateString();
    }

    $http.get('/tasks')
        .then(function (response) {
            console.log(response.data);
            $rootScope.tasks = response.data;
        });

    $scope.addTask = function (event, index) {
        $scope.editing = angular.copy($scope.tasks[index]);
        showDialog(index, true, event);
    };

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
    console.log(locals.editing);
    console.log(locals);
    // $scope.myForm
    if (locals.editing === undefined) {
        $scope.isCompleted = false;
    } else {
        $scope.isCompleted = (locals.editing.status === 'completed');
    }


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
        $http({
            method: 'DELETE',
            url: '/',
            data: task,
            dataType: "json",
            headers: {'Content-Type': 'application/json'}
        });
        $rootScope.tasks.splice(selectedIndex, 1);
        $mdDialog.cancel();
    };

    $scope.saveTask = function (task) {
        var preparedTask = convertDateToString(task);
        preparedTask.status = ($scope.isCompleted ? "completed" : "needsAction");
        if (!$scope.isCompleted) {
            delete preparedTask.completed;
        }
        $http.put('/', preparedTask);
        $rootScope.tasks[selectedIndex] = preparedTask;
        $mdDialog.hide();
    };

    $scope.cancel = function () {
        $mdDialog.hide();
    };

    $scope.add = function (task) {
        $mdDialog.hide();
        var preparedTask = convertDateToString(task);
        $http.post('/post', preparedTask);
    };


}
