import got from "got";
import promisePipe from "promisepipe";
import tar from "tar";

export type RepoInfo = {
  username: string;
  name: string;
  branch: string;
  filePath: string;
};

export function downloadAndExtractTemplate(root: string, name: string): Promise<void> {
  return promisePipe(
    got.stream("https://codeload.github.com/TomAFrench/create-ocean-app/tar.gz/develop"),
    tar.extract({ cwd: root, strip: 3 }, [`create-ocean-app-develop/templates/${name}`]),
  );
}

export function hasTemplate(name: string): Promise<boolean> {
  return isUrlOk(
    `https://api.github.com/repos/TomAFrench/create-ocean-app/contents/templates/${encodeURIComponent(name)}/package.json`,
  );
}

export async function isUrlOk(url: string) {
  const res = await got(url).catch(e => e);
  return res.statusCode === 200;
}
