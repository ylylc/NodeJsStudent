var crypto = require('crypto');
var User = require('../models/user.js');
var Post = require('../models/post.js');

module.exports = function(app){
	app.get('/',function(req,res){
		Post.get(null,function(err,posts){
			    if(err){
					posts = [];
				};
				res.render('index',{
					title:'首页',
					success:req.flash('success').toString(),
					posts:posts
				});				
			})


		
	});

	app.get('/reg',checkOutLogin);
	app.get('/reg',function(req,res){
		 res.render('reg',{title:'注册'});
	});
	app.post('/reg',function(req,res){
		var md5 = crypto.createHash('md5');
		var password = md5.update(req.body.password).digest('base64');
		var newUser = new User({
			name:req.body.username,
			password:password
		});
		User.get(newUser.name,function(err,user){
			if(user){
				err ='用户已存在';
			}
			console.log(err);
			if (err) {
				req.flash('error',err);
				return res.redirect('/reg');
			}
			newUser.save(function(err){
				if (err) {
					req.flash('error',err);
					return res.redirect('error',err);
				}

				req.session.user = newUser;
				req.flash('success','注册成功');
				res.redirect('/');
			});
		});

	});

	app.get('/login',checkOutLogin)
	app.get('/login',function(req,res){
		res.render('login',{title:'登录'});
	});
	app.post('/login',function(req,res){
		var md5 = crypto.createHash('md5');
		var password = md5.update(req.body.password).digest('base64');
		var loginUser = new User({
			name:req.body.username,
			password:password
		});
		User.get(loginUser.name,function(err,user){

			if(err){
				req.flash('error',err);
				return res.redirect('/login');
			}
			if(user){
				if(user.password != loginUser.password){
					req.flash('error','密码不正确');
					res.redirect('/login');
				}else{
					req.session.user = user;
					req.flash('success','登录成功');
					res.redirect('/');
				}
			}else{
				req.flash('error','用户不存在');
				res.redirect('/login');
			}

		});

	});
		//退出
		app.get('/logout',checkLogin);
		app.get('/logout',function(req,res){
			req.session.user = null;
			req.flash('success',"退出成功");
			res.redirect('/');
		});


		app.get('/post',checkLogin);
		app.get('/post',function(req,res){
			res.render({
				title:'发表微博',
				success:req.flash('success').toString()
			})
		})
		app.post('/post',checkLogin);
		app.post('/post',function(req,res){
			var currentUser = req.session.user;
			var post = new Post(currentUser.name,req.body.post,new Date());
			post.save(function(err){
				if(err){
					req.flash('error',err);
					return res.redirect('/');
				}
				req.flash('success',"发表成功");

				res.redirect('/u/'+ currentUser.name);

			})

		});

		//用户页面控制器
		app.get('/u/:user',function(req,res){
			User.get(req.params.user,function(err,user){
				if(!user){
					req.flash('error','用户不存在');
					res.redirect('/');
				}
				Post.get(user.name,function(err,posts){
					if(err){
						req.flash('error',err);
						return res.redirect('/');
					};
					res.render('user',{
						title:user.name,
						posts:posts
					});
				})
			});



		});

		function checkLogin(req,res,next){
			if(!req.session.user){
				req.flash('error','未登录');
				return res.redirect('/');
			}
			next();

		}

		function checkOutLogin(req,res,next){
			if(req.session.user){
				req.flash('error','已登录');
				return res.redirect('/');
			}
			next();

		}




}
