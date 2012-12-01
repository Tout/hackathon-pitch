var Deck = (function() {
    var latestTout = {'uid': null, 'created_at': new Date(0), 'mp4_url': null}, callAjax, getLatestTout, recordTout;

    callAjax = function(api_call) {
        var ajax_url = 'https://api.tout.com/api/v1/'+api_call+'?access_token=43c102e409327703d61d87a09e2a8178bd69ed5717d7c29fd3de0f0620d58e73';
        
        return $.ajax({
            url: ajax_url,
            async: true
        });
    };

    getLatestTout = function() {
        var x;
        var whenToutsLoaded = callAjax('me/touts');
        
        whenToutsLoaded.done(function (data) {
            var touts = data['touts'], t;

            if (typeof data['touts'] === 'undefined') {
                try {
                    touts = JSON.parse(data)['touts'];
                } catch (err) { console.log(err); }
            }

            t = touts[0]['tout'];

            latest = {};
            latest['uid'] = t['uid'];
            latest['created_at'] = new Date(t['created_at']);
            latest['mp4_url'] = t['video']['mp4']['http_url'];

            if (latest['created_at'] > this.latestTout['created_at']){
                var p = _V_('fresh-tout-video');
                p.src(latest['mp4_url']);

                this.latestTout = latest;
            }

        }.bind(this));

    };
    
    recordTout = function() {
        setTimeout(function() {
            this.getLatestTout();
            window.location.href = window.location.origin + window.location.pathname + '#/3/1';
            //$('#record-button').css('opacity', .6);
        }.bind(this), 60000);
        window.open('http://www.tout.com/m/new?display=popup', 'recordTout', 'height=420,width=800');
    };

    checkLatest = function(tout) {
        if (tout != 'fool') {
            var whenToutsLoaded = callAjax('touts/'+tout);
            whenToutsLoaded.done(function (data) {
                var tout = data['tout'];

                if (typeof data['tout'] === 'undefined') {
                    try {
                        touts = JSON.parse(data)['tout'];
                    } catch (err) { console.log(err); }
                }

                console.log(tout);

                this.latestTout = tout['video']['mp4']['http_url'];
                var p = _V_('fresh-tout-video');
                p.src(this.latestTout);
                $('.vjs-controls').css('display', 'none');
                
            }.bind(this));               

        }
    };

    return {
        latestTout: latestTout,
        callAjax: callAjax,
        checkLatest: checkLatest,
        getLatestTout: getLatestTout,
        recordTout: recordTout
    }
})();

$(document).ready(function(){
    console.log('ready');
    $('.vjs-controls').css('display', 'none');
    Deck.getLatestTout();

}); 
