var app = angular.module('MyApp', ['ngRoute', 'ngMaterial', 'ngMessages', 'ngResource', 'ngMdIcons'])
    .controller('AppCtrl', AppCtrl)
    .controller('DialogController', DialogController);


function AppCtrl($scope, $mdDialog, $http, $rootScope, $mdToast) {


    $scope.sortedBy = 'title';

    $scope.isSortedBy = function (colName) {
        return colName == $scope.sortCol;
    };

    $scope.sortCol = 'rank';

    $rootScope.isAuthed = false;
    $scope.signIn = function () {
        $http.get('/auth/tasks').then(function (response) {
            window.open(response.data);
        })
    };

    $scope.getTaskIndex = function (taskID) {
        return $rootScope.tasks.map(function (e) {
            return e.id;
        }).indexOf(taskID);
    };

    $scope.toggleSelection = function (task) {
        var index = $scope.getTaskIndex(task.id);
        var status = $rootScope.tasks[index].status === 'completed';
        $rootScope.tasks[index].status = !status ? 'completed' : 'needsAction';

        if ($rootScope.tasks[index].status === 'needsAction') {
            delete $rootScope.tasks[index].completed;
        }
        $http.put('/', $rootScope.tasks[index]).then($rootScope.showToast('Task Updated!'));
    };

    $rootScope.showToast = function (message) {
        $mdToast.show(
            $mdToast.simple()
                .textContent(message)
                .position('bottom left')
                .hideDelay(3000)
        );
    };

    $scope.getShortDate = function (date) {
        return new Date(date).toLocaleDateString();
    };

    $http.get('/isAuthed')
        .then(function (response) {
            $rootScope.isAuthed = response.data;
            if (response.data) {
                $http.get('/tasks')
                    .then(function (response) {
                        $rootScope.tasks = (response.data === "" ? [] : response.data);
                    });
            }

        });

    $scope.addTask = function () {
        showDialog(null, true, null,null);
    };

    $scope.selectTask = function (event, task) {
        $scope.editing = angular.copy(task);
        var index = $scope.getTaskIndex(task.id);
        showDialog(task, false, event, index);
    };

    function showDialog(task, isNewTask, event, seletedIndex) {
        $mdDialog.show({
            controller: DialogController,
            controllerAs: 'DialogController',
            templateUrl: 'dia.temp.html',
            parent: angular.element(document.body),
            targetEvent: event,
            locals: {
                selectedTaskID: (isNewTask ? -1 : task.id),
                selectedIndex: seletedIndex,
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

    if (locals.editing === undefined) {
        $scope.isCompleted = false;
    } else {
        $scope.isCompleted = (locals.editing.status === 'completed');
    }

    if ($scope.isNewTask) {
        $scope.editing = {updated: todayDate};
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
        }).then($rootScope.showToast('Task deleted!'));
        $rootScope.tasks.splice(selectedIndex, 1);
        $mdDialog.cancel();
    };

    $scope.saveTask = function (task) {
        var preparedTask = convertDateToString(task);
        preparedTask.status = ($scope.isCompleted ? "completed" : "needsAction");
        if (!$scope.isCompleted) {
            delete preparedTask.completed;
        }
        $http.put('/', preparedTask).then($rootScope.showToast('Task updated!'));
        $rootScope.tasks[selectedIndex] = preparedTask;
        $mdDialog.hide();
    };

    $scope.cancel = function () {
        $mdDialog.hide();
    };

    $scope.add = function (task) {

        $mdDialog.hide();
        var preparedTask = convertDateToString(task);
        $http.post('/post', preparedTask).then(function (res) {

            if( $rootScope.tasks === ""){
                $rootScope.tasks = [];
            }


            $rootScope.tasks.unshift(res.data);
        }).then($rootScope.showToast('Task added!')).then($scope.get());
    };


}
