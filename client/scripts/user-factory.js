module.exports = ["$http",
function UserFactory ($http) {
    var factory = {};
    factory.me = null;
    factory.whoAmI = function (callback) {
        $http({
            method: "GET",
            url: "/me"
        }).then(function (res) {
            console.log(res);
            if (res.data.user) {
                factory.me = res.data.user;
                callback(factory.me);
            } else {
                factory.me = null;
                callback(null);
            }
        }).catch(function () { callback(null); });
    };
    factory.whoAmI(function () {});
    factory.login = function (data, callback) {
        $http({
            method: "POST",
            url: "/login",
            data: data
        }).then(function (res) {
            console.log("RES:", res);
            factory.me = res.data.user;
            callback(null, res.data.user);
        }).catch(function (res) {
            console.log("ERR:", res.data.message);
            callback(res.data.message, null);  
            factory.me = null;
        });
    };
    factory.signOut = function (callback) {
        $http({
            method: "GET",
            url: "/logout"
        }).then(function (res) {
            factory.me = null;
            callback();
        }).catch(function (res) {
            callback(res);
        });
    };
    factory.register = function (data, callback) {
        console.log("OUTGOING:", data);
        $http({
            method: "POST",
            url: "/users",
            data: data
        }).then(function (res) {
            console.log("RES:", res);
            factory.me = res.data.user;
            callback(null, res.data.user);
        }).catch(function (res) {
            console.log("ERR:", res.data.message);
            callback(res.data.message, null);  
            factory.me = null;
        });
    };
    return factory;
}];