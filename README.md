# 简介

https://www.irasutoya.com/ 抓取工具

抓取所有数据并保存在`data.json`
`ir fetch data.json`

下载`data.json`中的图片，如果出现错误请重复运行，会自动跳过重复的
`ir download -i data.json -o images`

更多参数参见`help`指令

# 使用

Usage: ir [options] [command]

irasutoya 抓取

Options:
-V, --version output the version number
-h, --help display help for command

Commands:
fetch [options] 抓取数据
download [options] 下载图片
help [command] display help for command

# 协议

GPLV3
