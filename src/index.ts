import fs from "fs";
import Client from "./core";

const client = new Client({
  host: "127.0.0.1",
  port: 7890,
  protocol: "http",
});

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

const getAllLabel = async (url: string) => {
  const data: {
    label: string;
    link: string;
    image: string;
    rawImage: string;
  }[] = [];
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

let index = 0;
const main = async (file: string, start: number) => {
  const labels = await client.getlabelList();
  const data = [];
  try {
    for (let label of labels.slice(start)) {
      console.log(label);
      const imageData = await getAllLabel(label.link);
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
  // const images = await client.getLabelDetail(
  //   "https://www.irasutoya.com/search/label/%E8%81%B7%E6%A5%AD"
  // );
  // console.log(images);
  // let data = [];
  // if (fs.existsSync(file)) {
  //   data = JSON.parse(fs.readFileSync(file).toString());
  // }
  // const returnData = await getData(startPage, endPage);
  // fs.writeFileSync(file, JSON.stringify([...data, ...returnData]));
};

main("data.json", 0);
