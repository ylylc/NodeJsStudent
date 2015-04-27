var mongodb = require('./db');

function Post (username,post,time){
	this.user = username;
	this.post = post;
	if (time) {
		this.time = time;
	}else{
		time = new Date();
	}
};
	module.exports = Post;
Post.prototype.save = function(callback){
		//保存
		var post = {
			user:this.user,
			post:this.post,
			time:this.time
		}


		mongodb.open(function(err,db){
			if(err){
				return callback(err);
			}

			//读取posts
			db.collection('posts',function(err,collection){
				if (err) {
					mongodb.close();
					return callback(err);
				}
				//为属性添加索引
				collection.ensureIndex('user');
				//插入post
				collection.insert(post,function(err,post){
					mongodb.close();
					callback(err,post)
				});

			});

		});

	};


Post.get =function(username,callback){
		mongodb.open(function(err,db){
			if(err){
				return callback(err);
			}
			db.collection('posts',function(err,collection){
				if(err){
					mongodb.close();
					return callback(err);
				}
				var query = {};
				if(username){
					query.user = username;
				}
				//查询集合
				collection.find(query).sort({time:-1}).toArray(function(err,docs){
					mongodb.close();
					if (err) {return callback('err',null)};
					var posts = [];
					console.log("-----------"+docs.length);
					docs.forEach(function(doc,index){
						var post = new Post(doc.user,doc.post,doc.time);
						posts.push(post);
					});
					callback(null,posts);
				})

			});

		});

};