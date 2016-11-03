angular.module('ServicesModule').factory('appConfig', [function () {

    var isMobile = false;

    return {
        serverUrl: 'https://ldiro.qualitance.com/api/',
        authUrl: 'https://ldiro.qualitance.com/auth/',
        termsUrl: 'https://ldiro.qualitance.com',
        isMobile: isMobile,
        isIos: false,

        androidConfig: {
            'senderID': '' // INSERT SENDER ID FROM GOOGLE CLOUD MESSAGING
        },
        iosConfig: {
            'badge': 'true',
            'sound': 'true',
            'alert': 'true'
        },

        maxPhotoCount: 3,

        cameraOptions: {
            quality: 80,
            targetWidth: 800,
            targetHeight: 600
        },

        imagePickerOptions: {
            maximumImagesCount: 3,
            quality: 80,
            width: 800,
            height: 600
        },

        mapServerUrl: 'https://api.mapbox.com/v4/mapbox.streets-basic/{z}/{x}/{y}.png?access_token=',
        mapboxToken: '' //INSERT MAPBOX TOKEN HERE
    };
}]);
