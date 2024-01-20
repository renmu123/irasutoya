import fs from "fs-extra";
import Client from "./core";
import { sanitizeFileName } from "./utils";
import path from "path";

const getClient = (proxy?: string) => {
  if (!proxy) {
    return new Client();
  } else {
    const url = new URL(proxy);
    const client = new Client({
      host: url.hostname,
      port: Number(url.port),
      protocol: url.protocol.replace(":", ""),
    });
    return client;
  }
};

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

const getAllLabel = async (url: string, proxy?: string) => {
  const data: {
    name: string;
    link: string;
    image: string;
    rawImage: string;
  }[] = [];
  const client = getClient(proxy);

  let { nextPage, imageData } = await client.getLabelDetail(url);
  data.push(...imageData);
  while (nextPage) {
    console.log(nextPage);
    const { nextPage: nextPage2, imageData: imageData2 } =
      await client.getLabelDetail(nextPage);
    nextPage = nextPage2;
    data.push(...imageData2);
    await sleep(1000);
  }
  return data;
};

export const fetchData = async (
  file: string,
  start: number,
  proxy?: string
) => {
  const client = getClient(proxy);
  const labels = await client.getlabelList();
  const data = [];
  let index = start;

  try {
    for (let label of labels.slice(start)) {
      console.log(label);
      const imageData = (await getAllLabel(label.link)).map(item => ({
        ...item,
        label: label.label,
      }));
      data.push(...imageData);
      index++;
      console.log(`已完成${index}/${labels.length}`);
    }
  } catch (error) {
    console.log(error);
    throw error;
  } finally {
    let oldData = [];
    if (fs.existsSync(file)) {
      oldData = JSON.parse(fs.readFileSync(file).toString());
    }
    fs.writeFileSync(file, JSON.stringify([...data, ...oldData]));
  }
};

export const downloadImages = async (
  file: string,
  downloadPath: string,
  proxy?: string
) => {
  const client = getClient(proxy);
  const data = JSON.parse(fs.readFileSync(file).toString());
  let size = 0;
  for (let item of data.slice(0, 10)) {
    const filePath = sanitizeFileName(
      path.join(downloadPath, item.label, `${item.name}.png`)
    );
    await fs.ensureDir(path.dirname(filePath));
    size++;
    if (await fs.exists(filePath)) {
      console.log(`${filePath}已存在`);
      continue;
    }
    console.log(item.image);
    await client.downloadImage(item.image, filePath);
    console.log(`下载${filePath}成功`);
    await sleep(500);
  }
};

// main("data.json", 0);
// downloadImages("data.json", "images");
