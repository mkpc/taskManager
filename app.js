// angular.module('MyApp',['ngMaterial', 'ngMessages', 'material.svgAssetsCache'])
//     .config(function($mdIconProvider) {
//         $mdIconProvider
//             .iconSet('social', 'img/icons/sets/social-icons.svg', 24)
//             .iconSet('device', 'img/icons/sets/device-icons.svg', 24)
//             .iconSet('communication', 'img/icons/sets/communication-icons.svg', 24)
//             .defaultIconSet('img/icons/sets/core-icons.svg', 24);
//     })
//     .controller('ListCtrl', function($scope, $mdDialog) {
//         $scope.messages = [
//             {id: 1, title: "Message A", selected: false, date: '10/23/2016'},
//             {id: 2, title: "Message B", selected: true, date: '1/13/2016'},
//             {id: 3, title: "Message C", selected: true,date: '11/24/2016'},
//         ];
//
//         $scope.navigateTo = function(to, event) {
//             $mdDialog.show(
//                 $mdDialog.alert()
//                     .title('Navigating')
//                     .textContent('Imagine being taken to ' + to)
//                     .ariaLabel('Navigation demo')
//                     .ok('Neat!')
//                     .targetEvent(event)
//             );
//         };
//
//         $scope.doPrimaryAction = function(event) {
//             $mdDialog.show(
//                 $mdDialog.alert()
//                     .title('Primary Action')
//                     .textContent('Primary actions can be used for one click actions')
//                     .ariaLabel('Primary click demo')
//                     .ok('Awesome!')
//                     .targetEvent(event)
//             );
//         };
//
//         $scope.doSecondaryAction = function(event) {
//             $mdDialog.show(
//                 $mdDialog.alert()
//                     .title('Secondary Action')
//                     .textContent('Secondary actions can be used for one click actions')
//                     .ariaLabel('Secondary click demo')
//                     .ok('Neat!')
//                     .targetEvent(event)
//             );
//         };
//
//     });
//
//
// /**
//  Copyright 2016 Google Inc. All Rights Reserved.
//  Use of this source code is governed by an MIT-style license that can be foundin the LICENSE file at http://material.angularjs.org/HEAD/license.
//  **/


angular.module('MyApp',['ngMaterial', 'ngMessages', 'material.svgAssetsCache'])
    .controller('AppCtrl', function($scope) {

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
        ];
    });


/**
 Copyright 2016 Google Inc. All Rights Reserved.
 Use of this source code is governed by an MIT-style license that can be foundin the LICENSE file at http://material.angularjs.org/HEAD/license.
 **/