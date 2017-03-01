/**
 * Created by MarcoC on 2/28/17.
 */
angular
    .module('MyApp')
    .controller('AppCtrl', AppCtrl);

function AppCtrl($mdDialog, $http, $rootScope, $mdToast) {
    var vm = this;

    $rootScope.tasks = [];
    $rootScope.isAuthed = false;
    vm.sortedBy = 'updated';
    vm.sortReverse = sortReverse;
    vm.signIn = signIn;
    vm.getTaskIndex = getTaskIndex;
    vm.toggleSelection = toggleSelection;
    vm.getShortDate = getShortDate;
    vm.addTask = addTask;
    vm.editTask = editTask;
    vm.getShortDate = getShortDate;
    vm.showDialog = showDialog;


    function sortReverse() {
        return vm.sortedBy !== 'title';
    }

    function signIn() {
        var  windowReference= window.open();

        $http.get('/auth/tasks').then(function (response) {
            windowReference.location =response.data;
        })
    }

    function getTaskIndex(taskID) {
        return $rootScope.tasks.map(function (e) {
            return e.id;
        }).indexOf(taskID);
    }

    function toggleSelection(task) {
        var index = vm.getTaskIndex(task.id);
        var status = $rootScope.tasks[index].status === 'completed';
        $rootScope.tasks[index].status = !status ? 'completed' : 'needsAction';

        if ($rootScope.tasks[index].status === 'needsAction') {
            delete $rootScope.tasks[index].completed;
        }
        $http.put('/', $rootScope.tasks[index]).then($rootScope.showToast('Task Updated!'));
    }

    $rootScope.showToast = function (message) {
        //noinspection JSUnresolvedFunction
        $mdToast.show(
            $mdToast.simple()
                .textContent(message)
                .position('bottom left')
                .hideDelay(3000)
        );
    };

    function getShortDate(date) {
        return new Date(date).toLocaleDateString();
    }

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
    function addTask() {
        showDialog(null, true, null, null);
    }

    function editTask(event, task) {
        vm.editing = angular.copy(task);
        var index = vm.getTaskIndex(task.id);
        showDialog(task, false, event, index);
    }

    function showDialog(task, isNewTask, event, seletedIndex) {
        $mdDialog.show({
            controller: DialogController,
            controllerAs: 'dialog',
            templateUrl: 'dia.temp.html',
            parent: angular.element(document.body),
            targetEvent: event,
            locals: {
                selectedTaskID: (isNewTask ? -1 : task.id),
                selectedIndex: seletedIndex,
                isNewTask: isNewTask,
                editing: vm.editing
            }
        })
    }
}