var app = angular.module('articleApp', []);
app.controller('tableCtrl', function($scope, $http){
    $scope.gogo = function(){
        var title = document.getElementById('title').value;
        var content = document.getElementById('content').value;

        var data = {
            title : title,
            content : content
        };
        $http.post('/api/articles', data).
            then(function (response){
                var articles = response.data;
                $scope.articles = articles;
            });
    };

    $scope.modify = function (id){
        var title = document.getElementById('title').value;
        var content = document.getElementById('content').value;
        var data ={
            title : title,
            content : content
        };
        $http.put('api/articles/' + id, data).
            then(function(res){
                var articles = res.data;
                $scope.articles = articles;
            });
    };

    $scope.delete = function(id){
        $http.delete('api/articles/' + id).
            then(function(res){
                var articles = res.data;
                $scope.articles = articles;
            });
    }
})




