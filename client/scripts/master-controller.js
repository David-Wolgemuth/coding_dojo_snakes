module.exports = ["$scope", "$location",
function MasterController ($scope, $location) {
    $scope.setCurrentTab = function (tab) {
        $scope.currentTab = tab;
    };
    $scope.goToTab = function (tab) {
        $scope.currentTab = tab;
        $location.url("/" + tab);
    };
}];