var htmlwp = require('html-webpack-plugin');
var glob = require('glob');
var path= require('path')
// console.log(1)
// var a=glob.sync('./src/view/*.html')
// console.log(glob.sync('./src/view/*.html'))
// console.log(path.basename(path.dirname(a[0]),path.extname(a[0])))
function getEntry(globPath, pathDir) {
    var files = glob.sync(globPath);//获取文件夹所有指定类型胡文件（是数组）
    var entries = {},
        entry, dirname, basename, pathname, extname;

    for (var i = 0; i < files.length; i++) {
        entry = files[i];
        dirname = path.dirname(entry);//当前文件路径  ./src/view
        extname = path.extname(entry);//当前文件名后缀  .html
        basename = path.basename(entry, extname);//当前文件名  index1
        pathname = path.join(dirname, basename);//当前文件路径+名字  src\view\index1
         console.log(pathDir)
        pathname = pathDir ? pathname.replace(pathDir, '') : pathname;
        // console.log(2, pathname, entry);
        console.log(pathname)
        entries[pathname] = './' + entry;
        // console.log(entries)
    }
    return entries;
}

var htmls = getEntry('./src/view/**/*.html', 'src\\view\\');//模版文件与入口文件在同一文件夹
var entries = {};//入口文件是与html同名胡js
var HtmlPlugin = [];
for (var key in htmls) {
    entries[key] = htmls[key].replace('.html', '.js')
    // console.log(entries[key])
    HtmlPlugin.push(new htmlwp({
      filename: (key == 'index\\index' ? 'index.html' : key + '.html'), 
      template: htmls[key]
    }))
}
// console.log(htmls)
module.exports={
  entry:entries,  //指定打包的入口文件
  output:{
  	path : __dirname+'/dist',  // 注意：webpack1.14.0 要求这个路径是一个绝对路径
  	filename:'[name].js'
  },
  module:{
  	loaders:[
  		{
  			test: /\.css$/,  //打包 .css文件
  			loader:'style-loader!css-loader'
  		},
      {
        test: /\.scss$/,  //打包 .scss文件
        loader:'style-loader!css-loader!sass-loader'
      },
       {
        test: /\.less/,  //打包 .less文件
        loader:'style-loader!css-loader!less-loader'
      }
      ,
       {
        test: /\.(png|jpg|gif|ttf|svg)$/,  //打包 url请求的资源文件
        loader:'url-loader?limit=20000' //limit表示图片的大小为20K是临界值，小于20K的图片均被打包到build.js中去，请求图片就会很快
      },
       {
        test: /\.js$/,  // 将.js文件中的es6语法转成es5语法
        loader:'babel-loader',
        exclude:/node_modules/ 
      },
       {
        test: /.vue$/,  // 解析 .vue 组件页面文件
        loader:'vue-loader' //
      },
        {
            test: /vue-preview.src.*?js$/,  // vue-preivew组件专用
            loader: 'babel'
        },{ test: require.resolve("jquery"),

         loader: "expose-loader?$!expose-loader?jQuery" }

  	]
  },
  babel:{
    presets:['es2015'],  // 配置将es6语法转换成es5语法
    plugins:['transform-runtime']
  },
    plugins:HtmlPlugin
}