(function () {
    'use strict'
    angular.module('beacon').directive('frMetric', function () {
        return {
            restrict: 'E',
            template: '<li class="list-group-item">' +
                       ' <div class="row text-info"> '+
                       ' <div class="col-md-3"><strong class="hidden-md hidden-lg text-warning"><span translate>v2.performance_report.heading.metric</span>: </strong><span>{{"v2.performance_report." + key + ".label" | translate}}</span></div> ' +
                       ' <div class="col-md-2"><strong class="hidden-md hidden-lg text-warning"><span translate>v2.performance_report.heading.value </span>: </strong>{{value}}</div> ' +
                       ' <div class="col-md-3"><strong class="hidden-md hidden-lg text-warning"><span translate>v2.performance_report.heading.percentage</span>: </strong>{{percent}}</div> ' +
                       ' <div class="col-md-4"><strong class="hidden-md hidden-lg text-warning"><span translate>v2.performance_report.heading.description</span>: </strong><span>{{"v2.performance_report." + key + ".description" | translate}}</span></div> ' +
                       ' </div> '+
                    '</li>',
            scope: {
                key: '@',
                value: '=',
                percent: '='
            }            
        }
    });
   
   
})();