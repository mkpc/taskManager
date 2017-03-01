/**
 * Created by MarcoC on 2/28/17.
 */
angular
    .module('MyApp')
    .controller('DialogController', DialogController);

function DialogController($mdDialog, locals, $rootScope, common) {
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
        common.makeRequest('DELETE', '/', task)
            .then(common.showToast('Task deleted!'))
            .then($rootScope.tasks.splice(selectedIndex, 1));
        $mdDialog.cancel();
    }

    function saveTask(task) {
        var preparedTask = convertDateToString(task);
        preparedTask.status = (vm.isCompleted ? "completed" : "needsAction");
        if (!vm.isCompleted) {
            delete preparedTask.completed;
        }
        common.makeRequest('PUT', '/', preparedTask)
            .then(common.showToast("Task updated!"))
            .then($rootScope.tasks[selectedIndex] = preparedTask);
        $mdDialog.hide();
    }

    function cancelDialog() {
        $mdDialog.hide();
    }

    function addTask(task) {
        $mdDialog.hide();
        var preparedTask = convertDateToString(task);
        common.makeRequest('POST', '/post', preparedTask)
            .then(function (res) {
                if ($rootScope.tasks === "" || $rootScope.tasks === "undefined" || $rootScope.tasks === null) {
                    $rootScope.tasks = [];
                }
                $rootScope.tasks.unshift(res.data);
            }).then(common.showToast("Task added!"));
    }
}