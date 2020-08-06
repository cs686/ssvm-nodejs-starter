const { say, get_image_gray } = require('../pkg/ssvm_nodejs_starter_lib.js');

// const http = require('http');
// const url = require('url');
// const hostname = '0.0.0.0';
// const port = 3000;

// const server = http.createServer((req, res) => {
//   let p1 = {x:1.5, y:3.9}
//   let p2 = {x: 2.5, y: 5.8}
//   var line = JSON.parse(create_line(JSON.stringify(p1), JSON.stringify(p2), "A thin red line"));
//   console.log( line );
//   const queryObject = url.parse(req.url,true).query;
//   if (!queryObject['name']) {
//     res.end(`Please use command curl http://${hostname}:${port}/?name=MyName \n`);
//   } else {
//     res.end(say(queryObject['name']) + '\n');
//   }
// });

// server.listen(port, hostname, () => {
//   console.log(`Server running at http://${hostname}:${port}/`);
// });

const Koa = require('koa')
const views = require('koa-views')
const path = require('path')
const fs = require('fs')
const app = new Koa()
const bodyParser = require('koa-bodyparser')

app.use(bodyParser())


const koaBody = require('koa-body');
const { get } = require('http');
app.use(koaBody({
  multipart: true,
  formidable: {
    maxFileSize: 200 * 1024 * 1024    // 设置上传文件大小最大限制，默认2M
  }
}));

// 加载模板引擎
app.use(views(path.join(__dirname, './view'), {
  extension: 'ejs'
}))

app.use(async (ctx) => {
  if (ctx.method === 'GET') {
    let title = 'hello koa2'
    await ctx.render('index', {
      title,
    })
  } else {
    if (ctx.url === '/api/image' && ctx.method === 'POST') {
      // console.log(ctx.request.files.file)
      let data = await fs.readFileSync(ctx.request.files.file.path)
      let u8arr = new Uint8Array(data)
      let data2 = get_image_gray(u8arr)
      ctx.body = {
        msg: `${data2}`
      }
    }
  }

})

// app.use(async (ctx) => {
//   if (ctx.url === '/api/image' && ctx.method === 'POST') {
//     console.log(333)
//     let postData = ctx.request.body
//     console.log(postData)
//   } else {
//     ctx.body = '<h1>404！！！ o(╯□╰)o</h1>'
//   }
// })

app.listen(3000)
