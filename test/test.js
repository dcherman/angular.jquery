/* global module:false, sinon:false, asyncTest:false, ok:false, strictEqual:false, start:false */
(function( $, angular ) {
    "use strict";

    module( "angular.jquery", {
        setup: function() {
            this.$rootScope = $( "#test" ).injector().get( "$rootScope" );
            this.$ajax = $( "#test" ).injector().get( "$ajax" );

            this.successMock = $.mockjax({
                url: "success",
                responseTime: 10,
                responseText: "{}",
                status: 200
            });

            this.failureMock = $.mockjax({
                url: "failure",
                responseTime: 10,
                responseText: "{}",
                statusText: "error",
                status: 500
            });
        },

        teardown: function() {
            $.mockjaxClear( this.successMock );
            $.mockjaxClear( this.failureMock );
        }
    });

    // Setup a test application to run that depends on angular.jquery
    angular.module( "test", [ "angular.jquery" ]);

    $.each([ "failure", "success" ], function( i, mode ) {
        $.each([ "get", "getJSON", "getScript", "post" ], function( i, methodName ) {
            asyncTest( "jQuery." + methodName + " ( " + mode + " )", function() {
                var testContext = this;
                sinon.spy( testContext.$rootScope, "$digest" );

                this.$ajax[ methodName ]( mode ).always(function() {
                    setTimeout(function() {
                        ok( testContext.$rootScope.$digest.called, "A digest cycle should have been completed" );
                        testContext.$rootScope.$digest.restore();
                        start();
                    });
                });
            });
        });
    });

    $.each([ "failure", "success" ], function( i, mode ) {
        $.each({ sync: false, async: true }, function( syncMode, async ) {
            asyncTest( "$ajax ( " + syncMode + ", " + mode + " )", function() {
                var testContext = this;
                sinon.spy( testContext.$rootScope, "$digest" );

                this.$ajax({
                    url: mode,
                    async: async,
                    type: "POST"
                }).always(function() {
                    setTimeout(function() {
                        ok( testContext.$rootScope.$digest.called, "A digest cycle should have been completed" );
                        testContext.$rootScope.$digest.restore();
                        start();
                    });
                });
            });

            asyncTest( "jQuery.ajax ( " + syncMode + ", " + mode + " )", function() {
                var testContext = this;
                sinon.spy( testContext.$rootScope, "$digest" );

                $.ajax({
                    url: mode,
                    async: async,
                    type: "POST"
                }).always(function() {
                    setTimeout(function() {
                        strictEqual( testContext.$rootScope.$digest.called, false, "A digest cycle should not occur when we don't use the adapted ajax function" );
                        testContext.$rootScope.$digest.restore();
                        start();
                    });
                });
            });
        });
    });
}( jQuery, angular ));