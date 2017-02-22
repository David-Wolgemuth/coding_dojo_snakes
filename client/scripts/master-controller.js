module.exports = ["userFactory", "$scope", "$location",
function MasterController (User, $scope, $location) {
    User.whoAmI(function (me) {
        $scope.me = me;
    });
    $scope.signOut = function () {
        User.signOut(function () {
            $scope.me = null;
            // Trigger Page Refresh
            document.location.href="/";
        });
    };
    $scope.setCurrentTab = function (tab) {
        $scope.currentTab = tab;
    };
    $scope.goToTab = function (tab) {
        $scope.currentTab = tab;
        $location.url("/" + tab);
    };
    
}];