import { toXML } from "jstoxml";
import { resolve, parse } from "node:path";
import { readdir, writeFile } from "node:fs/promises";
import { glob } from "glob";
import { image } from "image-downloader";
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

const fetchMetaData = async (folder) => {
  const metaInfo = {
    a: {
      v: {
        c: "哈哈 a",
      },
    },
  };

  const targetFolder = resolve(sourceFolder, folder);
  const medias = await glob(`${targetFolder}/*.{mp4,mkv}`, { nodir: true });
  if (medias.length > 0) {
    const { name } = parse(medias[0]);
    await saveImage(
      "https://i-blog.csdnimg.cn/blog_migrate/786e3e2caf25c5d1abe665492f8cb69f.png",
      targetFolder,
    );
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
