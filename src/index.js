import { toXML } from "jstoxml";
import { resolve, parse } from "node:path";
import { readdir, writeFile } from "node:fs/promises";
import { glob } from "glob";
import { image } from "image-downloader";
import * as cheerio from "cheerio";
const sourceFolder = resolve(process.cwd(), "assets");

const saveXML = async (data, path, name) => {
  const xml = toXML(data, {
    header: true,
    indent: "  ",
  });
  await writeFile(resolve(path, `${name}.nfo`), xml);
};

const saveImage = async (url, path) => {
  await image({
    url,
    dest: path,
  });
};

const fetchPage = async (metaInfo, sn) => {
  const res = await fetch("https://tw.jav321.com/video/mukc00083").then((res) =>
    res.text()
  );
  const $ = cheerio.load(res);
  const poster = $(
    "body > div:nth-child(5) > div.col-md-7.col-md-offset-1.col-xs-12 > div:nth-child(1) > div.panel-body > div:nth-child(1) > div.col-md-3 > img"
  ).attr("src");
  const aaa = $("body > div:nth-child(5) > div.col-md-3 > div").map(
    function () {
      if (cheerio.load(this)("img")[0]) {
        return cheerio.load(this)("img")[0].attribs.src;
      }
    }
  );
  return [poster, ...Array.from(aaa)];
};

const fetchMetaData = async (folder) => {
  const metaInfo = {};

  const targetFolder = resolve(sourceFolder, folder);
  const medias = await glob(`${targetFolder}/*.{mp4,mkv}`, { nodir: true });

  if (medias.length > 0) {
    const { name } = parse(medias[0]);
    const result = await fetchPage(metaInfo, name);
    for await (const element of result) {
      saveImage(element, targetFolder);
    }
    // https://w.javtxt.top/search?type=id&q=MUKC-083 => https://w.javtxt.top/v/492258
    //
    await saveXML(metaInfo, targetFolder, name);
  }

  // const response = await fetch(url);
  // const data = await response.json();
  //
};

const init = async () => {
  const folder = await readdir(sourceFolder);
  for await (const item of folder) {
    fetchMetaData(item);
  }
};

init();
