var qiniu = require('qiniu');
var mime = require('mime');
var fs = require('fs');


// 配置密钥
qiniu.conf.ACCESS_KEY = '###your key ###';
qiniu.conf.SECRET_KEY = '###your secret####';

// 实例化带授权的 HTTP Client 对象
var conn = new qiniu.digestauth.Client();

// 创建空间，也可以在开发者自助网站创建
var bucket = 'soonseen';


exports.mkbucket = function(bucket) {
    qiniu.rs.mkbucket(conn, bucket, function(resp) {
        console.log("\n===> Make bucket result: ", resp);
        if (resp.code != 200) {
            return;
        }
    });
}

// 实例化 Bucket 操作对象
var rs = new qiniu.rs.Service(conn, bucket);

// 上传文件第1步
// 生成上传授权凭证（uploadToken）
var opts = {
    scope: "soonseen", // 可以是 "<bucketName>" 或 "<bucketName>:<key>"
    expires: 3600
    // callbackUrl: "http://www.example.com/notifications/qiniurs", // 可选
    // callbackBodyType: "application/x-www-form-urlencoded", // 可选
};
var uploadPolicy = new qiniu.auth.PutPolicy(opts);
var uploadToken = uploadPolicy.token();




exports.upload = function(localFile, key, callback) {
    // 上传文件第2步
    // 组装上传文件所需要的参数
    var customMeta = "",
        callbackParams = {"bucket": bucket, "key": key},
        enableCrc32Check = false,
        mimeType = mime.lookup(localFile);

    // 上传文件第3步
    // 上传文件
    rs.uploadFileWithToken(uploadToken, localFile, key, mimeType, customMeta, callbackParams, enableCrc32Check, function(resp){

        fs.unlink(localFile);

        if (resp.code != 200) {
            callback(false);
        }

        callback(true);
        
    });
};


exports.stat = function(key) {
    // 查看已上传文件属性信息
    rs.stat(key, function(resp) {
        console.log("\n===> Stat result: ", resp);
        if (resp.code != 200) {
            // ...
            return;
        }
    });
}


// // 获取文件下载链接（含文件属性信息）
// var saveAsFriendlyName = key;
// rs.get(key, saveAsFriendlyName, function(resp) {
//     console.log("\n===> Get result: ", resp);
//     if (resp.code != 200) {
//         // ...
//         return;
//     }
// });

// 删除已上传文件
exports.remove = function(key) {
    rs.remove(key, function(resp) {
        console.log("\n===> Delete result: ", resp);
    });
};

exports.domain = 'http://' + bucket + '.qiniudn.com/';


// // 将bucket的内容作为静态内容发布
// var DEMO_DOMAIN = bucket + '.dn.qbox.me';
// rs.publish(DEMO_DOMAIN, function(resp){
//     console.log("\n===> Publish result: ", resp);
//     if (resp.code != 200){
//         clear(rs);
//         return;
//     }
// });

// // 删除bucket，慎用！
// rs.drop(function(resp){
//     console.log("\n===> Drop result: ", resp);
// });
