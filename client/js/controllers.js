'use strict';

/* Controllers */

app.controller('MenuCtrl', function ($scope, $location) {
    $scope.isActive = function (viewLocation) {
        return viewLocation === $location.path();
    };
});

app.controller('AlertCtrl', function ($scope, AlertService) {
    $scope.alerts = AlertService.items;

    $scope.closeAlert = AlertService.closeAlert;
});

app.controller('AuthCtrl', function ($scope, $location, AuthService, AlertService, UserService) {
    $scope.user = UserService.user;

    $scope.logout = function() {
        AuthService.logout({}).$promise.then(function() {
            AlertService.addAlert('You are now logged out!', 'success', 2000);

            //TODO: Move to service layer.
            $.cookie('remember', 0, {expires: 3360, path:'/'});
            $.cookie('username', '', {expires: 3360, path:'/'});
            $.cookie('password', '', {expires: 3360, path:'/'});

            $location.path('/login');
        });
    }
});

app.controller('LoginCtrl', function ($scope, $location, AuthService, AlertService) {
    $scope.user = {

    };

    $scope.login = function() {
        AuthService.login($scope.user, function(response) {
            AlertService.addAlert('You are now logged in!', 'success', 2000);

            //TODO: Move to service layer.
            if(response.config.data.remember === true) {
                $.cookie('remember', 1, {expires: 3360, path:'/'});
                $.cookie('username', response.config.data.username, {expires: 3360, path:'/'});
                $.cookie('password', response.config.data.password, {expires: 3360, path:'/'});
            }

            $location.path('/events');
        }, function(response) {
            if(response.status === 401) {
                AlertService.addAlert('Login Error Invalid username/password combination. Please try again.', 'danger', 2000);
            }
        });
    }
});

app.controller('EventsCtrl', function ($scope, $route, $location, EventService, FieldsetService, breadcrumbs) {
    if( $route.current.params.id || $route.current.params.view == 'event') {
        EventService.get({id: $route.current.params.id}, {view: $route.current.params.view}).$promise.then(function(response) {
            $scope.event = response.resource;

            //TODO: Make this obsolete!
//            if($scope.event.item.documents.length === 0) {
//                $scope.event.item.documents = [{
//                    title: null
//                }]
//            }
        });
    } else {

        EventService.browse({view: $route.current.params.view}).$promise.then(function(response) {
            $scope.events = response.resource;

            $scope.export = response.config.url;
        });
    };
    $scope.elements = FieldsetService.get();

    $scope.breadcrumbs = breadcrumbs;

    $scope.save = function() {
        EventService.save($scope.event.item).$promise.then(function(data){
            var id;

            //TODO: Make this obsolete!
            if(typeof data.item != "undefined") {
                id = data.item.id;
            } else {
                id = data.id;
            };

            $location.path('/' + $route.current.params.view + '/' + id);
        });
    };

    $scope.remove2 = function() {
        EventService.remove($scope.event.item).$promise.then(function(data){
            $location.path('/events');
        });
    };

    $scope.$watch('currentPage', function(newPage){
        if(newPage) {
            $location.search({
                limit: $route.current.params.limit,
                offset: (newPage ? newPage : 1) * 20 - 20
            });
        };
    });

    $scope.$on('$routeUpdate', function() {
        EventService.browse({
            view: $route.current.params.view,
            limit: $route.current.params.limit || 20,
            offset: $route.current.params.offset,
            search: $route.current.params.search,
            ctas_involvement:  $route.current.params.ctas_involvement,
            start_date:  $route.current.params.start_date,
            end_date:  $route.current.params.end_date
        }).$promise.then(function(response) {
            $scope.events = response.resource;
            $scope.export = response.config.url;
        });
    });

//    $scope.regions = RegionService.browse();

    $scope.send = function() {
        $location.search({
            search: $scope.search
        });
    };

    $scope.change = function() {
        $location.search({
            ctas_involvement: $scope.filters.ctas_involvement ? $scope.filters.ctas_involvement : ''
        });
    };

//    $scope.$watch('filters.dates', function(newVal, oldVal) {
//       if(newVal) {
//           var start_date = new Date(newVal.startDate);
//           var end_date = new Date(newVal.endDate);
//
//           $location.search({
//               ctas_involvement: $scope.filters.ctas_involvement ? $scope.filters.ctas_involvement : '',
//               start_date: start_date.getFullYear() + '-' + ("0" + (start_date.getMonth() + 1)).slice(-2) + '-' + ("0" + start_date.getDate()).slice(-2),
//               end_date: end_date.getFullYear() + '-' + ("0" + (end_date.getMonth() + 1)).slice(-2) + '-' + ("0" + end_date.getDate()).slice(-2)
//           });
//       }
//    });

    $scope.search = $route.current.params.search;

    //TODO: Get data from CCK.
    $scope.ctas_involvement = [
        {name:'CTA organised or co-organised event', value:'CTA organised or co-organised event'},
        {name:'Event attended by CTA staff', value:'Event attended by CTA staff'},
        {name:'General ARD event organised by CTA partner', value:'General ARD event organised by CTA partner'},
        {name:'General ARD event not organised by CTA partner', value:'General ARD event not organised by CTA partner'},
    ];

    $scope.addmeh = function() {
        var last = _.last($scope.event.item.days);
        var from = new Date(last.date);
        var to = new Date();

        $scope.event.item.days.push({
            'title': 'Day',
            'date': to.setDate(from.getDate() + 1),
            'start_time': new Date(last.start_time),
            'end_time': new Date(last.end_time)
        });
    };

    $scope.addmeh2 = function() {
        $scope.event.item.documents.push({
            'title': null
        });
    };

    $scope.remove = function(index) {
        $scope.event.item.days.splice(index, 1);
    };

    $scope.uploadComplete = function (content) {
        $scope.response = content;
        $scope.event.item.documents = content;
    };
});

app.controller('DatepickerDemoCtrl', function ($scope) {
    $scope.today = function() {
        $scope.dt = new Date();
    };
    $scope.today();

    $scope.showWeeks = true;
    $scope.toggleWeeks = function () {
        $scope.showWeeks = ! $scope.showWeeks;
    };

    $scope.clear = function () {
        $scope.dt = null;
    };

    // Disable weekend selection
    $scope.disabled = function(date, mode) {
        return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
    };

    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
    };

    $scope.dateOptions = {
        'year-format': "'yy'",
        'starting-day': 1
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'shortDate'];
    $scope.format = $scope.formats[0];

    $scope.map = {
        center: {
            latitude: 45,
            longitude: -73
        },
        zoom: 8
    };
});

app.controller('UploadCtrl', function ($scope, $upload) {
    $scope.onFileSelect = function($files, $index) {
        //$files: an array of files selected, each file has name, size, and type.
        for (var i = 0; i < $files.length; i++) {
            var file = $files[i];
            $scope.upload = $upload.upload({
                url: '../server/index.php?option=com_documents&view=upload&format=json', //upload.php script, node.js route, or servlet url
                // method: POST or PUT,
                // headers: {'headerKey': 'headerValue'},
                // withCredentials: true,
                data: {title: $scope.document.title},
                file: file,
                // file: $files, //upload multiple files, this feature only works in HTML5 FromData browsers
                /* set file formData name for 'Content-Desposition' header. Default: 'file' */
                //fileFormDataName: myFile, //OR for HTML5 multiple upload only a list: ['name1', 'name2', ...]
                /* customize how data is added to formData. See #40#issuecomment-28612000 for example */
                //formDataAppender: function(formData, key, val){} //#40#issuecomment-28612000
            }).progress(function(evt) {
                console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
            }).success(function(data, status, headers, config) {
                $scope.$parent.event.item.documents[$index].files = data;
            });
            //.error(...)
            //.then(success, error, progress);
        }
        // $scope.upload = $upload.upload({...}) alternative way of uploading, sends the the file content directly with the same content-type of the file. Could be used to upload files to CouchDB, imgur, etc... for HTML5 FileReader browsers.
    };
});