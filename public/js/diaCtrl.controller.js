/**
 * Created by MarcoC on 2/28/17.
 */
angular
    .module('MyApp')
    .controller('DialogController', DialogController);

function DialogController($mdDialog, locals, $http, $rootScope) {
    var todayDate = new Date();
    var vm = this;
    var selectedIndex = locals.selectedIndex;
    vm.isNewTask = locals.isNewTask;
    vm.editing = locals.editing;

    vm.convertDateToString = convertDateToString;
    vm.deleteTask = deleteTask;
    vm.saveTask = saveTask;
    vm.cancelDialog = cancelDialog;
    vm.addTask = addTask;

    (function preFormatTask() {
        if (locals.editing === undefined) {
            vm.isCompleted = false;
        } else {
            vm.isCompleted = (locals.editing.status === 'completed');
        }

        if (vm.isNewTask) {
            vm.editing = {updated: todayDate};
        }
        if (vm.editing) {
            if (vm.editing.hasOwnProperty('updated')) {
                vm.editing.updated = new Date(vm.editing.updated);
            }
            if (vm.editing.hasOwnProperty('due')) {
                vm.editing.due = new Date(vm.editing.due);
            }
        }
    })();


    function convertDateToString(task) {
        var newTask = angular.copy(task);
        if (task.hasOwnProperty('updated')) {
            newTask.updated = task.updated.toISOString();
        }
        if (task.hasOwnProperty('due')) {
            newTask.due = task.due.toISOString();
        }
        return newTask;
    }

    function deleteTask(task) {
        $http({
            method: 'DELETE',
            url: '/',
            data: task,
            dataType: "json",
            headers: {'Content-Type': 'application/json'}
        }).then($rootScope.showToast('Task deleted!'));
        $rootScope.tasks.splice(selectedIndex, 1);
        $mdDialog.cancel();
    }

    function saveTask(task) {
        var preparedTask = convertDateToString(task);
        preparedTask.status = (vm.isCompleted ? "completed" : "needsAction");
        if (!vm.isCompleted) {
            delete preparedTask.completed;
        }
        $http.put('/', preparedTask).then($rootScope.showToast("Task updated!"));
        $rootScope.tasks[selectedIndex] = preparedTask;
        $mdDialog.hide();
    }

    function cancelDialog() {
        $mdDialog.hide();
    }

    function addTask(task) {
        $mdDialog.hide();
        var preparedTask = convertDateToString(task);
        $http.post('/post', preparedTask).then(function (res) {
            if ($rootScope.tasks === "" || $rootScope.tasks === "undefined" || $rootScope.tasks === null) {
                $rootScope.tasks = [];
            }
            $rootScope.tasks.unshift(res.data);
        }).then($rootScope.showToast("Task added!"));
    }
}