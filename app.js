var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var ejs = require('ejs');
var db = mongoose.connection;
var Schema = mongoose.Schema;
var app = express();

app.set('view engine','ejs');
app.engine('html', ejs.renderFile);

mongoose.connect('mongodb://localhost/local');

db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function(){
    console.log('db connect');
});

var ArticleSchema = new Schema({
    'author' : String,
    'title' : String,
    'content' : String
});

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.use('/public', express.static(__dirname + '/public'));

var Article = mongoose.model('article', ArticleSchema);

app.get('/', function(req, res){
    res.render('index');
});

function getArticles(res){
    Article.find(function (err, data){
        if(err){
            console.log(err);
            return;
        }else{
            res.json(data);
        }
    });
}


app.post('/api/articles', function(req, res){
    var title = req.body.title;
    var content = req.body.content;
    var article = new Article();
    console.log(title);
    article.title = title;
    article.content = content;
    article.save(function (err){
        if(err){
            console.log(err);
            return;
        }else{
            // console.log(article.title);
            getArticles(res);
        }
    });
});

app.put('/api/articles/:id', function(req,res){
    Article.findById(req.params.id, function(err, article){
        if(err) return res.status(500).json({error:'db failure'});
        if(!article) return res.status(404).json({error: 'article not found'});

        if(req.body.title) article.title = req.body.title;
        if(req.body.content) article.content = req.body.content;

        article.save(function (err){
            if(err){
                console.log(err);
                return;
            }
            else{
                getArticles(res);
            }
        });
    }); 
});

app.delete('/api/articles/:id', function(req,res){
    Article.findById(req.params.id, function(err, article){
        if(err) return res.status(500).json({error:'db failure'});
        if(!article) return res.status(404).json({error: 'article not found'});

        article.remove(function(err){
            if(err){
                console.log(err);
                return;
            }else{
                getArticles(res);
            }
        });
    });
});

app.listen(3000, function(){
    console.log('Server On');
});