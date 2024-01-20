#!/usr/bin/env node
import { fetchData, downloadImages, downloadLabel } from "./index";

import { Command } from "commander";
import { version } from "../package.json";

const program = new Command();
program.name("irasutoya").description("irasutoya下载工具").version(version);

program
  .command("download [url]")
  .description("下载图片,支持label页面和数据模式")
  .requiredOption("-o, --output <string>", "输出文件夹")
  .option("-i, --input <file>", "输入数据文件")
  .option("-p, --proxy <string>", "代理")
  .action(
    async (
      url: string | undefined,
      opts: { input: string; output: string; proxy?: string }
    ) => {
      if (url) {
        if (url.includes("label")) {
          downloadLabel(url, opts.output, opts.proxy);
        }
      } else {
        if (!opts.input) throw new Error("请输入数据文件");
        downloadImages(opts.input, opts.output);
      }
    }
  );

program
  .command("fetch")
  .description("抓取所有数据")
  .requiredOption("-o, --output <file>", "输出文件")
  .option("-s, --start <number>", "开始位置")
  .option("-p, --proxy <string>", "代理")
  .action(async (opts: { output: string; start?: number; proxy?: string }) => {
    fetchData(opts.output, opts.start || 0, opts.proxy);
  });

program.parse();
