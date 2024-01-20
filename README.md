# 简介

https://www.irasutoya.com/ 抓取工具，支持下载全部以及 label 页面

## 下载 label 页面

会下载该 label 下该页及后续的所有页面图片

`irasutoya download https://www.irasutoya.com/search/label/%E8%BE%B2%E6%A5%AD -o images`

## 下载全部内容

抓取所有数据并保存在`data.json`
`irasutoya fetch data.json`

下载`data.json`中的图片，如果出现错误请重复运行，会自动跳过重复的
`irasutoya download -i data.json -o images`

更多参数参见`help`指令

# 使用

```bash
Usage: irasutoya [options] [command]

irasutoya下载工具

Options:
  -V, --version             output the version number
  -h, --help                display help for command

Commands:
  download [options] [url]  下载图片,支持label页面和数据模式
  fetch [options]           抓取所有数据
  help [command]            display help for command
```

# 协议

GPLV3
