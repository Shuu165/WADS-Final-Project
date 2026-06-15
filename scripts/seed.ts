import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DIRECT_URL });
const db = new PrismaClient({ adapter });

const main = async () => {
  try {
    console.log("Seeding database...");

    await db.challengeProgress.deleteMany();
    await db.challengeOption.deleteMany();
    await db.challenge.deleteMany();
    await db.lesson.deleteMany();
    await db.unit.deleteMany();
    await db.userProgress.deleteMany();
    await db.userSubscription.deleteMany();
    await db.course.deleteMany();

    // -------------------------
    // COURSES
    // -------------------------
    await db.course.createMany({
      data: [
        { id: 1, title: "Indonesian", imageSrc: "/id.svg" },
        { id: 2, title: "Chinese", imageSrc: "/cn.svg" },
        { id: 3, title: "Korean", imageSrc: "/kr.svg" },
        { id: 4, title: "Japanese", imageSrc: "/jp.svg" },
        { id: 5, title: "Deutsch", imageSrc: "/de.svg" },
      ],
    });

    // -------------------------
    // UNITS
    // -------------------------
    await db.unit.createMany({
      data: [
        { id: 1, courseId: 1, title: "Unit 1", description: "Learn the basics of Indonesian", order: 1 },
        { id: 2, courseId: 2, title: "Unit 1", description: "Learn the basics of Chinese", order: 1 },
        { id: 3, courseId: 3, title: "Unit 1", description: "Learn the basics of Korean", order: 1 },
        { id: 4, courseId: 4, title: "Unit 1", description: "Learn the basics of Japanese", order: 1 },
        { id: 5, courseId: 5, title: "Unit 1", description: "Learn the basics of Deutsch", order: 1 },
      ],
    });

    // -------------------------
    // LESSONS
    // -------------------------
    await db.lesson.createMany({
      data: [
        // Indonesian
        { id: 1, unitId: 1, order: 1, title: "Greetings" },
        { id: 2, unitId: 1, order: 2, title: "Numbers" },
        { id: 3, unitId: 1, order: 3, title: "Colors" },
        { id: 4, unitId: 1, order: 4, title: "Animals" },
        { id: 5, unitId: 1, order: 5, title: "Food" },

        // Chinese
        { id: 6, unitId: 2, order: 1, title: "Greetings" },
        { id: 7, unitId: 2, order: 2, title: "Numbers" },
        { id: 8, unitId: 2, order: 3, title: "Colors" },
        { id: 9, unitId: 2, order: 4, title: "Animals" },
        { id: 10, unitId: 2, order: 5, title: "Food" },

        // Korean
        { id: 11, unitId: 3, order: 1, title: "Greetings" },
        { id: 12, unitId: 3, order: 2, title: "Numbers" },
        { id: 13, unitId: 3, order: 3, title: "Colors" },
        { id: 14, unitId: 3, order: 4, title: "Animals" },
        { id: 15, unitId: 3, order: 5, title: "Food" },

        // Japanese
        { id: 16, unitId: 4, order: 1, title: "Greetings" },
        { id: 17, unitId: 4, order: 2, title: "Numbers" },
        { id: 18, unitId: 4, order: 3, title: "Colors" },
        { id: 19, unitId: 4, order: 4, title: "Animals" },
        { id: 20, unitId: 4, order: 5, title: "Food" },

        // Deutsch
        { id: 21, unitId: 5, order: 1, title: "Greetings" },
        { id: 22, unitId: 5, order: 2, title: "Numbers" },
        { id: 23, unitId: 5, order: 3, title: "Colors" },
        { id: 24, unitId: 5, order: 4, title: "Animals" },
        { id: 25, unitId: 5, order: 5, title: "Food" },
      ],
    });

    // -------------------------
    // CHALLENGES - INDONESIAN
    // -------------------------
    await db.challenge.createMany({
      data: [
        { id: 1, lessonId: 1, type: "SELECT", order: 1, question: 'Which one means "Hello"?' },
        { id: 2, lessonId: 1, type: "ASSIST", order: 2, question: '"GoodBye"' },
        { id: 3, lessonId: 1, type: "SELECT", order: 3, question: 'Which one means "Thank you"?' },
        { id: 4, lessonId: 2, type: "SELECT", order: 1, question: 'Which one means "One"?' },
        { id: 5, lessonId: 2, type: "ASSIST", order: 2, question: '"Two"' },
        { id: 6, lessonId: 2, type: "SELECT", order: 3, question: 'Which one means "Three"?' },
      ],
    });

    await db.challengeOption.createMany({
      data: [
        { challengeId: 1, correct: true, text: "Halo", audioSrc: "/id_hello.mp3", imageSrc: "/boy.svg" },
        { challengeId: 1, correct: false, text: "Selamat tinggal", audioSrc: "/id_bye.mp3", imageSrc: "/man.svg" },
        { challengeId: 1, correct: false, text: "Terima kasih", audioSrc: "/id_thankyou.mp3", imageSrc: "/girl.svg" },
        { challengeId: 2, correct: true, text: "Selamat tinggal" },
        { challengeId: 2, correct: false, text: "Halo" },
        { challengeId: 2, correct: false, text: "Tolong" },
        { challengeId: 3, correct: true, text: "Terima kasih", audioSrc: "/id_thankyou.mp3", imageSrc: "/girl.svg" },
        { challengeId: 3, correct: false, text: "Maaf", audioSrc: "/id_sorry.mp3", imageSrc: "/zombie.svg"},
        { challengeId: 3, correct: false, text: "Halo", audioSrc: "/id_hello.mp3", imageSrc: "/boy.svg" },
        { challengeId: 4, correct: true, text: "Satu", audioSrc: "/id_one.mp3", imageSrc: "/boy.svg" },
        { challengeId: 4, correct: false, text: "Dua", audioSrc: "/id_two.mp3", imageSrc: "/girl.svg" },
        { challengeId: 4, correct: false, text: "Tiga", audioSrc: "/id_three.mp3", imageSrc: "/man.svg" },
        { challengeId: 5, correct: true, text: "Dua" },
        { challengeId: 5, correct: false, text: "Satu" },
        { challengeId: 5, correct: false, text: "Empat" },
        { challengeId: 6, correct: true, text: "Tiga", audioSrc: "/id_three.mp3", imageSrc: "/man.svg" },
        { challengeId: 6, correct: false, text: "Lima", audioSrc: "/id_five.mp3", imageSrc: "/zombie.svg" },
        { challengeId: 6, correct: false, text: "Dua", audioSrc: "/id_two.mp3", imageSrc: "/girl.svg" },
      ],
    });

    // -------------------------
    // CHALLENGES - CHINESE
    // -------------------------
    await db.challenge.createMany({
      data: [
        { id: 7, lessonId: 6, type: "SELECT", order: 1, question: 'Which one means "Hello"?' },
        { id: 8, lessonId: 6, type: "ASSIST", order: 2, question: '"GoodBye"' },
        { id: 9, lessonId: 6, type: "SELECT", order: 3, question: 'Which one means "Thank you"?' },
        { id: 10, lessonId: 7, type: "SELECT", order: 1, question: 'Which one means "One"?' },
        { id: 11, lessonId: 7, type: "ASSIST", order: 2, question: '"Two"' },
        { id: 12, lessonId: 7, type: "SELECT", order: 3, question: 'Which one means "Three"?' },
      ],
    });

    await db.challengeOption.createMany({
      data: [
        { challengeId: 7, correct: true, text: "你好 (Nǐ hǎo)", audioSrc: "/cn_hello.mp3", imageSrc: "/boy.svg" },
        { challengeId: 7, correct: false, text: "再见 (Zàijiàn)", audioSrc: "/cn_bye.mp3", imageSrc: "/man.svg" },
        { challengeId: 7, correct: false, text: "谢谢 (Xièxiè)", audioSrc: "/cn_thankyou.mp3", imageSrc: "/girl.svg" },
        { challengeId: 8, correct: true, text: "再见 (Zàijiàn)" },
        { challengeId: 8, correct: false, text: "你好 (Nǐ hǎo)" },
        { challengeId: 8, correct: false, text: "请 (Qǐng)" },
        { challengeId: 9, correct: true, text: "谢谢 (Xièxiè)", audioSrc: "/cn_thankyou.mp3", imageSrc: "/girl.svg" },
        { challengeId: 9, correct: false, text: "对不起 (Duìbùqǐ)", audioSrc: "/cn_sorry.mp3", imageSrc: "/zombie.svg" },
        { challengeId: 9, correct: false, text: "你好 (Nǐ hǎo)", audioSrc: "/cn_hello.mp3", imageSrc: "/boy.svg" },
        { challengeId: 10, correct: true, text: "一 (Yī)", audioSrc: "/cn_one.mp3", imageSrc: "/boy.svg" },
        { challengeId: 10, correct: false, text: "二 (Èr)", audioSrc: "/cn_two.mp3", imageSrc: "/girl.svg" },
        { challengeId: 10, correct: false, text: "三 (Sān)", audioSrc: "/cn_three.mp3", imageSrc: "/man.svg" },
        { challengeId: 11, correct: true, text: "二 (Èr)" },
        { challengeId: 11, correct: false, text: "一 (Yī)" },
        { challengeId: 11, correct: false, text: "四 (Sì)" },
        { challengeId: 12, correct: true, text: "三 (Sān)", audioSrc: "/cn_three.mp3", imageSrc: "/man.svg" },
        { challengeId: 12, correct: false, text: "五 (Wǔ)", audioSrc: "/cn_five.mp3", imageSrc: "/zombie.svg" },
        { challengeId: 12, correct: false, text: "二 (Èr)", audioSrc: "/cn_two.mp3", imageSrc: "/girl.svg" },
      ],
    });

    // -------------------------
    // CHALLENGES - KOREAN
    // -------------------------
    await db.challenge.createMany({
      data: [
        { id: 13, lessonId: 11, type: "SELECT", order: 1, question: 'Which one means "Hello"?' },
        { id: 14, lessonId: 11, type: "ASSIST", order: 2, question: '"GoodBye"' },
        { id: 15, lessonId: 11, type: "SELECT", order: 3, question: 'Which one means "Thank you"?' },
        { id: 16, lessonId: 12, type: "SELECT", order: 1, question: 'Which one means "One"?' },
        { id: 17, lessonId: 12, type: "ASSIST", order: 2, question: '"Two"' },
        { id: 18, lessonId: 12, type: "SELECT", order: 3, question: 'Which one means "Three"?' },
      ],
    });

    await db.challengeOption.createMany({
      data: [
        { challengeId: 13, correct: true, text: "안녕하세요 (Annyeonghaseyo)", audioSrc: "/kr_hello.mp3", imageSrc: "/boy.svg" },
        { challengeId: 13, correct: false, text: "안녕히 가세요 (Annyeonghi gaseyo)", audioSrc: "/kr_bye.mp3", imageSrc: "/man.svg"},
        { challengeId: 13, correct: false, text: "감사합니다 (Gamsahamnida)", audioSrc: "/kr_thankyou.mp3", imageSrc: "/girl.svg" },
        { challengeId: 14, correct: true, text: "안녕히 가세요 (Annyeonghi gaseyo)" },
        { challengeId: 14, correct: false, text: "안녕하세요 (Annyeonghaseyo)" },
        { challengeId: 14, correct: false, text: "부탁합니다 (Butakhamnida)" },
        { challengeId: 15, correct: true, text: "감사합니다 (Gamsahamnida)", audioSrc: "/kr_thankyou.mp3", imageSrc: "/girl.svg" },
        { challengeId: 15, correct: false, text: "죄송합니다 (Joesonghamnida)", audioSrc: "/kr_sorry.mp3", imageSrc: "/zombie.svg" },
        { challengeId: 15, correct: false, text: "안녕하세요 (Annyeonghaseyo)", audioSrc: "/kr_hello.mp3", imageSrc: "/boy.svg" },
        { challengeId: 16, correct: true, text: "일 (Il)", audioSrc: "/kr_one.mp3", imageSrc: "/boy.svg" },
        { challengeId: 16, correct: false, text: "이 (I)", audioSrc: "/kr_two.mp3", imageSrc: "/girl.svg" },
        { challengeId: 16, correct: false, text: "삼 (Sam)", audioSrc: "/kr_three.mp3", imageSrc: "/man.svg" },
        { challengeId: 17, correct: true, text: "이 (I)" },
        { challengeId: 17, correct: false, text: "일 (Il)" },
        { challengeId: 17, correct: false, text: "사 (Sa)" },
        { challengeId: 18, correct: true, text: "삼 (Sam)", audioSrc: "/kr_three.mp3", imageSrc: "/man.svg" },
        { challengeId: 18, correct: false, text: "오 (O)", audioSrc: "/kr_five.mp3", imageSrc: "/zombie.svg" },
        { challengeId: 18, correct: false, text: "이 (I)", audioSrc: "/kr_two.mp3", imageSrc: "/girl.svg" },
      ],
    });

    // -------------------------
    // CHALLENGES - JAPANESE
    // -------------------------
    await db.challenge.createMany({
      data: [
        { id: 19, lessonId: 16, type: "SELECT", order: 1, question: 'Which one means "Hello"?' },
        { id: 20, lessonId: 16, type: "ASSIST", order: 2, question: '"GoodBye"' },
        { id: 21, lessonId: 16, type: "SELECT", order: 3, question: 'Which one means "Thank you"?' },
        { id: 22, lessonId: 17, type: "SELECT", order: 1, question: 'Which one means "One"?' },
        { id: 23, lessonId: 17, type: "ASSIST", order: 2, question: '"Two"' },
        { id: 24, lessonId: 17, type: "SELECT", order: 3, question: 'Which one means "Three"?' },
      ],
    });

    await db.challengeOption.createMany({
      data: [
        { challengeId: 19, correct: true, text: "こんにちは (Konnichiwa)", audioSrc: "/jp_hello.mp3", imageSrc: "/boy.svg" },
        { challengeId: 19, correct: false, text: "さようなら (Sayōnara)", audioSrc: "/jp_bye.mp3", imageSrc: "/man.svg" },
        { challengeId: 19, correct: false, text: "ありがとう (Arigatō)", audioSrc: "/jp_thankyou.mp3", imageSrc: "/girl.svg" },
        { challengeId: 20, correct: true, text: "さようなら (Sayōnara)" },
        { challengeId: 20, correct: false, text: "こんにちは (Konnichiwa)" },
        { challengeId: 20, correct: false, text: "おねがいします (Onegaishimasu)" },
        { challengeId: 21, correct: true, text: "ありがとう (Arigatō)", audioSrc: "/jp_thankyou.mp3", imageSrc: "/girl.svg" },
        { challengeId: 21, correct: false, text: "すみません (Sumimasen)", audioSrc: "/jp_sorry.mp3", imageSrc: "/zombie.svg" },
        { challengeId: 21, correct: false, text: "こんにちは (Konnichiwa)", audioSrc: "/jp_hello.mp3", imageSrc: "/boy.svg" },
        { challengeId: 22, correct: true, text: "いち (Ichi)", audioSrc: "/jp_one.mp3", imageSrc: "/boy.svg" },
        { challengeId: 22, correct: false, text: "に (Ni)", audioSrc: "/jp_two.mp3", imageSrc: "/girl.svg" },
        { challengeId: 22, correct: false, text: "さん (San)", audioSrc: "/jp_three.mp3", imageSrc: "/man.svg" },
        { challengeId: 23, correct: true, text: "に (Ni)" },
        { challengeId: 23, correct: false, text: "いち (Ichi)" },
        { challengeId: 23, correct: false, text: "し (Shi)" },
        { challengeId: 24, correct: true, text: "さん (San)", audioSrc: "/jp_three.mp3", imageSrc: "/man.svg" },
        { challengeId: 24, correct: false, text: "ご (Go)", audioSrc: "/jp_five.mp3", imageSrc: "/zombie.svg" },
        { challengeId: 24, correct: false, text: "に (Ni)", audioSrc: "/jp_two.mp3", imageSrc: "/girl.svg" },
      ],
    });

    // -------------------------
    // CHALLENGES - DEUTSCH
    // -------------------------
    await db.challenge.createMany({
      data: [
        { id: 25, lessonId: 21, type: "SELECT", order: 1, question: 'Which one means "Hello"?' },
        { id: 26, lessonId: 21, type: "ASSIST", order: 2, question: '"GoodBye"' },
        { id: 27, lessonId: 21, type: "SELECT", order: 3, question: 'Which one means "Thank you"?' },
        { id: 28, lessonId: 22, type: "SELECT", order: 1, question: 'Which one means "One"?' },
        { id: 29, lessonId: 22, type: "ASSIST", order: 2, question: '"Two"' },
        { id: 30, lessonId: 22, type: "SELECT", order: 3, question: 'Which one means "Three"?' },
      ],
    });

    await db.challengeOption.createMany({
      data: [
        { challengeId: 25, correct: true, text: "Hallo", audioSrc: "/de_hello.mp3", imageSrc: "/boy.svg" },
        { challengeId: 25, correct: false, text: "Auf Wiedersehen", audioSrc: "/de_bye.mp3", imageSrc: "/man.svg" },
        { challengeId: 25, correct: false, text: "Danke", audioSrc: "/de_thankyou.mp3", imageSrc: "/girl.svg" },
        { challengeId: 26, correct: true, text: "Auf Wiedersehen" },
        { challengeId: 26, correct: false, text: "Hallo" },
        { challengeId: 26, correct: false, text: "Bitte" },
        { challengeId: 27, correct: true, text: "Danke", audioSrc: "/de_thankyou.mp3", imageSrc: "/girl.svg" },
        { challengeId: 27, correct: false, text: "Entschuldigung", audioSrc: "/de_sorry.mp3", imageSrc: "/zombie.svg" },
        { challengeId: 27, correct: false, text: "Hallo", audioSrc: "/de_hello.mp3", imageSrc: "/boy.svg" },
        { challengeId: 28, correct: true, text: "Eins", audioSrc: "/de_one.mp3", imageSrc: "/boy.svg" },
        { challengeId: 28, correct: false, text: "Zwei", audioSrc: "/de_two.mp3", imageSrc: "/girl.svg" },
        { challengeId: 28, correct: false, text: "Drei", audioSrc: "/de_three.mp3", imageSrc: "/man.svg" },
        { challengeId: 29, correct: true, text: "Zwei" },
        { challengeId: 29, correct: false, text: "Eins" },
        { challengeId: 29, correct: false, text: "Vier" },
        { challengeId: 30, correct: true, text: "Drei", audioSrc: "/de_three.mp3", imageSrc: "/man.svg" },
        { challengeId: 30, correct: false, text: "Fünf", audioSrc: "/de_five.mp3", imageSrc: "/zombie.svg" },
        { challengeId: 30, correct: false, text: "Zwei", audioSrc: "/de_two.mp3", imageSrc: "/girl.svg" },
      ],
    });

    console.log("Seeding finished!");
  } catch (error) {
    console.error(error);
    throw new Error("Failed to seed the database");
  } finally {
    await db.$disconnect();
  }
};

main();