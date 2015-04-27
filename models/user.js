var mongodb = require('./db');
function User(user){
	this.name = user.name;
	this.password = user.password;
}

module.exports = User;

//保存并返回
User.prototype.save = function save(callback){
	//保存user  到mongodb
	var user = {
		name:this.name,
		password:this.password
	}

	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}

		//读取users集合
		db.collection('users',function(err,collection){
			if (err) {
				mongodb.close();
				return callback(err);
			}

			//为name添加属性索引
			collection.ensureIndex('name',{unique:true});
			//写入user
			collection.insert(user,function(err,user){
				mongodb.close();
				callback(err,user);
			});

		});
	});

};

User.get = function(username,callback){
	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}

		db.collection('users',function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			//通过name查找
	    collection.findOne({
	    	name:username
	    },function(err,user){
	    	mongodb.close();
	    	console.log("================"+user+"========"+username)
	    	console.log(">>>>>>>>>>>>>>"+err)
	    	if (err) {
	    		//封装user
	    		return callback(err,null);
	    	}
			callback(null,user);//返回用户信息
	    });

		});
	});
}









