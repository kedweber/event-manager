'use strict';

/* Services */

app.factory('AlertService', function($timeout) {
    var service = {};
    service.items = [];

    service.addAlert = function(msg, type, timeout) {
        service.items.push({msg: msg, type: type});

        if (timeout) {
            $timeout(function(){
                service.closeAlert(this);
            }, timeout);
        }
    };

    service.closeAlert = function(index) {
        service.items.splice(index, 1);
    };

    return service;
});


app.factory('EventService', function($resource, $route, $q) {
    var transformRequest = function(data) {
        angular.forEach(data.days, function(value){
            var date = new Date(value.date);
            var start_time =  new Date(value.start_time);
            var end_time =  new Date(value.end_time);

            value.date = date.getFullYear() + '-' + ("0" + (date.getMonth())).slice(-2) + '-' + ("0" + date.getDate()).slice(-2);
            value.start_time = ("0" + start_time.getHours()).slice(-2) + ':' + ("0" + (start_time.getMinutes())).slice(-2) + ':' + ("0" + start_time.getSeconds()).slice(-2);
            value.end_time = ("0" + end_time.getHours()).slice(-2) + ':' + ("0" + (end_time.getMinutes())).slice(-2) + ':' + ("0" + end_time.getSeconds()).slice(-2);
        }, data.days);

        return $.param(data);
    }

    return $resource('../server/index.php?option=com_events&view=:view&format=json&id=:id&limit=:limit&offset=:offset&search=:search&ctas_involvement=:ctas_involvement&start_date=:start_date&end_date=:end_date', {
            id: '@id',
            limit: $route.current.params.limit || 20,
            offset: $route.current.params.offset || 0,
            search: $route.current.params.search,
            ctas_involvement: $route.current.params.ctas_involvement,
            start_date:  $route.current.params.start_date,
            end_date:  $route.current.params.end_date
        },{
            browse: {
                method: 'GET',
                params: { view: 'events' },
                interceptor: {
                    response: function(response) {
                        angular.forEach(response.resource.items, function(object) {
                            object.start_date = object.start_date * 1000;
                            object.end_date = object.end_date * 1000;
                        }, response.resource.items);

                        return response || $q.when(response);
                    }
                }
            },
            get: {
                method: 'GET',
                interceptor: {
                    // Convert times and dates to Javascript. HerpDerp!
                    response: function(response) {
                        //Default test data
                        if(response.resource.item.id <= 0) {
                            response.resource.item.days = [
                                {
                                    "title": "Day 1",
                                    "date": "2014-04-03",
                                    "start_time": "09:00:00",
                                    "end_time": "17:00:00"
                                },
                                {
                                    "title": "Day 2",
                                    "date": "2015-04-03",
                                    "start_time": "09:00:00",
                                    "end_time": "17:00:00"
                                }
                            ];
                        }

                        // Convert start_date and end_date to JavaScript Date object.
                        // TODO: Remove the need for a if statement.
                        if(response.resource.item.id) {
//                            var start_date = response.resource.item.start_date.split(/-/);
//                            var end_date = response.resource.item.end_date.split(/-/);
//
//                            response.resource.item.start_date = new Date(start_date[0], start_date[1], start_date[2]);
//                            response.resource.item.end_date = new Date(end_date[0], end_date[1], end_date[2]);

                            response.resource.item.start_date = new Date(response.resource.item.start_date * 1000);
                            response.resource.item.end_date = new Date(response.resource.item.end_date * 1000);
                        }

                        // Convert date start_time and end_time to JavaScript Date object.
                        angular.forEach(response.resource.item.days, function(value){
                            var date = value.date.split(/-/);
                            var start_time = value.start_time.split(/:/);
                            var end_time = value.end_time.split(/:/);

                            value.date = new Date(date[0], date[1] - 1, date[2]);
                            value.start_time = new Date(0, 0, 0, start_time[0], start_time[1], start_time[2]);
                            value.end_time = new Date(0, 0, 0, end_time[0], end_time[1], end_time[2]);
                        }, response.resource.item.days);

                        return response || $q.when(response);
                    }
                }
            },
            save: {
                method: 'POST',
                params: { view: 'event' },
                transformRequest: function(data) {
                    //Tansform date and time.
                    var test = angular.copy(data);

                    angular.forEach(test.days, function(value){
                        var date = new Date(value.date);
                        var start_time =  new Date(value.start_time);
                        var end_time =  new Date(value.end_time);

                        value.date = date.getFullYear() + '-' + ("0" + (date.getMonth() + 1)).slice(-2) + '-' + ("0" + date.getDate()).slice(-2);
                        value.start_time = ("0" + start_time.getHours()).slice(-2) + ':' + ("0" + (start_time.getMinutes())).slice(-2) + ':' + ("0" + start_time.getSeconds()).slice(-2);
                        value.end_time = ("0" + end_time.getHours()).slice(-2) + ':' + ("0" + (end_time.getMinutes())).slice(-2) + ':' + ("0" + end_time.getSeconds()).slice(-2);
                    }, test.days);

                    return angular.toJson(test);
                }
            },
            remove: {
                method: 'POST',
                params: { view: 'event' },
                transformRequest: function(request) {
                    request.action = 'delete';

                    return angular.toJson(request);
                }
            }
        }
    );
});

app.factory('FieldsetService', function($resource) {
    return $resource('../server/index.php?option=com_cck&view=elements&format=json&cck_fieldset_id=61', null,
        {
            browse: {
                method: 'GET'
            }
        }
    );
});

app.factory('RegionService', function($resource) {
    return $resource('../server/index.php?option=com_regions&view=regions&format=json', null,
        {
            browse: {
                method: 'GET'
            }
        }
    );
});

app.factory('AuthService', function($resource, UserService) {
    return $resource('../server/index.php?option=com_profile&view=user&format=json', null,
        {
            login: {
                method: 'POST',
                transformRequest: function(request) {
                    request.action = 'login';

                    return angular.toJson(request);
                },
                interceptor: {
                    response: function(response) {
                        if(response.status === 200) {
                            UserService.user.loggedin = 1;
                            UserService.save();
                        }

                        return response || $q.when(response);
                    }
                }
            },
            logout: {
                method: 'POST',
                transformRequest: function(request) {
                    request.action = 'logout';

                    return angular.toJson(request);
                },
                interceptor: {
                    response: function(response) {
                        if(response.status === 200) {
                            UserService.user.loggedin = 0;
                            UserService.save();
                        }

                        return response || $q.when(response);
                    }
                }
            }
        }
    );
});


app.factory('UserService', function() {
    var defaults = {
        role: 'guest',
        loggedin: 0,
        remember: $.cookie('remember'),
        username: $.cookie('username'),
        password: $.cookie('password')
    };

    var service = {
        user: {},
        save: function() {
            localStorage.presently =
                angular.toJson(service.user);
        },
        restore: function() {
            service.user =
                angular.fromJson(localStorage.presently) || defaults

            return service.user;
        }
    };

    service.restore();
    return service;
})