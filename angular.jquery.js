/*! angular.jquery.js v0.1.0 | (c) 2013 Daniel Herman | opensource.org/licenses/MIT */
(function( angular, $, undefined ) {
    "use strict";

    angular.module( "angular.jquery", [] ).factory( "$ajax", [ "$rootScope", function( $rootScope ) {
        // A flag used to determine whether the request currently being made
        // originated from a specific instance of ajax created from the factory.
        // Since everything is synchronous up and through when the prefilters are run,
        // we can reliably set and unset this flag and have it work as expected.
        var isRequestBeingMade = false;

        $.ajaxPrefilter(function( options, originalOptions, jqXHR ) {
            if ( isRequestBeingMade ) {
                isRequestBeingMade = false;

                if ( !options.nodigest ) {
                    jqXHR.always(function() {
                        // Invoke a $digest cycle on the next tick of the event
                        // loop because we need to allow all of the handlers that are
                        // attached to the jqXHR to finish before kicking off the $digest
                        setTimeout(function() {
                            if ( !$rootScope.$$phase ) {
                                $rootScope.$digest();
                            }
                        });
                    });
                }
            }
        });
        
        function markRequest( fn ) {
            return function() {
                isRequestBeingMade = true;
                return fn.apply( this, arguments );
            };
        };
        
        var ajax = markRequest( $.ajax );
        
        angular.forEach([ "get", "getJSON", "getScript", "post" ], function( name ) {
            ajax[ name ] = markRequest( $[ name ] );
        });
        
        return ajax;
    }]);
}( angular, jQuery ));