//1、引入express
var express = require('express');
var static = require('express-static');
var mysql = require('mysql');
//2、搭建服务器
var server = express();
//3、监听设置端口
server.listen(1234);
//4、设置静态文件
server.use(static('www'));
//5、链接数据库
var db = mysql.createConnection({"host":"localhost","user":"root","password":"","database":"weibomsg"})
//6、写接口

//添加
// /add?content=xxx	添加一条
//返回：{error:0, id: 新添加内容的ID, time: 添加时间}
server.get('/add',function (req,res) {
	var json = req.query;
	var time = Math.floor(Date.now()/1000);
	var addSql = 'INSERT INTO weibomsg VALUES(0,"'+json.content+'",'+time+',0,0)';
	db.query(addSql,function (err,data) {
		//console.log(addSql,err,data)
		res.send('{"error":0,"id":'+data.insertId+',"time":'+time+'}');
		res.end();
	});
})

//获取页数
//   /get_page
//返回：{count:页数}
server.get('/get_page',function (req,res) {
	var countSql='SELECT COUNT(*)FROM weibomsg';
	db.query(countSql,function (err,data) {
		// console.log(countSql,err,data)
		var count=Math.ceil(data[0]['COUNT(*)']/6);
        res.send('{"count":'+count+'}');
        res.end();
	});
})

//获取每页内容
// /get?page=1
//返回：[{id: ID, content: "内容", time: 时间戳, acc: 顶次数, ref: 踩次数}, {...}, ...]
server.get('/get',function (req,res) {
	var json = req.query;
	var getSql='SELECT * FROM weibomsg';
	db.query(getSql,function (err,data) {
		//分割数组 slice
		var resData = data.slice((json.page-1)*6,json.page*6);
		res.send(resData);
		res.end();
	})
})

//顶一下
// /acc?id=12
// 返回：{error:0}
server.get('/acc',function (req,res) {
	var json = req.query;
	var accSql='UPDATE weibomsg SET acc="1" WHERE id="'+json.id+'"';
	db.query(accSql,function(err,data){
        res.send('{"error":0}');
        res.end();
    })
})

//踩一下
// /ref?id=12
// 返回：{error:0}
server.get('/ref',function (req,res) {
	var json = req.query;
	var refSql='UPDATE weibomsg SET ref="1" WHERE id="'+json.id+'"';
	db.query(refSql,function(err,data){
        res.send('{"error":0}');
        res.end();
    })
})

//删除
// /del?id=12
// 返回：{error:0}
server.get('/del',function (req,res) {
	var json = req.query;
	var delSql='DELETE FROM weibomsg WHERE id="'+json.id+'"';
	db.query(refSql,function(err,data){
        res.send('{"error":0}');
        res.end();
    })
})
