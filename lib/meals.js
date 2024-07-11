import sql from "better-sqlite3";
import slugify from "slugify";
import xss from "xss";
import fs from "node:fs";

const db = sql("meals.db");

export async function getMeals() {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // throw new Error("Loading meals failed");
  return db.prepare("SELECT * FROM meals").all();
}

export function getMeal(slug) {
  return db.prepare("SELECT * FROM meals WHERE slug = ?").get(slug);
}

// 이미지 파일을 저장하고 meal 데이터를 데이터베이스에 저장하는 함수
export async function saveMeal(meal) {
  // slug를 생성하여 meal.slug 속성에 추가
  meal.slug = slugify(meal.title, { lower: true });
  // meal.instructions을 검열하여 덮어 띄워줌
  meal.instructions = xss(meal.instructions);

  // 이미지의 확장자를 가져옴
  const extension = meal.image.name.split(".").pop();
  // slug를 이용해 새로운 파일 이름을 만들어 줌
  const fileName = `${meal.slug}.${extension}`;

  // createWriteStream()을 통해 stream 객체 생성
  const stream = fs.createWriteStream(`public/images/${fileName}`);
  // 이미지를 buffer로 변환: arrayBuffer()는 promise를 반환하기 때문에 await 필요
  const bufferedImage = await meal.image.arrayBuffer();

  stream.write(Buffer.from(bufferedImage), (error) => {
    if (error) {
      throw new Error("Saving image failed!");
    }
  });

  meal.image = `/images/${fileName}`;

  // 데이터베이스 저장: 순서가 바뀌면 안 됨
  db.prepare(
    `
    INSERT INTO meals
      (title, summary, instructions, creator, creator_email, image, slug)
    VALUES(
      @title, 
      @summary, 
      @instructions, 
      @creator, 
      @creator_email, 
      @image, 
      @slug
    )
  `
  ).run(meal);
}
