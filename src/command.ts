#!/usr/bin/env node
import { fetchData, downloadImages } from "./index";

import { Command } from "commander";
import { version } from "../package.json";

const program = new Command();
program.name("ir").description("irasutoya抓取").version(version);

program
  .command("fetch")
  .description("抓取数据")
  .requiredOption("-o, --output <file>", "输出文件")
  .option("-s, --start <number>", "开始位置")
  .option("-p, --proxy <string>", "代理")
  .action(async (opts: { output: string; start?: number; proxy?: string }) => {
    fetchData(opts.output, opts.start || 0, opts.proxy);
  });

program
  .command("download")
  .description("下载图片")
  .requiredOption("-i, --input <file>", "输入文件")
  .requiredOption("-o, --output <number>", "输出文件夹")
  .option("-p, --proxy <string>", "代理")
  .action(async (opts: { input: string; output: string; proxy?: string }) => {
    downloadImages(opts.input, opts.output);
  });

program.parse();
