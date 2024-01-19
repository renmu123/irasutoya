import axios from "axios";
import * as cheerio from "cheerio";
import axiosRetry from "axios-retry";

import type { AxiosInstance, AxiosProxyConfig } from "axios";

export default class Client {
  request: AxiosInstance;
  constructor(proxy: AxiosProxyConfig | false = false) {
    const instance = axios.create({
      timeout: 1000000,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
        cookie: "language=cn_CN",
      },
      proxy: proxy,
    });
    axiosRetry(instance, { retries: 3 });
    this.request = instance;
  }
  /**
   * 获取标签列表
   */
  async getlabelList() {
    const html = await this.getPage("https://www.irasutoya.com/");
    const $ = cheerio.load(html);
    const items = $("#Label1 a");
    const data: {
      label: string;
      link: string;
    }[] = [];
    items.map((index, element) => {
      const item = $(element);
      const label = item.text();
      const link = item.attr("href");
      // console.log(label, link);
      data.push({
        label,
        link,
      });
    });
    return data;
  }
  /**
   * 获取标签详情
   */
  async getLabelDetail(url: string) {
    const html = await this.getPage(url);
    const $ = cheerio.load(html);
    const items = $(".boxim a");
    const data: {
      label: string;
      link: string;
      image: string;
      rawImage: string;
    }[] = [];
    const nextPage = $(".blog-pager-older-link").attr("href");
    items.map((index, element) => {
      const item = $(element);
      const link = item.attr("href");
      // console.log(link);
      const script = item.find("script").html();
      // console.log(script);
      // document.write(bp_thumbnail_resize("https://1.bp.blogspot.com/-m-FCbmqxzEQ/X9GYUUD8zpI/AAAAAAABcv0/wglNjDqRKTs32zUG9vJAjnwiCZWpPgOJwCNcBGAsYHQ/s72-c/opera_singer_man.png","オペラ歌手のイラスト&#65288;男性&#65289;"));
      // 使用正则解析上面的链接和文字
      const reg = /document\.write\(bp_thumbnail_resize\("(.*)","(.*)"\)\)/;
      const result = reg.exec(script);
      const rawImage = result[1];
      const image = rawImage.replaceAll("=s72-c", "").replaceAll("/s72-c", "");
      const label = result[2];

      data.push({
        label,
        link,
        image,
        rawImage,
      });
    });
    return {
      imageData: data,
      nextPage,
    };
  }

  /**
   * 获取页面
   */
  async getPage(url: string) {
    const res = await this.request.get(url);
    return res.data;
  }
}
