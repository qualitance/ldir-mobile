angular.module('starter').filter('datefilter', function ($translate) {

    return function (input) {

        var inputDate = new Date(input);

        var today = new Date();

        if (isToday(inputDate, today)) {
            return $translate.instant('date.today');
        }

        if (isYesterday(inputDate, today)) {
            return $translate.instant('date.yesterday');
        }

        return $translate.instant('date.on') + inputDate.toLocaleDateString();

    };

    function isToday(d1, d2) {
        return d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate();
    }

    function isYesterday(d1, d2) {
        return d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate() - 1;
    }
});

angular.module('starter').filter('decToDms', ['$sce', function ($sce) {
    return function (input, latlng) {

        if (!input) {
            return;
        }

        var v = input.toString().split('.');
        var pole = (latlng === 'lat' ? (parseInt(v[1]) < 0 ? 'S' : 'N') : (parseInt(v[1]) < 0) ? 'V' : 'E');

        var t = parseFloat('0.' + v[1]) * 3600;

        var o = {
            deg: v[0],
            min: Math.floor(t / 60)
        };
        o.sec = Math.round((t - (o.min * 60)) * 1000) / 1000;

        return $sce.trustAsHtml(pole + '&nbsp;' + o.deg + '&deg;&nbsp;' + o.min + '&#8242;&nbsp;' + o.sec + '&#8243;');
    };
}]);
